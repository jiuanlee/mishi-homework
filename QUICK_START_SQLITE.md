# 密室做题家 - 快速部署指南（SQLite 版）

## 📋 环境要求

- ✅ Node.js 18+（已安装 v22.22.0）
- ✅ npm 9+（已安装 10.9.4）
- ❌ MySQL（不需要，使用 SQLite）
- ❌ Redis（不需要，使用内存缓存）

---

## 🚀 5 分钟快速启动

### 步骤 1：配置后端

```bash
# 进入后端目录
cd /home/rocky/.openclaw/workspace/backend-server

# 复制环境变量
cp .env.example .env

# 编辑配置（使用 SQLite）
nano .env
```

**修改为**：
```ini
# 数据库配置（使用 SQLite）
DB_TYPE=sqlite
DB_PATH=./data/ragflow.db

# JWT 配置
JWT_SECRET=your_jwt_secret_key_123456

# AI API 配置（可选）
BAILIAN_API_KEY=sk-xxx
```

### 步骤 2：安装后端依赖

```bash
cd /home/rocky/.openclaw/workspace/backend-server

# 安装依赖（如果还没安装）
npm install

# 安装 SQLite 支持
npm install better-sqlite3
```

### 步骤 3：初始化数据库

```bash
cd /home/rocky/.openclaw/workspace/backend-server

# 创建数据目录
mkdir -p data

# 初始化数据库
node -e "
const Database = require('better-sqlite3');
const db = new Database('./data/ragflow.db');

// 创建表
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
```

### 步骤 4：启动后端

```bash
cd /home/rocky/.openclaw/workspace/backend-server

# 启动服务
npm start

# 或后台运行
nohup npm start > backend.log 2>&1 &
```

**访问**：http://localhost:3000

---

### 步骤 5：配置前端

```bash
# 进入前端目录
cd /home/rocky/.openclaw/workspace/teacher-web

# 安装依赖
npm install

# 配置 API 地址
nano .env.local
```

**添加**：
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 步骤 6：启动前端

```bash
cd /home/rocky/.openclaw/workspace/teacher-web

# 启动开发服务器
npm run dev
```

**访问**：http://localhost:5173

---

## 🧪 功能测试

### 测试 1：后端 API

```bash
# 健康检查
curl http://localhost:3000/api/health

# 应该返回：{"status":"ok"}
```

### 测试 2：前端页面

```bash
# 访问前端
curl http://localhost:5173

# 应该返回 HTML
```

### 测试 3：注册老师

```bash
curl -X POST http://localhost:3000/api/auth/teacher-register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_teacher",
    "password": "password123",
    "role": "teacher"
  }'
```

### 测试 4：AI 剧本生成

```bash
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "童话",
    "difficulty": "medium",
    "time_limit": 20,
    "grade": 3,
    "subject": "数学"
  }'
```

---

## 📊 服务状态

```bash
# 查看后端进程
ps aux | grep node

# 查看端口占用
netstat -tlnp | grep -E "3000|5173"

# 查看日志
tail -f backend-server/backend.log
```

---

## 🛑 停止服务

```bash
# 停止后端
pkill -f "node.*server.js"

# 停止前端
pkill -f "vite"

# 或找到进程 ID 后手动停止
ps aux | grep node
kill <PID>
```

---

## 📝 下一步

### 升级到 MySQL（生产环境）

1. 安装 MySQL
2. 修改 `.env` 配置
3. 迁移数据
4. 重启服务

### 升级到 Redis（缓存）

1. 安装 Redis
2. 修改 `.env` 配置
3. 重启服务

---

## 🐛 常见问题

### Q1: 后端启动失败？

**解决**：
```bash
# 查看日志
cat backend-server/backend.log

# 检查端口占用
netstat -tlnp | grep 3000

# 杀死占用端口的进程
kill <PID>
```

### Q2: 前端无法访问后端？

**解决**：
```bash
# 检查 .env.local 配置
cat teacher-web/.env.local

# 确认 API 地址正确
# VITE_API_BASE_URL=http://localhost:3000/api
```

### Q3: npm install 失败？

**解决**：
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 清除缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 部署完成！

**访问地址**：
- 🎨 前端（老师端）：http://localhost:5173
- 🔌 后端 API：http://localhost:3000

**下一步**：
1. 注册老师账号
2. 创建班级
3. 生成第一个作业
4. 体验 AI 剧本生成功能！

---

**祝你部署顺利！** 🚀
