# 密室做题家 - 部署文件说明

## 📁 文件结构

```
密室做题家/
├── docker-compose.yml          # Docker 编排配置
├── .env.example                # 环境变量模板
├── deploy-guide.md             # 部署指南
├── ops-manual.md               # 运维手册
│
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml          # CI/CD 流水线配置
│   └── ENVIRONMENTS.md         # 环境配置说明
│
├── nginx/
│   ├── nginx.conf              # Nginx 配置
│   └── ssl/                    # SSL 证书目录
│       ├── server.crt
│       └── server.key
│
├── monitoring/
│   ├── prometheus.yml          # Prometheus 配置
│   ├── loki-config.yml         # Loki 日志配置
│   ├── promtail-config.yml     # Promtail 配置
│   └── grafana/
│       ├── datasources/
│       │   └── datasources.yml # Grafana 数据源
│       └── dashboards/         # Grafana 仪表板
│
├── init-scripts/
│   └── 01-init.sql             # 数据库初始化脚本
│
├── scripts/
│   └── backup-db.sh            # 数据库备份脚本
│
├── frontend/
│   └── Dockerfile              # 前端镜像构建
│
└── backend/
    └── Dockerfile              # 后端镜像构建
```

---

## 🚀 快速开始

### 1. 准备环境

```bash
# 克隆仓库
git clone https://github.com/your-org/密室做题家.git
cd 密室做题家

# 复制环境变量
cp .env.example .env

# 编辑配置
vim .env
```

### 2. 启动服务

```bash
# 启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f

# 检查状态
docker compose ps
```

### 3. 初始化数据库

```bash
# 执行迁移
docker compose exec backend npm run db:migrate

# 创建初始数据
docker compose exec backend npm run db:seed
```

### 4. 访问应用

```
前端：http://localhost
后端 API: http://localhost:3000
Grafana: http://localhost:3001
Prometheus: http://localhost:9090
```

---

## 📋 配置说明

### docker-compose.yml

包含以下服务：

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend | 80 | 前端静态资源 |
| backend | 3000 | 后端 API 服务 |
| db | 5432 | PostgreSQL 数据库 |
| redis | 6379 | Redis 缓存 |
| nginx | 80/443 | 反向代理 |
| sentry | 9000 | 错误监控 |
| prometheus | 9090 | 性能监控 |
| grafana | 3001 | 监控面板 |
| loki | 3100 | 日志收集 |
| promtail | 9080 | 日志采集器 |

### .env.example

环境变量模板，包含：

- 数据库配置
- JWT 密钥
- Sentry DSN
- Grafana 账号
- 云存储配置
- 邮件服务配置

### .github/workflows/ci-cd.yml

CI/CD 流水线：

1. **Lint** - 代码风格检查
2. **Test** - 单元测试
3. **Build** - 构建 Docker 镜像
4. **Deploy Staging** - 部署测试环境
5. **Deploy Production** - 部署生产环境

---

## 🔧 常用命令

### 服务管理

```bash
# 启动所有服务
docker compose up -d

# 停止所有服务
docker compose down

# 重启服务
docker compose restart

# 重启单个服务
docker compose restart backend

# 查看日志
docker compose logs -f backend

# 查看实时状态
docker compose ps
```

### 数据库操作

```bash
# 进入数据库
docker compose exec db psql -U mizhi_user -d mizhi_db

# 备份数据库
./scripts/backup-db.sh

# 恢复数据库
gunzip < backup.sql.gz | docker exec -i 密室做题家-db-1 psql -U mizhi_user -d mizhi_db
```

### 监控查看

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df

# 清理未使用资源
docker system prune -a
```

---

## 📊 监控与日志

### Grafana 仪表板

访问：http://localhost:3001

预置仪表板：
- 系统资源监控
- 应用性能监控
- 业务指标监控
- 错误追踪

### Prometheus 指标

访问：http://localhost:9090

关键指标：
- `http_requests_total` - 请求总数
- `http_request_duration_seconds` - 请求耗时
- `node_memory_usage` - 内存使用
- `postgres_connections` - 数据库连接

### Loki 日志查询

在 Grafana 中探索日志：

```
# 查询后端错误日志
{container="密室做题家-backend"} |= "error"

# 查询特定用户
{container="密室做题家-backend"} |= "user_id=xxx"

# 统计错误数量
sum by (level) (rate({job="applogs"}[5m]))
```

---

## 🔒 安全建议

1. **修改默认密码**
   - 数据库密码
   - Grafana 密码
   - JWT 密钥

2. **配置防火墙**
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

3. **启用 HTTPS**
   - 申请 SSL 证书
   - 配置 Nginx
   - 强制 HTTPS 重定向

4. **定期更新**
   - 系统包：`apt update && apt upgrade`
   - Docker 镜像：`docker compose pull`
   - 依赖包：`npm update`

5. **备份数据**
   - 配置定时备份
   - 异地存储备份
   - 定期恢复演练

---

## 📞 技术支持

- **项目仓库**: https://github.com/your-org/密室做题家
- **问题反馈**: https://github.com/your-org/密室做题家/issues
- **文档**: https://docs.yourdomain.com
- **邮箱**: support@yourdomain.com

---

**版本**: v1.0.0  
**最后更新**: 2026-03-26  
**维护团队**: 密室做题家运维组
