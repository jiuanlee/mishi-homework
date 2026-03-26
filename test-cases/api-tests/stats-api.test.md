# API 接口测试用例 - 统计模块

## 说明

统计模块 API 目前处于规划阶段，以下测试用例基于技术架构文档设计。

---

## API-301: GET /api/stats/student/:id - 获取学生统计

| 项目 | 内容 |
|------|------|
| **用例编号** | API-301 |
| **接口路径** | GET /api/stats/student/:id |
| **优先级** | P0 |
| **认证要求** | 需要教师或家长权限 |
| **测试目标** | 验证获取学生学习统计数据 |
| **请求头** | `Authorization: Bearer <teacher_token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "stats": {"totalAssignments": 10, "completedCount": 8, "averageScore": 85.5, "totalTimeSpent": 7200, "accuracyRate": 0.88}}` |
| **执行状态** | TODO (待实现) |

---

## API-302: GET /api/stats/class/:id - 获取班级统计

| 项目 | 内容 |
|------|------|
| **用例编号** | API-302 |
| **接口路径** | GET /api/stats/class/:id |
| **优先级** | P0 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证获取班级整体统计数据 |
| **请求头** | `Authorization: Bearer <teacher_token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "stats": {"studentCount": 40, "completionRate": 0.85, "averageScore": 82.3, "scoreDistribution": {...}}}` |
| **执行状态** | TODO (待实现) |

---

## API-303: GET /api/stats/assignment/:id - 获取作业统计

| 项目 | 内容 |
|------|------|
| **用例编号** | API-303 |
| **接口路径** | GET /api/stats/assignment/:id |
| **优先级** | P0 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证获取单个作业的统计信息 |
| **请求头** | `Authorization: Bearer <teacher_token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "stats": {"submittedCount": 35, "averageScore": 78.5, "questionStats": [{"questionId", "correctRate", "avgTimeSpent"}, ...]}}` |
| **执行状态** | TODO (待实现) |

---

## API-304: GET /api/stats/knowledge-point/:id - 获取知识点统计

| 项目 | 内容 |
|------|------|
| **用例编号** | API-304 |
| **接口路径** | GET /api/stats/knowledge-point/:id |
| **优先级** | P1 |
| **认证要求** | 需要教师或家长权限 |
| **测试目标** | 验证获取知识点掌握情况 |
| **请求头** | `Authorization: Bearer <token>` |
| **查询参数** | `?studentId=xxx` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "stats": {"knowledgePoint": {"id", "name"}, "masteryLevel": 0.75, "relatedQuestions": 20, "correctCount": 15}}` |
| **执行状态** | TODO (待实现) |

---

## API-305: GET /api/stats/weak-points - 获取薄弱点分析

| 项目 | 内容 |
|------|------|
| **用例编号** | API-305 |
| **接口路径** | GET /api/stats/weak-points |
| **优先级** | P1 |
| **认证要求** | 需要教师或家长权限 |
| **测试目标** | 验证获取学生薄弱知识点分析 |
| **请求头** | `Authorization: Bearer <token>` |
| **查询参数** | `?studentId=xxx&limit=10` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "weakPoints": [{"knowledgePointId", "name", "correctRate", "recommendation"}, ...]}` |
| **执行状态** | TODO (待实现) |

---

## API-306: GET /api/stats/ranking - 获取排行榜

| 项目 | 内容 |
|------|------|
| **用例编号** | API-306 |
| **接口路径** | GET /api/stats/ranking |
| **优先级** | P2 |
| **认证要求** | 需要学生权限 |
| **测试目标** | 验证获取班级/年级排行榜 |
| **请求头** | `Authorization: Bearer <student_token>` |
| **查询参数** | `?scope=class|grade&metric=score|progress&limit=20` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "ranking": [{"rank", "studentId", "studentName", "score", "avatar"}, ...], "myRank": 15}` |
| **执行状态** | TODO (待实现) |

---

## API-307: GET /api/stats/trend - 获取学习趋势

| 项目 | 内容 |
|------|------|
| **用例编号** | API-307 |
| **接口路径** | GET /api/stats/trend |
| **优先级** | P1 |
| **认证要求** | 需要教师或家长权限 |
| **测试目标** | 验证获取学生学习趋势数据 |
| **请求头** | `Authorization: Bearer <token>` |
| **查询参数** | `?studentId=xxx&days=30` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "trend": [{"date", "score", "completedCount", "timeSpent"}, ...]}` |
| **执行状态** | TODO (待实现) |

---

## API-308: POST /api/stats/export - 导出统计报告

| 项目 | 内容 |
|------|------|
| **用例编号** | API-308 |
| **接口路径** | POST /api/stats/export |
| **优先级** | P2 |
| **认证要求** | 需要教师权限 |
| **测试目标** | 验证导出统计报告功能 |
| **请求头** | `Authorization: Bearer <teacher_token>`, `Content-Type: application/json` |
| **请求体** | `{"type": "class|student|assignment", "id": "xxx", "format": "pdf|excel"}` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "downloadUrl": "https://...", "expiresAt": "..."}` |
| **执行状态** | TODO (待实现) |

---

## 边界条件测试

| 用例编号 | 测试场景 | 预期结果 |
|----------|----------|----------|
| API-309 | 查询不存在的班级统计 | 404 错误 |
| API-310 | 查询不存在的作业统计 | 404 错误 |
| API-311 | 无权限访问他人统计 | 403 错误 |
| API-312 | 查询空数据班级 | 返回空统计，不报错 |
| API-313 | 排行榜 limit>100 | 400 错误，最多 100 条 |
| API-314 | 趋势查询 days>365 | 400 错误，最多 1 年 |

---

## 性能测试指标

| 接口 | 平均响应时间 | P95 响应时间 | 并发支持 |
|------|--------------|--------------|----------|
| GET /api/stats/student/:id | ≤100ms | ≤300ms | ≥200 |
| GET /api/stats/class/:id | ≤200ms | ≤500ms | ≥100 |
| GET /api/stats/ranking | ≤150ms | ≤400ms | ≥150 |

---

## 数据准确性测试

| 用例编号 | 测试场景 | 验证方法 |
|----------|----------|----------|
| API-315 | 平均分计算 | 手动计算对比 API 返回 |
| API-316 | 完成率计算 | 手动计算对比 API 返回 |
| API-317 | 排行榜排序 | 验证按指定指标正确排序 |
| API-318 | 趋势数据连续性 | 验证日期连续无缺失 |
