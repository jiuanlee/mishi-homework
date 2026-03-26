# 密室做题家 API 文档

## 概述

**版本**: v1.0.0  
**基础 URL**: `http://localhost:3000/api`  
**认证方式**: JWT Token

---

## 认证说明

所有需要认证的接口需要在请求头中携带 JWT Token：

```
Authorization: Bearer <your_jwt_token>
```

---

## 接口列表

### 1. 用户认证 `/api/auth/*`

#### 1.1 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string (3-20 字符)",
  "password": "string (至少 6 字符)",
  "email": "string (邮箱格式)",
  "role": "student|teacher|admin (可选，默认 student)"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "注册成功",
  "userId": 1
}
```

#### 1.2 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student1@example.com",
    "role": "student"
  }
}
```

#### 1.3 获取当前用户信息
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student1@example.com",
    "role": "student",
    "created_at": "2026-03-26T10:00:00.000Z"
  }
}
```

---

### 2. 班级管理 `/api/class/*`

#### 2.1 创建班级
```http
POST /api/class
Authorization: Bearer <token> (需要教师权限)
Content-Type: application/json

{
  "name": "三年级一班",
  "grade": "3",
  "description": "快乐学习的班级"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "班级创建成功",
  "classId": 1
}
```

#### 2.2 获取班级列表
```http
GET /api/class
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "三年级一班",
      "grade": "3",
      "description": "快乐学习的班级",
      "teacher_id": 2,
      "status": "active",
      "created_at": "2026-03-26T10:00:00.000Z"
    }
  ]
}
```

#### 2.3 获取班级详情
```http
GET /api/class/:id
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "三年级一班",
    "grade": "3",
    "students": [
      {
        "id": 4,
        "username": "student1",
        "email": "student1@example.com",
        "joined_at": "2026-03-26T10:00:00.000Z"
      }
    ],
    "assignments": [
      {
        "id": 1,
        "title": "知识大冒险 - 数学 3 年级",
        "subject": "数学",
        "due_date": "2026-04-01T23:59:59.000Z",
        "status": "published"
      }
    ]
  }
}
```

#### 2.4 更新班级
```http
PUT /api/class/:id
Authorization: Bearer <token> (需要教师权限)
Content-Type: application/json

{
  "name": "三年级一班（更新）",
  "status": "active"
}
```

#### 2.5 添加学生到班级
```http
POST /api/class/:id/students
Authorization: Bearer <token> (需要教师权限)
Content-Type: application/json

{
  "studentIds": [4, 5, 6]
}
```

#### 2.6 删除班级
```http
DELETE /api/class/:id
Authorization: Bearer <token> (需要教师权限)
```

---

### 3. 作业生成 `/api/assignment/*`

#### 3.1 一键生成作业 ⭐核心接口
```http
POST /api/assignment/generate
Authorization: Bearer <token> (需要教师权限)
Content-Type: application/json

{
  "classId": 1,
  "subject": "数学",
  "knowledgePoints": ["加法运算", "减法运算"],
  "difficulty": "medium",
  "questionCount": 10,
  "storyTheme": "detective",
  "timeLimit": 30
}
```

**参数说明**:
- `classId`: 班级 ID
- `subject`: 科目（语文/数学/英语/科学）
- `knowledgePoints`: 知识点数组
- `difficulty`: 难度（easy/medium/hard）
- `questionCount`: 题目数量（1-50）
- `storyTheme`: 剧情主题（default/detective/adventure/space）
- `timeLimit`: 时间限制（分钟）

**响应示例**:
```json
{
  "success": true,
  "message": "作业生成成功",
  "data": {
    "assignmentId": 1,
    "title": "名侦探学院 - 数学 3 年级",
    "questionCount": 10,
    "estimatedTime": 20
  }
}
```

#### 3.2 获取作业详情
```http
GET /api/assignment/:id
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "名侦探学院 - 数学 3 年级",
    "subject": "数学",
    "grade": "3",
    "storyTheme": "detective",
    "story": {
      "intro": "作为一个小侦探，你需要解开这些谜题才能找到真相...",
      "success": "真相大白！你真是个出色的侦探！",
      "failure": "线索就在眼前，再仔细想想！"
    },
    "knowledgePoints": ["加法运算", "减法运算"],
    "difficulty": "medium",
    "questions": [
      {
        "id": 1,
        "order": 1,
        "type": "single_choice",
        "content": "5 + 3 = ?",
        "options": ["6", "7", "8", "9"],
        "points": 10,
        "difficulty": 1,
        "knowledgePoint": "加法运算"
      }
    ],
    "totalPoints": 100,
    "estimatedTime": 20,
    "stats": {
      "total": 15,
      "completed": 12
    }
  }
}
```

#### 3.3 编辑作业
```http
PUT /api/assignment/:id
Authorization: Bearer <token> (需要教师权限)
Content-Type: application/json

{
  "title": "新标题",
  "time_limit": 45,
  "status": "published"
}
```

#### 3.4 获取班级作业列表
```http
GET /api/assignment/class/:classId
Authorization: Bearer <token>
```

#### 3.5 删除作业
```http
DELETE /api/assignment/:id
Authorization: Bearer <token> (需要教师权限)
```

---

### 4. 做题提交 `/api/answer/*`

#### 4.1 提交答案 ⭐核心接口
```http
POST /api/answer/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignmentId": 1,
  "answers": [
    {
      "questionId": 1,
      "answer": "8"
    },
    {
      "questionId": 2,
      "answer": "6"
    }
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "答案提交成功",
  "data": {
    "correctCount": 8,
    "totalCount": 10,
    "correctRate": "80.0",
    "earnedPoints": 80,
    "totalPoints": 100,
    "story": {
      "level": "good",
      "message": "不错！你找到了大部分线索！"
    }
  }
}
```

#### 4.2 获取进度 ⭐核心接口
```http
GET /api/answer/progress
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "overall": {
      "total_assignments": 10,
      "average_correct_rate": 75.5,
      "passed_count": 8
    },
    "recent": [
      {
        "id": 1,
        "assignment_id": 5,
        "title": "知识大冒险 - 数学 3 年级",
        "subject": "数学",
        "correct_rate": 80.0,
        "completed_at": "2026-03-26T12:00:00.000Z"
      }
    ],
    "updatedAt": "2026-03-26T13:00:00.000Z"
  }
}
```

#### 4.3 获取作业答案详情
```http
GET /api/answer/assignment/:id/detail
Authorization: Bearer <token>
```

---

### 5. 统计查询 `/api/stats/*`

#### 5.1 获取班级统计
```http
GET /api/stats/class/:id
Authorization: Bearer <token> (需要教师权限)
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "classInfo": {
      "id": 1,
      "name": "三年级一班",
      "grade": "3"
    },
    "assignments": {
      "total_assignments": 10,
      "published_count": 8,
      "avg_questions": 12
    },
    "students": {
      "total_students": 30,
      "avg_correct_rate": 75.5
    },
    "difficultyBreakdown": [
      {
        "difficulty": 1,
        "total_answers": 100,
        "correct_count": 90,
        "correct_rate": 90.0
      }
    ]
  }
}
```

#### 5.2 获取学生个人统计
```http
GET /api/stats/student/:id
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "overall": {
      "total_assignments": 10,
      "avg_correct_rate": 75.5,
      "last_completed_at": "2026-03-26T12:00:00.000Z",
      "excellent_count": 3,
      "good_count": 5,
      "need_improve_count": 2
    },
    "bySubject": [
      {
        "subject": "数学",
        "assignment_count": 5,
        "avg_correct_rate": 80.0
      }
    ],
    "knowledgePoints": [
      {
        "knowledge_point": "加法运算",
        "practice_count": 20,
        "correct_count": 18,
        "mastery_rate": 90.0
      }
    ],
    "trend": [
      {
        "title": "知识大冒险 - 数学 3 年级",
        "subject": "数学",
        "correct_rate": 80.0,
        "completed_at": "2026-03-26T12:00:00.000Z"
      }
    ]
  }
}
```

#### 5.3 获取平台总体统计
```http
GET /api/stats/platform
Authorization: Bearer <token> (需要管理员权限)
```

#### 5.4 获取知识点掌握排行
```http
GET /api/stats/knowledge-points/ranking
Authorization: Bearer <token> (需要教师权限)
```

---

## 错误响应

所有错误返回统一格式：

```json
{
  "success": false,
  "message": "错误描述",
  "errors": [
    {
      "field": "username",
      "message": "用户名长度 3-20 个字符"
    }
  ]
}
```

**常见 HTTP 状态码**:
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 核心逻辑说明

### 知识点匹配算法

系统根据以下条件匹配题目：
1. **年级匹配**: 题目难度不超过学生年级
2. **知识点匹配**: 优先匹配指定知识点
3. **难度控制**: 在目标难度±1 范围内选择
4. **随机抽样**: 从匹配题目中随机抽取指定数量

### 作业生成逻辑

1. 教师指定科目、知识点、难度、题量
2. 系统从题库匹配符合条件的题目
3. 应用剧情模板生成沉浸式场景
4. 计算预估完成时间（每题 2 分钟）
5. 生成作业并缓存

### 题目难度匹配

- **easy (1)**: 基础概念，直接应用
- **medium (2)**: 综合运用，需要思考
- **hard (3)**: 拓展延伸，挑战思维

### 剧情模板引擎

支持 4 种主题：
- **default**: 知识大冒险（通用）
- **detective**: 名侦探学院（推理）
- **adventure**: 奇幻冒险岛（探险）
- **space**: 太空探索（科幻）

每个主题包含：
- 开场介绍（intro）
- 成功台词（success）
- 失败鼓励（failure）

---

## 快速开始

### 1. 安装依赖
```bash
cd backend-server
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件配置数据库和 Redis
```

### 3. 初始化数据库
```bash
mysql -u root -p < database/init-data.sql
```

### 4. 启动服务
```bash
npm start
```

### 5. 测试接口
```bash
# 登录获取 token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"student123"}'

# 使用 token 访问接口
curl -X GET http://localhost:3000/api/class \
  -H "Authorization: Bearer <your_token>"
```

---

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express.js 4.x
- **数据库**: MySQL 8.0 / PostgreSQL 14+
- **缓存**: Redis 6+
- **认证**: JWT (jsonwebtoken)
- **加密**: bcryptjs
- **验证**: express-validator

---

**文档版本**: 1.0.0  
**最后更新**: 2026-03-26
