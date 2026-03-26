const express = require('express');
const router = express.Router();
const db = require('../config/database');
const redisClient = require('../config/redis');
const { authenticateToken, requireTeacher, requireAdmin } = require('../middleware/auth');

// 获取班级统计
router.get('/class/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const classId = req.params.id;

    // 验证班级权限
    const [classes] = await db.query(
      'SELECT * FROM classes WHERE id = ? AND teacher_id = ?',
      [classId, req.user.userId]
    );

    if (classes.length === 0) {
      return res.status(404).json({ success: false, message: '班级不存在或无权访问' });
    }

    // 获取作业统计
    const [assignmentStats] = await db.query(`
      SELECT 
        COUNT(*) as total_assignments,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count,
        AVG(question_count) as avg_questions
      FROM assignments
      WHERE class_id = ?
    `, [classId]);

    // 获取学生统计
    const [studentStats] = await db.query(`
      SELECT 
        COUNT(DISTINCT cs.student_id) as total_students,
        AVG(sp.correct_rate) as avg_correct_rate
      FROM class_students cs
      LEFT JOIN student_progress sp ON cs.student_id = sp.student_id
      WHERE cs.class_id = ?
    `, [classId]);

    // 获取题目正确率分布
    const [difficultyStats] = await db.query(`
      SELECT 
        q.difficulty,
        COUNT(a.id) as total_answers,
        SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) as correct_count,
        ROUND(SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 2) as correct_rate
      FROM answers a
      INNER JOIN assignments ast ON a.assignment_id = ast.id
      INNER JOIN question_bank q ON a.question_id = q.id
      WHERE ast.class_id = ?
      GROUP BY q.difficulty
    `, [classId]);

    const stats = {
      classInfo: classes[0],
      assignments: assignmentStats[0],
      students: studentStats[0],
      difficultyBreakdown: difficultyStats
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取班级统计错误:', error);
    res.status(500).json({ success: false, message: '获取班级统计失败' });
  }
});

// 获取学生个人统计
router.get('/student/:id', authenticateToken, async (req, res) => {
  try {
    const studentId = req.params.id;

    // 只能查看自己的统计，除非是管理员或教师
    if (req.user.userId !== parseInt(studentId) && 
        !['teacher', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: '无权查看该学生统计' });
    }

    // 总体统计
    const [overallStats] = await db.query(`
      SELECT 
        COUNT(DISTINCT sp.assignment_id) as total_assignments,
        AVG(sp.correct_rate) as avg_correct_rate,
        MAX(sp.completed_at) as last_completed_at,
        SUM(CASE WHEN sp.correct_rate >= 90 THEN 1 ELSE 0 END) as excellent_count,
        SUM(CASE WHEN sp.correct_rate >= 60 AND sp.correct_rate < 90 THEN 1 ELSE 0 END) as good_count,
        SUM(CASE WHEN sp.correct_rate < 60 THEN 1 ELSE 0 END) as need_improve_count
      FROM student_progress sp
      WHERE sp.student_id = ?
    `, [studentId]);

    // 科目分布
    const [subjectStats] = await db.query(`
      SELECT 
        a.subject,
        COUNT(*) as assignment_count,
        AVG(sp.correct_rate) as avg_correct_rate
      FROM student_progress sp
      INNER JOIN assignments a ON sp.assignment_id = a.id
      WHERE sp.student_id = ?
      GROUP BY a.subject
    `, [studentId]);

    // 知识点掌握情况
    const [knowledgeStats] = await db.query(`
      SELECT 
        kp.knowledge_point,
        COUNT(*) as practice_count,
        SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) as correct_count,
        ROUND(SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as mastery_rate
      FROM answers a
      INNER JOIN assignments ast ON a.assignment_id = ast.id
      INNER JOIN (
        SELECT id, 
               JSON_EXTRACT(knowledge_points, '$') as knowledge_points
        FROM assignments
      ) kp_json ON ast.id = a.assignment_id
      WHERE a.student_id = ?
      GROUP BY kp.knowledge_point
      ORDER BY practice_count DESC
      LIMIT 10
    `, [studentId]);

    // 学习趋势（最近 10 次作业）
    const [trendStats] = await db.query(`
      SELECT 
        a.title,
        a.subject,
        sp.correct_rate,
        sp.completed_at
      FROM student_progress sp
      INNER JOIN assignments a ON sp.assignment_id = a.id
      WHERE sp.student_id = ?
      ORDER BY sp.completed_at DESC
      LIMIT 10
    `, [studentId]);

    const stats = {
      overall: overallStats[0],
      bySubject: subjectStats,
      knowledgePoints: knowledgeStats,
      trend: trendStats
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取学生统计错误:', error);
    res.status(500).json({ success: false, message: '获取学生统计失败' });
  }
});

// 获取平台总体统计（管理员）
router.get('/platform', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 尝试从缓存获取
    const cached = await redisClient.get('stats:platform');
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached), fromCache: true });
    }

    // 用户统计
    const [userStats] = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as student_count,
        SUM(CASE WHEN role = 'teacher' THEN 1 ELSE 0 END) as teacher_count,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count
      FROM users
    `);

    // 班级统计
    const [classStats] = await db.query(`
      SELECT 
        COUNT(*) as total_classes,
        COUNT(DISTINCT teacher_id) as active_teachers
      FROM classes
      WHERE status = 'active'
    `);

    // 作业统计
    const [assignmentStats] = await db.query(`
      SELECT 
        COUNT(*) as total_assignments,
        SUM(question_count) as total_questions,
        AVG(question_count) as avg_questions_per_assignment
      FROM assignments
    `);

    // 答题统计
    const [answerStats] = await db.query(`
      SELECT 
        COUNT(*) as total_answers,
        SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct_answers,
        ROUND(SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as overall_correct_rate
      FROM answers
    `);

    const stats = {
      users: userStats[0],
      classes: classStats[0],
      assignments: assignmentStats[0],
      answers: answerStats[0],
      updatedAt: new Date().toISOString()
    };

    // 缓存 10 分钟
    await redisClient.setEx('stats:platform', 600, JSON.stringify(stats));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取平台统计错误:', error);
    res.status(500).json({ success: false, message: '获取平台统计失败' });
  }
});

// 获取知识点掌握排行
router.get('/knowledge-points/ranking', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const [ranking] = await db.query(`
      SELECT 
        q.knowledge_point,
        q.subject,
        q.grade,
        COUNT(a.id) as practice_count,
        ROUND(AVG(CASE WHEN a.correct = 1 THEN 100 ELSE 0 END), 2) as avg_correct_rate
      FROM answers a
      INNER JOIN assignments ast ON a.assignment_id = ast.id
      INNER JOIN question_bank q ON a.question_id = q.id
      WHERE ast.class_id IN (
        SELECT id FROM classes WHERE teacher_id = ?
      )
      GROUP BY q.knowledge_point, q.subject, q.grade
      HAVING practice_count >= 5
      ORDER BY avg_correct_rate ASC
      LIMIT 20
    `, [req.user.userId]);

    res.json({
      success: true,
      data: ranking
    });
  } catch (error) {
    console.error('获取知识点排行错误:', error);
    res.status(500).json({ success: false, message: '获取知识点排行失败' });
  }
});

module.exports = router;
