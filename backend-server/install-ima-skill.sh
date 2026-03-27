#!/bin/bash

set -e

echo "🦞 IMA Skill 手动安装脚本"
echo ""

# 配置
SKILL_NAME="ima-skills"
SKILL_DIR="$HOME/.openclaw/skills/ima"
BACKUP_DIR="$HOME/.openclaw/skills/ima.backup.$(date +%Y%m%d_%H%M%S)"

echo "📋 安装配置:"
echo "  技能名称：$SKILL_NAME"
echo "  安装目录：$SKILL_DIR"
echo ""

# 1. 备份现有技能（如果有）
if [ -d "$SKILL_DIR" ]; then
    echo "⚠️  发现现有技能目录，备份中..."
    cp -r "$SKILL_DIR" "$BACKUP_DIR"
    echo "✅ 已备份到：$BACKUP_DIR"
fi

# 2. 创建技能目录
echo ""
echo "📁 创建技能目录..."
mkdir -p "$SKILL_DIR"

# 3. 创建 SKILL.md
echo ""
echo "📝 创建 SKILL.md..."
cat > "$SKILL_DIR/SKILL.md" << 'SKILL_EOF'
# IMA Knowledge Base Skill

腾讯 IMA 知识库集成技能，支持读取和写入 IMA 笔记与知识库。

## 功能

- ✅ 读取笔记内容
- ✅ 读取笔记列表与内容
- ✅ 写入笔记（新建或追加）
- ✅ 检索笔记
- ✅ 检索知识库
- ✅ 导入知识库内容

## 配置

### 环境变量

```ini
# IMA API Key（从 https://ima.qq.com/agent-interface 获取）
IMA_API_KEY=your_api_key_here

# IMA Base URL（可选）
IMA_BASE_URL=https://ima.qq.com/api/v1
```

### OpenClaw 配置

编辑 `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "entries": {
      "ima": {
        "apiKey": "your_api_key_here"
      }
    }
  }
}
```

## 使用方式

### 1. 记录笔记

```
帮我记下，南头这家咖啡店拿铁很好喝，露台 view 绝佳，但周末人特别多。
```

### 2. 查询笔记

```
老板突然问去年我们和腾飞供应商合作细节，帮我找下当时记录的。
```

### 3. 整理知识库

```
整理提炼这篇报告，生成「投资笔记」，并导入个人知识库的"行业研究"文件夹。
```

## 获取 API Key

1. 访问：https://ima.qq.com/agent-interface
2. 安装 IMA 技能
3. 获取 API Key
4. 配置到环境变量或 OpenClaw 配置

## 注意事项

- API Key 请妥善保管，不要泄露
- 敏感数据建议本地存储
- 需要网络连接才能访问 IMA 服务

## 参考资料

- IMA 官网：https://ima.qq.com/
- API 文档：https://ima.qq.com/agent-interface
- GitHub: https://github.com/Tencent/WeKnora (开源替代方案)
SKILL_EOF

echo "✅ SKILL.md 创建完成"

# 4. 创建 index.js
echo ""
echo "📝 创建 index.js..."
cat > "$SKILL_DIR/index.js" << 'INDEX_EOF'
/**
 * IMA Knowledge Base Skill
 * 腾讯 IMA 知识库集成
 */

const axios = require('axios');

class IMASkill {
  constructor(config) {
    this.apiKey = config.apiKey || process.env.IMA_API_KEY;
    this.baseUrl = config.baseUrl || process.env.IMA_BASE_URL || 'https://ima.qq.com/api/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️  IMA_API_KEY not configured');
    }
  }

  /**
   * 读取笔记列表
   */
  async getNotes(options = {}) {
    const response = await axios.get(`${this.baseUrl}/notes`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      params: options
    });
    return response.data;
  }

  /**
   * 读取笔记内容
   */
  async getNote(noteId) {
    const response = await axios.get(`${this.baseUrl}/notes/${noteId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.data;
  }

  /**
   * 写入笔记
   */
  async createNote(title, content, folderId) {
    const response = await axios.post(`${this.baseUrl}/notes`, {
      title,
      content,
      folderId
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  /**
   * 检索笔记
   */
  async searchNotes(query, options = {}) {
    const response = await axios.post(`${this.baseUrl}/notes/search`, {
      query,
      ...options
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  /**
   * 获取知识库列表
   */
  async getKnowledgeBases() {
    const response = await axios.get(`${this.baseUrl}/knowledge-bases`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.data;
  }

  /**
   * 检索知识库
   */
  async searchKnowledgeBase(knowledgeBaseId, query) {
    const response = await axios.post(`${this.baseUrl}/knowledge-bases/${knowledgeBaseId}/search`, {
      query
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  /**
   * 导入内容到知识库
   */
  async importToKnowledgeBase(knowledgeBaseId, content, title) {
    const response = await axios.post(`${this.baseUrl}/knowledge-bases/${knowledgeBaseId}/import`, {
      title,
      content
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
}

module.exports = IMASkill;
INDEX_EOF

echo "✅ index.js 创建完成"

# 5. 创建 package.json
echo ""
echo "📝 创建 package.json..."
cat > "$SKILL_DIR/package.json" << 'PACKAGE_EOF'
{
  "name": "ima-skills",
  "version": "1.0.0",
  "description": "腾讯 IMA 知识库集成技能",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "openclaw",
    "skill",
    "ima",
    "knowledge-base",
    "tencent"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
PACKAGE_EOF

echo "✅ package.json 创建完成"

# 6. 创建 .env.example
echo ""
echo "📝 创建 .env.example..."
cat > "$SKILL_DIR/.env.example" << 'ENV_EOF'
# IMA API Key
# 从 https://ima.qq.com/agent-interface 获取
IMA_API_KEY=your_api_key_here

# IMA Base URL (可选)
IMA_BASE_URL=https://ima.qq.com/api/v1
ENV_EOF

echo "✅ .env.example 创建完成"

# 7. 安装依赖
echo ""
echo "📦 安装依赖..."
cd "$SKILL_DIR"
npm install 2>&1 | tail -5

# 8. 配置 OpenClaw
echo ""
echo "⚙️  配置 OpenClaw..."

# 备份配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d_%H%M%S)

# 添加 IMA skill 配置
python3 << PYTHON_EOF
import json

# 读取配置
with open('$HOME/.openclaw/openclaw.json', 'r') as f:
    config = json.load(f)

# 添加 IMA skill
if 'skills' not in config:
    config['skills'] = {}
if 'entries' not in config['skills']:
    config['skills']['entries'] = {}

config['skills']['entries']['ima'] = {
    'apiKey': 'your_api_key_here'
}

# 保存配置
with open('$HOME/.openclaw/openclaw.json', 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print('✅ OpenClaw 配置已更新')
PYTHON_EOF

# 9. 创建 README
echo ""
echo "📝 创建 README.md..."
cat > "$SKILL_DIR/README.md" << 'README_EOF'
# IMA Skill - 腾讯 IMA 知识库集成

## 安装

自动安装脚本已执行完成。

## 配置

### 1. 获取 API Key

访问：https://ima.qq.com/agent-interface

1. 安装 IMA 技能
2. 获取 API Key
3. 复制 API Key

### 2. 配置 API Key

编辑 `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "entries": {
      "ima": {
        "apiKey": "你的 API Key"
      }
    }
  }
}
```

或者创建环境变量：

```bash
export IMA_API_KEY=你的 API Key
```

### 3. 重启 OpenClaw

```bash
openclaw gateway restart
```

## 使用示例

### 记录笔记

```
帮我记下，南头这家咖啡店拿铁很好喝，露台 view 绝佳，但周末人特别多。
```

### 查询笔记

```
帮我找下之前记录的关于咖啡店的内容。
```

### 整理知识库

```
整理提炼这篇报告，生成「投资笔记」，并导入个人知识库的"行业研究"文件夹。
```

## 故障排除

### 问题：API Key 无效

**解决**：
1. 确认 API Key 正确复制
2. 确认 API Key 未过期
3. 重新获取 API Key

### 问题：网络连接失败

**解决**：
1. 检查网络连接
2. 确认 IMA 服务正常
3. 检查防火墙设置

## 参考资料

- IMA 官网：https://ima.qq.com/
- API 文档：https://ima.qq.com/agent-interface
- WeKnora（开源替代）：https://github.com/Tencent/WeKnora
README_EOF

echo "✅ README.md 创建完成"

# 10. 完成
echo ""
echo "=========================================="
echo "🎉 IMA Skill 安装完成！"
echo "=========================================="
echo ""
echo "📋 下一步操作："
echo ""
echo "1. 获取 API Key"
echo "   访问：https://ima.qq.com/agent-interface"
echo ""
echo "2. 配置 API Key"
echo "   编辑：~/.openclaw/openclaw.json"
echo "   将 'your_api_key_here' 替换为你的真实 API Key"
echo ""
echo "3. 重启 OpenClaw"
echo "   openclaw gateway restart"
echo ""
echo "4. 测试功能"
echo "   对 OpenClaw 说：'帮我记下...'"
echo ""
echo "=========================================="
echo ""
