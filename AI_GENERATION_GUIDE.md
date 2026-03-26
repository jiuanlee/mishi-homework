# AI 剧本生成功能使用指南

## 📖 概述

本功能使用大模型（通义千问/MiniMax）自动生成密室逃脱剧本和配套题目，支持自定义主题、难度和时长。

## 🔧 API 接口

### 1. 生成剧本

**接口**: `POST /api/ai/generate-script`

**请求体**:
```json
{
  "theme": "童话城堡",
  "difficulty": "medium",
  "timeLimit": 20,
  "knowledgePoints": "数学、逻辑推理",
  "targetAge": "小学生",
  "model": "qwen-plus"
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| theme | string | 否 | "奇幻冒险" | 剧本主题 |
| difficulty | string | 否 | "medium" | 难度：easy/medium/hard |
| timeLimit | number | 否 | 20 | 时长（分钟），范围 5-120 |
| knowledgePoints | string | 否 | "数学、逻辑推理" | 知识点 |
| targetAge | string | 否 | "小学生" | 目标年龄群体 |
| model | string | 否 | "qwen-plus" | 模型：qwen-plus/qwen-turbo/abab6.5 |

**响应示例**:
```json
{
  "success": true,
  "message": "剧本生成成功",
  "data": {
    "scriptId": "1711432800000",
    "theme": "童话城堡",
    "difficulty": "medium",
    "timeLimit": 20,
    "sceneCount": 4,
    "branchCount": 2,
    "createdAt": "2024-03-26T06:00:00.000Z"
  }
}
```

---

### 2. 生成题目

**接口**: `POST /api/ai/generate-questions`

**请求体**:
```json
{
  "knowledgePoints": "一元一次方程",
  "count": 10,
  "difficulty": "easy",
  "theme": "童话城堡",
  "questionType": "choice"
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| knowledgePoints | string | **是** | - | 知识点（必填） |
| count | number | 否 | 5 | 题目数量，范围 1-50 |
| difficulty | string | 否 | "medium" | 难度：easy/medium/hard |
| theme | string | 否 | "通用" | 主题情境（用于情境化题目） |
| questionType | string | 否 | "choice" | 题型：choice/fill/match/open |

**响应示例**:
```json
{
  "success": true,
  "message": "题目生成成功",
  "data": {
    "count": 10,
    "knowledgePoints": "一元一次方程",
    "difficulty": "easy",
    "questions": [
      {
        "id": "q_1711432800000_0",
        "type": "choice",
        "question": "小明有 5 个苹果，小红给了他 3 个，现在小明有几个苹果？",
        "options": ["A. 6 个", "B. 7 个", "C. 8 个", "D. 9 个"],
        "answer": "C",
        "explanation": "5 + 3 = 8，所以小明现在有 8 个苹果。",
        "difficulty": "easy",
        "knowledgePoint": "加法运算",
        "createdAt": "2024-03-26T06:00:00.000Z"
      }
    ]
  }
}
```

---

### 3. 获取剧本详情

**接口**: `GET /api/ai/script/:id`

**路径参数**:
- `id`: 剧本 ID（从生成剧本接口返回）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "1711432800000",
    "theme": "童话城堡",
    "difficulty": "medium",
    "time_limit": 20,
    "target_age": "小学生",
    "knowledge_points": ["数学", "逻辑推理"],
    "story_background": "你是一位勇敢的冒险者，听说在一座古老的城堡中...",
    "scenes": [
      {
        "id": 1,
        "title": "进入城堡",
        "description": "你站在一座古老的城堡前，大门紧闭...",
        "clue": "钥匙藏在门前的石像下",
        "puzzle": "解开石像上的密码锁",
        "solution": "密码是 1234",
        "question_ids": ["q_1711432800000_0", "q_1711432800000_1"],
        "next_scene_id": 2,
        "failure_hint": "仔细观察石像的底座"
      }
    ],
    "branches": [
      {
        "from": 1,
        "to": 2,
        "condition": "正确率>=80%",
        "description": "表现优秀，进入主线"
      }
    ],
    "ending": {
      "success": "恭喜你成功逃脱城堡！",
      "failure": "很遗憾，时间到了..."
    },
    "props": [
      {
        "name": "古老钥匙",
        "description": "一把生锈的铜钥匙",
        "usage": "打开城堡大门"
      }
    ],
    "tips": ["多观察环境", "注意细节"],
    "createdAt": "2024-03-26T06:00:00.000Z",
    "status": "active"
  }
}
```

---

### 4. 其他接口

**获取剧本列表**: `GET /api/ai/scripts`

**删除剧本**: `DELETE /api/ai/script/:id`

---

## 🚀 快速开始

### 1. 配置环境变量

在 `.env` 文件中添加：

```bash
# Bailian API 配置
BAILIAN_API_KEY=your_bailian_api_key

# MiniMax API 配置（可选）
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_GROUP_ID=your_minimax_group_id
```

### 2. 启动服务

```bash
cd backend-server
npm start
```

### 3. 调用示例

#### 使用 curl

```bash
# 生成剧本
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "太空探险",
    "difficulty": "easy",
    "timeLimit": 15,
    "knowledgePoints": "基础物理、天文知识",
    "targetAge": "小学生"
  }'

# 生成题目
curl -X POST http://localhost:3000/api/ai/generate-questions \
  -H "Content-Type: application/json" \
  -d '{
    "knowledgePoints": "一元一次方程",
    "count": 5,
    "difficulty": "easy"
  }'

# 获取剧本
curl http://localhost:3000/api/ai/script/1711432800000
```

#### 使用 JavaScript

```javascript
// 生成剧本
const generateScript = async () => {
  const response = await fetch('http://localhost:3000/api/ai/generate-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      theme: '魔法学院',
      difficulty: 'medium',
      timeLimit: 25,
      knowledgePoints: '数学、逻辑思维',
      targetAge: '初中生'
    })
  });
  const data = await response.json();
  console.log('剧本 ID:', data.data.scriptId);
  return data.data.scriptId;
};

// 生成题目
const generateQuestions = async () => {
  const response = await fetch('http://localhost:3000/api/ai/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      knowledgePoints: '几何图形',
      count: 10,
      difficulty: 'medium',
      theme: '魔法学院'
    })
  });
  const data = await response.json();
  console.log('题目数量:', data.data.count);
};

// 获取剧本详情
const getScript = async (scriptId) => {
  const response = await fetch(`http://localhost:3000/api/ai/script/${scriptId}`);
  const data = await response.json();
  console.log('剧本详情:', data.data);
};
```

---

## 📊 剧本结构说明

生成的剧本包含以下核心部分：

### 场景 (scenes)
每个场景包含：
- `id`: 场景唯一标识
- `title`: 场景标题
- `description`: 详细场景描述
- `clue`: 关键线索
- `puzzle`: 需要解决的谜题
- `solution`: 谜题答案
- `question_ids`: 关联的题目 ID 列表
- `next_scene_id`: 下一个场景 ID
- `failure_hint`: 失败提示

### 剧情分支 (branches)
- `from`: 起始场景 ID
- `to`: 目标场景 ID
- `condition`: 分支条件（如正确率>=80%）
- `description`: 分支描述

### 结局 (ending)
- `success`: 成功结局描述
- `failure`: 失败结局描述

---

## 🎯 最佳实践

### 1. 主题设计建议

| 主题类型 | 适合年龄 | 知识点建议 |
|---------|---------|-----------|
| 童话城堡 | 小学生 | 基础数学、常识 |
| 太空探险 | 小学生/初中 | 物理、天文 |
| 魔法学院 | 初中 | 逻辑推理、代数 |
| 历史探秘 | 初中/高中 | 历史、地理 |
| 科学实验室 | 全年龄 | 化学、生物 |

### 2. 难度选择

- **easy**: 1-2 个知识点，简单谜题，适合初学者
- **medium**: 2-3 个知识点，需要推理，适合有经验玩家
- **hard**: 3+ 知识点，多层推理，适合挑战者

### 3. 时长建议

- 10-15 分钟：3 个场景，快速体验
- 20-30 分钟：4-5 个场景，标准体验
- 40-60 分钟：6+ 场景，完整体验

### 4. 题目生成技巧

- 明确知识点，避免过于宽泛
- 根据主题情境化题目，增加趣味性
- 难度与剧本难度保持一致
- 题目数量建议为场景数的 2-3 倍

---

## ⚠️ 注意事项

1. **API Key 安全**: 不要将 API Key 提交到代码仓库
2. **速率限制**: Bailian API 有调用频率限制，建议添加重试机制
3. **JSON 解析**: 大模型返回的 JSON 可能有格式问题，已内置容错处理
4. **存储限制**: 当前使用内存存储，重启后数据会丢失（生产环境应使用数据库）
5. **错误处理**: 建议前端添加完善的错误处理和加载状态

---

## 🔍 故障排查

### 问题：剧本生成失败

**可能原因**:
- API Key 配置错误
- 网络连接问题
- 模型服务不可用

**解决方案**:
1. 检查 `.env` 文件中的 API Key 是否正确
2. 查看后端日志：`tail -f backend-server/logs/error.log`
3. 测试 API 连通性：`curl https://dashscope.aliyuncs.com/compatible-mode/v1/models`

### 问题：返回的 JSON 格式错误

**可能原因**:
- 模型返回内容包含额外文本
- JSON 格式不完整

**解决方案**:
- 服务已内置 JSON 清理和容错处理
- 如持续出现，尝试降低 `temperature` 参数或更换模型

### 问题：生成速度慢

**可能原因**:
- 模型响应慢
- 网络延迟

**解决方案**:
- 使用 `qwen-turbo` 模型（更快但质量略低）
- 添加加载提示和超时处理
- 考虑使用流式输出

---

## 📚 相关文件

- `backend-server/routes/ai.js` - AI 路由实现
- `backend-server/services/llmService.js` - 大模型服务
- `backend-server/prompts/script-generator.md` - Prompt 模板

---

## 🎉 示例场景

### 示例 1：小学数学练习

```bash
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "数学王国",
    "difficulty": "easy",
    "timeLimit": 15,
    "knowledgePoints": "加减乘除、简单方程",
    "targetAge": "小学三年级"
  }'
```

### 示例 2：初中物理挑战

```bash
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "物理实验室",
    "difficulty": "hard",
    "timeLimit": 40,
    "knowledgePoints": "力学、电学、光学",
    "targetAge": "初中二年级"
  }'
```

### 示例 3：生成配套题目

```bash
curl -X POST http://localhost:3000/api/ai/generate-questions \
  -H "Content-Type: application/json" \
  -d '{
    "knowledgePoints": "一元一次方程应用题",
    "count": 15,
    "difficulty": "medium",
    "theme": "数学王国",
    "questionType": "choice"
  }'
```

---

**祝使用愉快！如有问题请查看后端日志或联系开发团队。** 🦞
