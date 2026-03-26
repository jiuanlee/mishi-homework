const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('❌ Redis 连接错误:', err.message);
});

redisClient.on('connect', () => {
  console.log('✅ Redis 连接成功');
});

async function connectRedis() {
  try {
    await redisClient.connect();
    return true;
  } catch (error) {
    console.error('Redis 连接失败:', error.message);
    return false;
  }
}

module.exports = redisClient;
module.exports.connectRedis = connectRedis;
