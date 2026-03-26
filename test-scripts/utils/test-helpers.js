/**
 * 测试辅助工具函数
 * 提供常用的测试辅助方法
 */

const db = require('../../backend-server/config/database');

/**
 * 清理测试数据
 * @param {string} tableName - 表名
 * @param {string} whereClause - WHERE 条件
 * @param {Array} values - 参数值
 */
async function cleanupTestData(tableName, whereClause, values) {
  try {
    await db.query(`DELETE FROM ${tableName} WHERE ${whereClause}`, values);
  } catch (error) {
    console.error(`清理测试数据失败：${tableName}`, error);
  }
}

/**
 * 创建测试用户
 * @param {Object} userData - 用户数据
 * @returns {Promise<number>} - 用户 ID
 */
async function createTestUser(userData) {
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const [result] = await db.query(
    'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
    [userData.username, hashedPassword, userData.email, userData.role || 'student']
  );
  
  return result.insertId;
}

/**
 * 生成测试 Token
 * @param {Object} payload - JWT payload
 * @param {string} secret - JWT secret
 * @returns {string} - JWT token
 */
function generateTestToken(payload, secret = 'test-secret-key') {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

/**
 * 等待指定毫秒数
 * @param {number} ms - 毫秒数
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试执行函数
 * @param {Function} fn - 要执行的函数
 * @param {number} retries - 重试次数
 * @param {number} delay - 重试间隔 (ms)
 */
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay);
    }
  }
}

/**
 * 验证响应时间
 * @param {Function} fn - 要测试的函数
 * @param {number} maxMs - 最大允许时间 (ms)
 */
async function assertResponseTime(fn, maxMs) {
  const start = Date.now();
  await fn();
  const duration = Date.now() - start;
  
  if (duration > maxMs) {
    throw new Error(`响应时间 ${duration}ms 超过限制 ${maxMs}ms`);
  }
  
  return duration;
}

/**
 * 创建测试作业
 * @param {Object} assignmentData - 作业数据
 * @returns {Promise<Object>} - 创建的作业
 */
async function createTestAssignment(assignmentData) {
  // TODO: 实现作业创建逻辑
  console.log('创建测试作业:', assignmentData);
  return { id: 1, ...assignmentData };
}

/**
 * 模拟 API 请求
 * @param {string} method - HTTP 方法
 * @param {string} url - URL
 * @param {Object} options - 请求选项
 */
async function mockApiRequest(method, url, options = {}) {
  const request = require('supertest');
  const app = require('../../backend-server/server');
  
  const req = request(app)[method.toLowerCase()](url);
  
  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      req.set(key, value);
    }
  }
  
  if (options.body) {
    req.send(options.body);
  }
  
  return req;
}

/**
 * 验证错误响应
 * @param {Object} response - HTTP 响应
 * @param {number} expectedStatus - 期望状态码
 * @param {string} expectedMessage - 期望错误消息
 */
function assertErrorResponse(response, expectedStatus, expectedMessage) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body.success).toBe(false);
  if (expectedMessage) {
    expect(response.body.message).toContain(expectedMessage);
  }
}

/**
 * 验证成功响应
 * @param {Object} response - HTTP 响应
 * @param {Object} expectedData - 期望数据
 */
function assertSuccessResponse(response, expectedData = {}) {
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  
  for (const [key, value] of Object.entries(expectedData)) {
    expect(response.body[key]).toEqual(value);
  }
}

// 导出所有辅助函数
module.exports = {
  cleanupTestData,
  createTestUser,
  generateTestToken,
  sleep,
  retry,
  assertResponseTime,
  createTestAssignment,
  mockApiRequest,
  assertErrorResponse,
  assertSuccessResponse
};
