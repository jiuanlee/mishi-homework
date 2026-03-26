# API 接口测试用例 - 认证模块

## API-001: POST /api/auth/register - 成功注册

| 项目 | 内容 |
|------|------|
| **用例编号** | API-001 |
| **接口路径** | POST /api/auth/register |
| **优先级** | P0 |
| **测试目标** | 验证用户注册接口正常工作 |
| **请求头** | `Content-Type: application/json` |
| **请求体** | `{"username": "testuser001", "password": "123456", "email": "test001@example.com", "role": "student"}` |
| **预期状态码** | 201 |
| **预期响应** | `{"success": true, "message": "注册成功", "userId": <number>}` |
| **执行状态** | TODO |

---

## API-002: POST /api/auth/register - 用户名重复

| 项目 | 内容 |
|------|------|
| **用例编号** | API-002 |
| **接口路径** | POST /api/auth/register |
| **优先级** | P0 |
| **测试目标** | 验证重复用户名被拒绝 |
| **请求头** | `Content-Type: application/json` |
| **请求体** | `{"username": "existinguser", "password": "123456", "email": "test002@example.com"}` |
| **预期状态码** | 400 |
| **预期响应** | `{"success": false, "message": "用户名已存在"}` |
| **执行状态** | TODO |

---

## API-003: POST /api/auth/register - 参数验证失败

| 项目 | 内容 |
|------|------|
| **用例编号** | API-003 |
| **接口路径** | POST /api/auth/register |
| **优先级** | P1 |
| **测试目标** | 验证请求参数验证逻辑 |
| **测试场景** | - 用户名过短 (<3 字符)<br>- 用户名过长 (>20 字符)<br>- 密码过短 (<6 字符)<br>- 邮箱格式错误<br>- 角色无效 |
| **请求体示例** | `{"username": "ab", "password": "123456", "email": "test@example.com"}` |
| **预期状态码** | 400 |
| **预期响应** | `{"success": false, "errors": [...]}` |
| **执行状态** | TODO |

---

## API-004: POST /api/auth/login - 成功登录

| 项目 | 内容 |
|------|------|
| **用例编号** | API-004 |
| **接口路径** | POST /api/auth/login |
| **优先级** | P0 |
| **测试目标** | 验证用户登录接口正常工作 |
| **请求头** | `Content-Type: application/json` |
| **请求体** | `{"username": "testuser001", "password": "123456"}` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "message": "登录成功", "token": "<jwt_token>", "user": {...}}` |
| **验证点** | - token 不为空<br>- token 格式为 JWT (三段式)<br>- user 对象包含 id, username, email, role |
| **执行状态** | TODO |

---

## API-005: POST /api/auth/login - 用户不存在

| 项目 | 内容 |
|------|------|
| **用例编号** | API-005 |
| **接口路径** | POST /api/auth/login |
| **优先级** | P0 |
| **测试目标** | 验证不存在的用户被拒绝 |
| **请求头** | `Content-Type: application/json` |
| **请求体** | `{"username": "nonexistentuser", "password": "123456"}` |
| **预期状态码** | 401 |
| **预期响应** | `{"success": false, "message": "用户名或密码错误"}` |
| **执行状态** | TODO |

---

## API-006: POST /api/auth/login - 密码错误

| 项目 | 内容 |
|------|------|
| **用例编号** | API-006 |
| **接口路径** | POST /api/auth/login |
| **优先级** | P0 |
| **测试目标** | 验证错误密码被拒绝 |
| **请求头** | `Content-Type: application/json` |
| **请求体** | `{"username": "testuser001", "password": "wrongpassword"}` |
| **预期状态码** | 401 |
| **预期响应** | `{"success": false, "message": "用户名或密码错误"}` |
| **执行状态** | TODO |

---

## API-007: POST /api/auth/login - 参数缺失

| 项目 | 内容 |
|------|------|
| **用例编号** | API-007 |
| **接口路径** | POST /api/auth/login |
| **优先级** | P1 |
| **测试目标** | 验证必填参数验证 |
| **测试场景** | - 缺少 username<br>- 缺少 password<br>- 两者都缺失 |
| **请求体示例** | `{"password": "123456"}` |
| **预期状态码** | 400 |
| **预期响应** | `{"success": false, "errors": [...]}` |
| **执行状态** | TODO |

---

## API-008: GET /api/auth/me - 获取当前用户

| 项目 | 内容 |
|------|------|
| **用例编号** | API-008 |
| **接口路径** | GET /api/auth/me |
| **优先级** | P0 |
| **测试目标** | 验证获取当前用户信息接口 |
| **请求头** | `Authorization: Bearer <valid_token>` |
| **预期状态码** | 200 |
| **预期响应** | `{"success": true, "user": {"id", "username", "email", "role", "created_at"}}` |
| **执行状态** | TODO |

---

## API-009: GET /api/auth/me - 未认证

| 项目 | 内容 |
|------|------|
| **用例编号** | API-009 |
| **接口路径** | GET /api/auth/me |
| **优先级** | P0 |
| **测试目标** | 验证未携带 token 被拒绝 |
| **请求头** | 无 Authorization 头 |
| **预期状态码** | 401 |
| **预期响应** | `{"success": false, "message": "未提供认证令牌"}` |
| **执行状态** | TODO |

---

## API-010: GET /api/auth/me - Token 过期

| 项目 | 内容 |
|------|------|
| **用例编号** | API-010 |
| **接口路径** | GET /api/auth/me |
| **优先级** | P1 |
| **测试目标** | 验证过期 token 被拒绝 |
| **请求头** | `Authorization: Bearer <expired_token>` |
| **预期状态码** | 403 |
| **预期响应** | `{"success": false, "message": "令牌无效或已过期"}` |
| **执行状态** | TODO |

---

## API-011: GET /health - 健康检查

| 项目 | 内容 |
|------|------|
| **用例编号** | API-011 |
| **接口路径** | GET /health |
| **优先级** | P0 |
| **测试目标** | 验证健康检查接口 |
| **请求头** | 无 |
| **预期状态码** | 200 |
| **预期响应** | `{"status": "ok", "timestamp": "<ISO8601>"}` |
| **执行状态** | TODO |

---

## 性能测试指标

| 接口 | 平均响应时间 | P95 响应时间 | 吞吐量 (req/s) |
|------|--------------|--------------|----------------|
| POST /api/auth/register | ≤200ms | ≤500ms | ≥100 |
| POST /api/auth/login | ≤100ms | ≤300ms | ≥200 |
| GET /api/auth/me | ≤50ms | ≤150ms | ≥500 |
| GET /health | ≤20ms | ≤50ms | ≥1000 |

---

## 安全测试要点

- [ ] SQL 注入防护 (所有用户输入参数化查询)
- [ ] XSS 防护 (响应头设置)
- [ ] 暴力破解防护 (登录失败次数限制)
- [ ] Token 安全 (HTTPS 传输，HttpOnly cookie)
- [ ] 密码安全 (bcrypt 加密，salt rounds ≥10)
