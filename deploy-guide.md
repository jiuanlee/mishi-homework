# 密室做题家 - 部署指南

## 📋 目录

1. [部署架构](#部署架构)
2. [前置准备](#前置准备)
3. [云服务选择](#云服务选择)
4. [环境配置](#环境配置)
5. [部署步骤](#部署步骤)
6. [验证与测试](#验证与测试)
7. [常见问题](#常见问题)

---

## 🏗️ 部署架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户请求                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   CDN (静态资源加速)    │
        │   阿里云 CDN/腾讯云 CDN  │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │      Nginx 反向代理     │
        │    (HTTPS 终止/负载均衡)  │
        └────────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │    Backend      │
│   (React/Vue)   │     │   (Node.js)     │
│   Port: 80      │     │   Port: 3000    │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
           ┌────────────┐ ┌──────────┐ ┌──────────┐
           │ PostgreSQL │ │  Redis   │ │  Sentry  │
           │   Port:5432│ │Port:6379 │ │Port:9000 │
           └────────────┘ └──────────┘ └──────────┘
```

---

## 🛠️ 前置准备

### 1. 服务器要求

| 环境 | CPU | 内存 | 存储 | 带宽 |
|------|-----|------|------|------|
| 开发环境 | 2 核 | 4GB | 40GB | 1Mbps |
| 测试环境 | 2 核 | 4GB | 40GB | 1Mbps |
| 生产环境 | 4 核 | 8GB | 80GB | 5Mbps+ |

### 2. 软件要求

- Docker 20.10+
- Docker Compose 2.0+
- Git
- Node.js 20+ (本地开发)

### 3. 账号准备

- [ ] 阿里云/腾讯云账号
- [ ] 域名注册账号
- [ ] GitHub 账号
- [ ] Sentry 账号（可选）

---

## ☁️ 云服务选择

### 阿里云 vs 腾讯云对比

| 特性 | 阿里云 | 腾讯云 | 推荐 |
|------|--------|--------|------|
| ECS 价格 | ¥99/月起 | ¥88/月起 | 腾讯云 |
| 数据库 RDS | ¥149/月起 | ¥139/月起 | 腾讯云 |
| CDN | ¥0.24/GB | ¥0.21/GB | 腾讯云 |
| SSL 证书 | 免费/付费 | 免费/付费 | 平手 |
| 文档质量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 阿里云 |
| 技术支持 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 阿里云 |

### 推荐配置（生产环境）

**方案 A - 阿里云**
```
- ECS: ecs.c6.large (2 核 4GB) - ¥165/月
- RDS PostgreSQL: pg.n2.small.1 (2 核 4GB) - ¥234/月
- Redis: redis.master.small (1GB) - ¥78/月
- CDN: 按量付费 - 约¥50/月
- SSL: 免费 DV 证书 - ¥0/月
总计：约¥527/月
```

**方案 B - 腾讯云**
```
- CVM: S3.MEDIUM2 (2 核 4GB) - ¥138/月
- DB PostgreSQL: 2 核 4GB - ¥198/月
- Redis: 1GB - ¥65/月
- CDN: 按量付费 - 约¥45/月
- SSL: 免费 DV 证书 - ¥0/月
总计：约¥446/月
```

---

## 🔧 环境配置

### 1. 环境变量文件

创建 `.env` 文件：

```bash
# 数据库配置
DB_USER=mizhi_user
DB_PASSWORD=your_secure_password_here
DB_NAME=mizhi_db

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here

# Sentry 配置
SENTRY_DSN=https://xxx@sentry.io/xxx

# Grafana 配置
GRAFANA_USER=admin
GRAFANA_PASSWORD=your_grafana_password

# API 配置
API_URL=https://api.yourdomain.com
```

### 2. 目录结构

```
/opt/密室做题家-production/
├── docker-compose.yml
├── .env
├── .env.example
├── nginx/
│   ├── nginx.conf
│   └── ssl/
│       ├── server.crt
│       └── server.key
├── monitoring/
│   ├── prometheus.yml
│   ├── loki-config.yml
│   ├── promtail-config.yml
│   └── grafana/
├── init-scripts/
│   └── 01-init.sql
└── logs/
```

---

## 🚀 部署步骤

### Step 1: 准备服务器

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 更新系统
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
apt install docker-compose-plugin -y

# 验证安装
docker --version
docker compose version
```

### Step 2: 克隆项目

```bash
# 创建目录
mkdir -p /opt/密室做题家-production
cd /opt/密室做题家-production

# 克隆代码
git clone https://github.com/your-org/密室做题家.git .
```

### Step 3: 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
# 修改所有密码和密钥为安全值
```

### Step 4: 配置 Nginx

```bash
# 创建 Nginx 配置目录
mkdir -p nginx/ssl

# 上传 SSL 证书到 nginx/ssl/
# server.crt 和 server.key
```

### Step 5: 启动服务

```bash
# 拉取镜像并启动
docker compose pull
docker compose up -d

# 查看日志
docker compose logs -f

# 检查服务状态
docker compose ps
```

### Step 6: 数据库初始化

```bash
# 执行数据库迁移
docker compose exec backend npm run db:migrate

# 创建初始数据
docker compose exec backend npm run db:seed
```

---

## ✅ 验证与测试

### 服务健康检查

```bash
# 检查所有容器
docker compose ps

# 预期输出：
# NAME                STATUS         PORTS
# frontend            Up (healthy)   0.0.0.0:80->80/tcp
# backend             Up (healthy)   0.0.0.0:3000->3000/tcp
# db                  Up (healthy)   5432/tcp
# redis               Up (healthy)   6379/tcp
# nginx               Up             0.0.0.0:443->443/tcp
```

### API 测试

```bash
# 健康检查端点
curl https://api.yourdomain.com/health

# 预期响应：
# {"status": "ok", "timestamp": "..."}
```

### 前端访问

```
浏览器访问：https://yourdomain.com
```

### 监控面板

```
Grafana:    https://yourdomain.com:3001
Prometheus: https://yourdomain.com:9090
```

---

## ❓ 常见问题

### Q1: 容器启动失败

```bash
# 查看日志
docker compose logs backend

# 常见原因：
# 1. 端口被占用：lsof -i :3000
# 2. 内存不足：free -h
# 3. 环境变量错误：docker compose config
```

### Q2: 数据库连接失败

```bash
# 检查数据库状态
docker compose exec db pg_isready

# 查看数据库日志
docker compose logs db

# 重置数据库（谨慎操作！）
docker compose down -v
docker compose up -d db
```

### Q3: HTTPS 证书问题

```bash
# 检查证书有效期
openssl x509 -in nginx/ssl/server.crt -noout -dates

# 重新申请证书（阿里云/腾讯云控制台）
# 下载并替换 nginx/ssl/ 下的证书文件
# 重启 Nginx
docker compose restart nginx
```

### Q4: 性能问题

```bash
# 查看资源使用
docker stats

# 优化建议：
# 1. 增加服务器配置
# 2. 启用 Redis 缓存
# 3. 配置 CDN 加速
# 4. 数据库添加索引
```

---

## 📞 技术支持

- 项目仓库：https://github.com/your-org/密室做题家
- 问题反馈：https://github.com/your-org/密室做题家/issues
- 文档：https://docs.yourdomain.com

---

**版本**: v1.0.0  
**最后更新**: 2026-03-26  
**维护团队**: 密室做题家运维组
