#!/bin/bash

set -e

echo "🚀 密室做题家 - MySQL 安装和配置脚本"
echo ""

# 检查是否已安装 MySQL
if command -v mysql &> /dev/null; then
    echo "✅ MySQL 已安装"
    
    # 检查 MySQL 是否运行
    if sudo service mysql status | grep -q "is running"; then
        echo "✅ MySQL 正在运行"
    else
        echo "⚠️  MySQL 未运行，启动中..."
        sudo service mysql start
    fi
else
    echo "❌ MySQL 未安装，开始安装..."
    
    # 更新包列表
    sudo apt update
    
    # 安装 MySQL Server
    sudo apt install mysql-server -y
    
    # 启动 MySQL
    sudo service mysql start
    
    echo "✅ MySQL 安装完成"
fi

# 配置数据库
echo ""
echo "📦 配置数据库..."

sudo mysql -u root <<EOF
-- 创建数据库
CREATE DATABASE IF NOT EXISTS escape_room_solver 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- 创建用户（如果不存在）
CREATE USER IF NOT EXISTS 'escape'@'localhost' 
  IDENTIFIED BY 'escape123';

-- 授权
GRANT ALL PRIVILEGES ON escape_room_solver.* TO 'escape'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "✅ 数据库配置完成"

# 初始化表结构
echo ""
echo "📋 初始化表结构..."

if [ -f "database/init-data.sql" ]; then
    mysql -u escape -pescape123 escape_room_solver < database/init-data.sql
    echo "✅ 表结构初始化完成"
else
    echo "⚠️  未找到 init-data.sql，跳过表结构初始化"
fi

# 更新 .env 文件
echo ""
echo "⚙️  更新配置文件..."

cat > .env << 'ENVEOF'
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=escape
DB_PASSWORD=escape123
DB_NAME=escape_room_solver

# Redis 配置
REDIS_URL=redis://localhost:6379

# JWT 配置
JWT_SECRET=your-secret-key-change-in-production

# AI 大模型配置
BAILIAN_API_KEY=sk-e89ac68116cc4f88a5ef1c82c2070cc2
MINIMAX_API_KEY=
MINIMAX_GROUP_ID=
ENVEOF

echo "✅ 配置文件已更新"

# 检查 Redis
echo ""
echo "📦 检查 Redis..."
if command -v redis-server &> /dev/null; then
    if sudo service redis-server status | grep -q "is running"; then
        echo "✅ Redis 正在运行"
    else
        echo "⚠️  Redis 未运行，启动中..."
        sudo service redis-server start
    fi
else
    echo "⚠️  Redis 未安装（可选，AI 功能不需要）"
fi

echo ""
echo "🎉 配置完成！"
echo ""
echo "数据库信息："
echo "  主机：localhost:3306"
echo "  用户：escape"
echo "  密码：escape123"
echo "  数据库：escape_room_solver"
echo ""
echo "下一步："
echo "  1. 重启后端服务：npm start"
echo "  2. 访问前端：http://localhost:5173"
echo ""
