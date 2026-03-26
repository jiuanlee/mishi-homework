/**
 * 认证 API 接口测试
 * 使用 Jest + Supertest 进行 API 测试
 */

const request = require('supertest');
const app = require('../../backend-server/server');
const db = require('../../backend-server/config/database');

// 测试数据
const testData = {
  teacher: {
    username: 'teacher_test',
    password: 'password123',
    email: 'teacher@test.com',
    role: 'teacher'
  },
  student: {
    username: 'student_test',
    password: 'password123',
    email: 'student@test.com',
    role: 'student'
  }
};

describe('认证 API 接口测试', () => {
  let teacherToken;
  let studentToken;

  beforeAll(async () => {
    // 清理测试数据
    await db.query('DELETE FROM users WHERE username IN (?, ?)', [
      testData.teacher.username,
      testData.student.username
    ]);

    // 创建测试用户
    await request(app).post('/api/auth/register').send(testData.teacher);
    await request(app).post('/api/auth/register').send(testData.student);
  });

  afterAll(async () => {
    // 清理测试数据
    await db.query('DELETE FROM users WHERE username IN (?, ?)', [
      testData.teacher.username,
      testData.student.username
    ]);
    await db.end();
  });

  describe('POST /api/auth/register', () => {
    test('API-001: 成功注册', async () => {
      const newUser = {
        username: 'newuser_' + Date.now(),
        password: 'password123',
        email: 'new@test.com',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        message: '注册成功'
      });
      expect(response.body.userId).toBeDefined();
    });

    test('API-002: 用户名重复', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testData.teacher);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: '用户名已存在'
      });
    });

    test('API-003: 参数验证失败', async () => {
      const invalidUser = {
        username: 'ab', // 太短
        password: '12345', // 太短
        email: 'invalid', // 格式错误
        role: 'invalid' // 无效角色
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    test('API-004: 成功登录', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testData.teacher.username,
          password: testData.teacher.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: '登录成功'
      });
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('teacher');
      teacherToken = response.body.token;
    });

    test('API-004b: 学生成功登录', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testData.student.username,
          password: testData.student.password
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      studentToken = response.body.token;
    });

    test('API-005: 用户不存在', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: '用户名或密码错误'
      });
    });

    test('API-006: 密码错误', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testData.teacher.username,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: '用户名或密码错误'
      });
    });

    test('API-007: 参数缺失', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testData.teacher.username
          // 缺少 password
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    test('API-008: 获取当前用户信息', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true
      });
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe(testData.teacher.username);
    });

    test('API-009: 未认证访问', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: '未提供认证令牌'
      });
    });

    test('API-010: 无效 Token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({
        success: false,
        message: '令牌无效或已过期'
      });
    });
  });

  describe('GET /health', () => {
    test('API-011: 健康检查', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'ok'
      });
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('性能测试', () => {
    test('API-PERF-001: 登录接口响应时间 <200ms', async () => {
      const start = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send({
          username: testData.teacher.username,
          password: testData.teacher.password
        });

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });

    test('API-PERF-002: 注册接口响应时间 <300ms', async () => {
      const newUser = {
        username: 'perf_test_' + Date.now(),
        password: 'password123',
        email: 'perf@test.com'
      };

      const start = Date.now();
      
      await request(app)
        .post('/api/auth/register')
        .send(newUser);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(300);
    });
  });
});
