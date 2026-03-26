# API 接口测试用例 - 作业模块

## 说明

作业模块 API 目前处于规划阶段，以下测试用例基于技术架构文档设计。

---

## API-101: POST /api/assignment/create - 创建作业

| 项目 | 内容 |
|------|------|
| **用例编号** | API-101 |
| **接口路径** | POST /api/assignment/create |
| **优先级** | P0 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证老师能成功创建作业 |
| **请求头** | `Authorization: Bearer <teacher_token>`, `Content-Type: application/json` |
| **请求体** | `{"title": "数学练习 1", "subject": "math", "grade": 3, "knowledgePoints": ["kp001", "kp002"], "questionTypes": ["choice", "fill"], "difficulty": "medium", "questionCount": 10, "timeLimit": 1800}` |
| **预期状态码** | 201 |
| **预期响应** | `{"success": true, "assignmentId": "<uuid>", "message": "作业创建成功"}` |
| **执行状态** | TODO (待实现) |

---

## API-102: POST /api/assignment/publish - 发布作业

| 项目 | 内容 |
|------|------|
| **用例编号** | API-102 |
| **接口路径** | POST /api/assignment/publish |
| **优先级** | P0 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证老师能发布作业给班级 |
| **请求头** | `Authorization: Bearer <teacher_token>`, `Content-Type: application/json` |
| **请求体** | `{"assignmentId": "<uuid>", "classId": "<uuid>", "dueDate": "2026-03-30T23:59:59Z"}` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "message": "作业发布成功"}` |
| **执行状态** | TODO (待实现) |

---

## API-103: GET /api/assignment/list - 获取作业列表

| 项目 | 内容 |
|------|------|
| **用例编号** | API-103 |
| **接口路径** | GET /api/assignment/list |
| **优先级** | P0 |
| **认证要求** | 需要认证 |
| **测试目标** | 验证获取作业列表 |
| **请求头** | `Authorization: Bearer <token>` |
| **查询参数** | `?role=teacher&page=1&pageSize=20` 或 `?role=student&classId=xxx` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "assignments": [...], "total": <number>, "page": 1, "pageSize": 20}` |
| **执行状态** | TODO (待实现) |

---

## API-104: GET /api/assignment/:id - 获取作业详情

| 项目 | 内容 |
|------|------|
| **用例编号** | API-104 |
| **接口路径** | GET /api/assignment/:id |
| **优先级** | P0 |
| **认证要求** | 需要认证 |
| **测试目标** | 验证获取单个作业详情 |
| **请求头** | `Authorization: Bearer <token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "assignment": {"id", "title", "subject", "questions", "timeLimit", ...}}` |
| **执行状态** | TODO (待实现) |

---

## API-105: PUT /api/assignment/:id - 更新作业

| 项目 | 内容 |
|------|------|
| **用例编号** | API-105 |
| **接口路径** | PUT /api/assignment/:id |
| **优先级** | P1 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证老师能更新未发布的作业 |
| **请求头** | `Authorization: Bearer <teacher_token>`, `Content-Type: application/json` |
| **请求体** | `{"title": "数学练习 1 (更新)", "difficulty": "hard"}` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "message": "作业更新成功"}` |
| **执行状态** | TODO (待实现) |

---

## API-106: DELETE /api/assignment/:id - 删除作业

| 项目 | 内容 |
|------|------|
| **用例编号** | API-106 |
| **接口路径** | DELETE /api/assignment/:id |
| **优先级** | P1 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证老师能删除自己的作业 |
| **请求头** | `Authorization: Bearer <teacher_token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "message": "作业删除成功"}` |
| **执行状态** | TODO (待实现) |

---

## API-107: POST /api/assignment/:id/clone - 克隆作业

| 项目 | 内容 |
|------|------|
| **用例编号** | API-107 |
| **接口路径** | POST /api/assignment/:id/clone |
| **优先级** | P2 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证老师能克隆已有作业 |
| **请求头** | `Authorization: Bearer <teacher_token>` |
| **预期状态码** | 201 |
| **预期响应** | `{"success": true, "newAssignmentId": "<uuid>"}` |
| **执行状态** | TODO (待实现) |

---

## 边界条件测试

| 用例编号 | 测试场景 | 预期结果 |
|----------|----------|----------|
| API-108 | 创建作业时 questionCount=0 | 400 错误，至少 1 题 |
| API-109 | 创建作业时 questionCount>100 | 400 错误，最多 100 题 |
| API-110 | 创建作业时 timeLimit<60 | 400 错误，最少 60 秒 |
| API-111 | 创建作业时 timeLimit>7200 | 400 错误，最多 2 小时 |
| API-112 | 发布已过截止日期的作业 | 400 错误，截止日期必须未来 |
| API-113 | 获取不存在的作业 | 404 错误 |
| API-114 | 无权限访问他人作业 | 403 错误 |

---

## 性能测试指标

| 接口 | 平均响应时间 | P95 响应时间 | 并发支持 |
|------|--------------|--------------|----------|
| POST /api/assignment/create | ≤500ms | ≤1000ms | ≥50 |
| GET /api/assignment/list | ≤200ms | ≤500ms | ≥100 |
| GET /api/assignment/:id | ≤100ms | ≤300ms | ≥200 |
