# AI 剧本生成功能 - 实现总结

## 📦 交付物清单

| 文件 | 路径 | 说明 |
|------|------|------|
| AI 路由 | `routes/ai.js` | 3 个核心 API 接口 |
| 大模型服务 | `services/llmService.js` | Bailian/MiniMax 集成 |
| Prompt 模板 | `prompts/script-generator.md` | 剧本生成提示词 |
| 使用指南 | `/AI_GENERATION_GUIDE.md` | 完整 API 文档 |
| 测试脚本 | `test-ai-api.js` | API 功能测试 |

## 🎯 功能特性

### 1. 大模型集成
- ✅ 支持 Bailian API（通义千问）
- ✅ 支持 MiniMax API
- ✅ 可配置模型切换
- ✅ 支持流式输出（框架已就绪）

### 2. 剧本生成
- ✅ 自定义主题
- ✅ 自定义难度（easy/medium/hard）
- ✅ 自定义时长（5-120 分钟）
- ✅ 自定义知识点
- ✅ 自定义目标年龄
- ✅ 自动生成场景、分支、线索

### 3. 题目生成
- ✅ 支持多种题型（choice/fill/match/open）
- ✅ 支持情境化题目
- ✅ 自定义题目数量（1-50）
- ✅ 自动关联知识点

### 4. API 接口

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/ai/generate-script` | POST | 生成剧本 |
| `/api/ai/generate-questions` | POST | 生成题目 |
| `/api/ai/script/:id` | GET | 获取剧本详情 |
| `/api/ai/scripts` | GET | 获取剧本列表 |
| `/api/ai/script/:id` | DELETE | 删除剧本 |

## 📊 剧本结构

```json
{
  "theme": "童话城堡",
  "difficulty": "medium",
  "time_limit": 20,
  "target_age": "小学生",
  "knowledge_points": ["数学", "逻辑推理"],
  "story_background": "故事背景...",
  "scenes": [
    {
      "id": 1,
      "title": "进入城堡",
      "description": "场景描述...",
      "clue": "关键线索...",
      "puzzle": "谜题...",
      "solution": "答案...",
      "question_ids": [1, 2],
      "next_scene_id": 2,
      "failure_hint": "失败提示..."
    }
  ],
  "branches": [
    {
      "from": 1,
      "to": 2,
      "condition": "正确率>=80%",
      "description": "分支描述"
    }
  ],
  "ending": {
    "success": "成功结局...",
    "failure": "失败结局..."
  },
  "props": [...],
  "tips": [...]
}
```

## 🔧 配置说明

### 环境变量

在 `.env` 文件中添加：

```bash
# Bailian API（必填）
BAILIAN_API_KEY=your_bailian_api_key

# MiniMax API（可选）
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_GROUP_ID=your_minimax_group_id
```

### 获取 API Key

- **Bailian**: https://dashscope.console.aliyun.com/
- **MiniMax**: https://api.minimax.chat/

## 🚀 快速开始

### 1. 启动服务

```bash
cd backend-server
npm start
```

### 2. 测试 API

```bash
# 运行测试脚本
node test-ai-api.js

# 或使用 curl 测试
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "魔法学院",
    "difficulty": "medium",
    "timeLimit": 25
  }'
```

## 📝 使用示例

### 生成小学数学剧本

```javascript
POST /api/ai/generate-script
{
  "theme": "数学王国",
  "difficulty": "easy",
  "timeLimit": 15,
  "knowledgePoints": "加减乘除",
  "targetAge": "小学三年级"
}
```

### 生成配套题目

```javascript
POST /api/ai/generate-questions
{
  "knowledgePoints": "一元一次方程",
  "count": 10,
  "difficulty": "medium",
  "theme": "魔法学院"
}
```

## ⚠️ 注意事项

1. **API Key 安全**: 不要提交到代码仓库
2. **速率限制**: Bailian API 有调用频率限制
3. **存储**: 当前使用内存存储，重启后数据丢失
4. **生产环境**: 建议使用数据库持久化存储

## 🔍 故障排查

### 常见问题

1. **生成失败**: 检查 API Key 配置和网络连接
2. **JSON 解析错误**: 已内置容错处理，如持续出现请更换模型
3. **生成速度慢**: 使用 `qwen-turbo` 模型或添加超时处理

### 查看日志

```bash
# 后端日志
tail -f backend-server/logs/error.log

# 或查看控制台输出
```

## 📚 相关文档

- [完整 API 文档](../AI_GENERATION_GUIDE.md)
- [Prompt 模板](./prompts/script-generator.md)
- [服务实现](./services/llmService.js)

---

**实现完成！🦞**
