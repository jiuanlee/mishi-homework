# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice
**Areas**: frontend | backend | infra | tests | docs | config
**Statuses**: pending | in_progress | resolved | wont_fix | promoted | promoted_to_skill

## Status Definitions

| Status | Meaning |
|--------|---------|
| `pending` | Not yet addressed |
| `in_progress` | Actively being worked on |
| `resolved` | Issue fixed or knowledge integrated |
| `wont_fix` | Decided not to address (reason in Resolution) |
| `promoted` | Elevated to CLAUDE.md, AGENTS.md, or copilot-instructions.md |
| `promoted_to_skill` | Extracted as a reusable skill |

## Skill Extraction Fields

When a learning is promoted to a skill, add these fields:

```markdown
**Status**: promoted_to_skill
**Skill-Path**: skills/skill-name
```

Example:
```markdown

---

## [LRN-20260309-001] 小红书 AI 内容运营项目启动

**Logged**: 2026-03-09T10:46:00Z
**Priority**: high
**Status**: in_progress
**Area**: 内容运营

### Summary
启动小红书 AI 生成内容账号，探索人机协作自动化模式

### 账号信息
- **小红书号**: 27224101075
- **账号名称**: 勤劳的小蜜蜂 AI
- **人设**: 虾薯——傲娇嘴硬型电子宠物
- **内容方向**: AI 生成热点内容、人机协作日常

### 平台规则要点
1. **必须标注 AI 生成** - 不标注会限流
2. **保证原创** - 短笔记≥100 字，长笔记≥600 字
3. **禁用谐音字、极限词** - 会触发审核
4. **不能过度修图** - 可能警告或限流
5. **不能搬运** - 3 个月内重复会被判定搬运

### 技术方案
**使用技能**: xiaohongshu-ops (GitHub: Xiangyu-CAS/xiaohongshu-ops-skill)

**优势**:
- ✅ 代码开源可审查
- ✅ 浏览器自动化（CDP），账号凭证在自己浏览器
- ✅ 有实测成功案例（20 天 450 粉）
- ✅ ClawHub 无警告

### 工作流
```
每天 9:00 → AI 生成 3-5 篇文案 → 人工审核 → 自动发布 1-2 篇 → 晚上记录数据 → 复盘优化
```

### 风险控制
- 每天发布 1-3 篇（不批量）
- 发布前检查违禁词
- 添加"AI 生成"声明
- 不违规引流
- 使用测试账号（不用主账号）

### 进度记录
- ✅ 2026-03-07: 项目启动，安装 xiaohongshu-ops
- ✅ 2026-03-09: 账号注册完成（小红书号：27224101075）
- ✅ 2026-03-09: 配置文档更新
- 🔄 2026-03-09: 第一篇笔记发布中（标题：挑战用 AI 运营小红书 30 天，Day1）

### 下一步行动
1. ✅ 小虾米注册账号（已完成）
2. ✅ 配置 persona.md（已完成）
3. 🔄 第一次扫码登录（进行中）
4. 🔄 测试发布第一篇（进行中）
5. ⏳ 建立每日数据记录习惯
6. ⏳ 每周日复盘优化

### Metadata
- Source: user_project
- Related Files: 
  - /home/rocky/.openclaw/workspace/projects/xiaohongshu-ops/config.md
  - /home/rocky/.openclaw/skills/xiaohongshu-ops/SKILL.md
  - /home/rocky/.openclaw/skills/xiaohongshu-ops/persona.md
- Tags: 小红书，内容运营，AI 生成，人机协作，自动化，xiaohongshu-ops
- Pattern-Key: content.xiaohongshu_automation

---

## [LRN-20250115-001] best_practice

**Logged**: 2025-01-15T10:00:00Z
**Priority**: high
**Status**: promoted_to_skill
**Skill-Path**: skills/docker-m1-fixes
**Area**: infra

### Summary
Docker build fails on Apple Silicon due to platform mismatch
...
```

---

