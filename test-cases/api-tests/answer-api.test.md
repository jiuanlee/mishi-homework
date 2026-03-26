# API 接口测试用例 - 答题模块

## 说明

答题模块 API 目前处于规划阶段，以下测试用例基于技术架构文档设计。

---

## API-201: POST /api/answer/submit - 提交答案

| 项目 | 内容 |
|------|------|
| **用例编号** | API-201 |
| **接口路径** | POST /api/answer/submit |
| **优先级** | P0 |
| **认证要求** | 需要学生权限 |
| **测试目标** | 验证学生能提交答案 |
| **请求头** | `Authorization: Bearer <student_token>`, `Content-Type: application/json` |
| **请求体** | `{"assignmentId": "<uuid>", "questionId": "q001", "answer": "A", "timeSpent": 45}` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "isCorrect": true, "explanation": "解析内容", "score": 10, "progress": {"completed": 5, "total": 10}}` |
| **执行状态** | TODO (待实现) |

---

## API-202: POST /api/answer/submit - 批量提交

| 项目 | 内容 |
|------|------|
| **用例编号** | API-202 |
| **接口路径** | POST /api/answer/submit-batch |
| **优先级** | P1 |
| **认证要求** | 需要学生权限 |
| **测试目标** | 验证学生能批量提交答案 |
| **请求头** | `Authorization: Bearer <student_token>`, `Content-Type: application/json` |
| **请求体** | `{"assignmentId": "<uuid>", "answers": [{"questionId": "q001", "answer": "A", "timeSpent": 45}, {"questionId": "q002", "answer": "B", "timeSpent": 60}]}` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "results": [...], "totalScore": 90, "completedCount": 10}` |
| **执行状态** | TODO (待实现) |

---

## API-203: GET /api/answer/progress - 获取答题进度

| 项目 | 内容 |
|------|------|
| **用例编号** | API-203 |
| **接口路径** | GET /api/answer/progress/:assignmentId |
| **优先级** | P0 |
| **认证要求** | 需要学生权限 |
| **测试目标** | 验证学生能查看自己的答题进度 |
| **请求头** | `Authorization: Bearer <student_token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "progress": {"completed": 5, "total": 10, "correctCount": 4, "score": 80, "timeSpent": 600}}` |
| **执行状态** | TODO (待实现) |

---

## API-204: GET /api/answer/history - 获取答题历史

| 项目 | 内容 |
|------|------|
| **用例编号** | API-204 |
| **接口路径** | GET /api/answer/history |
| **优先级** | P1 |
| **认证要求** | 需要学生权限 |
| **测试目标** | 验证学生能查看答题历史 |
| **请求头** | `Authorization: Bearer <student_token>` |
| **查询参数** | `?assignmentId=xxx&limit=20` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "history": [{"assignmentId", "score", "completedAt", "duration"}, ...]}` |
| **执行状态** | TODO (待实现) |

---

## API-205: POST /api/answer/resume - 续做中断的作业

| 项目 | 内容 |
|------|------|
| **用例编号** | API-205 |
| **接口路径** | POST /api/answer/resume |
| **优先级** | P0 |
| **认证要求** | 需要学生权限 |
| **测试目标** | 验证学生能续做中断的作业 |
| **请求头** | `Authorization: Bearer <student_token>`, `Content-Type: application/json` |
| **请求体** | `{"assignmentId": "<uuid>"}` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "resumed": true, "progress": {"completed": 3, "total": 10}, "remainingTime": 1200}` |
| **执行状态** | TODO (待实现) |

---

## API-206: GET /api/answer/:assignmentId/questions - 获取题目列表

| 项目 | 内容 |
|------|------|
| **用例编号** | API-206 |
| **接口路径** | GET /api/answer/:assignmentId/questions |
| **优先级** | P0 |
| **认证要求** | 需要学生权限 |
| **测试目标** | 验证学生能获取作业题目 |
| **请求头** | `Authorization: Bearer <student_token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "questions": [{"id", "type", "content", "options", ...}], "timeLimit": 1800}` |
| **执行状态** | TODO (待实现) |

---

## 边界条件测试

| 用例编号 | 测试场景 | 预期结果 |
|----------|----------|----------|
| API-207 | 提交答案时作业已过期 | 400 错误，作业已截止 |
| API-208 | 提交答案时剩余时间为 0 | 400 错误，时间已用完 |
| API-209 | 提交空答案 | 400 错误，答案不能为空 |
| API-210 | 提交不存在的题目 ID | 404 错误 |
| API-211 | 重复提交同一题 | 200 成功，覆盖原答案 |
| API-212 | 续做已完成的作业 | 400 错误，作业已完成 |
| API-213 | 续做不存在的作业 | 404 错误 |
| API-214 | 访问他人的作业答案 | 403 错误 |

---

## 超时场景测试

| 用例编号 | 测试场景 | 预期结果 |
|----------|----------|----------|
| API-215 | 答题过程中超时 | 自动提交已答题目，标记未完成 |
| API-216 | 超时后继续提交答案 | 400 错误，作业已超时 |
| API-217 | 网络延迟导致提交超时 | 服务端应支持幂等提交 |

---

## 性能测试指标

| 接口 | 平均响应时间 | P95 响应时间 | 并发支持 |
|------|--------------|--------------|----------|
| POST /api/answer/submit | ≤100ms | ≤300ms | ≥500 |
| POST /api/answer/submit-batch | ≤300ms | ≤800ms | ≥200 |
| GET /api/answer/progress | ≤50ms | ≤150ms | ≥1000 |

---

## 游戏化特性测试

| 用例编号 | 测试场景 | 预期结果 |
|----------|----------|----------|
| API-218 | 答对题目获得积分 | 返回积分增加 |
| API-219 | 连续答对获得连击奖励 | 返回 bonus score |
| API-220 | 完成作业解锁新场景 | 返回解锁信息 |
| API-221 | 获得成就徽章 | 返回成就列表 |
