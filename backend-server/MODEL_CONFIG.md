# AI 模型配置说明

## 🎯 当前配置

| 配置项 | 值 |
|--------|-----|
| **模型** | qwen3.5-plus |
| **提供商** | 阿里云百炼 |
| **状态** | ⚠️ 免费额度已用尽 |

## 📋 支持的模型列表

### 通义千问系列

| 模型名称 | API 名称 | 状态 | 价格 |
|---------|---------|------|------|
| 通义千问 3.5 | qwen-plus | ✅ 可用 | ¥0.008/千 tokens |
| 通义千问 3 | qwen-turbo | ✅ 可用 | ¥0.002/千 tokens |
| 通义千问 2.5 | qwen2.5-72b-instruct | ✅ 可用 | 免费额度内 |

### 模型名称对照

**代码中使用的名称**：
```javascript
model: 'qwen-plus'      // 通义千问 3.5
model: 'qwen-turbo'     // 通义千问 3
model: 'qwen3.5-plus'   // ❌ 可能不正确
```

**正确的 API 名称**：
- `qwen-plus` ✅
- `qwen-turbo` ✅
- `qwen-max` ✅

## 🔧 建议配置

### 推荐：使用 qwen-plus

```javascript
// backend-server/services/llmService.js
model: 'qwen-plus',  // ✅ 正确的模型名称
```

### 临时：使用 qwen-turbo（更便宜）

```javascript
model: 'qwen-turbo',  // ✅ 更便宜，速度快
```

## 🆓 免费额度说明

### 当前状态
```
AllocationQuota.FreeTierOnly
The free tier of the model has been exhausted.
```

### 解决方案
1. 开通付费服务
2. 或等待下个月免费额度重置

### 开通步骤
1. 访问：https://bailian.console.aliyun.com/
2. 进入"费用中心"
3. 开通按量付费
4. 关闭"Use Free Tier Only"模式

## 💰 价格参考

| 模型 | 价格（元/千 tokens） | 生成剧本成本 |
|------|---------------------|-------------|
| qwen-turbo | ¥0.002 | ¥0.002-0.004 |
| qwen-plus | ¥0.008 | ¥0.008-0.016 |
| qwen-max | ¥0.04 | ¥0.04-0.08 |

**注**：生成一个密室逃脱剧本约 1000-2000 tokens

## 🧪 测试命令

```bash
# 测试 qwen-plus
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-plus",
    "input": {
      "messages": [
        {"role": "user", "content": "Hello"}
      ]
    }
  }'

# 成功响应
{
  "output": {
    "text": "Hello! How can I assist you today?"
  },
  "request_id": "xxx"
}
```

## 📝 修改步骤

1. **编辑代码**
   ```bash
   nano backend-server/services/llmService.js
   ```

2. **修改模型名称**
   ```javascript
   model: 'qwen-plus',  // 确保使用正确的名称
   ```

3. **重启后端**
   ```bash
   pkill -f "node.*server.js"
   cd backend-server && npm start
   ```

4. **测试**
   ```bash
   curl -X POST http://localhost:3000/api/ai/generate-script \
     -H "Content-Type: application/json" \
     -d '{"theme":"童话","difficulty":"medium"}'
   ```
