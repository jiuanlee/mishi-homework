const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const redisClient = require('../config/redis');
const { authenticateToken, requireTeacher } = require('../middleware/auth');
const { generateAssignment } = require('../utils/assignmentGenerator');

// 一键生成作业
router.post('/generate', authenticateToken, requireTeacher, [
  body('classId').isInt().withMessage('班级 ID 无效'),
  body('subject').isIn(['语文', '数学', '英语', '科学']).withMessage('科目无效'),
  body('knowledgePoints').isArray({ min: 1 }).withMessage('至少选择一个知识点'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('难度无效'),
  body('questionCount').isInt({ min: 1, max: 50 }).withMessage('题目数量 1-50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { 
      classId, 
      subject, 
      knowledgePoints, 
      difficulty, 
      questionCount,
      storyTheme,
      timeLimit 
    } = req.body;

    // 验证班级存在
    const [classes] = await db.query(
      'SELECT * FROM classes WHERE id = ?',
      [classId]
    );

    if (classes.length === 0) {
      return res.status(404).json({ success: false, message: '班级不存在' });
    }

    // 生成作业
    const assignmentData = await generateAssignment({
      subject,
      knowledgePoints,
      difficulty,
      questionCount,
      storyTheme,
      grade: classes[0].grade
    });

    // 保存到数据库
    const [result] = await db.query(
      `INSERT INTO assignments 
       (class_id, teacher_id, title, subject, knowledge_points, difficulty, 
        question_count, story_theme, time_limit, status, questions) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        classId,
        req.user.userId,
        assignmentData.title,
        subject,
        JSON.stringify(knowledgePoints),
        difficulty,
        questionCount,
        storyTheme || 'default',
        timeLimit || 30,
        'draft',
        JSON.stringify(assignmentData.questions)
      ]
    );

    // 缓存作业数据
    await redisClient.setEx(
      `assignment:${result.insertId}`,
      3600,
      JSON.stringify(assignmentData)
    );

    res.status(201).json({
      success: true,
      message: '作业生成成功',
      data: {
        assignmentId: result.insertId,
        title: assignmentData.title,
        questionCount: assignmentData.questions.length,
        estimatedTime: assignmentData.estimatedTime
      }
    });
  } catch (error) {
    console.error('生成作业错误:', error);
    res.status(500).json({ success: false, message: '生成作业失败' });
  }
});

// 获取作业详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // 先尝试从缓存获取
    const cached = await redisClient.get(`assignment:${req.params.id}`);
    if (cached) {
      const assignment = JSON.parse(cached);
      return res.json({ success: true, data: assignment, fromCache: true });
    }

    // 从数据库获取
    const [assignments] = await db.query(
      'SELECT * FROM assignments WHERE id = ?',
      [req.params.id]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ success: false, message: '作业不存在' });
    }

    const assignment = assignments[0];
    
    // 解析 JSON 字段
    assignment.knowledge_points = JSON.parse(assignment.knowledge_points);
    assignment.questions = JSON.parse(assignment.questions);

    // 获取提交统计
    const [stats] = await db.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed FROM answers WHERE assignment_id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...assignment,
        stats: stats[0]
      }
    });
  } catch (error) {
    console.error('获取作业详情错误:', error);
    res.status(500).json({ success: false, message: '获取作业详情失败' });
  }
});

// 编辑作业
router.put('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { title, description, time_limit, status, questions } = req.body;

    // 验证作业存在且属于该教师
    const [assignments] = await db.query(
      'SELECT * FROM assignments WHERE id = ? AND teacher_id = ?',
      [req.params.id, req.user.userId]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ success: false, message: '作业不存在或无权操作' });
    }

    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (time_limit !== undefined) {
      updateFields.push('time_limit = ?');
      updateValues.push(time_limit);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (questions !== undefined) {
      updateFields.push('questions = ?');
      updateValues.push(JSON.stringify(questions));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: '没有可更新的字段' });
    }

    updateValues.push(req.params.id);

    await db.query(
      `UPDATE assignments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // 清除缓存
    await redisClient.del(`assignment:${req.params.id}`);

    res.json({
      success: true,
      message: '作业更新成功'
    });
  } catch (error) {
    console.error('更新作业错误:', error);
    res.status(500).json({ success: false, message: '更新作业失败' });
  }
});

// 获取班级作业列表
router.get('/class/:classId', authenticateToken, async (req, res) => {
  try {
    const [assignments] = await db.query(
      `SELECT a.*, u.username as teacher_name 
       FROM assignments a
       LEFT JOIN users u ON a.teacher_id = u.id
       WHERE a.class_id = ?
       ORDER BY a.created_at DESC`,
      [req.params.classId]
    );

    res.json({
      success: true,
      data: assignments.map(a => ({
        ...a,
        knowledge_points: JSON.parse(a.knowledge_points)
      }))
    });
  } catch (error) {
    console.error('获取作业列表错误:', error);
    res.status(500).json({ success: false, message: '获取作业列表失败' });
  }
});

// 删除作业
router.delete('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const [assignments] = await db.query(
      'SELECT * FROM assignments WHERE id = ? AND teacher_id = ?',
      [req.params.id, req.user.userId]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ success: false, message: '作业不存在或无权操作' });
    }

    await db.query('DELETE FROM assignments WHERE id = ?', [req.params.id]);
    await redisClient.del(`assignment:${req.params.id}`);

    res.json({
      success: true,
      message: '作业删除成功'
    });
  } catch (error) {
    console.error('删除作业错误:', error);
    res.status(500).json({ success: false, message: '删除作业失败' });
  }
});

module.exports = router;
