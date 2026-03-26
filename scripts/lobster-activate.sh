#!/bin/bash
# 多龙虾协作系统 - 快速启动脚本

echo "🦞 多龙虾协作系统配置检查..."

# 检查配置文件是否存在
PERSONAS_DIR="$HOME/.openclaw/workspace/personas"
SKILLS_DIR="$HOME/.openclaw/workspace/skills"

if [ ! -f "$PERSONAS_DIR/manager-lobster.md" ]; then
    echo "❌ 监工龙虾人格文件不存在"
    exit 1
fi

if [ ! -f "$PERSONAS_DIR/worker-lobster.md" ]; then
    echo "❌ 工作龙虾人格文件不存在"
    exit 1
fi

if [ ! -f "$SKILLS_DIR/multi-lobster/SKILL.md" ]; then
    echo "❌ 多龙虾协作技能文件不存在"
    exit 1
fi

echo "✅ 所有配置文件已就绪"
echo ""
echo "📋 使用说明："
echo ""
echo "1. 激活监工龙虾模式（当前会话）："
echo "   直接说：'启动监工龙虾模式' 或 '我要分配一个任务'"
echo ""
echo "2. 分配任务给监工："
echo "   例如：'帮我做一个 2026 年 AI 助手发展趋势的调研报告'"
echo ""
echo "3. 查看子 Agent 状态："
echo "   说：'查看任务进度' 或 'subagents list'"
echo ""
echo "4. 系统会自动："
echo "   - 监工分解任务"
echo "   - 创建多个工作龙虾 subagent"
echo "   - 跟踪进度"
echo "   - 全部完成后向你汇报"
echo ""
echo "🦞 小龙虾团队已就绪，等待你的任务！"
