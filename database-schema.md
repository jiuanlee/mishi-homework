# 数据库设计 - 寓教于乐·密室做题家

## 1. 数据库概述

- **数据库类型**：PostgreSQL 15
- **字符集**：UTF-8
- **命名规范**：蛇形命名法（snake_case）
- **主键策略**：UUID（分布式友好）

---

## 2. ER 图

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │   knowledge     │       │    questions    │
│─────────────────│       │    _points      │       │─────────────────│
│ id (PK)         │       │─────────────────│       │ id (PK)         │
│ role            │◄─────►│ id (PK)         │◄─────►│ knowledge_id(FK)│
│ name            │       │ name            │       │ type            │
│ email           │       │ parent_id (FK)  │       │ content         │
│ phone           │       │ grade_level     │       │ options         │
│ avatar_url      │       │ difficulty      │       │ answer          │
│ grade_level     │       │ created_at      │       │ explanation     │
│ created_at      │       └─────────────────┘       │ difficulty      │
│ updated_at      │                                 │ media_urls      │
└────────┬────────┘                                 │ created_at      │
         │                                          └────────┬────────┘
         │                                                   │
         │              ┌─────────────────┐                  │
         │              │   assignments   │                  │
         │              │─────────────────│                  │
         └─────────────►│ id (PK)         │◄─────────────────┘
                        │ teacher_id (FK) │       ┌───────────────────┐
                        │ title           │       │ assignment_items  │
                        │ description     │       │───────────────────│
                        │ knowledge_ids   │       │ id (PK)           │
                        │ due_date        │       │ assignment_id (FK)│
                        │ status          │       │ question_id (FK)  │
                        │ scene_config    │       │ order_index       │
                        │ created_at      │       │ required_score    │
                        └────────┬────────┘       └───────────────────┘
                                 │
                                 │
                        ┌────────▼────────┐       ┌───────────────────┐
                        │  student_progress│      │    answers        │
                        │─────────────────│       │───────────────────│
                        │ id (PK)         │       │ id (PK)           │
                        │ assignment_id(FK)│      │ progress_id (FK)  │
                        │ student_id (FK) │       │ item_id (FK)      │
                        │ status          │       │ answer_content    │
                        │ current_scene   │       │ is_correct        │
                        │ score           │       │ submitted_at      │
                        │ started_at      │       │ feedback          │
                        │ completed_at    │       └───────────────────┘
                        │ updated_at      │
                        └─────────────────┘
```

---

## 3. 数据表详细设计

### 3.1 用户表 (users)

存储老师和小学生用户信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 用户唯一标识 |
| role | VARCHAR(20) | NOT NULL | 角色：teacher/student |
| name | VARCHAR(100) | NOT NULL | 姓名/昵称 |
| email | VARCHAR(255) | UNIQUE | 邮箱（老师必填） |
| phone | VARCHAR(20) | UNIQUE | 手机号（登录用） |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希 |
| avatar_url | VARCHAR(500) | | 头像 URL |
| grade_level | SMALLINT | | 年级（1-6） |
| class_name | VARCHAR(50) | | 班级名称（学生） |
| school_name | VARCHAR(100) | | 学校名称 |
| parent_phone | VARCHAR(20) | | 家长手机号（学生） |
| status | VARCHAR(20) | DEFAULT 'active' | 状态：active/banned |
| last_login_at | TIMESTAMP | | 最后登录时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**：
- `idx_users_phone` (phone)
- `idx_users_role_grade` (role, grade_level)
- `idx_users_school` (school_name)

---

### 3.2 知识点表 (knowledge_points)

学科知识点树状结构。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 知识点 ID |
| subject | VARCHAR(20) | NOT NULL | 学科：math/chinese/english |
| name | VARCHAR(200) | NOT NULL | 知识点名称 |
| parent_id | UUID | FOREIGN KEY | 父知识点 ID（根节点为 NULL） |
| grade_level | SMALLINT | NOT NULL | 适用年级（1-6） |
| difficulty | SMALLINT | DEFAULT 1 | 难度等级（1-5） |
| description | TEXT | | 知识点描述 |
| tags | TEXT[] | | 标签数组 |
| sort_order | INTEGER | DEFAULT 0 | 排序顺序 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**：
- `idx_kp_subject_grade` (subject, grade_level)
- `idx_kp_parent` (parent_id)

---

### 3.3 题目表 (questions)

题库，存储所有题目。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 题目 ID |
| knowledge_id | UUID | FOREIGN KEY, NOT NULL | 所属知识点 |
| type | VARCHAR(20) | NOT NULL | 题型：single_choice/multiple_choice/fill_blank/calculation |
| content | TEXT | NOT NULL | 题目内容（支持 HTML/Markdown） |
| options | JSONB | | 选项数组（选择题用） |
| answer | TEXT | NOT NULL | 正确答案 |
| explanation | TEXT | | 答案解析 |
| difficulty | SMALLINT | DEFAULT 1 | 难度（1-5） |
| estimated_time | SMALLINT | | 预估用时（秒） |
| media_urls | JSONB | | 多媒体资源 URL 数组 |
| tags | TEXT[] | | 标签 |
| status | VARCHAR(20) | DEFAULT 'published' | 状态：draft/published/archived |
| usage_count | INTEGER | DEFAULT 0 | 使用次数 |
| correct_rate | DECIMAL(5,2) | | 正确率（%） |
| created_by | UUID | FOREIGN KEY | 创建者（老师 ID） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**：
- `idx_q_knowledge` (knowledge_id)
- `idx_q_type_difficulty` (type, difficulty)
- `idx_q_status` (status)
- `idx_q_created_by` (created_by)

---

### 3.4 作业表 (assignments)

老师发布的作业。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 作业 ID |
| teacher_id | UUID | FOREIGN KEY, NOT NULL | 发布老师 |
| title | VARCHAR(200) | NOT NULL | 作业标题 |
| description | TEXT | | 作业说明 |
| knowledge_ids | UUID[] | NOT NULL | 关联知识点数组 |
| grade_level | SMALLINT | NOT NULL | 适用年级 |
| due_date | TIMESTAMP | | 截止时间 |
| total_score | INTEGER | DEFAULT 100 | 总分 |
| passing_score | INTEGER | DEFAULT 60 | 及格分 |
| scene_config | JSONB | | 密室场景配置 |
| story_line | JSONB | | 剧情分支配置 |
| status | VARCHAR(20) | DEFAULT 'draft' | 状态：draft/published/closed |
| is_public | BOOLEAN | DEFAULT false | 是否公开（其他老师可用） |
| student_count | INTEGER | DEFAULT 0 | 学生数量 |
| completed_count | INTEGER | DEFAULT 0 | 完成数量 |
| avg_score | DECIMAL(5,2) | | 平均分 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**：
- `idx_a_teacher` (teacher_id)
- `idx_a_status` (status)
- `idx_a_grade` (grade_level)
- `idx_a_due_date` (due_date)

---

### 3.5 作业题目关联表 (assignment_items)

作业与题目的多对多关系。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 关联 ID |
| assignment_id | UUID | FOREIGN KEY, NOT NULL | 作业 ID |
| question_id | UUID | FOREIGN KEY, NOT NULL | 题目 ID |
| order_index | INTEGER | NOT NULL | 题目顺序 |
| required_score | INTEGER | | 该题分值 |
| is_required | BOOLEAN | DEFAULT true | 是否必做 |
| unlock_condition | JSONB | | 解锁条件（前置题目） |

**索引**：
- `idx_ai_assignment` (assignment_id)
- `idx_ai_question` (question_id)
- `idx_ai_order` (assignment_id, order_index)

**唯一约束**：
- `unique_assignment_question` (assignment_id, question_id)

---

### 3.6 学生进度表 (student_progress)

学生作业完成进度。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 进度 ID |
| assignment_id | UUID | FOREIGN KEY, NOT NULL | 作业 ID |
| student_id | UUID | FOREIGN KEY, NOT NULL | 学生 ID |
| status | VARCHAR(20) | DEFAULT 'not_started' | 状态：not_started/in_progress/completed |
| current_scene | VARCHAR(50) | | 当前场景 |
| current_item_id | UUID | FOREIGN KEY | 当前题目 ID |
| score | INTEGER | DEFAULT 0 | 当前得分 |
| total_items | INTEGER | | 总题目数 |
| completed_items | INTEGER | DEFAULT 0 | 已完成数 |
| correct_count | INTEGER | DEFAULT 0 | 正确数 |
| started_at | TIMESTAMP | | 开始时间 |
| completed_at | TIMESTAMP | | 完成时间 |
| last_activity_at | TIMESTAMP | | 最后活动时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**：
- `idx_sp_assignment_student` (assignment_id, student_id)
- `idx_sp_student` (student_id)
- `idx_sp_status` (status)

**唯一约束**：
- `unique_student_assignment` (assignment_id, student_id)

---

### 3.7 答题记录表 (answers)

学生答题详情。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 答题 ID |
| progress_id | UUID | FOREIGN KEY, NOT NULL | 进度 ID |
| item_id | UUID | FOREIGN KEY, NOT NULL | 作业题目关联 ID |
| answer_content | TEXT | NOT NULL | 学生答案 |
| is_correct | BOOLEAN | | 是否正确 |
| score_earned | INTEGER | DEFAULT 0 | 获得分数 |
| attempt_count | INTEGER | DEFAULT 1 | 尝试次数 |
| time_spent | INTEGER | | 用时（秒） |
| submitted_at | TIMESTAMP | DEFAULT NOW() | 提交时间 |
| feedback | TEXT | | 老师/系统反馈 |

**索引**：
- `idx_ans_progress` (progress_id)
- `idx_ans_item` (item_id)
- `idx_ans_submitted` (submitted_at)

---

### 3.8 奖励记录表 (rewards)

游戏化奖励。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 奖励 ID |
| student_id | UUID | FOREIGN KEY, NOT NULL | 学生 ID |
| type | VARCHAR(50) | NOT NULL | 类型：badge/points/item |
| name | VARCHAR(100) | NOT NULL | 奖励名称 |
| description | TEXT | | 奖励描述 |
| icon_url | VARCHAR(500) | | 图标 URL |
| value | INTEGER | DEFAULT 0 | 数值（积分/数量） |
| reason | VARCHAR(200) | | 获得原因 |
| earned_at | TIMESTAMP | DEFAULT NOW() | 获得时间 |

**索引**：
- `idx_r_student` (student_id)
- `idx_r_type` (type)

---

### 3.9 系统配置表 (system_configs)

系统级配置。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 配置 ID |
| config_key | VARCHAR(100) | UNIQUE, NOT NULL | 配置键 |
| config_value | JSONB | NOT NULL | 配置值 |
| description | TEXT | | 配置说明 |
| updated_by | UUID | | 最后更新人 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

---

## 4. 数据字典

### 4.1 用户角色 (user_role)
- `teacher` - 老师
- `student` - 学生

### 4.2 学科 (subject)
- `math` - 数学
- `chinese` - 语文
- `english` - 英语
- `science` - 科学

### 4.3 题型 (question_type)
- `single_choice` - 单选题
- `multiple_choice` - 多选题
- `fill_blank` - 填空题
- `calculation` - 计算题
- `essay` - 作文题

### 4.4 作业状态 (assignment_status)
- `draft` - 草稿
- `published` - 已发布
- `closed` - 已截止

### 4.5 进度状态 (progress_status)
- `not_started` - 未开始
- `in_progress` - 进行中
- `completed` - 已完成

### 4.6 难度等级 (difficulty)
- `1` - 非常简单
- `2` - 简单
- `3` - 中等
- `4` - 困难
- `5` - 非常困难

---

## 5. 数据库初始化脚本

```sql
-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    grade_level SMALLINT,
    class_name VARCHAR(50),
    school_name VARCHAR(100),
    parent_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建知识点表
CREATE TABLE knowledge_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    parent_id UUID REFERENCES knowledge_points(id),
    grade_level SMALLINT NOT NULL,
    difficulty SMALLINT DEFAULT 1,
    description TEXT,
    tags TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建题目表
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    knowledge_id UUID NOT NULL REFERENCES knowledge_points(id),
    type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    options JSONB,
    answer TEXT NOT NULL,
    explanation TEXT,
    difficulty SMALLINT DEFAULT 1,
    estimated_time SMALLINT,
    media_urls JSONB,
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'published',
    usage_count INTEGER DEFAULT 0,
    correct_rate DECIMAL(5,2),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建作业表
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    knowledge_ids UUID[] NOT NULL,
    grade_level SMALLINT NOT NULL,
    due_date TIMESTAMP,
    total_score INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 60,
    scene_config JSONB,
    story_line JSONB,
    status VARCHAR(20) DEFAULT 'draft',
    is_public BOOLEAN DEFAULT false,
    student_count INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    avg_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建作业题目关联表
CREATE TABLE assignment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    order_index INTEGER NOT NULL,
    required_score INTEGER,
    is_required BOOLEAN DEFAULT true,
    unlock_condition JSONB,
    UNIQUE(assignment_id, question_id)
);

-- 创建学生进度表
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id),
    student_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'not_started',
    current_scene VARCHAR(50),
    current_item_id UUID REFERENCES assignment_items(id),
    score INTEGER DEFAULT 0,
    total_items INTEGER,
    completed_items INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_activity_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- 创建答题记录表
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    progress_id UUID NOT NULL REFERENCES student_progress(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES assignment_items(id),
    answer_content TEXT NOT NULL,
    is_correct BOOLEAN,
    score_earned INTEGER DEFAULT 0,
    attempt_count INTEGER DEFAULT 1,
    time_spent INTEGER,
    submitted_at TIMESTAMP DEFAULT NOW(),
    feedback TEXT
);

-- 创建奖励记录表
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    value INTEGER DEFAULT 0,
    reason VARCHAR(200),
    earned_at TIMESTAMP DEFAULT NOW()
);

-- 创建系统配置表
CREATE TABLE system_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role_grade ON users(role, grade_level);
CREATE INDEX idx_kp_subject_grade ON knowledge_points(subject, grade_level);
CREATE INDEX idx_kp_parent ON knowledge_points(parent_id);
CREATE INDEX idx_q_knowledge ON questions(knowledge_id);
CREATE INDEX idx_q_type_difficulty ON questions(type, difficulty);
CREATE INDEX idx_q_status ON questions(status);
CREATE INDEX idx_a_teacher ON assignments(teacher_id);
CREATE INDEX idx_a_status ON assignments(status);
CREATE INDEX idx_ai_assignment ON assignment_items(assignment_id);
CREATE INDEX idx_sp_assignment_student ON student_progress(assignment_id, student_id);
CREATE INDEX idx_sp_student ON student_progress(student_id);
CREATE INDEX idx_ans_progress ON answers(progress_id);
CREATE INDEX idx_r_student ON rewards(student_id);
```

---

*文档版本：v1.0*  
*创建日期：2026-03-26*  
*作者：架构师龙虾*
