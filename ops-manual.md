# 密室做题家 - 运维手册

## 📖 目录

1. [日常运维](#日常运维)
2. [监控告警](#监控告警)
3. [备份恢复](#备份恢复)
4. [故障排查](#故障排查)
5. [性能优化](#性能优化)
6. [安全加固](#安全加固)
7. [应急预案](#应急预案)

---

## 🔧 日常运维

### 每日检查清单

- [ ] 检查服务状态：`docker compose ps`
- [ ] 查看错误日志：`docker compose logs --tail=100 backend`
- [ ] 检查磁盘空间：`df -h`
- [ ] 检查内存使用：`free -h`
- [ ] 查看监控面板：Grafana Dashboard
- [ ] 检查 Sentry 错误报告

### 每周维护

```bash
# 清理未使用的镜像
docker image prune -a --filter "until=168h"

# 清理系统日志
journalctl --vacuum-time=7d

# 更新系统包
apt update && apt upgrade -y

# 检查容器重启次数
docker inspect --format='{{.RestartCount}}' $(docker ps -q)
```

### 每月任务

- [ ] 数据库性能分析
- [ ] 日志归档
- [ ] 证书有效期检查
- [ ] 备份恢复演练
- [ ] 安全漏洞扫描

---

## 📊 监控告警

### 监控指标

| 指标 | 阈值 | 告警级别 |
|------|------|----------|
| CPU 使用率 | >80% | Warning |
| CPU 使用率 | >95% | Critical |
| 内存使用率 | >80% | Warning |
| 内存使用率 | >95% | Critical |
| 磁盘使用率 | >80% | Warning |
| 磁盘使用率 | >90% | Critical |
| API 响应时间 | >2s | Warning |
| API 响应时间 | >5s | Critical |
| 错误率 | >1% | Warning |
| 错误率 | >5% | Critical |

### Grafana 仪表盘

```
访问地址：https://yourdomain.com:3001
默认账号：admin / ${GRAFANA_PASSWORD}

主要 Dashboard:
- 系统资源监控 (ID: 1)
- 应用性能监控 (ID: 2)
- 业务指标监控 (ID: 3)
- 错误追踪 (ID: 4)
```

### Sentry 配置

```javascript
// backend/src/config/sentry.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  attachStacktrace: true,
});
```

### 告警通知配置

```yaml
# monitoring/alertmanager.yml
global:
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alerts@yourdomain.com'

route:
  receiver: 'default-receiver'
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

receivers:
  - name: 'default-receiver'
    email_configs:
      - to: 'ops-team@yourdomain.com'
    webhook_configs:
      - url: 'https://hooks.slack.com/services/xxx'
```

---

## 💾 备份恢复

### 数据库备份

#### 自动备份脚本

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/opt/backups/db"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="密室做题家-db-1"

mkdir -p $BACKUP_DIR

# PostgreSQL 备份
docker exec $CONTAINER_NAME pg_dump -U ${DB_USER} ${DB_NAME} | gzip > $BACKUP_DIR/db_${DATE}.sql.gz

# 保留最近 30 天备份
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_${DATE}.sql.gz"
```

#### 定时备份（Cron）

```bash
# 编辑 crontab
crontab -e

# 添加每日凌晨 2 点备份
0 2 * * * /opt/密室做题家-production/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### Redis 备份

```bash
# 手动触发 Redis 持久化
docker compose exec redis redis-cli BGSAVE

# 备份 RDB 文件
docker cp 密室做题家-redis-1:/data/dump.rdb /opt/backups/redis/dump_$(date +%Y%m%d).rdb
```

### 备份验证

```bash
# 恢复测试（在测试环境）
gunzip < db_20260326_020000.sql.gz | docker exec -i 密室做题家-db-1 psql -U ${DB_USER} -d ${DB_NAME}

# 验证数据完整性
docker exec 密室做题家-db-1 psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT COUNT(*) FROM users;"
```

### 备份存储策略

```
本地备份：/opt/backups/ (保留 7 天)
云存储：阿里云 OSS / 腾讯云 COS (保留 30 天)
异地备份：另一台服务器 (保留 90 天)
```

---

## 🔍 故障排查

### 常见问题诊断

#### 1. 服务无法访问

```bash
# 检查容器状态
docker compose ps

# 检查端口监听
netstat -tlnp | grep :3000

# 检查防火墙
ufw status

# 检查 Nginx 配置
docker compose exec nginx nginx -t
```

#### 2. 数据库连接超时

```bash
# 检查数据库容器
docker compose logs db

# 测试数据库连接
docker compose exec backend psql $DATABASE_URL

# 检查连接池
docker compose exec db psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT count(*) FROM pg_stat_activity;"
```

#### 3. 内存泄漏

```bash
# 查看容器内存使用
docker stats --no-stream

# 分析 Node.js 堆内存
docker compose exec backend node --inspect=0.0.0.0:9229 app.js

# Chrome DevTools 连接分析
```

#### 4. 磁盘空间不足

```bash
# 查看磁盘使用
df -h

# 查找大文件
find /opt -type f -size +100M -exec ls -lh {} \;

# 清理 Docker 日志
truncate -s 0 /var/lib/docker/containers/*/*-json.log

# 清理未使用卷
docker volume prune
```

### 日志查询

```bash
# 实时查看日志
docker compose logs -f backend

# 查看特定时间范围
docker compose logs --since="2026-03-26T10:00:00" --until="2026-03-26T12:00:00" backend

# 搜索错误
docker compose logs backend | grep -i error

# Loki 日志查询（Grafana）
{container="密室做题家-backend"} |= "error"
```

---

## ⚡ 性能优化

### 数据库优化

```sql
-- 添加索引
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_questions_category ON questions(category_id);

-- 分析表
ANALYZE users;
ANALYZE questions;

-- 查看慢查询
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### Redis 缓存策略

```javascript
// 缓存热点数据
const cacheKey = `question:${questionId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 设置过期时间
await redis.setex(cacheKey, 3600, JSON.stringify(data));
```

### CDN 配置

```
阿里云 CDN 配置:
- 加速域名：cdn.yourdomain.com
- 源站：后端服务器 IP
- 缓存规则:
  - 静态资源 (js/css/images): 缓存 30 天
  - API 响应：不缓存
  - HTML: 缓存 1 小时
```

### Nginx 优化

```nginx
# nginx/nginx.conf
http {
    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
    
    # 连接优化
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # 反向代理优化
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # 缓存配置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;
}
```

---

## 🔒 安全加固

### 系统安全

```bash
# 创建专用用户
useradd -m -s /bin/bash mizhi
usermod -aG docker mizhi

# 设置 SSH 密钥登录
mkdir -p /home/mizhi/.ssh
chmod 700 /home/mizhi/.ssh

# 禁用 root SSH 登录
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
```

### 网络安全

```bash
# 配置防火墙
ufw default deny incoming
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# 限制数据库访问
# 仅允许内网访问 5432 和 6379 端口
```

### 应用安全

```yaml
# Docker 安全配置
version: '3.8'
services:
  backend:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
```

### 定期安全扫描

```bash
# 镜像漏洞扫描
docker scan 密室做题家-backend:latest

# 依赖安全检查
cd backend && npm audit
cd frontend && npm audit

# 使用 Snyk
snyk test
```

---

## 🚨 应急预案

### 服务宕机

```bash
# 1. 快速重启
docker compose restart

# 2. 查看日志定位问题
docker compose logs --tail=500

# 3. 回滚到上一版本
git checkout previous-tag
docker compose pull
docker compose up -d
```

### 数据库故障

```bash
# 1. 检查数据库状态
docker compose exec db pg_isready

# 2. 尝试重启
docker compose restart db

# 3. 从备份恢复
gunzip < /opt/backups/db/latest.sql.gz | docker exec -i 密室做题家-db-1 psql -U ${DB_USER}
```

### DDoS 攻击

```bash
# 1. 启用云服务商 DDoS 防护
# 阿里云：DDoS 基础防护
# 腾讯云：DDoS 防护

# 2. 限制请求频率
# Nginx 限流配置
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

# 3. 临时封禁 IP
ufw deny from ATTACKER_IP
```

### 数据泄露

```
应急流程:
1. 立即隔离受影响系统
2. 保存日志和证据
3. 评估泄露范围
4. 通知相关用户
5. 修复漏洞
6. 提交事故报告
```

### 联系人列表

| 角色 | 姓名 | 电话 | 邮箱 |
|------|------|------|------|
| 运维负责人 | XXX | 138-xxxx-xxxx | ops@yourdomain.com |
| 开发负责人 | XXX | 139-xxxx-xxxx | dev@yourdomain.com |
| 云服务商 | 阿里云/腾讯云 | 95187 / 95716 | support@cloud.com |

---

## 📝 运维记录模板

### 变更日志

```markdown
## 2026-03-26

### 变更内容
- 部署版本：v1.0.0
- 变更类型：[新增/修复/优化]
- 影响范围：[全量/部分]

### 操作人员
- 操作人：XXX
- 审核人：XXX

### 回滚方案
- 回滚命令：git checkout xxx
- 预计时间：10 分钟
```

### 事故报告

```markdown
## 事故编号：INC-2026-001

### 事故概述
- 发生时间：2026-03-26 10:00
- 恢复时间：2026-03-26 10:30
- 持续时间：30 分钟
- 影响等级：P2

### 事故描述
[详细描述事故现象和影响]

### 根本原因
[分析事故根本原因]

### 处理过程
[记录处理步骤]

### 改进措施
[列出预防措施]
```

---

**版本**: v1.0.0  
**最后更新**: 2026-03-26  
**维护团队**: 密室做题家运维组
