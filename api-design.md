# API 接口设计 - 寓教于乐·密室做题家

## 1. API 概述

- **协议**：HTTPS
- **风格**：RESTful
- **数据格式**：JSON
- **认证方式**：JWT Bearer Token
- **API 版本**：v1
- **基础路径**：`/api/v1`

---

## 2. 认证与授权

### 2.1 认证流程

```
用户登录 → 获取 Token → 请求头携带 Token → 访问受保护资源
```

### 2.2 Token 格式

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

### 2.3 请求头示例

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 3. 接口列表

### 3.1 用户认证模块

#### POST /auth/register
用户注册。

**请求体**：
```json
{
  "role": "teacher",
  "name": "张老师",
  "phone": "13800138000",
  "password": "securePassword123",
  "email": "zhang@example.com",
  "school_name": "实验小学",
  "grade_level": 3
}
```

**响应** (201 Created)：
```json
{
  "id": "uuid",
  "role": "teacher",
  "name": "张老师",
  "phone": "13800138000",
  "email": "zhang@example.com",
  "created_at": "2026-03-26T10:00:00Z"
}
```

---

#### POST /auth/login
用户登录。

**请求体**：
```json
{
  "phone": "13800138000",
  "password": "securePassword123"
}
```

**响应** (200 OK)：
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": "uuid",
    "role": "teacher",
    "name": "张老师",
    "avatar_url": "https://..."
  }
}
```

---

#### POST /auth/refresh
刷新 Token。

**请求体**：
```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**响应** (200 OK)：
```json
{
  "access_token": "new_access_token...",
  "token_type": "Bearer",
  "expires_in": 7200
}
```

---

#### GET /auth/profile
获取当前用户信息。

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "role": "teacher",
  "name": "张老师",
  "email": "zhang@example.com",
  "phone": "13800138000",
  "avatar_url": "https://...",
  "school_name": "实验小学",
  "grade_level": 3,
  "created_at": "2026-03-26T10:00:00Z"
}
```

---

#### PUT /auth/profile
更新用户信息。

**请求体**：
```json
{
  "name": "张老湿",
  "avatar_url": "https://new-avatar.com/..."
}
```

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "name": "张老湿",
  "avatar_url": "https://new-avatar.com/...",
  "updated_at": "2026-03-26T12:00:00Z"
}
```

---

### 3.2 知识点模块

#### GET /knowledge-points
获取知识点列表（树状结构）。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| subject | string | 否 | 学科过滤 |
| grade_level | number | 否 | 年级过滤 |
| parent_id | string | 否 | 父节点 ID（获取子节点） |

**响应** (200 OK)：
```json
{
  "data": [
    {
      "id": "uuid",
      "subject": "math",
      "name": "三年级数学",
      "grade_level": 3,
      "children": [
        {
          "id": "uuid",
          "name": "乘法运算",
          "difficulty": 2,
          "children": []
        }
      ]
    }
  ]
}
```

---

#### GET /knowledge-points/:id
获取知识点详情。

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "subject": "math",
  "name": "乘法运算",
  "parent_id": "uuid",
  "grade_level": 3,
  "difficulty": 2,
  "description": "学习乘法的基本概念和运算方法",
  "tags": ["计算", "基础"],
  "question_count": 150
}
```

---

### 3.3 题目模块

#### GET /questions
获取题目列表（分页）。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| knowledge_id | string | 否 | 知识点 ID |
| type | string | 否 | 题型 |
| difficulty | number | 否 | 难度 |
| page | number | 否 | 页码（默认 1） |
| page_size | number | 否 | 每页数量（默认 20） |

**响应** (200 OK)：
```json
{
  "data": [
    {
      "id": "uuid",
      "knowledge_id": "uuid",
      "type": "single_choice",
      "content": "3 × 4 = ?",
      "options": ["A. 7", "B. 12", "C. 10", "D. 15"],
      "difficulty": 1,
      "correct_rate": 85.5,
      "created_at": "2026-03-26T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

#### GET /questions/:id
获取题目详情。

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "knowledge_id": "uuid",
  "type": "single_choice",
  "content": "3 × 4 = ?",
  "options": [
    {"key": "A", "value": "7"},
    {"key": "B", "value": "12"},
    {"key": "C", "value": "10"},
    {"key": "D", "value": "15"}
  ],
  "answer": "B",
  "explanation": "3 乘以 4 等于 12",
  "difficulty": 1,
  "estimated_time": 30,
  "media_urls": [],
  "tags": ["计算", "乘法"]
}
```

---

#### POST /questions
创建题目（老师）。

**请求体**：
```json
{
  "knowledge_id": "uuid",
  "type": "single_choice",
  "content": "5 × 6 = ?",
  "options": [
    {"key": "A", "value": "25"},
    {"key": "B", "value": "30"},
    {"key": "C", "value": "35"}
  ],
  "answer": "B",
  "explanation": "5 乘以 6 等于 30",
  "difficulty": 1,
  "estimated_time": 30,
  "tags": ["计算", "乘法"]
}
```

**响应** (201 Created)：
```json
{
  "id": "uuid",
  "knowledge_id": "uuid",
  "type": "single_choice",
  "content": "5 × 6 = ?",
  "status": "published",
  "created_at": "2026-03-26T10:00:00Z"
}
```

---

#### PUT /questions/:id
更新题目。

**请求体**：
```json
{
  "content": "updated content",
  "difficulty": 2
}
```

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "content": "updated content",
  "difficulty": 2,
  "updated_at": "2026-03-26T12:00:00Z"
}
```

---

#### DELETE /questions/:id
删除题目（软删除，改为 archived 状态）。

**响应** (204 No Content)

---

### 3.4 作业模块

#### POST /assignments
创建作业。

**请求体**：
```json
{
  "title": "乘法练习作业",
  "description": "本周乘法运算练习",
  "knowledge_ids": ["uuid1", "uuid2"],
  "grade_level": 3,
  "due_date": "2026-04-01T23:59:59Z",
  "total_score": 100,
  "passing_score": 60,
  "scene_config": {
    "theme": "ancient_tomb",
    "difficulty": "normal",
    "time_limit": 1800
  },
  "story_line": {
    "intro": "你是一名探险家，进入古墓寻找宝藏...",
    "branches": []
  },
  "question_selection": {
    "mode": "manual",
    "question_ids": ["uuid1", "uuid2", "uuid3"]
  }
}
```

**响应** (201 Created)：
```json
{
  "id": "uuid",
  "title": "乘法练习作业",
  "status": "draft",
  "teacher_id": "uuid",
  "created_at": "2026-03-26T10:00:00Z"
}
```

---

#### GET /assignments
获取作业列表（老师）。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态过滤 |
| grade_level | number | 否 | 年级过滤 |

**响应** (200 OK)：
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "乘法练习作业",
      "description": "本周乘法运算练习",
      "grade_level": 3,
      "due_date": "2026-04-01T23:59:59Z",
      "status": "published",
      "student_count": 35,
      "completed_count": 28,
      "avg_score": 82.5,
      "created_at": "2026-03-26T10:00:00Z"
    }
  ]
}
```

---

#### GET /assignments/:id
获取作业详情。

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "title": "乘法练习作业",
  "description": "本周乘法运算练习",
  "knowledge_ids": ["uuid1", "uuid2"],
  "grade_level": 3,
  "due_date": "2026-04-01T23:59:59Z",
  "total_score": 100,
  "passing_score": 60,
  "scene_config": {
    "theme": "ancient_tomb",
    "difficulty": "normal"
  },
  "items": [
    {
      "id": "uuid",
      "question_id": "uuid",
      "order_index": 1,
      "required_score": 10,
      "question": {
        "content": "3 × 4 = ?",
        "type": "single_choice",
        "options": [...]
      }
    }
  ],
  "status": "published",
  "created_at": "2026-03-26T10:00:00Z"
}
```

---

#### PUT /assignments/:id
更新作业。

**请求体**：
```json
{
  "title": "updated title",
  "due_date": "2026-04-05T23:59:59Z"
}
```

**响应** (200 OK)

---

#### DELETE /assignments/:id
删除作业。

**响应** (204 No Content)

---

#### POST /assignments/:id/publish
发布作业。

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "status": "published",
  "published_at": "2026-03-26T10:00:00Z"
}
```

---

#### POST /assignments/:id/close
关闭作业。

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "status": "closed",
  "closed_at": "2026-04-02T00:00:00Z"
}
```

---

### 3.5 学生作业模块

#### GET /students/assignments
获取学生作业列表。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态过滤（not_started/in_progress/completed） |

**响应** (200 OK)：
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "乘法练习作业",
      "description": "本周乘法运算练习",
      "due_date": "2026-04-01T23:59:59Z",
      "total_score": 100,
      "progress": {
        "status": "in_progress",
        "completed_items": 5,
        "total_items": 10,
        "score": 45
      },
      "scene_theme": "ancient_tomb"
    }
  ]
}
```

---

#### GET /students/assignments/:id
获取学生作业详情（游戏场景）。

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "title": "乘法练习作业",
  "scene_config": {
    "theme": "ancient_tomb",
    "current_scene": "entrance",
    "story_text": "你站在古墓入口，面前有三条通道..."
  },
  "current_item": {
    "id": "uuid",
    "order_index": 1,
    "question": {
      "id": "uuid",
      "content": "3 × 4 = ?",
      "type": "single_choice",
      "options": [...]
    },
    "unlock_condition": null
  },
  "progress": {
    "status": "in_progress",
    "completed_items": 0,
    "total_items": 10,
    "score": 0
  }
}
```

---

### 3.6 答题模块

#### POST /answers/submit
提交答案。

**请求体**：
```json
{
  "assignment_id": "uuid",
  "item_id": "uuid",
  "answer_content": "B",
  "time_spent": 25
}
```

**响应** (200 OK)：
```json
{
  "id": "uuid",
  "is_correct": true,
  "score_earned": 10,
  "feedback": "回答正确！继续前进探索古墓吧！",
  "next_item": {
    "id": "uuid",
    "order_index": 2,
    "unlock_condition_met": true
  },
  "progress": {
    "completed_items": 1,
    "total_items": 10,
    "score": 10,
    "current_scene": "corridor"
  },
  "reward": {
    "type": "points",
    "name": "首题告捷",
    "value": 10
  }
}
```

---

#### POST /answers/:id/feedback
老师添加反馈（主观题）。

**请求体**：
```json
{
  "feedback": "思路正确，但计算有误，请再检查一下",
  "score_earned": 5
}
```

**响应** (200 OK)

---

### 3.7 进度模块

#### GET /progress/:assignment_id
获取作业进度。

**响应** (200 OK)：
```json
{
  "assignment_id": "uuid",
  "student_id": "uuid",
  "status": "in_progress",
  "current_scene": "corridor",
  "score": 45,
  "total_items": 10,
  "completed_items": 5,
  "correct_count": 4,
  "started_at": "2026-03-26T14:00:00Z",
  "last_activity_at": "2026-03-26T14:30:00Z",
  "items": [
    {
      "item_id": "uuid",
      "order_index": 1,
      "is_correct": true,
      "score_earned": 10,
      "time_spent": 25
    }
  ]
}
```

---

#### POST /progress/:assignment_id/complete
完成作业。

**响应** (200 OK)：
```json
{
  "assignment_id": "uuid",
  "status": "completed",
  "final_score": 85,
  "total_items": 10,
  "correct_count": 8,
  "completed_at": "2026-03-26T15:00:00Z",
  "rewards": [
    {
      "type": "badge",
      "name": "古墓探险家",
      "icon_url": "https://..."
    },
    {
      "type": "points",
      "name": "积分奖励",
      "value": 85
    }
  ]
}
```

---

### 3.8 统计模块

#### GET /teachers/statistics/assignments/:id
获取作业统计数据（老师）。

**响应** (200 OK)：
```json
{
  "assignment_id": "uuid",
  "title": "乘法练习作业",
  "student_count": 35,
  "completed_count": 28,
  "completion_rate": 80.0,
  "avg_score": 82.5,
  "score_distribution": {
    "90-100": 10,
    "80-89": 12,
    "70-79": 4,
    "60-69": 2,
    "0-59": 0
  },
  "question_stats": [
    {
      "question_id": "uuid",
      "order_index": 1,
      "correct_rate": 95.0,
      "avg_time_spent": 22
    }
  ],
  "weak_points": [
    {
      "knowledge_id": "uuid",
      "knowledge_name": "进位乘法",
      "correct_rate": 65.0
    }
  ]
}
```

---

#### GET /students/statistics
获取学生个人统计。

**响应** (200 OK)：
```json
{
  "student_id": "uuid",
  "total_assignments": 15,
  "completed_assignments": 12,
  "avg_score": 85.5,
  "total_questions": 150,
  "correct_count": 128,
  "overall_correct_rate": 85.3,
  "knowledge_stats": [
    {
      "knowledge_id": "uuid",
      "knowledge_name": "乘法运算",
      "question_count": 50,
      "correct_rate": 90.0
    }
  ],
  "recent_rewards": [
    {
      "type": "badge",
      "name": "学习之星",
      "earned_at": "2026-03-25T10:00:00Z"
    }
  ]
}
```

---

### 3.9 奖励模块

#### GET /rewards
获取学生奖励列表。

**响应** (200 OK)：
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "badge",
      "name": "古墓探险家",
      "description": "完成第一个密室作业",
      "icon_url": "https://...",
      "earned_at": "2026-03-26T15:00:00Z"
    },
    {
      "type": "points",
      "name": "积分",
      "value": 500,
      "earned_at": "2026-03-26T15:00:00Z"
    }
  ],
  "total_points": 500,
  "badge_count": 5
}
```

---

#### GET /rewards/ranking
获取积分排行榜。

**查询参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| grade_level | number | 否 | 年级 |
| time_range | string | 否 | 时间范围（week/month/all） |

**响应** (200 OK)：
```json
{
  "data": [
    {
      "rank": 1,
      "student_id": "uuid",
      "student_name": "小明",
      "avatar_url": "https://...",
      "total_points": 1250,
      "badge_count": 12
    },
    {
      "rank": 2,
      "student_id": "uuid",
      "student_name": "小红",
      "avatar_url": "https://...",
      "total_points": 1180,
      "badge_count": 10
    }
  ],
  "my_rank": 5,
  "update_time": "2026-03-26T16:00:00Z"
}
```

---

### 3.10 文件上传模块

#### POST /files/upload
上传文件（图片/音频/视频）。

**请求体**：multipart/form-data
```
file: [binary]
type: image|audio|video
```

**响应** (200 OK)：
```json
{
  "file_id": "uuid",
  "url": "https://oss.example.com/files/xxx.jpg",
  "type": "image",
  "size": 102400,
  "uploaded_at": "2026-03-26T10:00:00Z"
}
```

---

## 4. 错误处理

### 4.1 错误响应格式

```json
{
  "status_code": 400,
  "error_code": "VALIDATION_ERROR",
  "message": "请求参数验证失败",
  "details": [
    {
      "field": "phone",
      "message": "手机号格式不正确"
    }
  ],
  "timestamp": "2026-03-26T10:00:00Z",
  "request_id": "req_xxx"
}
```

### 4.2 常见错误码

| 错误码 | HTTP 状态 | 说明 |
|--------|----------|------|
| VALIDATION_ERROR | 400 | 参数验证失败 |
| UNAUTHORIZED | 401 | 未认证/Token 过期 |
| FORBIDDEN | 403 | 无权限 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突（如重复提交） |
| RATE_LIMITED | 429 | 请求频率超限 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

---

## 5. 限流策略

| 接口类型 | 限流 | 说明 |
|----------|------|------|
| 认证接口 | 10 次/分钟 | 防止暴力破解 |
| 答题提交 | 60 次/分钟 | 防止刷分 |
| 其他接口 | 100 次/分钟 | 常规限流 |

---

## 6. API 版本管理

- 当前版本：v1
- 版本标识：URL 路径 `/api/v1/`
- 废弃策略：新版本发布后，旧版本保留 6 个月

---

*文档版本：v1.0*  
*创建日期：2026-03-26*  
*作者：架构师龙虾*
