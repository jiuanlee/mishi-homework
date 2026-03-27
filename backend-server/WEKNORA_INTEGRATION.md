# 腾讯 IMA/WeKnora 知识库集成方案

## 📋 方案概述

根据调研，腾讯 IMA 知识库有两种集成方式：

### 方案 1：WeKnora（开源框架）⭐⭐⭐⭐⭐

**WeKnora** 是腾讯开源的知识库框架，提供完整的 REST API。

**优势**：
- ✅ 开源免费
- ✅ 完整的 REST API
- ✅ 支持本地部署
- ✅ 数据完全可控
- ✅ 支持多种文档格式（PDF/Word/Markdown）

**GitHub**: https://github.com/Tencent/WeKnora

### 方案 2：腾讯 IMA 客户端 ⭐⭐

**IMA 客户端** 是腾讯官方应用，但**没有公开 API**。

**限制**：
- ❌ 没有官方 API
- ❌ 需要手动操作
- ❌ 数据在腾讯云端

---

## 🚀 推荐方案：WeKnora

### WeKnora API 概览

**基础信息**：
- **Base URL**: `/api/v1`
- **响应格式**: JSON
- **认证方式**: API Key（HTTP Header: `X-API-Key`）

**核心 API 分类**：

| 分类 | 描述 | 主要接口 |
|------|------|---------|
| **知识库管理** | 创建、查询和管理知识库 | POST/GET/DELETE /knowledge-base |
| **知识管理** | 上传、检索和管理知识内容 | POST /knowledge/upload<br>GET /knowledge/search |
| **聊天功能** | 基于知识库问答 | POST /chat |
| **会话管理** | 创建和管理对话会话 | POST/GET /session |
| **模型管理** | 配置 AI 模型 | GET/PUT /model |

---

## 🔧 集成步骤

### 步骤 1：部署 WeKnora

**Docker 部署**：

```bash
# 1. 克隆项目
git clone https://github.com/Tencent/WeKnora.git
cd WeKnora

# 2. 复制配置文件
cp .env.example .env

# 3. 修改配置（编辑 .env）
# 设置 LLM 模型、Embedding 模型等

# 4. 启动服务
docker compose up -d

# 5. 访问 Web UI
# http://localhost:8080
```

### 步骤 2：获取 API Key

1. 访问 WeKnora Web UI
2. 注册账户
3. 进入账户信息页面
4. 获取 API Key

### 步骤 3：在密室做题家中集成

**创建 WeKnora 服务类**：

```javascript
// backend-server/services/weknora.js
const axios = require('axios');

class WeKnoraService {
  constructor() {
    this.baseUrl = process.env.WEKNORA_BASE_URL || 'http://localhost:8080/api/v1';
    this.apiKey = process.env.WEKNORA_API_KEY;
  }

  /**
   * 上传文档到知识库
   */
  async uploadDocument(knowledgeBaseId, file, fileName) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    const response = await axios.post(
      `${this.baseUrl}/knowledge/upload`,
      formData,
      {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'multipart/form-data'
        },
        params: {
          knowledgeBaseId: knowledgeBaseId
        }
      }
    );

    return response.data;
  }

  /**
   * 搜索知识库
   */
  async searchKnowledge(knowledgeBaseId, query, limit = 5) {
    const response = await axios.post(
      `${this.baseUrl}/knowledge/search`,
      {
        query: query,
        knowledgeBaseId: knowledgeBaseId,
        limit: limit
      },
      {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  /**
   * 基于知识库问答
   */
  async chat(knowledgeBaseId, message, sessionId) {
    const response = await axios.post(
      `${this.baseUrl}/chat`,
      {
        knowledgeBaseId: knowledgeBaseId,
        message: message,
        sessionId: sessionId
      },
      {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  /**
   * 创建知识库
   */
  async createKnowledgeBase(name, description) {
    const response = await axios.post(
      `${this.baseUrl}/knowledge-base`,
      {
        name: name,
        description: description
      },
      {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  /**
   * 获取知识库列表
   */
  async getKnowledgeBases(page = 1, pageSize = 10) {
    const response = await axios.get(
      `${this.baseUrl}/knowledge-base`,
      {
        headers: {
          'X-API-Key': this.apiKey
        },
        params: {
          page: page,
          pageSize: pageSize
        }
      }
    );

    return response.data;
  }
}

module.exports = WeKnoraService;
```

---

### 步骤 4：配置环境变量

**编辑 `backend-server/.env`**：

```ini
# WeKnora 知识库配置
WEKNORA_BASE_URL=http://localhost:8080/api/v1
WEKNORA_API_KEY=your_weknora_api_key_here
```

---

## 📝 使用场景

### 场景 1：上传教学资料到知识库

```javascript
const WeKnoraService = require('./services/weknora');
const fs = require('fs');

const weknora = new WeKnoraService();

// 上传 PDF 文档
const fileStream = fs.createReadStream('./math-teaching.pdf');
await weknora.uploadDocument('math-kb-id', fileStream, '数学教学资料.pdf');
```

### 场景 2：基于知识库生成试题

```javascript
// 搜索相关知识
const searchResult = await weknora.searchKnowledge(
  'math-kb-id',
  '三角函数 二次方程',
  10
);

// 基于搜索结果生成试题
const context = searchResult.results.map(r => r.content).join('\n');
const prompt = `基于以下知识点生成 5 道数学题：\n${context}`;

// 调用 LLM 生成试题
const questions = await llmService.generate(prompt);
```

### 场景 3：智能答疑

```javascript
// 学生提问
const question = "如何解二次方程？";

// 基于知识库回答
const answer = await weknora.chat(
  'math-kb-id',
  question,
  'student-session-123'
);

console.log(answer.message);
```

---

## 🔗 完整 API 文档

WeKnora 提供以下 API 类别：

| API 类别 | 文档链接 |
|---------|---------|
| 认证管理 | auth.md |
| 租户管理 | tenant.md |
| 知识库管理 | knowledge-base.md |
| 知识管理 | knowledge.md |
| 模型管理 | model.md |
| 分块管理 | chunk.md |
| 标签管理 | tag.md |
| FAQ 管理 | faq.md |
| 智能体管理 | agent.md |
| 会话管理 | session.md |
| 知识搜索 | knowledge-search.md |
| 聊天功能 | chat.md |
| 消息管理 | message.md |

**完整文档**: https://github.com/Tencent/WeKnora/blob/main/docs/api/README.md

---

## 💡 集成建议

### 第一阶段：基础集成

1. ✅ 部署 WeKnora 服务
2. ✅ 创建 API 调用服务类
3. ✅ 实现知识库上传功能
4. ✅ 实现知识库搜索功能

### 第二阶段：深度集成

1. ⏳ 基于知识库生成试题
2. ⏳ 智能答疑助手
3. ⏳ 知识点自动分类
4. ⏳ 学习路径推荐

### 第三阶段：高级功能

1. ⏳ 多模态知识（图片/音频）
2. ⏳ 知识图谱可视化
3. ⏳ 学习数据分析
4. ⏳ 个性化推荐

---

## 📊 对比分析

| 功能 | WeKnora | 腾讯 IMA 客户端 |
|------|---------|---------------|
| **API 支持** | ✅ 完整 REST API | ❌ 无官方 API |
| **部署方式** | ✅ 本地/私有云 | ❌ 仅 SaaS |
| **数据控制** | ✅ 完全自控 | ❌ 腾讯云存储 |
| **定制能力** | ✅ 完全开源可定制 | ❌ 封闭系统 |
| **成本** | ✅ 免费（自建） | 💰 可能收费 |
| **文档格式** | ✅ PDF/Word/Markdown 等 | ✅ PDF/Word |
| **AI 模型** | ✅ 支持多种模型 | ✅ 腾讯混元/DeepSeek |

---

## 🎯 结论

**推荐使用 WeKnora** 进行集成，原因：

1. ✅ **完整的 API 支持** - 便于自动化集成
2. ✅ **数据可控** - 教学资料私有化部署
3. ✅ **开源免费** - 无额外成本
4. ✅ **灵活定制** - 可根据需求扩展功能

---

## 📚 参考资料

- **WeKnora GitHub**: https://github.com/Tencent/WeKnora
- **API 文档**: https://github.com/Tencent/WeKnora/blob/main/docs/api/README.md
- **部署指南**: https://github.com/Tencent/WeKnora/blob/main/README.md
- **腾讯 IMA 官网**: https://ima.qq.com/

---

*文档创建时间：2026-03-27*
