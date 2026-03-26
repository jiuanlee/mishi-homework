#!/bin/bash

# 密室做题家 - Android APK 打包脚本
# 使用方法：bash build-apk.sh

set -e

echo "🚀 开始构建 Android APK..."

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未安装 Node.js"
    exit 1
fi

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "❌ 错误：未安装 Java JDK"
    exit 1
fi

# 进入 android 目录
cd android

# 清理构建缓存
echo "🧹 清理构建缓存..."
./gradlew clean

# 设置环境变量 (根据需要修改)
export ORG_GRADLE_PROJECT_reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64

# 构建 Release APK
echo "📦 构建 Release APK..."
./gradlew assembleRelease

# 检查构建结果
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ APK 构建成功!"
    
    # 创建输出目录
    mkdir -p ../builds
    
    # 复制 APK 到 builds 目录
    cp app/build/outputs/apk/release/app-release.apk ../builds/密室做题家-v1.0.0.apk
    
    echo "📱 APK 文件位置：./builds/密室做题家-v1.0.0.apk"
    echo "📊 APK 大小：$(ls -lh ../builds/密室做题家-v1.0.0.apk | awk '{print $5}')"
else
    echo "❌ APK 构建失败"
    exit 1
fi

# 构建 AAB (Google Play 格式)
echo ""
echo "📦 构建 AAB (Google Play 格式)..."
./gradlew bundleRelease

if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    cp app/build/outputs/bundle/release/app-release.aab ../builds/密室做题家-v1.0.0.aab
    echo "✅ AAB 构建成功!"
    echo "📱 AAB 文件位置：./builds/密室做题家-v1.0.0.aab"
fi

echo ""
echo "🎉 构建完成!"
echo ""
echo "📋 构建产物:"
ls -lh ../builds/
