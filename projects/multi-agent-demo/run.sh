#!/bin/bash

# 多 Agent 协作系统 - 快速运行脚本

set -e

echo "=========================================="
echo "🐝 多 Agent 协作开发系统"
echo "=========================================="
echo ""

# 切换到项目目录
cd "$(dirname "$0")"

echo "📂 项目目录：$(pwd)"
echo ""

# 检查 Python 版本
echo "🐍 检查 Python 环境..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "   Python 版本：$python_version"

# 检查依赖
echo ""
echo "📦 检查依赖..."
if ! python3 -c "import yaml" 2>/dev/null; then
    echo "   安装 pyyaml..."
    pip3 install pyyaml -q
    echo "   ✓ pyyaml 已安装"
else
    echo "   ✓ 依赖已安装"
fi

# 创建必要目录
echo ""
echo "📁 创建目录..."
mkdir -p reports logs
echo "   ✓ reports/ 已创建"
echo "   ✓ logs/ 已创建"

# 运行演示
echo ""
echo "🚀 启动多 Agent 协作..."
echo "=========================================="
echo ""

python3 src/coordinator.py

echo ""
echo "=========================================="
echo "✅ 多 Agent 协作完成！"
echo "=========================================="
echo ""

# 显示最新报告
echo "📊 最新报告："
latest_report=$(ls -t reports/*.md 2>/dev/null | head -1)
if [ -n "$latest_report" ]; then
    echo "   文件：$latest_report"
    echo ""
    echo "📄 查看报告内容："
    echo "----------------------------------------"
    cat "$latest_report"
    echo "----------------------------------------"
else
    echo "   未找到报告文件"
fi

echo ""
echo "💡 提示："
echo "   - 日志文件：logs/multi-agent.log"
echo "   - 报告目录：reports/"
echo "   - 配置文件：agents/config.yaml"
echo ""
