const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

// 用户注册
router.post('/register', [
  body('username').isLength({ min: 3, max: 20 }).withMessage('用户名长度 3-20 个字符'),
  body('password').isLength({ min: 6 }).withMessage('密码至少 6 个字符'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('role').isIn(['student', 'teacher', 'admin']).withMessage('角色无效')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, password, email, role } = req.body;
    
    // 检查用户名是否已存在
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const [result] = await db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, role || 'student']
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      userId: result.insertId
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '注册失败' });
  }
});

// 用户登录
router.post('/login', [
  body('username').notEmpty().withMessage('请输入用户名'),
  body('password').notEmpty().withMessage('请输入密码')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, password } = req.body;
    
    // 查找用户
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const user = users[0];
    
    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '登录失败' });
  }
});

// 获取当前用户信息
router.get('/me', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ success: false, message: '获取用户信息失败' });
  }
});

module.exports = router;
