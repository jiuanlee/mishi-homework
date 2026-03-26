# 多 Agent 协作开发 Skill

让多个专业 Agent 协作完成开发任务！

---

## 🚀 快速开始

### 1. 安装 Skill

```bash
# 无需安装，Skill 已创建
# 路径：~/.openclaw/workspace/skills/multi-agent-dev/
```

### 2. 启用 Skill

在对话中告诉 Little Bee：

```
启用 multi-agent-dev Skill
```

### 3. 开始协作

```
启动多 Agent 协作

任务：开发一个用户登录功能

要求：
- 支持邮箱和密码登录
- 密码强度检查
- 登录失败次数限制

请按流程协调各个 Agent 完成。
```

---

## 📋 使用示例

### 示例 1：开发新功能

```
启动多 Agent 协作

任务：开发一个待办事项管理功能

功能要求：
1. 添加待办事项
2. 删除待办事项
3. 标记完成
4. 按优先级排序
5. 数据持久化到本地文件

请按标准流程执行：规划 → 编码 → 测试 → 审查
```

### 示例 2：修复 Bug

```
启动多 Agent 协作

任务：修复用户无法登出的问题

问题描述：
用户点击登出按钮后，Session 未清除，仍可访问受保护页面。

相关文件：
- src/auth/login.py
- src/middleware/auth.py

要求：
1. 编码 Agent 分析问题并修复
2. 测试 Agent 验证修复
3. 审查 Agent 审查代码
```

### 示例 3：代码重构

```
启动多 Agent 协作

任务：重构用户管理模块

当前问题：
- 代码重复严重
- 函数过长（超过 100 行）
- 缺少类型注解
- 单元测试覆盖率低（<50%）

要求：
1. 规划 Agent 制定重构计划
2. 编码 Agent 执行重构
3. 测试 Agent 确保功能正常
4. 审查 Agent 评估重构质量
```

### 示例 4：快速开发（跳过审查）

```
启动多 Agent 协作

任务：快速开发一个原型功能

要求：
- 跳过审查 Agent（时间紧急）
- 规划 Agent 简化计划
- 编码 Agent 专注核心功能
- 测试 Agent 只测试主流程

时间要求：1 小时内完成
```

---

## 🎯 Agent 角色说明

### 规划 Agent

**职责**：
- 分析用户需求
- 拆解为可执行任务
- 技术选型建议
- 风险评估

**输出**：
- 需求分析文档
- 任务列表（含优先级）
- 技术栈建议
- 风险评估报告

---

### 编码 Agent

**职责**：
- 根据规划编写代码
- 遵循代码规范
- 添加注释和文档
- 确保代码可维护

**输出**：
- 源代码文件
- 代码说明文档
- 依赖列表

---

### 测试 Agent

**职责**：
- 设计测试用例
- 编写测试代码
- 运行测试
- 报告测试结果

**输出**：
- 测试用例列表
- 测试代码
- 测试报告（通过率、覆盖率）

---

### 审查 Agent

**职责**：
- 代码质量审查
- 安全检查
- 性能评估
- 提出改进建议

**输出**：
- 审查报告
- 问题列表
- 改进建议

---

## ⚙️ 配置选项

### 启用/禁用 Agent

编辑 `config.yaml`：

```yaml
agents:
  planning:
    enabled: true   # 启用规划 Agent
  coding:
    enabled: true   # 启用编码 Agent
  testing:
    enabled: true   # 启用测试 Agent
  review:
    enabled: false  # 禁用审查 Agent
```

### 调整超时时间

```yaml
execution:
  timeout: 7200  # 2 小时超时
```

### 自定义报告目录

```yaml
output:
  report_dir: ~/projects/reports/
```

---

## 📊 输出报告

所有报告自动保存到：

```
~/.openclaw/workspace/skills/multi-agent-dev/reports/
├── planning-YYYYMMDD-HHMM.md
├── coding-YYYYMMDD-HHMM.md
├── testing-YYYYMMDD-HHMM.md
└── review-YYYYMMDD-HHMM.md
```

### 查看报告

```bash
# 查看最新报告
ls -lt ~/.openclaw/workspace/skills/multi-agent-dev/reports/ | head

# 查看特定报告
cat ~/.openclaw/workspace/skills/multi-agent-dev/reports/planning-20260316-001.md
```

---

## 🔧 高级用法

### 1. 自定义 Agent 系统提示词

编辑 `config.yaml`：

```yaml
agents:
  coding:
    system_prompt: |
      你是 Python 专家，擅长编写高性能的 Python 代码。
      必须使用类型注解，遵循 PEP 8 规范。
```

### 2. 添加新的 Agent 角色

在 `config.yaml` 中添加：

```yaml
agents:
  security:
    enabled: true
    name: "安全 Agent"
    system_prompt: |
      你是安全专家，负责代码安全审计。
      检查 SQL 注入、XSS、CSRF 等安全问题。
```

### 3. 并行执行（实验性）

```yaml
execution:
  parallel: true
```

注意：并行执行可能导致上下文冲突，谨慎使用。

---

## ❓ 常见问题

### Q1: 如何跳过某个 Agent？

在任务描述中说明：

```
启动多 Agent 协作

任务：[任务描述]

跳过：审查 Agent
```

### Q2: 如何指定特定 Agent？

```
启动多 Agent 协作

任务：[任务描述]

只启用：规划 Agent, 编码 Agent
```

### Q3: 如何查看执行日志？

```bash
cat ~/.openclaw/workspace/skills/multi-agent-dev/logs/multi-agent.log
```

### Q4: 如何重置配置？

```bash
# 删除配置文件
rm ~/.openclaw/workspace/skills/multi-agent-dev/config.yaml

# 重新创建（使用默认配置）
# 重启 OpenClaw
openclaw gateway restart
```

### Q5: 如何更新 Skill？

```bash
# 检查更新
openclaw skills info multi-agent-dev

# 重新加载 Skill
openclaw skills reload multi-agent-dev
```

---

## 📝 最佳实践

### 1. 明确任务描述

❌ 不好：
```
开发一个功能
```

✅ 好：
```
开发一个用户注册功能，包含：
- 邮箱验证（发送验证邮件）
- 密码强度检查（至少 8 位，包含大小写和数字）
- 用户信息存储到 PostgreSQL 的 users 表
- 发送欢迎邮件
```

### 2. 提供充分上下文

❌ 不好：
```
修复这个 bug
```

✅ 好：
```
修复 bug：用户登录后，刷新页面会退出登录

上下文：
- 使用 JWT Token 认证
- Token 存储在 localStorage
- 后端验证中间件已实现

相关文件：
- src/auth/login.py
- src/middleware/auth.py
- frontend/src/auth.js
```

### 3. 指定输出要求

❌ 不好：
```
写代码
```

✅ 好：
```
编写代码，要求：
- 遵循 PEP 8 规范
- 添加类型注解
- 函数必须有 docstring
- 单元测试覆盖率 > 80%
- 添加错误处理
```

### 4. 合理设置超时

根据任务复杂度设置：

```yaml
execution:
  timeout: 3600   # 简单任务：1 小时
  timeout: 7200   # 中等任务：2 小时
  timeout: 14400  # 复杂任务：4 小时
```

---

## 🎯 下一步

### 学习更多

- [OpenClaw 官方文档](https://docs.openclaw.ai/)
- [ClawHub Skills 市场](https://clawhub.com/)
- [多 Agent 协作最佳实践](https://docs.openclaw.ai/skills/multi-agent)

### 分享你的用法

在评论区分享：
- 你的使用场景
- 遇到的问题
- 改进建议

### 贡献代码

欢迎提交 PR：
- Bug 修复
- 新功能
- 文档改进

---

## 📄 许可证

MIT License

---

**祝你使用愉快！** 🎉
