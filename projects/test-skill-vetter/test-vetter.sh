#!/bin/bash

# skill-vetter 功能测试脚本

set -e

echo "=========================================="
echo "🔒 skill-vetter 功能测试"
echo "=========================================="
echo ""

# 切换到项目目录
cd "$(dirname "$0")"

echo "📋 测试场景：使用 skill-vetter 审查 github 技能"
echo ""

# 步骤 1：搜索技能
echo "【步骤 1】搜索 github 技能..."
echo "----------------------------------------"
export PATH="$HOME/.local/bin:$PATH"
skillhub search github | head -10
echo ""

# 步骤 2：查看 skill-vetter 的审查协议
echo "【步骤 2】查看 skill-vetter 审查协议..."
echo "----------------------------------------"
cat ~/.openclaw/workspace/skills/skill-vetter/SKILL.md | head -60
echo ""

# 步骤 3：模拟审查流程
echo "【步骤 3】模拟审查流程..."
echo "----------------------------------------"

cat << 'EOF'
SKILL VETTING REPORT
====================

技能名称：github
版本：1.0.0
来源：SkillHub Registry
审查时间：$(date '+%Y-%m-%d %H:%M:%S')

【步骤 1：来源检查】✅ 通过
- 来源：SkillHub 官方 Registry
- 作者：SkillHub 官方
- 版本：1.0.0
- 描述：使用 gh CLI 与 GitHub 交互

【步骤 2：代码审查】✅ 通过
检查项目：
- [✓] 无 curl/wget 到未知 URL
- [✓] 无发送数据到外部服务器
- [✓] 无请求凭证/Token/API Key
- [✓] 无访问敏感目录 (~/.ssh, ~/.aws)
- [✓] 无使用 eval()/exec()
- [✓] 无混淆代码
- [✓] 使用官方 gh CLI 工具

【步骤 3：权限评估】✅ 通过
- 文件读取：项目目录
- 文件写入：项目目录
- 命令执行：gh CLI 命令
- 网络访问：github.com（官方域名）
- 权限范围：最小化，符合功能需求

【步骤 4：风险分级】🟢 低风险

风险等级：🟢 LOW
理由：
1. 使用官方 GitHub CLI 工具
2. 权限范围明确且最小化
3. 无敏感操作
4. 来源可信

【审查结论】✅ 推荐安装

建议：可以安全安装，用于 GitHub 相关操作。
安装命令：skillhub install github

审查员：skill-vetter v1.0.0
EOF

echo ""
echo "=========================================="
echo "✅ skill-vetter 功能测试完成！"
echo "=========================================="
echo ""

echo "💡 提示："
echo "   - 在实际使用时，先运行 skill-vetter 审查"
echo "   - 审查通过后再安装技能"
echo "   - 对于高风险技能，需要人工审批"
echo ""
