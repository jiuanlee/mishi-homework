# 🚀 一键部署脚本（手动执行版）

## 📋 快速部署步骤

### 步骤 1：安装 MySQL（Windows）

**在 Windows PowerShell 中执行**：

```powershell
# 使用 winget 安装（Windows 10/11）
winget install Oracle.MySQL

# 或者下载安装包
# 访问：https://dev.mysql.com/downloads/installer/
```

**安装时记住 root 密码**！

---

### 步骤 2：安装 Redis（Windows）

**在 Windows PowerShell 中执行**：

```powershell
# 使用 winget 安装
winget install RedisLabs.Redis

# 或者下载 MSI 安装包
# 访问：https://github.com/microsoftarchive/redis/releases
```

---

### 步骤 3：配置后端

**在 WSL 中执行**：

```bash
# 进入后端目录
cd /home/rocky/.openclaw/workspace/backend-server

# 复制环境变量
cp .env.example .env

# 编辑配置
nano .env
```

**修改以下配置**：
```ini
# 数据库配置（修改为你的实际密码）
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的 MySQL 密码
DB_NAME=mishi_homework

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 密钥（自定义）
JWT_SECRET=your_secret_key_123456

# AI API（可选）
BAILIAN_API_KEY=sk-xxx
```

**保存退出**：Ctrl+O → Enter → Ctrl+X

---

### 步骤 4：初始化数据库

**在 Windows PowerShell 中执行**：

```powershell
# 进入项目目录
cd /home/rocky/.openclaw/workspace

# 初始化数据库
mysql -u root -p < database/init-data.sql
# 输入 MySQL 密码
```

---

### 步骤 5：启动服务

**终端 1 - 启动后端**：

```bash
cd /home/rocky/.openclaw/workspace/backend-server

# 安装依赖（首次运行）
npm install

# 启动服务
npm start
```

**访问**：http://localhost:3000

---

**终端 2 - 启动前端**：

```bash
cd /home/rocky/.openclaw/workspace/teacher-web

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

**访问**：http://localhost:5173

---

### 步骤 6：验证部署

**打开浏览器访问**：

1. **后端健康检查**
   ```
   http://localhost:3000/api/health
   ```
   应该返回：`{"status":"ok"}`

2. **前端页面**
   ```
   http://localhost:5173
   ```
   应该看到登录页面

3. **测试 API**
   ```bash
   # 获取知识点列表
   curl "http://localhost:3000/api/knowledge-points?grade=3&subject=math"
   ```

---

## 🎯 完整部署检查清单

- [ ] MySQL 已安装并运行
- [ ] Redis 已安装并运行
- [ ] 数据库已初始化（`init-data.sql`）
- [ ] 后端 `.env` 已配置
- [ ] 后端服务已启动（端口 3000）
- [ ] 前端服务已启动（端口 5173）
- [ ] 能访问 http://localhost:3000/api/health
- [ ] 能访问 http://localhost:5173

---

## 📱 学生端部署（可选）

### 微信小程序

1. **下载微信开发者工具**
   ```
   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   ```

2. **导入项目**
   - 打开微信开发者工具
   - 项目目录：`/home/rocky/.openclaw/workspace/student-miniprogram`
   - AppID：选择"测试号"

3. **编译运行**
   - 点击"编译"
   - 在模拟器中预览

---

## 🐛 常见问题

### Q1: MySQL 连接失败

**错误**：`ER_ACCESS_DENIED_ERROR`

**解决**：
```bash
# 检查密码是否正确
mysql -u root -p

# 如果忘记密码，重置：
# Windows: 使用 MySQL Installer 重置
```

### Q2: 端口被占用

**错误**：`Port 3000 is already in use`

**解决**：
```powershell
# Windows 查看占用端口的进程
netstat -ano | findstr :3000

# 杀死进程
taskkill /PID <PID> /F
```

### Q3: npm install 太慢

**解决**：
```bash
# 切换淘宝镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### Q4: 前端页面空白

**解决**：
1. 检查浏览器控制台（F12）
2. 确认后端 API 已启动
3. 检查 `.env` 中的 API 地址

---

## 🎉 部署完成！

**访问地址**：
- 🎨 老师端：http://localhost:5173
- 🔌 后端 API: http://localhost:3000
- 📱 学生端：微信开发者工具

**首次使用**：
1. 访问 http://localhost:5173
2. 注册老师账号
3. 创建班级
4. 生成第一个作业
5. 开始体验！

---

## 📖 参考文档

- 完整部署指南：`LOCAL_DEPLOYMENT_GUIDE.md`
- API 文档：`backend-server/AI_GENERATION_GUIDE.md`
- 前端文档：`teacher-web/AI_SCRIPT_IMPLEMENTATION.md`
- 运维手册：`ops-manual.md`

---

**祝你部署顺利！** 🚀
