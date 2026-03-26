const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const redisClient = require('../config/redis');
const { authenticateToken } = require('../middleware/auth');

// 提交答案
router.post('/submit', authenticateToken, [
  body('assignmentId').isInt().withMessage('作业 ID 无效'),
  body('answers').isArray({ min: 1 }).withMessage('至少提交一个答案')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { assignmentId, answers } = req.body;
    const studentId = req.user.userId;

    // 验证作业存在
    const [assignments] = await db.query(
      'SELECT * FROM assignments WHERE id = ?',
      [assignmentId]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ success: false, message: '作业不存在' });
    }

    const assignment = assignments[0];
    const questions = JSON.parse(assignment.questions);

    // 检查是否已提交
    const [existing] = await db.query(
      'SELECT * FROM answers WHERE assignment_id = ? AND student_id = ?',
      [assignmentId, studentId]
    );

    if (existing.length > 0 && assignment.status === 'published') {
      return res.status(400).json({ 
        success: false, 
        message: '你已经提交过该作业' 
      });
    }

    // 批改答案
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const answerRecords = answers.map(ans => {
      const question = questions.find(q => q.id === ans.questionId);
      const isCorrect = checkAnswer(question, ans.answer);
      
      if (isCorrect) {
        correctCount++;
        earnedPoints += question.points;
      }
      totalPoints += question.points;

      return {
        assignment_id: assignmentId,
        student_id: studentId,
        question_id: ans.questionId,
        student_answer: JSON.stringify(ans.answer),
        correct: isCorrect,
        points: isCorrect ? question.points : 0
      };
    });

    // 保存答案记录
    for (const record of answerRecords) {
      await db.query(
        `INSERT INTO answers 
         (assignment_id, student_id, question_id, student_answer, correct, points) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          record.assignment_id,
          record.student_id,
          record.question_id,
          record.student_answer,
          record.correct,
          record.points
        ]
      );
    }

    // 计算正确率
    const correctRate = (correctCount / questions.length) * 100;

    // 更新学生进度
    await updateStudentProgress(studentId, assignmentId, correctRate);

    // 清除缓存
    await redisClient.del(`assignment:${assignmentId}`);
    await redisClient.del(`progress:${studentId}`);

    res.json({
      success: true,
      message: '答案提交成功',
      data: {
        correctCount,
        totalCount: questions.length,
        correctRate: correctRate.toFixed(1),
        earnedPoints,
        totalPoints,
        story: getStoryResult(correctRate, assignment.story_theme)
      }
    });
  } catch (error) {
    console.error('提交答案错误:', error);
    res.status(500).json({ success: false, message: '提交答案失败' });
  }
});

// 检查答案是否正确
function checkAnswer(question, studentAnswer) {
  switch (question.type) {
    case 'single_choice':
      return studentAnswer === question.correct_answer;
    case 'multiple_choice':
      const studentSet = new Set(studentAnswer.sort());
      const correctSet = new Set(question.correct_answer.sort());
      return studentSet.size === correctSet.size && 
             [...studentSet].every(v => correctSet.has(v));
    case 'fill_blank':
      return studentAnswer.trim().toLowerCase() === 
             question.correct_answer.trim().toLowerCase();
    case 'true_false':
      return studentAnswer === question.correct_answer;
    default:
      return false;
  }
}

// 获取剧情结果
function getStoryResult(correctRate, theme = 'default') {
  const templates = {
    default: {
      excellent: '太棒了！你成功解开了所有谜题！',
      good: '不错！你找到了大部分线索！',
      needImprove: '继续努力，你离成功不远了！'
    },
    detective: {
      excellent: '真相大白！你是个天才侦探！',
      good: '案件基本破解，干得漂亮！',
      needImprove: '还有一些疑点，继续调查！'
    },
    adventure: {
      excellent: '冒险成功！你成为了传奇英雄！',
      good: '冒险完成，表现不错！',
      needImprove: '冒险还未结束，继续前进！'
    },
    space: {
      excellent: '任务完美完成！地球感谢你！',
      good: '任务完成，欢迎返回！',
      needImprove: '燃料充足，再来一次！'
    }
  };

  const template = templates[theme] || templates.default;

  if (correctRate >= 90) {
    return { level: 'excellent', message: template.excellent };
  } else if (correctRate >= 60) {
    return { level: 'good', message: template.good };
  } else {
    return { level: 'needImprove', message: template.needImprove };
  }
}

// 更新学生进度
async function updateStudentProgress(studentId, assignmentId, correctRate) {
  const [existing] = await db.query(
    'SELECT * FROM student_progress WHERE student_id = ? AND assignment_id = ?',
    [studentId, assignmentId]
  );

  if (existing.length > 0) {
    await db.query(
      'UPDATE student_progress SET correct_rate = ?, completed_at = NOW() WHERE id = ?',
      [correctRate, existing[0].id]
    );
  } else {
    await db.query(
      'INSERT INTO student_progress (student_id, assignment_id, correct_rate) VALUES (?, ?, ?)',
      [studentId, assignmentId, correctRate]
    );
  }
}

// 获取进度
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.userId;

    // 尝试从缓存获取
    const cached = await redisClient.get(`progress:${studentId}`);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached), fromCache: true });
    }

    // 获取总体进度
    const [overallStats] = await db.query(`
      SELECT 
        COUNT(DISTINCT assignment_id) as total_assignments,
        AVG(correct_rate) as average_correct_rate,
        SUM(CASE WHEN correct_rate >= 60 THEN 1 ELSE 0 END) as passed_count
      FROM student_progress
      WHERE student_id = ?
    `, [studentId]);

    // 获取最近作业进度
    const [recentProgress] = await db.query(`
      SELECT sp.*, a.title, a.subject, a.story_theme
      FROM student_progress sp
      INNER JOIN assignments a ON sp.assignment_id = a.id
      WHERE sp.student_id = ?
      ORDER BY sp.completed_at DESC
      LIMIT 10
    `, [studentId]);

    const progressData = {
      overall: overallStats[0],
      recent: recentProgress,
      updatedAt: new Date().toISOString()
    };

    // 缓存进度数据
    await redisClient.setEx(
      `progress:${studentId}`,
      300, // 5 分钟缓存
      JSON.stringify(progressData)
    );

    res.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('获取进度错误:', error);
    res.status(500).json({ success: false, message: '获取进度失败' });
  }
});

// 获取作业答案详情
router.get('/assignment/:id/detail', authenticateToken, async (req, res) => {
  try {
    const [answers] = await db.query(`
      SELECT a.*, q.question_content, q.correct_answer, q.explanation
      FROM answers a
      INNER JOIN (
        SELECT id, JSON_EXTRACT(questions, CONCAT('$[', id - 1, '].content')) as question_content,
               JSON_EXTRACT(questions, CONCAT('$[', id - 1, '].correct_answer')) as correct_answer,
               JSON_EXTRACT(questions, CONCAT('$[', id - 1, '].explanation')) as explanation
        FROM assignments
        WHERE id = ?
      ) q ON a.question_id = q.id
      WHERE a.assignment_id = ? AND a.student_id = ?
    `, [req.params.id, req.params.id, req.user.userId]);

    res.json({
      success: true,
      data: answers
    });
  } catch (error) {
    console.error('获取答案详情错误:', error);
    res.status(500).json({ success: false, message: '获取答案详情失败' });
  }
});

module.exports = router;
