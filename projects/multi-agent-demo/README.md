# 多 Agent 协作开发系统

让多个专业 Agent 协作完成开发任务！

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd ~/.openclaw/workspace/projects/multi-agent-demo

# 安装 Python 依赖
pip install pyyaml
```

### 2. 运行演示

```bash
# 运行多 Agent 协作演示
python src/coordinator.py
```

### 3. 查看报告

报告自动保存到：
```
~/.openclaw/workspace/projects/multi-agent-demo/reports/
```

---

## 📋 项目结构

```
multi-agent-demo/
├── agents/
│   └── config.yaml          # Agent 配置文件
├── src/
│   └── coordinator.py       # 协调器实现
├── reports/                  # 报告保存目录
├── logs/                     # 日志目录
└── README.md                 # 使用说明
```

---

## 🎯 核心概念

### 协调 Agent（Little Bee）

负责接收用户需求，协调各个专业 Agent 完成任务。

**职责**：
- 分析任务需求
- 选择合适的 Agent
- 调用 Agent 执行
- 汇总结果返回

### 专业 Agent

| Agent | 职责 | 输出 |
|-------|------|------|
| **规划 Agent** | 分析需求，制定计划 | 规划报告 |
| **编码 Agent** | 编写高质量代码 | 源代码 |
| **测试 Agent** | 生成测试并运行 | 测试报告 |
| **审查 Agent** | 代码审查和评估 | 审查报告 |

---

## 🔧 配置说明

### 配置文件：`agents/config.yaml`

```yaml
# 协调 Agent 配置
coordinator:
  name: "Little Bee"
  system_prompt: |
    你是协调 Agent Little Bee...

# 专业 Agent 配置
agents:
  planner:
    enabled: true
    name: "规划 Agent"
    system_prompt: |
      你是资深技术规划师...
    max_tokens: 4000
    timeout: 600
  
  coder:
    enabled: true
    # ...
```

### 执行配置

```yaml
execution:
  parallel: false        # 是否并行执行
  timeout: 3600          # 超时时间（秒）
  retries: 1             # 重试次数
  continue_on_failure: true  # 失败后是否继续
```

### 输出配置

```yaml
output:
  save_reports: true     # 保存报告
  report_dir: ./reports/ # 报告目录
  verbose: true          # 详细输出
  format: markdown       # 报告格式
```

---

## 💡 使用示例

### 示例 1：开发新功能

```python
from src.coordinator import MultiAgentCoordinator

# 创建协调器
coordinator = MultiAgentCoordinator()

# 初始化 Agent
coordinator.initialize_agents()

# 执行任务
import asyncio

task = """
开发一个用户注册功能

要求：
- 邮箱验证
- 密码强度检查
- 用户信息存储
"""

report = asyncio.run(coordinator.execute_task(task))

# 查看报告
print(report.summary)

# 保存报告
report_path = coordinator.save_report()
print(f"报告已保存：{report_path}")
```

### 示例 2：修复 Bug

```python
task = """
修复用户无法登出的问题

问题描述：
用户点击登出按钮后，Session 未清除，仍可访问受保护页面。

相关文件：
- src/auth/login.py
- src/middleware/auth.py
"""

report = asyncio.run(coordinator.execute_task(task))
```

### 示例 3：代码重构

```python
task = """
重构用户管理模块

当前问题：
- 代码重复严重
- 函数过长（>100 行）
- 缺少注释

要求：
1. 规划 Agent 制定重构计划
2. 编码 Agent 执行重构
3. 测试 Agent 确保功能正常
4. 审查 Agent 评估重构质量
"""

report = asyncio.run(coordinator.execute_task(task))
```

---

## 📊 报告格式

### 规划报告

```markdown
## 📋 规划报告

### 需求分析
[需求理解和拆解]

### 任务列表
1. [ ] 任务 1 - 优先级：高 - 预估：2h
2. [ ] 任务 2 - 优先级：中 - 预估：1h

### 技术选型
- 框架：XXX
- 数据库：XXX

### 风险评估
- 风险 1：[描述] - 缓解措施：[方案]
```

### 编码报告

```markdown
## 💻 编码报告

### 文件列表
- `src/main.py` - 主逻辑
- `src/utils.py` - 工具函数

### 代码实现
```python
# 代码内容
```

### 实现说明
[关键实现点说明]
```

### 测试报告

```markdown
## ✅ 测试报告

### 测试结果
- 总计：10 个测试用例
- 通过：10 个
- 失败：0 个
- 覆盖率：95%
```

### 审查报告

```markdown
## 🔍 审查报告

### 代码质量评分
- 规范性：⭐⭐⭐⭐⭐
- 可维护性：⭐⭐⭐⭐
- 安全性：⭐⭐⭐⭐⭐

### 发现问题
1. ⚠️ 问题 1 - 严重程度：中
```

---

## 🔧 高级用法

### 自定义 Agent

在配置文件中添加新的 Agent：

```yaml
agents:
  security:
    enabled: true
    name: "安全 Agent"
    system_prompt: |
      你是安全专家，负责代码安全审计。
      检查 SQL 注入、XSS、CSRF 等安全问题。
    max_tokens: 4000
    timeout: 600
```

### 并行执行（实验性）

```yaml
execution:
  parallel: true  # 启用并行执行
```

注意：并行执行可能导致上下文冲突，谨慎使用。

### 自定义超时

```yaml
agents:
  coder:
    timeout: 1800  # 编码 Agent 30 分钟超时
```

---

## 📝 日志查看

```bash
# 查看实时日志
tail -f logs/multi-agent.log

# 查看错误日志
grep ERROR logs/multi-agent.log

# 查看特定 Agent 日志
grep "规划 Agent" logs/multi-agent.log
```

---

## ❓ 常见问题

### Q1: 如何跳过某个 Agent？

在配置文件中禁用：

```yaml
agents:
  reviewer:
    enabled: false  # 禁用审查 Agent
```

### Q2: 如何修改 Agent 的系统提示词？

编辑配置文件：

```yaml
agents:
  coder:
    system_prompt: |
      你是 Python 专家，擅长编写高性能的 Python 代码。
      必须使用类型注解，遵循 PEP 8 规范。
```

### Q3: 如何查看历史报告？

```bash
# 列出所有报告
ls -lt reports/

# 查看特定报告
cat reports/report-20260318-195300.md
```

### Q4: 如何集成真实的 LLM API？

修改 `coordinator.py` 中的 `_simulate_agent_response` 方法：

```python
async def _simulate_agent_response(self, agent_id: str, prompt: str) -> str:
    # 替换为真实的 LLM API 调用
    import openai
    
    agent = self.agents[agent_id]
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": agent['system_prompt']},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content
```

---

## 🎯 最佳实践

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
```

---

## 📚 扩展阅读

- [OpenClaw 官方文档](https://docs.openclaw.ai/)
- [Multi-Agent 协作最佳实践](https://docs.openclaw.ai/skills/multi-agent)
- [ClawHub Skills 市场](https://clawhub.com/)

---

## 🤝 贡献代码

欢迎提交 PR：
- Bug 修复
- 新功能
- 文档改进

---

## 📄 许可证

MIT License

---

**祝你使用愉快！** 🎉
