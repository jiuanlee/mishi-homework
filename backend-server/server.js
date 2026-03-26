const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = require('./config/database');

// Redis connection
const redisClient = require('./config/redis');

// Routes
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/class');
const assignmentRoutes = require('./routes/assignment');
const answerRoutes = require('./routes/answer');
const statsRoutes = require('./routes/stats');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/class', classRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/answer', answerRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: '接口不存在' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🦞 密室做题家后端服务已启动`);
  console.log(`📍 端口：${PORT}`);
  console.log(`📅 时间：${new Date().toLocaleString('zh-CN')}`);
});

module.exports = app;
