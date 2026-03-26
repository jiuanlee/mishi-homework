# 密室做题家后端部署说明

## 项目概述

**密室做题家**是一款面向小学生的沉浸式学习平台，将作业与密室逃脱/剧本杀剧情结合，让学习更有趣。

### 核心功能
- 🎯 知识点智能匹配
- 📚 一键生成作业
- 🎮 剧情化学习体验
- 📊 实时进度追踪
- 📈 多维度统计分析

---

## 技术栈

| 组件 | 技术选型 | 版本要求 |
|------|---------|---------|
| 语言 | Node.js | 18+ |
| 框架 | Express.js | 4.x |
| 数据库 | MySQL / PostgreSQL | 8.0+ / 14+ |
| 缓存 | Redis | 6+ |
| 认证 | JWT | - |

---

## 快速部署

### 1. 环境准备

#### 安装 Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v18.x.x
npm -v   # 应显示 9.x.x
```

#### 安装 MySQL
```bash
# Ubuntu/Debian
sudo apt-get install -y mysql-server

# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全初始化
sudo mysql_secure_installation
```

#### 安装 Redis
```bash
# Ubuntu/Debian
sudo apt-get install -y redis-server

# 启动 Redis
sudo systemctl start redis
sudo systemctl enable redis
```

---

### 2. 代码部署

#### 克隆/上传代码
```bash
# 进入工作目录
cd /home/rocky/.openclaw/workspace

# 确认目录结构
ls -la backend-server/
ls -la database/
```

#### 安装依赖
```bash
cd backend-server
npm install --production
```

---

### 3. 数据库初始化

#### 创建数据库
```bash
mysql -u root -p < ../database/init-data.sql
```

#### 验证数据
```bash
mysql -u root -p -e "USE escape_room_solver; SELECT COUNT(*) FROM question_bank;"
```

---

### 4. 配置环境变量

创建 `.env` 文件：
```bash
cd backend-server
cat > .env << EOF
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=escape_room_solver

# Redis 配置
REDIS_URL=redis://localhost:6379

# JWT 配置（生产环境请修改！）
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
EOF
```

**⚠️ 安全提示**:
- 生产环境必须修改 `JWT_SECRET`
- 使用强密码保护数据库
- 不要将 `.env` 文件提交到版本控制

---

### 5. 启动服务

#### 开发模式（带热重载）
```bash
npm run dev
```

#### 生产模式
```bash
npm start
```

#### 后台运行（推荐）
```bash
# 使用 PM2（推荐）
npm install -g pm2
pm2 start server.js --name escape-room-api
pm2 save
pm2 startup

# 或使用 nohup
nohup npm start > output.log 2>&1 &
```

---

### 6. 验证部署

#### 健康检查
```bash
curl http://localhost:3000/health
```

预期响应：
```json
{
  "status": "ok",
  "timestamp": "2026-03-26T13:40:00.000Z"
}
```

#### 测试登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 生产环境配置

### Nginx 反向代理

#### 安装 Nginx
```bash
sudo apt-get install -y nginx
```

#### 配置 Nginx
```bash
sudo nano /etc/nginx/sites-available/escape-room-api
```

添加配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 启用配置
```bash
sudo ln -s /etc/nginx/sites-available/escape-room-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### HTTPS 配置（Let's Encrypt）
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 性能优化

### Redis 缓存策略

系统已实现以下缓存：
- 作业详情缓存（1 小时）
- 学生进度缓存（5 分钟）
- 平台统计缓存（10 分钟）

### 数据库优化

#### 创建索引（已在初始化脚本中）
```sql
-- 常用查询索引
CREATE INDEX idx_assignment_student ON answers(assignment_id, student_id);
CREATE INDEX idx_question_difficulty ON question_bank(difficulty, subject, grade);
```

#### 连接池配置
在 `config/database.js` 中调整：
```javascript
connectionLimit: 20,  // 根据服务器性能调整
queueLimit: 100
```

---

## 监控与日志

### 应用日志
```bash
# 查看 PM2 日志
pm2 logs escape-room-api

# 查看 nohup 日志
tail -f output.log
```

### 数据库监控
```sql
-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 查看连接数
SHOW STATUS LIKE 'Threads_connected';
```

### Redis 监控
```bash
redis-cli INFO
redis-cli MONITOR
```

---

## 备份与恢复

### 数据库备份
```bash
# 备份
mysqldump -u root -p escape_room_solver > backup_$(date +%Y%m%d).sql

# 恢复
mysql -u root -p escape_room_solver < backup_20260326.sql
```

### 定期备份脚本
```bash
#!/bin/bash
# /usr/local/bin/backup-escape-room.sh

BACKUP_DIR="/backups/escape-room"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mysqldump -u root -pYOUR_PASSWORD escape_room_solver > $BACKUP_DIR/db_$DATE.sql

# 保留最近 7 天备份
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
```

#### 添加定时任务
```bash
crontab -e
# 每天凌晨 2 点备份
0 2 * * * /usr/local/bin/backup-escape-room.sh
```

---

## 故障排查

### 常见问题

#### 1. 数据库连接失败
```bash
# 检查 MySQL 状态
sudo systemctl status mysql

# 检查连接
mysql -u root -p -e "SELECT 1"

# 检查防火墙
sudo ufw status
```

#### 2. Redis 连接失败
```bash
# 检查 Redis 状态
sudo systemctl status redis

# 测试连接
redis-cli ping  # 应返回 PONG
```

#### 3. 端口被占用
```bash
# 查看占用端口的进程
sudo lsof -i :3000

# 杀死进程
sudo kill -9 <PID>
```

#### 4. 内存不足
```bash
# 查看内存使用
free -h

# 查看 Node 进程内存
pm2 monit
```

---

## 扩展与升级

### 水平扩展

#### 多实例部署
```bash
# PM2 集群模式
pm2 start server.js -i max --name escape-room-api
```

#### 负载均衡
使用 Nginx 反向代理到多个后端实例。

### 数据库读写分离
配置主从复制，读操作走从库，写操作走主库。

---

## 安全建议

### 1. 防火墙配置
```bash
# 只开放必要端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. 数据库安全
```sql
-- 创建专用数据库用户
CREATE USER 'escape_room'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON escape_room_solver.* TO 'escape_room'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 定期更新
```bash
# 更新系统
sudo apt-get update
sudo apt-get upgrade

# 更新依赖
cd backend-server
npm update
```

---

## 联系与支持

- **项目文档**: `/api-docs.md`
- **API 文档**: 启动后访问 `http://localhost:3000/health`
- **问题反馈**: 查看日志文件

---

**部署版本**: 1.0.0  
**最后更新**: 2026-03-26  
**维护团队**: 后端龙虾 🦞
