#!/bin/bash

set -e

echo "🚀 开始部署密室做题家..."
echo ""

PROJECT_DIR="/home/rocky/.openclaw/workspace"
cd $PROJECT_DIR

# 1. 检查 Docker
echo "📋 步骤 1/6: 检查 Docker 环境..."
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker 未运行"
    echo "请先启动 Docker Desktop 或安装 Docker"
    exit 1
fi
echo "✅ Docker 运行正常"
echo ""

# 2. 备份配置
echo "📦 步骤 2/6: 备份配置..."
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi
echo "✅ 备份完成"
echo ""

# 3. 配置环境变量
echo "⚙️  步骤 3/6: 配置环境变量..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，修改以下配置："
    echo "   - MYSQL_ROOT_PASSWORD"
    echo "   - JWT_SECRET"
    echo "   - BAILIAN_API_KEY (可选)"
    echo ""
    read -p "按回车继续..."
fi
echo ""

# 4. 拉取镜像
echo "📥 步骤 4/6: 拉取 Docker 镜像..."
docker compose pull
echo ""

# 5. 启动服务
echo "🔄 步骤 5/6: 启动服务..."
docker compose up -d
echo "⏳ 等待服务启动..."
sleep 30
echo ""

# 6. 验证
echo "📋 步骤 6/6: 验证服务..."
docker compose ps

echo ""
echo "测试 API..."
if curl -s http://localhost:3000/api/health | grep -q "ok"; then
    echo "✅ 后端 API 正常"
else
    echo "⚠️  后端 API 测试失败"
fi

echo ""
echo "测试前端..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    echo "✅ 前端正常"
else
    echo "⚠️  前端测试失败"
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "访问地址："
echo "  🎨 前端（老师端）: http://localhost"
echo "  🔌 后端 API: http://localhost:3000"
echo "  📊 监控面板：http://localhost:3001"
echo "  🗄️  数据库管理：http://localhost:8080"
echo ""
echo "查看日志：docker compose logs -f"
echo "停止服务：docker compose down"
echo "重启服务：docker compose restart"
