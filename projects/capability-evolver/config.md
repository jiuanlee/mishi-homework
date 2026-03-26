# capability-evolver 安装配置文档

**项目**: capability-evolver (AI Agent 自我进化引擎)  
**GitHub**: https://github.com/EvoMap/evolver  
**Stars**: 1.2k+  
**License**: MIT  
**状态**: 待安装

---

## 一、项目说明

### 这是什么？

**capability-evolver** 是一个基于 GEP（Genome Evolution Protocol）协议的 AI Agent 自我进化引擎。

**核心功能**:
- 分析日志和历史，提取错误模式
- 生成进化改进建议（prompt）
- 记录每次进化的审计日志
- 支持人工审核模式（--review）

### 为什么选这个？

| 优势 | 说明 |
|------|------|
| ✅ 代码 100% 开源 | 纯 JavaScript，无二进制文件 |
| ✅ 安全模型清晰 | 有明确的执行边界和限制 |
| ✅ 社区活跃 | 1.2k stars，持续更新 |
| ✅ MIT 协议 | 可自由使用、审查、修改 |
| ✅ 人工审核模式 | --review 模式需确认后才执行 |

---

## 二、安装步骤（待执行）

### 方法 1：ClawHub 安装（推荐）

```bash
clawhub install capability-evolver
```

### 方法 2：Git 克隆

```bash
git clone https://github.com/EvoMap/evolver.git /home/rocky/.openclaw/skills/capability-evolver
```

### 方法 3：下载 ZIP（网络不好时）

```bash
cd /home/rocky/.openclaw/skills
curl -L https://github.com/EvoMap/evolver/archive/refs/heads/main.zip -o evolver.zip
unzip evolver.zip
mv evolver-main capability-evolver
rm evolver.zip
```

---

## 三、配置说明

### 环境变量（可选）

在 `~/.openclaw/.env` 中添加：

```bash
# 进化策略
# balanced: 平衡模式（默认）
# innovate: 创新模式（最大化新功能）
# harden: 稳定模式（专注稳定性）
# repair-only: 仅修复模式（紧急修复）
EVOLVE_STRATEGY=balanced

# 报告工具（可选）
# message: 默认
# feishu-card: 飞书卡片（如果安装了飞书插件）
EVOLVE_REPORT_TOOL=message

# 自动 GitHub Issue 报告（可选）
EVOLVER_AUTO_ISSUE=true
EVOLVER_ISSUE_REPO=autogame-17/capability-evolver
GITHUB_TOKEN=your_token_here
```

### OpenClaw 配置

在 `~/.openclaw/openclaw.json` 中添加：

```json
{
  "plugins": {
    "entries": {
      "capability-evolver": {
        "enabled": true
      }
    }
  }
}
```

---

## 四、使用方式

### 模式 1：人工审核（推荐首次使用）

```bash
cd /home/rocky/.openclaw/skills/capability-evolver
node index.js --review
```

**说明**: 每次进化建议需要人工确认后才执行。

### 模式 2：自动循环（熟悉后使用）

```bash
# 平衡模式
node index.js --loop

# 稳定模式（推荐生产环境）
EVOLVE_STRATEGY=harden node index.js --loop

# 仅修复模式（最保守）
EVOLVE_STRATEGY=repair-only node index.js --loop
```

### 模式 3：生命周期管理

```bash
# 启动后台运行
node src/ops/lifecycle.js start

# 查看状态
node src/ops/lifecycle.js status

# 停止
node src/ops/lifecycle.js stop

# 健康检查
node src/ops/lifecycle.js check
```

---

## 五、安全注意事项

### ✅ 安全特性

| 特性 | 说明 |
|------|------|
| 只读分析 | 读取日志，不直接修改代码 |
| 生成 prompt | 输出改进建议，不直接执行 |
| 审计日志 | 记录每次进化事件 |
| 命令限制 | 只允许 node/npm/npx 前缀 |
| 超时限制 | 验证命令限时 180 秒 |
| 人工审核 | --review 模式需确认 |

### ⚠️ 风险提示

| 风险 | 缓解措施 |
|------|---------|
| 可能生成激进改进建议 | 使用 --review 模式人工审核 |
| 验证命令可能消耗资源 | 设置 CPU 负载阈值 |
| 进化记录可能包含敏感信息 | 定期清理日志，使用脱敏 |
| 可能改变 Agent 行为 | 备份原始配置，使用 git 回滚 |

### 📋 最佳实践

1. **首次使用 --review 模式** - 熟悉后再考虑自动模式
2. **使用 harden 策略** - 生产环境用稳定模式
3. **定期备份配置** - 使用 git 管理变更
4. **审查进化日志** - 定期检查 assets/gep/events.jsonl
5. **使用测试环境** - 先在测试环境验证

---

## 六、文件结构

```
/home/rocky/.openclaw/skills/capability-evolver/
├── index.js              # 主入口
├── SKILL.md              # 技能说明
├── README.md             # 使用文档
├── README.zh-CN.md       # 中文文档
├── package.json          # 依赖配置
├── src/
│   ├── evolve.js         # 进化逻辑
│   ├── gep/
│   │   ├── prompt.js     # GEP prompt 生成
│   │   ├── selector.js   # 基因选择器
│   │   └── solidify.js   # 验证和固化
│   └── ops/
│       └── lifecycle.js  # 生命周期管理
├── assets/gep/
│   ├── genes.json        # 基因库
│   ├── capsules.json     # 胶囊库
│   └── events.jsonl      # 进化事件日志
└── scripts/
    └── ...               # 辅助脚本
```

---

## 七、下一步行动

| 序号 | 事项 | 状态 | 说明 |
|------|------|------|------|
| 1 | 下载代码 | ⏳ 待执行 | 网络不好，明天再试 |
| 2 | 安装依赖 | ⏳ | npm install |
| 3 | 配置环境变量 | ⏳ | 可选 |
| 4 | 首次运行（审核模式） | ⏳ | node index.js --review |
| 5 | 审查进化日志 | ⏳ | assets/gep/events.jsonl |
| 6 | 决定是否启用自动模式 | ⏳ | 根据使用情况 |

---

## 八、相关资源

- **官方网站**: https://evomap.ai
- **GitHub**: https://github.com/EvoMap/evolver
- **中文文档**: https://github.com/EvoMap/evolver/blob/main/README.zh-CN.md
- **ClawHub**: https://clawhub.ai/autogame-17/capability-evolver

---

**创建日期**: 2026-03-07  
**最后更新**: 2026-03-07  
**下次回顾**: 安装完成后
