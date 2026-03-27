require('dotenv').config();

let pool;

// 根据配置选择数据库类型
if (process.env.DB_TYPE === 'sqlite') {
  // SQLite 配置
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');
  
  // 确保数据目录存在
  const dbPath = path.join(__dirname, '..', process.env.DB_PATH || './data/ragflow.db');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // 创建 SQLite 连接
  const db = new Database(dbPath);
  
  // 包装为 promise 风格
  pool = {
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        try {
          let result;
          if (sql.trim().toUpperCase().startsWith('SELECT')) {
            result = db.prepare(sql).all(...params);
          } else {
            const info = db.prepare(sql).run(...params);
            result = [{ insertId: info.lastInsertRowid, affectedRows: info.changes }];
          }
          resolve([result]);
        } catch (error) {
          reject(error);
        }
      });
    },
    end: () => db.close(),
    getConnection: async () => ({
      release: () => {},
      query: pool.query
    })
  };
  
  console.log('✅ SQLite 数据库初始化成功:', dbPath);
} else {
  // MySQL 配置
  const mysql = require('mysql2/promise');
  
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'escape_room_solver',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  console.log('✅ MySQL 数据库配置完成');
}

// Test connection
async function testConnection() {
  try {
    if (process.env.DB_TYPE === 'sqlite') {
      const [result] = await pool.query('SELECT 1 as test');
      console.log('✅ SQLite 数据库连接成功');
      return true;
    } else {
      const connection = await pool.getConnection();
      console.log('✅ MySQL 数据库连接成功');
      connection.release();
      return true;
    }
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

module.exports = pool;
module.exports.testConnection = testConnection;
