# 🚀 本地快速部署指南

## ✅ GitHub 上传完成

**仓库地址**：https://github.com/jiuanlee/mishi-homework

**代码状态**：
- ✅ 303 个文件已推送
- ✅ 初始版本：V1.0
- ✅ 包含完整前后端代码

---

## 📋 本地部署方案

### 方案 A：Docker 部署（推荐）⭐⭐⭐⭐⭐

**前提**：需要安装 Docker Desktop

**步骤**：
```bash
# 1. 克隆仓库
git clone https://github.com/jiuanlee/mishi-homework.git
cd mishi-homework

# 2. 复制环境变量
cp .env.example .env

# 3. 修改 .env 配置
# - 数据库密码
# - JWT 密钥
# - Redis 密码

# 4. 启动所有服务
docker compose up -d

# 5. 查看状态
docker compose ps

# 6. 访问服务
# 前端：http://localhost
# API: http://localhost:3000
# Grafana: http://localhost:3001
```

**优点**：
- ✅ 一键启动所有服务
- ✅ 环境隔离
- ✅ 包含数据库、Redis、监控

---

### 方案 B：本地手动部署（无 Docker）⭐⭐⭐

**前提**：
- Node.js 18+ ✅ (已安装 v22.22.0)
- MySQL 8.0+
- Redis 6.0+

**步骤**：

#### 1. 安装 MySQL

**Windows**：
```
下载：https://dev.mysql.com/downloads/installer/
安装后记录 root 密码
```

**初始化数据库**：
```bash
mysql -u root -p < database/init-data.sql
```

#### 2. 安装 Redis

**Windows**：
```
下载：https://github.com/microsoftarchive/redis/releases
运行：redis-server.exe
```

#### 3. 部署后端

```bash
cd backend-server
npm install
cp .env.example .env
# 编辑 .env 配置数据库连接
npm start
```

**访问**：http://localhost:3000

#### 4. 部署前端（老师端）

```bash
cd teacher-web
npm install
npm run dev
```

**访问**：http://localhost:5173

#### 5. 部署学生端（微信小程序）

```
1. 下载微信小程序开发者工具
   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2. 导入 student-miniprogram 目录

3. 编译运行
```

---

### 方案 C：云服务器部署（生产环境）⭐⭐⭐⭐

**推荐服务商**：
- 阿里云：约 ¥527/月
- 腾讯云：约 ¥446/月

**步骤**：
1. 购买云服务器（2 核 4G 起步）
2. 安装 Docker
3. 按照方案 A 部署
4. 配置域名和 HTTPS

---

## 🔧 当前环境检查

| 组件 | 状态 | 说明 |
|------|------|------|
| Node.js | ✅ v22.22.0 | 已安装 |
| npm | ✅ 10.9.4 | 已安装 |
| Docker | ❌ 未安装 | 需要 Docker Desktop |
| MySQL | ⏳ 待检查 | 需要安装 |
| Redis | ⏳ 待检查 | 需要安装 |

---

## 🎯 推荐部署流程

### 如果你要快速测试：

**方案 1：使用 Docker Desktop（最简单）**

1. 下载安装 Docker Desktop
   https://www.docker.com/products/docker-desktop/

2. 启用 WSL 集成
   - 打开 Docker Desktop
   - Settings → Resources → WSL Integration
   - 启用你的 WSL 发行版

3. 执行：
   ```bash
   docker compose up -d
   ```

**方案 2：只部署后端 API 测试**

```bash
# 1. 安装 MySQL 和 Redis

# 2. 初始化数据库
mysql -u root -p < database/init-data.sql

# 3. 启动后端
cd backend-server
npm install
npm start

# 4. 测试 API
curl http://localhost:3000/api/health
```

---

## 📝 下一步

1. **选择部署方案**（A/B/C）
2. **安装依赖服务**（Docker/MySQL/Redis）
3. **执行部署**
4. **测试功能**

---

## 🆘 需要帮助？

- **Docker 问题**：参考 `docker-compose.yml` 注释
- **后端问题**：参考 `backend-readme.md`
- **前端问题**：参考 `frontend-readme.md`
- **运维问题**：参考 `ops-manual.md`

---

**仓库地址**：https://github.com/jiuanlee/mishi-homework  
**文档**：参考各目录下的 README.md
