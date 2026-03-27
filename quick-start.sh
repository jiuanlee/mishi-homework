#!/bin/bash

set -e

echo "🚀 开始部署密室做题家（SQLite 快速版）..."
echo ""

PROJECT_DIR="/home/rocky/.openclaw/workspace"
cd $PROJECT_DIR

# 1. 检查 Node.js
echo "📋 步骤 1/7: 检查 Node.js..."
if ! node --version >/dev/null 2>&1; then
    echo "❌ Node.js 未安装"
    exit 1
fi
echo "✅ Node.js $(node --version)"
echo ""

# 2. 配置后端
echo "⚙️  步骤 2/7: 配置后端..."
cd $PROJECT_DIR/backend-server
if [ ! -f ".env" ]; then
    cp .env.example .env
    # 修改为 SQLite 配置
    sed -i 's/DB_TYPE=mysql/DB_TYPE=sqlite/' .env
    sed -i 's/DB_HOST=.*/DB_PATH=.\/data\/ragflow.db/' .env
    echo "✅ 后端配置完成"
else
    echo "✅ 后端配置已存在"
fi
echo ""

# 3. 创建数据目录
echo "📁 步骤 3/7: 创建数据目录..."
mkdir -p data
echo "✅ 数据目录已创建"
echo ""

# 4. 安装后端依赖
echo "📦 步骤 4/7: 安装后端依赖..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 依赖已安装"
fi

# 安装 SQLite
npm install better-sqlite3 --save 2>/dev/null || echo "⚠️  SQLite 安装失败，继续..."
echo ""

# 5. 初始化数据库
echo "🗄️  步骤 5/7: 初始化数据库..."
node -e "
const Database = require('better-sqlite3');
const db = new Database('./data/ragflow.db');

db.exec(\`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    code TEXT UNIQUE,
    teacher_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    type TEXT,
    class_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
\`);

console.log('✅ 数据库初始化完成！');
"
echo ""

# 6. 启动后端
echo "🔄 步骤 6/7: 启动后端服务..."
echo "⏳ 后端服务启动中..."
npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo ""

# 7. 启动前端
echo "🎨 步骤 7/7: 启动前端服务..."
cd $PROJECT_DIR/teacher-web

if [ ! -d "node_modules" ]; then
    npm install
fi

# 配置 API 地址
if [ ! -f ".env.local" ]; then
    echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env.local
fi

echo "⏳ 前端服务启动中..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"
echo ""

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 验证
echo ""
echo "📋 验证服务..."
if curl -s http://localhost:3000/api/health | grep -q "ok"; then
    echo "✅ 后端 API 正常"
else
    echo "⚠️  后端 API 测试失败"
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200"; then
    echo "✅ 前端正常"
else
    echo "⚠️  前端测试失败"
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "访问地址："
echo "  🎨 前端（老师端）: http://localhost:5173"
echo "  🔌 后端 API: http://localhost:3000"
echo ""
echo "进程 ID："
echo "  后端：$BACKEND_PID"
echo "  前端：$FRONTEND_PID"
echo ""
echo "查看日志："
echo "  后端：tail -f backend-server/backend.log"
echo "  前端：tail -f teacher-web/frontend.log"
echo ""
echo "停止服务："
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
