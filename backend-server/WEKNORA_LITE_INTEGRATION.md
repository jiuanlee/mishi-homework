# WeKnora 知识库集成指南

## 📋 概述

WeKnora 是腾讯开源的知识库框架，提供完整的 RAG（检索增强生成）能力。

## 🚀 部署方案

### 方案 A：Docker 部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Tencent/WeKnora.git
cd WeKnora

# 2. 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 3. 启动服务
docker compose up -d

# 4. 访问 Web UI
# http://localhost:8080
```

### 方案 B：Node.js 集成（轻量级）

使用 `services/weknora-lite.js` 直接调用 WeKnora API。

## 🔑 配置

### 1. 获取 API Key

1. 访问 WeKnora Web UI
2. 注册账户
3. 进入账户信息页面
4. 获取 API Key

### 2. 配置环境变量

编辑 `backend-server/.env`:

```ini
# WeKnora 配置
WEKNORA_BASE_URL=http://localhost:8080/api/v1
WEKNORA_API_KEY=your_api_key_here
```

## 📝 使用示例

### 创建知识库

```javascript
const WeKnoraLiteService = require('./services/weknora-lite');

const weknora = new WeKnoraLiteService();

// 创建数学知识库
const kb = await weknora.createKnowledgeBase(
  '初中数学知识库',
  '包含代数、几何、函数等知识点'
);

console.log('知识库 ID:', kb.id);
```

### 上传文档

```javascript
// 上传教学资料
await weknora.uploadDocument(
  kb.id,
  './algebra.pdf',
  '代数基础.pdf'
);
```

### 搜索知识点

```javascript
// 搜索相关知识点
const results = await weknora.searchKnowledge(
  kb.id,
  '二次方程',
  5
);

console.log('搜索结果:', results);
```

### 智能答疑

```javascript
// 基于知识库问答
const answer = await weknora.chat(
  kb.id,
  '如何解一元二次方程？',
  'student-session-123'
);

console.log('AI 回答:', answer.message);
```

## 🎯 集成到密室做题家

### 1. 创建学科知识库

为每个科目创建独立的知识库：

```javascript
const knowledgeBases = {
  math: await weknora.createKnowledgeBase('数学知识库', '数学知识点'),
  chinese: await weknora.createKnowledgeBase('语文知识库', '语文知识点'),
  english: await weknora.createKnowledgeBase('英语知识库', '英语知识点')
};
```

### 2. 上传教学资料

批量上传教材、教案、习题解析：

```javascript
const files = [
  './docs/math/algebra.pdf',
  './docs/math/geometry.pdf',
  './docs/chinese/poetry.pdf'
];

for (const file of files) {
  await weknora.uploadDocument(kb.id, file, path.basename(file));
}
```

### 3. 实现智能答疑

在密室做题家中添加 AI 答疑功能：

```javascript
// 学生提问
app.post('/api/ask', async (req, res) => {
  const { question, subject, sessionId } = req.body;
  
  // 根据科目选择知识库
  const kbId = knowledgeBases[subject].id;
  
  // 获取 AI 回答
  const answer = await weknora.chat(kbId, question, sessionId);
  
  res.json({
    success: true,
    answer: answer.message,
    sources: answer.sources
  });
});
```

## 📊 API 参考

| API | 方法 | 说明 |
|------|------|------|
| `/knowledge-base` | POST | 创建知识库 |
| `/knowledge-base` | GET | 获取知识库列表 |
| `/knowledge/upload` | POST | 上传文档 |
| `/knowledge/search` | POST | 搜索知识 |
| `/chat` | POST | 智能问答 |
| `/session` | POST/GET | 会话管理 |

## 💡 最佳实践

1. **知识库分类**
   - 按科目分类（数学/语文/英语）
   - 按年级分类（初一/初二/初三）
   - 按知识点分类（代数/几何/函数）

2. **文档管理**
   - 使用清晰的命名规范
   - 添加标签便于检索
   - 定期更新内容

3. **性能优化**
   - 批量上传文档
   - 使用缓存减少 API 调用
   - 设置合理的搜索限制

## 🔧 故障排除

### 问题 1：连接失败

**解决**：
```bash
# 检查 WeKnora 服务
docker compose ps

# 检查网络
curl http://localhost:8080/api/v1/system
```

### 问题 2：API Key 无效

**解决**：
1. 确认 API Key 正确复制
2. 检查 API Key 是否过期
3. 重新生成 API Key

### 问题 3：上传失败

**解决**：
```bash
# 检查文件大小（限制 10MB）
ls -lh file.pdf

# 检查文件格式（支持 PDF/Word/Markdown）
file file.pdf
```

---

**文档创建时间**: 2026-03-27  
**WeKnora 版本**: v0.2.1
