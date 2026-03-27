const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireTeacher } = require('../middleware/auth');

/**
 * 批量导入试题
 */
router.post('/questions', authenticateToken, requireTeacher, [
  body('questions').isArray().withMessage('试题必须是数组'),
  body('questions.*.title').isString().notEmpty().withMessage('试题标题不能为空'),
  body('questions.*.type').isIn(['choice', 'fill', 'judge', 'essay']).withMessage('试题类型无效'),
  body('questions.*.answer').notEmpty().withMessage('答案不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { questions, knowledgePoint, difficulty, subject } = req.body;
    
    // 批量插入试题
    const values = questions.map(q => [
      knowledgePoint || '',
      subject || '',
      difficulty || 'medium',
      q.title,
      q.type,
      q.options ? JSON.stringify(q.options) : null,
      q.answer,
      q.explanation || '',
      req.user.userId,
      new Date().toISOString()
    ]);

    await db.query(`
      INSERT INTO questions (
        knowledge_point, subject, difficulty, title, type, 
        options, answer, explanation, teacher_id, created_at
      ) VALUES ?
    `, [values]);

    res.json({
      success: true,
      message: `成功导入 ${questions.length} 道试题`,
      count: questions.length
    });
  } catch (error) {
    console.error('批量导入试题错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '批量导入失败',
      error: error.message 
    });
  }
});

/**
 * 导出试题
 */
router.get('/questions/export', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { knowledgePoint, subject, difficulty } = req.query;
    
    let query = 'SELECT * FROM questions WHERE teacher_id = ?';
    const params = [req.user.userId];

    if (knowledgePoint) {
      query += ' AND knowledge_point LIKE ?';
      params.push(`%${knowledgePoint}%`);
    }

    if (subject) {
      query += ' AND subject = ?';
      params.push(subject);
    }

    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY created_at DESC';

    const [questions] = await db.query(query, params);

    res.json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('导出试题错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '导出失败',
      error: error.message 
    });
  }
});

module.exports = router;
