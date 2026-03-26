/**
 * 认证模块单元测试
 * 测试文件：backend-server/routes/auth.js
 */

const request = require('supertest');
const app = require('../backend-server/server');
const db = require('../backend-server/config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 模拟测试数据
const testUser = {
  username: 'testuser_unit',
  password: 'password123',
  email: 'test@example.com',
  role: 'student'
};

describe('认证模块单元测试', () => {
  let authToken;
  let userId;

  // 测试前清理
  beforeAll(async () => {
    // 清理测试用户
    await db.query('DELETE FROM users WHERE username = ?', [testUser.username]);
  });

  // 测试后清理
  afterAll(async () => {
    await db.query('DELETE FROM users WHERE username = ?', [testUser.username]);
    await db.end();
  });

  describe('用户注册', () => {
    test('UT-001: 成功注册新用户', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBeDefined();
      userId = response.body.userId;
    });

    test('UT-002: 重复用户名注册失败', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('用户名已存在');
    });

    test('UT-003: 密码长度不足注册失败', async () => {
      const shortPasswordUser = {
        ...testUser,
        username: 'testuser2',
        password: '12345'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(shortPasswordUser);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('UT-003b: 用户名过短注册失败', async () => {
      const shortNameUser = {
        ...testUser,
        username: 'ab',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(shortNameUser);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('UT-003c: 邮箱格式错误注册失败', async () => {
      const invalidEmailUser = {
        ...testUser,
        username: 'testuser3',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidEmailUser);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('用户登录', () => {
    test('UT-004: 成功登录', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      authToken = response.body.token;
    });

    test('UT-005: 密码错误登录失败', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('用户名或密码错误');
    });

    test('UT-005b: 用户不存在登录失败', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('UT-007: 参数缺失登录失败', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username
          // 缺少 password
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('获取当前用户信息', () => {
    test('UT-008: 成功获取当前用户', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe(testUser.username);
    });

    test('UT-009: 未认证访问失败', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('UT-010: 无效 Token 访问失败', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('JWT Token 验证', () => {
    test('UT-006: 有效 Token 格式验证', () => {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      expect(decoded).toBeDefined();
      expect(decoded.username).toBe(testUser.username);
      expect(decoded.role).toBe(testUser.role);
    });

    test('UT-007: 过期 Token 验证', () => {
      const expiredToken = jwt.sign(
        { userId: 1, username: 'test', role: 'student' },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '-1h' } // 已过期
      );

      expect(() => {
        jwt.verify(expiredToken, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      }).toThrow();
    });
  });

  describe('权限验证中间件', () => {
    test('UT-009: 教师权限验证', () => {
      const { requireTeacher } = require('../backend-server/middleware/auth');
      
      // 模拟 request 和 response
      const mockReq = { user: { role: 'teacher' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      requireTeacher(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('UT-009b: 学生权限不足', () => {
      const { requireTeacher } = require('../backend-server/middleware/auth');
      
      const mockReq = { user: { role: 'student' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      requireTeacher(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('数据库连接测试', () => {
    test('UT-010: 数据库连接正常', async () => {
      const testConnection = db.testConnection || require('../backend-server/config/database').testConnection;
      // 如果连接成功，不会抛出异常
      const connection = await db.getConnection();
      expect(connection).toBeDefined();
      connection.release();
    });
  });
});
