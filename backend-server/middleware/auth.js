const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 验证 JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '未提供认证令牌' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: '令牌无效或已过期' 
      });
    }
    req.user = user;
    next();
  });
}

// 验证管理员权限
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: '需要管理员权限' 
    });
  }
  next();
}

// 验证教师权限
function requireTeacher(req, res, next) {
  if (!req.user || !['admin', 'teacher'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: '需要教师权限' 
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireTeacher,
  JWT_SECRET
};
