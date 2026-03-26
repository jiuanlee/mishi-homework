const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireTeacher } = require('../middleware/auth');

// 创建班级
router.post('/', authenticateToken, requireTeacher, [
  body('name').isLength({ min: 2, max: 50 }).withMessage('班级名称长度 2-50 个字符'),
  body('grade').isIn(['1', '2', '3', '4', '5', '6']).withMessage('年级必须是 1-6')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, grade, description } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO classes (name, grade, description, teacher_id) VALUES (?, ?, ?, ?)',
      [name, grade, description, req.user.userId]
    );

    res.status(201).json({
      success: true,
      message: '班级创建成功',
      classId: result.insertId
    });
  } catch (error) {
    console.error('创建班级错误:', error);
    res.status(500).json({ success: false, message: '创建班级失败' });
  }
});

// 获取班级列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role === 'admin') {
      query = 'SELECT * FROM classes ORDER BY created_at DESC';
    } else if (req.user.role === 'teacher') {
      query = 'SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at DESC';
      params = [req.user.userId];
    } else {
      // 学生只能看到自己加入的班级
      query = `
        SELECT c.* FROM classes c
        INNER JOIN class_students cs ON c.id = cs.class_id
        WHERE cs.student_id = ?
        ORDER BY c.created_at DESC
      `;
      params = [req.user.userId];
    }

    const [classes] = await db.query(query, params);
    
    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('获取班级列表错误:', error);
    res.status(500).json({ success: false, message: '获取班级列表失败' });
  }
});

// 获取班级详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [classes] = await db.query(
      'SELECT * FROM classes WHERE id = ?',
      [req.params.id]
    );

    if (classes.length === 0) {
      return res.status(404).json({ success: false, message: '班级不存在' });
    }

    // 获取班级学生列表
    const [students] = await db.query(`
      SELECT u.id, u.username, u.email, cs.joined_at
      FROM users u
      INNER JOIN class_students cs ON u.id = cs.student_id
      WHERE cs.class_id = ?
    `, [req.params.id]);

    // 获取班级作业列表
    const [assignments] = await db.query(
      'SELECT id, title, subject, due_date, status FROM assignments WHERE class_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...classes[0],
        students,
        assignments
      }
    });
  } catch (error) {
    console.error('获取班级详情错误:', error);
    res.status(500).json({ success: false, message: '获取班级详情失败' });
  }
});

// 更新班级
router.put('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { name, grade, description, status } = req.body;
    
    // 验证班级存在且属于该教师
    const [classes] = await db.query(
      'SELECT * FROM classes WHERE id = ? AND teacher_id = ?',
      [req.params.id, req.user.userId]
    );

    if (classes.length === 0) {
      return res.status(404).json({ success: false, message: '班级不存在或无权操作' });
    }

    await db.query(
      'UPDATE classes SET name = ?, grade = ?, description = ?, status = ? WHERE id = ?',
      [name, grade, description, status, req.params.id]
    );

    res.json({
      success: true,
      message: '班级更新成功'
    });
  } catch (error) {
    console.error('更新班级错误:', error);
    res.status(500).json({ success: false, message: '更新班级失败' });
  }
});

// 添加学生到班级
router.post('/:id/students', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { studentIds } = req.body;
    
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: '请提供学生 ID 列表' });
    }

    // 批量插入
    const values = studentIds.map(id => [req.params.id, id]);
    await db.query(
      'INSERT INTO class_students (class_id, student_id) VALUES ? ON DUPLICATE KEY UPDATE class_id = class_id',
      [values]
    );

    res.json({
      success: true,
      message: `成功添加 ${studentIds.length} 名学生`
    });
  } catch (error) {
    console.error('添加学生错误:', error);
    res.status(500).json({ success: false, message: '添加学生失败' });
  }
});

// 删除班级
router.delete('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const [classes] = await db.query(
      'SELECT * FROM classes WHERE id = ? AND teacher_id = ?',
      [req.params.id, req.user.userId]
    );

    if (classes.length === 0) {
      return res.status(404).json({ success: false, message: '班级不存在或无权操作' });
    }

    await db.query('DELETE FROM classes WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: '班级删除成功'
    });
  } catch (error) {
    console.error('删除班级错误:', error);
    res.status(500).json({ success: false, message: '删除班级失败' });
  }
});

module.exports = router;
