# 密室做题家 - 功能清单

## 📊 项目状态

**更新时间**: 2026-03-27 15:16

| 组件 | 状态 | 端口/位置 |
|------|------|----------|
| **后端服务** | ✅ 运行中 | http://localhost:3000 |
| **前端服务** | ✅ 运行中 | http://localhost:5173 |
| **SQLite 数据库** | ✅ 正常 | backend-server/data/ragflow.db (36KB) |
| **AI 集成** | ✅ 已配置 | 阿里云百炼 (qwen3.5-plus) |

---

## 🎯 已完成的功能

### 1. 用户系统 ✅

| API | 方法 | 端点 | 说明 |
|------|------|------|------|
| 用户注册 | POST | `/api/auth/register` | 创建新用户 |
| 老师注册 | POST | `/api/auth/teacher-register` | 创建老师账号 |
| 用户登录 | POST | `/api/auth/login` | 用户登录 |
| 获取当前用户 | GET | `/api/auth/me` | 获取当前用户信息 |

**默认账号**：
- 管理员：`admin / admin123`
- 老师：`test_teacher / password123`
- 学生：`test_student / student123`

---

### 2. 班级管理 ✅

| API | 方法 | 端点 | 说明 |
|------|------|------|------|
| 创建班级 | POST | `/api/class` | 创建新班级 |
| 班级列表 | GET | `/api/class` | 获取班级列表 |
| 班级详情 | GET | `/api/class/:id` | 获取班级详情 |
| 更新班级 | PUT | `/api/class/:id` | 更新班级信息 |
| 删除班级 | DELETE | `/api/class/:id` | 删除班级 |
| 添加学生 | POST | `/api/class/:id/students` | 批量添加学生 |

---

### 3. 作业管理 ✅

| API | 方法 | 端点 | 说明 |
|------|------|------|------|
| 创建作业 | POST | `/api/assignment` | 创建新作业 |
| 作业列表 | GET | `/api/assignment` | 获取作业列表 |
| 作业详情 | GET | `/api/assignment/:id` | 获取作业详情 |
| 更新作业 | PUT | `/api/assignment/:id` | 更新作业 |
| 删除作业 | DELETE | `/api/assignment/:id` | 删除作业 |
| 班级作业 | GET | `/api/assignment/class/:classId` | 获取班级作业 |

---

### 4. 试题管理 ✅

| API | 方法 | 端点 | 说明 |
|------|------|------|------|
| 创建试题 | POST | `/api/question` | 创建单道试题 |
| 试题列表 | GET | `/api/question` | 获取试题列表 |
| 试题详情 | GET | `/api/question/:id` | 获取试题详情（带解析） |
| 更新试题 | PUT | `/api/question/:id` | 更新试题 |
| 删除试题 | DELETE | `/api/question/:id` | 删除试题 |
| **批量导入** | POST | `/api/batch-import/questions` | **批量导入试题** ⭐ |
| **试题导出** | GET | `/api/batch-import/questions/export` | **导出试题** ⭐ |
| **随机组卷** | GET | `/api/question/random/exam` | **随机组卷** ⭐ |

**支持的题型**：
- ✅ 选择题 (choice)
- ✅ 填空题 (fill)
- ✅ 判断题 (judge)
- ✅ 问答题 (essay)

---

### 5. 答题功能 ✅

| API | 方法 | 端点 | 说明 |
|------|------|------|------|
| 提交答案 | POST | `/api/answer` | 提交答题结果 |
| 答案列表 | GET | `/api/answer` | 获取答案列表 |
| 答案详情 | GET | `/api/answer/:id` | 获取答案详情 |

---

### 6. 统计功能 ✅

| API | 方法 | 端点 | 说明 |
|------|------|------|------|
| 教师统计 | GET | `/api/stats-lite/teacher/dashboard` | 教师仪表盘统计 ⭐ |
| 作业统计 | GET | `/api/stats/assignment/:id` | 作业统计数据 |
| 班级统计 | GET | `/api/stats/class/:id` | 班级统计数据 |

---

### 7. AI 功能 ✅

| API | 方法 | 端点 | 说明 |
|------|------|------|------|
| AI 剧本生成 | POST | `/api/ai/generate-script` | 生成密室逃脱剧本 |
| AI 题目生成 | POST | `/api/ai/generate-questions` | 基于知识点生成题目 |
| AI 答案分析 | POST | `/api/ai/analyze-answer` | 分析学生答案 |

**支持的 AI 模型**：
- ✅ 阿里云百炼 (qwen3.5-plus, qwen-turbo)
- ✅ 智谱 GLM (glm-4, glm-3-turbo) - 需配置 Key
- ⏳ MiniMax - 需配置 Key

---

## 📁 项目文件结构

```
backend-server/
├── config/
│   ├── database.js          # SQLite 数据库配置
│   └── redis.js             # Redis 配置（可选）
├── middleware/
│   └── auth.js              # JWT 认证中间件
├── routes/
│   ├── auth.js              # 认证路由
│   ├── class.js             # 班级管理路由
│   ├── assignment.js        # 作业管理路由
│   ├── question.js          # 试题管理路由
│   ├── answer.js            # 答题功能路由
│   ├── stats.js             # 统计功能路由
│   ├── stats-lite.js        # 轻量级统计 ⭐
│   ├── ai.js                # AI 功能路由
│   └── batch-import.js      # 批量导入 ⭐
├── services/
│   ├── llmService.js        # AI 大模型服务
│   └── weknora-lite.js      # WeKnora 集成 ⭐
├── prompts/
│   └── script-generator.md  # 剧本生成 Prompt
├── data/
│   └── ragflow.db           # SQLite 数据库 (36KB)
├── .env                     # 环境变量配置
├── server.js                # 主服务器文件
└── package.json             # 依赖配置
```

---

## 🚀 快速开始

### 1. 启动服务

```bash
# 后端
cd ~/.openclaw/workspace/backend-server
npm start

# 前端
cd ~/.openclaw/workspace/teacher-web
npm run dev
```

### 2. 访问系统

- **前端**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **健康检查**: http://localhost:3000/health

### 3. 登录测试

```bash
# 获取 Token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📊 API 使用示例

### 批量导入试题

```bash
# 1. 获取 Token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))")

# 2. 批量导入 3 道数学题
curl -X POST http://localhost:3000/api/batch-import/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "knowledgePoint": "二次方程",
    "subject": "数学",
    "difficulty": "medium",
    "questions": [
      {
        "title": "解方程：x² - 5x + 6 = 0",
        "type": "choice",
        "options": ["x=2", "x=3", "x=2 或 x=3", "无解"],
        "answer": "x=2 或 x=3",
        "explanation": "因式分解得 (x-2)(x-3)=0"
      },
      {
        "title": "一元二次方程根的判别式是？",
        "type": "choice",
        "options": ["b²-4ac", "b²+4ac", "4ac-b²", "以上都不对"],
        "answer": "b²-4ac"
      },
      {
        "title": "当Δ>0 时，方程有____个实数根",
        "type": "fill",
        "answer": "2",
        "explanation": "判别式大于 0 时有两个不相等的实数根"
      }
    ]
  }'
```

### 随机组卷

```bash
# 生成 10 道数学试卷
curl -X GET "http://localhost:3000/api/question/random/exam?subject=数学&count=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 获取教师统计

```bash
# 获取教师仪表盘数据
curl -X GET http://localhost:3000/api/stats-lite/teacher/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📈 数据库表结构

### users (用户表)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT,
  role TEXT DEFAULT 'student',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### classes (班级表)
```sql
CREATE TABLE classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  grade TEXT,
  description TEXT,
  teacher_id INTEGER,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### questions (试题表)
```sql
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  knowledge_point TEXT,
  subject TEXT,
  difficulty TEXT,
  title TEXT,
  type TEXT,
  options TEXT,
  answer TEXT,
  explanation TEXT,
  teacher_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### assignments (作业表)
```sql
CREATE TABLE assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER,
  teacher_id INTEGER,
  title TEXT,
  subject TEXT,
  knowledge_points TEXT,
  difficulty TEXT,
  content TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### answers (答题表)
```sql
CREATE TABLE answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER,
  student_id INTEGER,
  content TEXT,
  score INTEGER,
  status TEXT DEFAULT 'pending',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### class_students (班级学生关系表)
```sql
CREATE TABLE class_students (
  class_id INTEGER,
  student_id INTEGER,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (class_id, student_id)
);
```

---

## 🎯 下一步优化建议

### 短期（1-2 天）
1. ✅ 批量导入试题 - 已完成
2. ✅ 随机组卷功能 - 已完成
3. ✅ 教师统计仪表盘 - 已完成
4. ⏳ 前端试题管理页面
5. ⏳ 前端批量导入界面

### 中期（3-5 天）
1. ⏳ AI 生成试题（需要 GLM API Key）
2. ⏳ AI 批改作业
3. ⏳ 学习路径推荐
4. ⏳ WeKnora 知识库集成（需要 Docker）

### 长期（1-2 周）
1. ⏳ 知识图谱可视化
2. ⏳ 专属 AI 教师
3. ⏳ 学情分析系统
4. ⏳ 多端同步（小程序/App）

---

## 📝 更新日志

### v1.1.0 (2026-03-27)
- ✅ 新增批量导入试题功能
- ✅ 新增试题导出功能
- ✅ 新增随机组卷功能
- ✅ 新增教师统计仪表盘
- ✅ 创建 WeKnora 集成服务（轻量级）
- ✅ 完善 API 文档

### v1.0.0 (2026-03-26)
- ✅ 用户系统
- ✅ 班级管理
- ✅ 作业管理
- ✅ 试题管理
- ✅ 答题功能
- ✅ AI 剧本生成
- ✅ SQLite 数据库配置

---

**文档创建时间**: 2026-03-27 15:16  
**总 API 端点**: 30+  
**数据库大小**: 36KB  
**运行状态**: ✅ 正常
