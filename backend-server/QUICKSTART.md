# AI 剧本生成 - 快速启动指南

## 1️⃣ 配置 API Key

复制环境变量配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，添加你的 API Key：

```bash
# Bailian API Key（必填）
BAILIAN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# MiniMax API Key（可选）
MINIMAX_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
MINIMAX_GROUP_ID=xxxxxxxxxx
```

## 2️⃣ 启动服务

```bash
cd backend-server
npm start
```

看到以下输出表示启动成功：

```
🦞 密室做题家后端服务已启动
📍 端口：3000
📅 时间：2024-03-26 14:00:00
```

## 3️⃣ 测试 API

### 方法 1: 使用测试脚本

```bash
node test-ai-api.js
```

### 方法 2: 使用 curl

```bash
# 生成剧本
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "魔法学院",
    "difficulty": "medium",
    "timeLimit": 20,
    "knowledgePoints": "数学、逻辑推理",
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
curl http://localhost:3000/api/ai/script/你的剧本 ID
```

## 4️⃣ 查看完整文档

```bash
# API 使用指南
cat ../AI_GENERATION_GUIDE.md

# 实现说明
cat AI_README.md
```

## 🎯 常用命令

```bash
# 查看服务状态
curl http://localhost:3000/health

# 查看所有剧本
curl http://localhost:3000/api/ai/scripts

# 删除剧本
curl -X DELETE http://localhost:3000/api/ai/script/剧本 ID
```

## ⚡ 一键测试（复制粘贴）

```bash
# 1. 生成一个童话主题剧本
curl -X POST http://localhost:3000/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -d '{"theme":"童话城堡","difficulty":"easy","timeLimit":15,"knowledgePoints":"基础数学","targetAge":"小学生"}'

# 2. 生成 5 道数学题
curl -X POST http://localhost:3000/api/ai/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"knowledgePoints":"加减乘除","count":5,"difficulty":"easy","theme":"童话城堡"}'
```

---

**就这么简单！开始创作你的密室逃脱剧本吧！🦞**
