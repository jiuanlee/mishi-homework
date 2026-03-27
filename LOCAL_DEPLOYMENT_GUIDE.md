# 🚀 本地部署完整指南

## 📋 环境要求

| 组件 | 版本 | 状态 |
|------|------|------|
| Node.js | 18+ | ✅ 已安装 (v22.22.0) |
| npm | 9+ | ✅ 已安装 (10.9.4) |
| MySQL | 8.0+ | ❌ 需要安装 |
| Redis | 6.0+ | ❌ 需要安装 |

---

## 🔧 步骤 1：安装 MySQL（Windows）

### 方式 A：MySQL Installer（推荐）⭐

1. **下载安装包**
   ```
   访问：https://dev.mysql.com/downloads/installer/
   下载：mysql-installer-community-8.0.xx.msi
   ```

2. **安装步骤**
   - 运行安装程序
   - 选择 "Developer Default" 或 "Server only"
   - 设置 root 密码（**重要！记住它**）
   - 其他选项默认即可

3. **验证安装**
   ```bash
   # 在 WSL 中测试连接
   mysql -u root -p
   # 输入密码，能登录即成功
   ```

### 方式 B：使用 Docker（如果有 Docker Desktop）⭐⭐⭐

```bash
docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -p 3306:3306 \
  mysql:8.0
```

---

## 🔧 步骤 2：安装 Redis（Windows）

### 方式 A：Windows 原生版本

1. **下载**
   ```
   访问：https://github.com/microsoftarchive/redis/releases
   下载：Redis-x64-3.0.504.msi
   ```

2. **安装**
   - 运行安装程序
   - 默认安装到 `C:\Program Files\Redis`
   - 自动启动 Redis 服务

3. **验证**
   ```bash
   # 在命令行测试
   redis-cli ping
   # 返回 PONG 即成功
   ```

### 方式 B：WSL2 安装（推荐）⭐⭐

```bash
# 在 WSL 中执行
sudo apt update
sudo apt install redis-server -y

# 启动 Redis
sudo service redis-server start

# 验证
redis-cli ping
```

### 方式 C：使用 Docker

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7
```

---

## 🔧 步骤 3：初始化数据库

```bash
# 进入项目目录
cd /home/rocky/.openclaw/workspace

# 登录 MySQL
mysql -u root -p

# 在 MySQL 中执行
source database/init-data.sql

# 或者一行命令
mysql -u root -p < database/init-data.sql
```

**初始化内容**：
- ✅ 创建数据库 `mishi_homework`
- ✅ 创建 8 张表
- ✅ 插入示例数据（20+ 题目）

---

## 🔧 步骤 4：配置后端

```bash
# 进入后端目录
cd /home/rocky/.openclaw/workspace/backend-server

# 复制环境变量
cp .env.example .env

# 编辑 .env 文件
nano .env
```

**修改以下配置**：
```ini
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的 MySQL 密码
DB_NAME=mishi_homework

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_this

# AI API 配置（可选，用于 AI 剧本生成）
BAILIAN_API_KEY=sk-xxx
```

**保存退出**（Ctrl+O → Enter → Ctrl+X）

---

## 🔧 步骤 5：启动后端服务

```bash
# 安装依赖（如果还没安装）
cd /home/rocky/.openclaw/workspace/backend-server
npm install

# 启动服务
npm start

# 后台运行（可选）
nohup npm start > backend.log 2>&1 &
```

**验证**：
```bash
# 测试 API
curl http://localhost:3000/api/health

# 应该返回：{"status":"ok"}
```

**访问**：http://localhost:3000

---

## 🔧 步骤 6：部署前端（老师端）

```bash
# 进入前端目录
cd /home/rocky/.openclaw/workspace/teacher-web

# 安装依赖（如果还没安装）
npm install

# 开发模式（热更新）
npm run dev

# 生产模式（构建后部署）
npm run build
```

**开发模式启动后访问**：http://localhost:5173

---

## 🔧 步骤 7：部署学生端（微信小程序）

### 方式 A：微信小程序开发者工具

1. **下载**
   ```
   访问：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   下载并安装
   ```

2. **导入项目**
   - 打开微信开发者工具
   - 导入项目
   - 选择目录：`/home/rocky/.openclaw/workspace/student-miniprogram`
   - AppID 选择"测试号"

3. **编译运行**
   - 点击"编译"
   - 在模拟器中预览

### 方式 B：H5 版本（临时测试）

```bash
# 学生端也有 H5 版本
cd student-miniprogram
# 使用浏览器打开 index.html
```

---

## 📊 服务状态检查

### 检查清单

```bash
# 1. MySQL
mysql -u root -p -e "SELECT 1"
# 无错误即成功

# 2. Redis
redis-cli ping
# 返回 PONG

# 3. 后端 API
curl http://localhost:3000/api/health
# 返回 {"status":"ok"}

# 4. 前端
curl http://localhost:5173
# 返回 HTML
```

---

## 🎯 快速启动脚本

**创建启动脚本**：

```bash
# 创建文件
cat > /home/rocky/.openclaw/workspace/start-all.sh << 'EOF'
#!/bin/bash

echo "🚀 启动密室做题家..."

# 1. 启动 MySQL（如果未启动）
echo "检查 MySQL..."
mysql -u root -p123456 -e "SELECT 1" 2>/dev/null || echo "❌ MySQL 未启动，请手动启动"

# 2. 启动 Redis（如果未启动）
echo "检查 Redis..."
redis-cli ping >/dev/null 2>&1 || {
    echo "启动 Redis..."
    sudo service redis-server start
}

# 3. 启动后端
echo "启动后端..."
cd /home/rocky/.openclaw/workspace/backend-server
npm start &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"

# 4. 启动前端
echo "启动前端..."
cd /home/rocky/.openclaw/workspace/teacher-web
npm run dev &
FRONTEND_PID=$!
echo "前端 PID: $FRONTEND_PID"

echo ""
echo "✅ 所有服务已启动！"
echo ""
echo "访问地址："
echo "  前端（老师端）: http://localhost:5173"
echo "  后端 API: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

wait
EOF

chmod +x /home/rocky/.openclaw/workspace/start-all.sh
```

**使用**：
```bash
./start-all.sh
```

---

## 🐛 常见问题

### 问题 1：MySQL 连接失败

**错误**：`ECONNREFUSED`

**解决**：
```bash
# 检查 MySQL 是否运行
sudo service mysql status

# 启动 MySQL
sudo service mysql start

# 检查端口
netstat -tlnp | grep 3306
```

### 问题 2：Redis 连接失败

**错误**：`Redis connection refused`

**解决**：
```bash
# 启动 Redis
sudo service redis-server start

# 检查端口
netstat -tlnp | grep 6379
```

### 问题 3：端口被占用

**错误**：`Port 3000 is already in use`

**解决**：
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或者修改端口
# 编辑 backend-server/.env
# SERVER_PORT=3001
```

### 问题 4：npm install 失败

**错误**：`npm ERR! network timeout`

**解决**：
```bash
# 切换淘宝镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

---

## 📝 部署后测试

### 1. 测试后端 API

```bash
# 健康检查
curl http://localhost:3000/api/health

# 获取知识点列表
curl http://localhost:3000/api/knowledge-points?grade=3&subject=math

# 测试 AI 剧本生成（需要配置 API Key）
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{"theme":"童话","difficulty":"medium","time_limit":20,"grade":3,"subject":"数学"}'
```

### 2. 测试前端

1. 访问 http://localhost:5173
2. 注册老师账号
3. 创建班级
4. 生成作业（传统模式或 AI 模式）
5. 下发给学生

### 3. 测试学生端

1. 打开微信小程序开发者工具
2. 使用班级码登录
3. 查看作业列表
4. 进入游戏化做题
5. 完成作业

---

## 🎉 部署完成！

**访问地址**：
- 🎨 老师端（Web）：http://localhost:5173
- 🔌 后端 API：http://localhost:3000
- 📱 学生端（小程序）：微信开发者工具

**下一步**：
1. 注册老师账号
2. 创建班级
3. 生成第一个作业
4. 体验游戏化做题！

---

## 🆘 需要帮助？

- **技术文档**：参考 `backend-server/AI_README.md`
- **API 文档**：参考 `AI_GENERATION_GUIDE.md`
- **部署指南**：参考 `deploy-guide.md`
- **运维手册**：参考 `ops-manual.md`

---

**祝你部署顺利！** 🚀
