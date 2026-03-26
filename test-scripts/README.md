# 自动化测试脚本目录

## 目录结构

```
test-scripts/
├── README.md                      # 本文件
├── unit-tests/                    # 单元测试脚本
│   ├── auth.test.js              # 认证模块测试
│   ├── database.test.js          # 数据库测试
│   └── utils.test.js             # 工具函数测试
├── api-tests/                     # API 接口测试脚本
│   ├── auth-api.test.js          # 认证 API 测试
│   ├── assignment-api.test.js    # 作业 API 测试
│   └── answer-api.test.js        # 答题 API 测试
├── e2e-tests/                     # 端到端测试脚本
│   ├── teacher-workflow.spec.js  # 老师工作流
│   └── student-workflow.spec.js  # 学生工作流
├── performance-tests/             # 性能测试脚本
│   ├── load-test.js              # 负载测试
│   └── stress-test.js            # 压力测试
├── fixtures/                      # 测试数据
│   ├── users.json                # 测试用户
│   └── assignments.json          # 测试作业
├── utils/                         # 测试工具
│   ├── test-helpers.js           # 测试辅助函数
│   └── mock-data.js              # 模拟数据
├── package.json                   # 测试依赖
└── jest.config.js                # Jest 配置
```

## 安装依赖

```bash
cd test-scripts
npm install
```

## 运行测试

### 运行所有测试
```bash
npm test
```

### 运行单元测试
```bash
npm run test:unit
```

### 运行 API 测试
```bash
npm run test:api
```

### 运行端到端测试
```bash
npm run test:e2e
```

### 运行性能测试
```bash
npm run test:perf
```

### 生成覆盖率报告
```bash
npm run test:coverage
```

## 测试配置

### 环境变量

创建 `.env.test` 文件:

```bash
# 测试数据库
TEST_DB_HOST=localhost
TEST_DB_PORT=3306
TEST_DB_USER=test
TEST_DB_PASSWORD=test123
TEST_DB_NAME=escape_room_test

# 测试 Redis
TEST_REDIS_URL=redis://localhost:6379

# JWT 配置
JWT_SECRET=test-secret-key

# API 基础 URL
API_BASE_URL=http://localhost:3000
```

## 测试报告

测试完成后，报告将生成在 `test-results/` 目录:

- `junit.xml` - JUnit 格式报告
- `coverage/` - 覆盖率报告
- `screenshots/` - E2E 测试截图 (失败时)
