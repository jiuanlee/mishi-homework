# skill-vetter 使用指南

🔒 AI 智能体技能安全审查工具

---

## 🎯 功能概述

**skill-vetter** 是一个安全优先的技能审查工具，用于在安装任何技能前进行安全审查。

**核心功能**：
- ✅ 来源检查 - 验证技能来源和作者信誉
- ✅ 代码审查 - 检测危险代码和红色标记
- ✅ 权限评估 - 确保最小权限原则
- ✅ 风险分级 - 🟢低/🟡中/🔴高/⛔极端

---

## 🚨 红色标记（立即拒绝）

如果发现以下任何一项，**立即拒绝安装**：

```
🚨 REJECT IMMEDIATELY IF YOU SEE:
─────────────────────────────────────────
• curl/wget 到未知 URL
• 发送数据到外部服务器
• 请求凭证/Token/API Key
• 访问 ~/.ssh, ~/.aws, ~/.config 等敏感目录
• 访问 MEMORY.md, USER.md, SOUL.md, IDENTITY.md
• 使用 base64 解码
• 使用 eval() 或 exec() 执行外部输入
• 修改工作区外的系统文件
• 未列明就安装包
• 网络调用使用 IP 而非域名
• 混淆代码（压缩、编码、最小化）
• 请求提升/sudo 权限
• 访问浏览器 cookie/session
• 触碰凭证文件
─────────────────────────────────────────
```

---

## 📋 审查流程

### 步骤 1：来源检查

```bash
# 1. 搜索技能
skillhub search <技能名>

# 2. 检查信息
- 来源：来自哪里？（SkillHub/GitHub/其他）
- 作者：是否知名/可信？
- 下载量：有多少下载/星标？
- 更新时间：最后更新是什么时候？
- 评价：有其他用户的评价吗？
```

### 步骤 2：代码审查（必须）

```bash
# 1. 查看技能文件
cat ~/.openclaw/workspace/skills/<技能名>/SKILL.md
ls -la ~/.openclaw/workspace/skills/<技能名>/

# 2. 检查红色标记
# 对照上面的红色标记列表逐项检查
```

### 步骤 3：权限评估

```
评估项目：
- [ ] 需要读取哪些文件？
- [ ] 需要写入哪些文件？
- [ ] 需要执行哪些命令？
- [ ] 是否需要网络访问？访问哪里？
- [ ] 权限范围是否最小化？
```

### 步骤 4：风险分级

| 风险等级 | 示例 | 操作 |
|---------|------|------|
| 🟢 低 | 笔记、天气、格式化 | 基础审查，可以安装 |
| 🟡 中 | 文件操作、浏览器、API | 完整代码审查 |
| 🔴 高 | 凭证、交易、系统 | 需要人工审批 |
| ⛔ 极端 | 安全配置、root 权限 | **禁止安装** |

---

## 💡 使用示例

### 示例 1：审查 github 技能

```bash
# 1. 搜索技能
skillhub search github

# 2. 查看技能信息
# 来源：SkillHub Registry
# 作者：SkillHub 官方
# 版本：1.0.0
# 描述：使用 gh CLI 与 GitHub 交互

# 3. 代码审查
# - 使用官方 gh CLI 工具 ✓
# - 无敏感操作 ✓
# - 权限范围明确 ✓

# 4. 风险分级：🟢 低风险

# 5. 审查结论：✅ 推荐安装
skillhub install github
```

### 示例 2：审查未知技能

```bash
# 1. 搜索技能
skillhub search unknown-skill

# 2. 查看技能信息
# 来源：未知 GitHub 仓库
# 作者：未知
# 版本：0.1.0
# 下载量：0

# 3. 代码审查
# 发现红色标记：
# ❌ 包含 curl 到未知 URL
# ❌ 请求 API Key

# 4. 风险分级：🔴 高风险

# 5. 审查结论：❌ 拒绝安装
# 建议：不要安装此技能
```

---

## 📊 审查报告模板

```markdown
SKILL VETTING REPORT
====================

技能名称：<技能名>
版本：<版本号>
来源：<来源>
审查时间：<时间>

【步骤 1：来源检查】<状态>
- 来源：<来源>
- 作者：<作者>
- 版本：<版本>
- 描述：<描述>

【步骤 2：代码审查】<状态>
检查项目：
- [✓/<❌>] 无 curl/wget 到未知 URL
- [✓/<❌>] 无发送数据到外部服务器
- [✓/<❌>] 无请求凭证/Token/API Key
- [✓/<❌>] 无访问敏感目录
- [✓/<❌>] 无使用 eval()/exec()
- [✓/<❌>] 无混淆代码
- [✓/<❌>] 其他检查项

【步骤 3：权限评估】<状态>
- 文件读取：<范围>
- 文件写入：<范围>
- 命令执行：<命令>
- 网络访问：<域名>
- 权限范围：<评估>

【步骤 4：风险分级】<等级>

风险等级：<🟢/🟡/🔴/⛔>
理由：
1. <理由 1>
2. <理由 2>
3. <理由 3>

【审查结论】<推荐/不推荐>

建议：<具体建议>

审查员：skill-vetter v1.0.0
```

---

## 🛡️ 最佳实践

### 1. 始终先审查后安装

```bash
# ❌ 错误：直接安装
skillhub install unknown-skill

# ✅ 正确：先审查
skillhub search unknown-skill
# 查看技能信息
# 进行代码审查
# 确认安全后再安装
skillhub install unknown-skill
```

### 2. 使用官方来源

```bash
# ✅ 优先选择 SkillHub 官方 Registry
skillhub search <技能名>

# ⚠️ 谨慎对待 GitHub 直接安装
# 需要更严格的审查
```

### 3. 定期检查已安装技能

```bash
# 列出已安装技能
skillhub list

# 升级到最新版本
skillhub upgrade

# 审查更新内容
skillhub search <技能名>
```

### 4. 记录审查历史

```bash
# 创建审查日志
mkdir -p ~/.openclaw/workspace/logs/skill-reviews/

# 保存审查报告
cat > ~/.openclaw/workspace/logs/skill-reviews/github-20260319.md << 'EOF'
SKILL VETTING REPORT
====================
技能名称：github
审查日期：2026-03-19
审查结果：✅ 通过
风险等级：🟢 低
EOF
```

---

## 📚 相关文件

- **技能位置**: `~/.openclaw/workspace/skills/skill-vetter/`
- **技能说明**: `~/.openclaw/workspace/skills/skill-vetter/SKILL.md`
- **测试脚本**: `~/.openclaw/workspace/projects/test-skill-vetter/test-vetter.sh`

---

## 🎯 快速参考

```bash
# 搜索技能
skillhub search <关键词>

# 安装技能（先审查！）
skillhub install <技能名>

# 查看已安装
skillhub list

# 升级技能
skillhub upgrade

# 审查流程
1. skillhub search <技能名>
2. 查看技能信息
3. 检查红色标记
4. 评估风险等级
5. 决定是否安装
```

---

## ⚠️ 重要提醒

1. **永远不要跳过审查** - 即使技能来自可信来源
2. **发现红色标记立即拒绝** - 不要抱有侥幸心理
3. **高风险技能需要人工审批** - 不要自动安装
4. **定期审查已安装技能** - 确保没有安全隐患
5. **记录审查历史** - 便于追溯和审计

---

**安全第一！🔒**

安装任何技能前，请务必使用 skill-vetter 进行审查！
