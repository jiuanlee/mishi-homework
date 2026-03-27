#!/bin/bash

set -e

echo "🔑 AI API Key 自动配置脚本"
echo ""
echo "支持的大模型平台："
echo "  1. 阿里云百炼（通义千问）"
echo "  2. 智谱 AI（GLM）"
echo "  3. MiniMax"
echo ""

# 读取当前配置
if [ -f ".env" ]; then
    echo "📋 当前配置："
    grep "API_KEY" .env | sed 's/=.*$/=****/'
    echo ""
fi

# 配置菜单
echo "请选择要配置的 API Key："
echo "  1. 阿里云百炼（Bailian）"
echo "  2. 智谱 AI（GLM）"
echo "  3. MiniMax"
echo "  4. 全部配置"
echo "  5. 跳过"
echo ""

read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        read -p "请输入阿里云百炼 API Key: " bailian_key
        if [ -n "$bailian_key" ]; then
            sed -i "s/BAILIAN_API_KEY=.*/BAILIAN_API_KEY=$bailian_key/" .env
            echo "✅ 阿里云百炼 API Key 已配置"
        fi
        ;;
    2)
        read -p "请输入智谱 AI API Key: " glm_key
        if [ -n "$glm_key" ]; then
            sed -i "s/GLM_API_KEY=.*/GLM_API_KEY=$glm_key/" .env
            echo "✅ 智谱 AI API Key 已配置"
        fi
        ;;
    3)
        read -p "请输入 MiniMax API Key: " minimax_key
        read -p "请输入 MiniMax Group ID: " minimax_group
        if [ -n "$minimax_key" ]; then
            sed -i "s/MINIMAX_API_KEY=.*/MINIMAX_API_KEY=$minimax_key/" .env
            sed -i "s/MINIMAX_GROUP_ID=.*/MINIMAX_GROUP_ID=$minimax_group/" .env
            echo "✅ MiniMax API Key 已配置"
        fi
        ;;
    4)
        echo ""
        echo "--- 配置阿里云百炼 ---"
        read -p "请输入阿里云百炼 API Key: " bailian_key
        if [ -n "$bailian_key" ]; then
            sed -i "s/BAILIAN_API_KEY=.*/BAILIAN_API_KEY=$bailian_key/" .env
        fi
        
        echo ""
        echo "--- 配置智谱 AI ---"
        read -p "请输入智谱 AI API Key: " glm_key
        if [ -n "$glm_key" ]; then
            sed -i "s/GLM_API_KEY=.*/GLM_API_KEY=$glm_key/" .env
        fi
        
        echo ""
        echo "--- 配置 MiniMax ---"
        read -p "请输入 MiniMax API Key: " minimax_key
        read -p "请输入 MiniMax Group ID: " minimax_group
        if [ -n "$minimax_key" ]; then
            sed -i "s/MINIMAX_API_KEY=.*/MINIMAX_API_KEY=$minimax_key/" .env
            sed -i "s/MINIMAX_GROUP_ID=.*/MINIMAX_GROUP_ID=$minimax_group/" .env
        fi
        echo "✅ 所有 API Key 已配置"
        ;;
    5)
        echo "⏭️  跳过配置"
        exit 0
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "📋 配置完成后的配置："
grep "API_KEY" .env | sed 's/=.*$/=****/'

echo ""
echo "🎉 配置完成！"
echo ""
echo "下一步："
echo "  1. 重启后端服务：npm start"
echo "  2. 测试 AI 功能：curl -X POST http://localhost:3000/api/ai/generate-script ..."
echo ""

# 提示获取 API Key 的链接
echo ""
echo "📝 如何获取 API Key："
echo ""
echo "阿里云百炼（通义千问）："
echo "  1. 访问：https://bailian.console.aliyun.com/"
echo "  2. 登录阿里云账号"
echo "  3. 进入 API-KEY 管理"
echo "  4. 创建新的 API Key"
echo ""
echo "智谱 AI（GLM）："
echo "  1. 访问：https://open.bigmodel.cn/"
echo "  2. 登录/注册账号"
echo "  3. 进入 API Key 管理"
echo "  4. 创建 API Key"
echo ""
echo "MiniMax："
echo "  1. 访问：https://platform.minimaxi.com/"
echo "  2. 登录/注册账号"
echo "  3. 进入用户中心"
echo "  4. 创建 API Key 和 Group ID"
echo ""
