#!/usr/bin/env node

/**
 * SQLite 数据库初始化脚本
 */

const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('📦 开始初始化数据库...\n');
    
    // 创建表结构
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        grade TEXT,
        description TEXT,
        teacher_id INTEGER,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER,
        teacher_id INTEGER,
        title TEXT,
        subject TEXT,
        knowledge_points TEXT,
        difficulty TEXT,
        content TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id INTEGER,
        student_id INTEGER,
        content TEXT,
        score INTEGER,
        status TEXT DEFAULT 'pending',
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS class_students (
        class_id INTEGER,
        student_id INTEGER,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (class_id, student_id)
      )`
    ];
    
    // 使用原生 SQLite 连接
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(__dirname, process.env.DB_PATH || './data/ragflow.db');
    const sqlite = new Database(dbPath);
    
    tables.forEach(sql => {
      sqlite.exec(sql);
    });
    
    console.log('✅ 数据库表结构创建完成\n');
    
    // 创建默认账号
    console.log('📝 创建默认账号...');
    
    // Admin
    const adminHash = bcrypt.hashSync('admin123', 10);
    try {
      sqlite.exec(`INSERT INTO users (username, password, email, role) VALUES ('admin', '${adminHash}', 'admin@example.com', 'admin')`);
      console.log('✅ Admin 账号：admin / admin123');
    } catch (err) {
      console.log('ℹ️  Admin 账号已存在');
    }
    
    // Test Teacher
    const teacherHash = bcrypt.hashSync('password123', 10);
    try {
      sqlite.exec(`INSERT INTO users (username, password, email, role) VALUES ('test_teacher', '${teacherHash}', 'teacher@example.com', 'teacher')`);
      console.log('✅ Teacher 账号：test_teacher / password123');
    } catch (err) {
      console.log('ℹ️  Teacher 账号已存在');
    }
    
    // Test Student
    const studentHash = bcrypt.hashSync('student123', 10);
    try {
      sqlite.exec(`INSERT INTO users (username, password, email, role) VALUES ('test_student', '${studentHash}', 'student@example.com', 'student')`);
      console.log('✅ Student 账号：test_student / student123\n');
    } catch (err) {
      console.log('ℹ️  Student 账号已存在\n');
    }
    
    sqlite.close();
    
    // 测试查询
    const [users] = await db.query('SELECT id, username, role FROM users');
    console.log(`📊 当前用户数：${users.length}`);
    
    console.log('\n🎉 数据库初始化完成！\n');
    
    process.exit(0);
  } catch (err) {
    console.error('\n❌ 初始化失败:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

initializeDatabase();
