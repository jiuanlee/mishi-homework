# 测试用例目录 - 密室做题家

## 目录结构

```
test-cases/
├── README.md                    # 本文件
├── unit-tests/                  # 单元测试用例
│   ├── auth.test.md            # 认证模块测试
│   ├── database.test.md        # 数据库操作测试
│   └── utils.test.md           # 工具函数测试
├── api-tests/                   # 接口测试用例
│   ├── auth-api.test.md        # 认证 API 测试
│   ├── assignment-api.test.md  # 作业 API 测试
│   ├── answer-api.test.md      # 答题 API 测试
│   └── stats-api.test.md       # 统计 API 测试
├── ui-tests/                    # UI 测试用例
│   ├── teacher-web.test.md     # 老师端 Web 测试
│   └── student-mini.test.md    # 学生端小程序测试
├── e2e-tests/                   # 端到端测试用例
│   ├── teacher-workflow.test.md # 老师生成作业流程
│   ├── student-workflow.test.md # 学生做题流程
│   └── interrupt-resume.test.md # 中断续做场景
└── boundary-tests/              # 边界条件测试
    ├── timeout.test.md         # 超时测试
    └── error-handling.test.md  # 错误处理测试
```

## 测试用例编号规则

- `UT-XXX`: 单元测试 (Unit Test)
- `API-XXX`: 接口测试 (API Test)
- `UI-XXX`: UI 测试 (User Interface Test)
- `E2E-XXX`: 端到端测试 (End-to-End Test)
- `BT-XXX`: 边界测试 (Boundary Test)

## 优先级定义

| 优先级 | 说明 | 执行频率 |
|--------|------|----------|
| P0 | 核心功能，必须通过 | 每次提交 |
| P1 | 重要功能，应该通过 | 每日构建 |
| P2 | 次要功能，建议通过 | 每周构建 |
| P3 | 边缘场景，可选通过 | 发布前 |

## 测试状态

| 状态 | 说明 |
|------|------|
| TODO | 未执行 |
| PASS | 通过 |
| FAIL | 失败 |
| BLOCK | 阻塞 |
| SKIP | 跳过 |
