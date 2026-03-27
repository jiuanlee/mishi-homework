#!/bin/bash

set -e

echo "🚀 密室做题家 - 快速启动脚本（SQLite + AI 配置）"
echo ""

# 检查 Node.js
if ! node --version >/dev/null 2>&1; then
    echo "❌ Node.js 未安装"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# 进入项目目录
cd "$(dirname "$0")"

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，创建默认配置..."
    cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
DB_TYPE=sqlite
DB_PATH=./data/ragflow.db
JWT_SECRET=your-secret-key-change-in-production
BAILIAN_API_KEY=your_bailian_api_key
GLM_API_KEY=your_glm_api_key
MINIMAX_API_KEY=
MINIMAX_GROUP_ID=
EOF
    echo "✅ .env 文件已创建，请编辑配置 API Key"
fi

# 检查 SQLite 配置
if grep -q "DB_TYPE=sqlite" .env; then
    echo "✅ SQLite 配置已启用"
    
    # 创建数据目录
    mkdir -p data
    
    # 检查 better-sqlite3
    if [ ! -d "node_modules/better-sqlite3" ]; then
        echo "📦 安装 SQLite 依赖..."
        npm install better-sqlite3 --save
    fi
else
    echo "⚠️  未使用 SQLite，请确保 MySQL 已配置"
fi

# 检查 AI API Key
echo ""
echo "🔑 检查 AI API Key 配置..."

if grep -q "BAILIAN_API_KEY=sk-" .env; then
    echo "✅ 阿里云百炼 API Key 已配置"
else
    echo "⚠️  阿里云百炼 API Key 未配置"
fi

if grep -q "GLM_API_KEY=glm" .env; then
    echo "✅ 智谱 AI API Key 已配置"
else
    echo "⚠️  智谱 AI API Key 未配置"
fi

# 初始化数据库
echo ""
echo "📦 初始化数据库..."
node -e "
const db = require('./config/database');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    // 检查是否需要初始化 SQLite
    if (process.env.DB_TYPE === 'sqlite') {
      const dbPath = path.join(__dirname, process.env.DB_PATH);
      if (!fs.existsSync(dbPath)) {
        console.log('创建 SQLite 数据库...');
        
        // 创建表结构
        const tables = \`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT,
            role TEXT DEFAULT 'student',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            grade TEXT,
            description TEXT,
            teacher_id INTEGER,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS assignments (
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
          );
          
          CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assignment_id INTEGER,
            student_id INTEGER,
            content TEXT,
            score INTEGER,
            status TEXT DEFAULT 'pending',
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS class_students (
            class_id INTEGER,
            student_id INTEGER,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (class_id, student_id)
          );
        \`;
        
        tables.split(';').forEach(sql => {
          if (sql.trim()) {
            db.exec(sql.trim());
          }
        });
        
        console.log('✅ 数据库表结构创建完成');
        
        // 创建默认管理员账号
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.exec(\`INSERT OR IGNORE INTO users (username, password, email, role) VALUES ('admin', '$hashedPassword', 'admin@example.com', 'admin')\`);
        console.log('✅ 默认管理员账号创建成功 (admin/admin123)');
      } else {
        console.log('✅ SQLite 数据库已存在');
      }
    }
    
    // 测试连接
    await db.testConnection();
    process.exit(0);
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err.message);
    process.exit(1);
  }
})();
"

# 启动服务
echo ""
echo "🚀 启动后端服务..."

# 检查是否已在运行
if pgrep -f "node.*server.js" >/dev/null; then
    echo "⚠️  后端服务已在运行，重启中..."
    pkill -f "node.*server.js"
    sleep 2
fi

# 启动
npm start &
sleep 5

# 验证
echo ""
echo "📋 验证服务..."
if curl -s http://localhost:3000/health | grep -q "ok"; then
    echo "✅ 后端服务启动成功"
else
    echo "⚠️  后端服务启动中，请稍候..."
    sleep 5
fi

echo ""
echo "🎉 启动完成！"
echo ""
echo "访问地址："
echo "  后端 API: http://localhost:3000"
echo "  健康检查：http://localhost:3000/health"
echo ""
echo "默认管理员账号："
echo "  用户名：admin"
echo "  密码：admin123"
echo ""
echo "配置 AI API Key："
echo "  ./config-ai-keys.sh"
echo ""
echo "停止服务："
echo "  pkill -f 'node.*server.js'"
echo ""
