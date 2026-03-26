# GitHub Actions 环境配置说明

## 环境列表

### Staging (测试环境)
- **名称**: staging
- **分支**: develop
- **用途**: 功能测试、集成测试
- **访问**: https://staging.yourdomain.com

### Production (生产环境)
- **名称**: production  
- **分支**: main
- **用途**: 线上服务
- **访问**: https://yourdomain.com

---

## 必需配置 Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置：

### 阿里云镜像仓库
```
ALIYUN_USERNAME=your-aliyun-username
ALIYUN_PASSWORD=your-aliyun-password
```

### Staging 环境
```
STAGING_HOST=staging-server-ip
STAGING_USERNAME=deploy
STAGING_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
STAGING_URL=https://staging.yourdomain.com
```

### Production 环境
```
PRODUCTION_HOST=production-server-ip
PRODUCTION_USERNAME=deploy
PRODUCTION_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
PRODUCTION_URL=https://api.yourdomain.com
SLACK_WEBHOOK=https://hooks.slack.com/services/xxx
```

### 应用配置
```
SENTRY_DSN=https://xxx@sentry.io/xxx
JWT_SECRET=your-jwt-secret
DB_PASSWORD=your-db-password
GRAFANA_PASSWORD=your-grafana-password
```

---

## 环境分支保护

### main 分支保护规则
- [x] Require a pull request before merging
- [x] Require approvals (至少 1 人)
- [x] Require status checks to pass before merging
  - [x] lint
  - [x] test
  - [x] build
- [x] Require branches to be up to date before merging
- [x] Include administrators

### develop 分支保护规则
- [x] Require status checks to pass before merging
  - [x] lint
  - [x] test

---

## 手动触发部署

### 部署到 Staging
```yaml
name: Deploy to Staging

on:
  workflow_dispatch:
    inputs:
      version:
        description: '版本标签'
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: |
          echo "Deploying version ${{ github.event.inputs.version }}"
```

### 部署到 Production
```yaml
name: Deploy to Production

on:
  workflow_dispatch:
    inputs:
      version:
        description: '版本标签'
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: |
          echo "Deploying version ${{ github.event.inputs.version }}"
```

---

## 部署流程

```
开发 → Push → develop 分支
        ↓
    触发 CI
        ↓
   运行测试
        ↓
  自动部署到 Staging
        ↓
   测试验证 ✓
        ↓
  创建 Pull Request
        ↓
  Code Review ✓
        ↓
  合并到 main 分支
        ↓
   触发 CI/CD
        ↓
  自动部署到 Production
        ↓
   健康检查 ✓
        ↓
   发送通知
```

---

## 回滚流程

### 自动回滚（健康检查失败）
```bash
# GitHub Actions 自动执行
git checkout previous-tag
docker-compose pull
docker-compose up -d
```

### 手动回滚
```bash
# 1. 在 GitHub Actions 选择之前的成功部署
# 2. 点击 "Run workflow"
# 3. 选择要回滚的版本
# 4. 确认执行
```

---

## 监控部署状态

### GitHub Actions
访问：https://github.com/your-org/密室做题家/actions

### 部署通知
- Slack: #deployments 频道
- 邮件：ops-team@yourdomain.com

### 健康检查
```bash
# Staging
curl https://staging.yourdomain.com/health

# Production
curl https://api.yourdomain.com/health
```

---

**维护**: 运维团队  
**更新**: 2026-03-26
