# AI 配置说明

## 🔑 获取 API Key

### 阿里云百炼（推荐）

1. 访问：https://bailian.console.aliyun.com/
2. 登录阿里云账号
3. 进入"API-KEY 管理"
4. 创建新的 API Key
5. 复制到 `.env` 文件

### 支持的模型

- **qwen-turbo** - 通义千问（快速）
- **qwen-plus** - 通义千问（增强）
- **qwen-max** - 通义千问（最强）

## 📝 配置示例

```ini
# 阿里云百炼 API Key
BAILIAN_API_KEY=sk-你的 API 密钥

# 可选：MiniMax API Key
MINIMAX_API_KEY=你的 MiniMax API 密钥
```

## 🧪 测试 API Key

```bash
# 测试 API Key 是否有效
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer sk-你的 API 密钥" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-turbo",
    "input": {
      "messages": [
        {"role": "user", "content": "Hello"}
      ]
    }
  }'
```

**成功响应**：
```json
{
  "output": {
    "text": "Hello! How can I assist you today?"
  },
  "request_id": "xxx"
}
```

**失败响应**：
```json
{
  "code": "InvalidApiKey",
  "message": "Invalid API-key provided."
}
```

## 🆓 免费额度

阿里云百炼提供**免费试用额度**：
- 新用户赠送 ¥20 体验金
- qwen-turbo 约可使用 1000 次
- 有效期 30 天

## 🔧 故障排除

### 401 Unauthorized
- API Key 无效或过期
- 检查 Key 是否正确复制
- 确认是百炼服务的 Key

### 403 Forbidden
- 账号未开通百炼服务
- 访问控制台开通服务

### 429 Too Many Requests
- 超出速率限制
- 等待后重试
