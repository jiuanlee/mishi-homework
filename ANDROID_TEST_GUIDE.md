# 📱 Android App 测试指南

## ✅ GitHub 更新完成

**仓库地址**：https://github.com/jiuanlee/mishi-homework

**最新提交**：
- ✅ React Native App 端代码已推送
- ✅ 包含 9 个页面组件
- ✅ 支持 iOS + Android

---

## 🔧 Android 环境配置

### 方式 1：安装 Android Studio（推荐）⭐⭐⭐

**适合**：完整开发环境

#### 步骤 1：下载安装

**Windows**：
```
1. 访问：https://developer.android.com/studio
2. 下载 Android Studio
3. 运行安装程序
4. 默认安装即可
```

#### 步骤 2：配置 SDK

打开 Android Studio 后：
```
1. Tools → SDK Manager
2. 安装 Android SDK Platform（API 21+）
3. 安装 Android SDK Build-Tools
4. 安装 Android Emulator
```

#### 步骤 3：配置环境变量

**Windows**：
```powershell
# 添加到系统环境变量
ANDROID_HOME = C:\Users\你的用户名\AppData\Local\Android\Sdk
PATH = %PATH%;%ANDROID_HOME%\platform-tools
PATH = %PATH%;%ANDROID_HOME%\emulator
```

#### 步骤 4：验证安装

**在 WSL 中**：
```bash
# 需要配置 ADB 路径
export ANDROID_HOME=/mnt/c/Users/你的用户名/AppData/Local/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 验证
adb version
```

---

### 方式 2：使用 Expo Go（最简单）⭐⭐⭐⭐⭐

**适合**：快速测试，无需安装 Android Studio

#### 步骤 1：安装 Expo Go App

**在手机上操作**：
```
1. 打开 Google Play 或应用商店
2. 搜索 "Expo Go"
3. 下载安装
```

**iOS**：App Store 搜索 "Expo Go"  
**Android**：Google Play 搜索 "Expo Go"

#### 步骤 2：启动 Expo 开发服务器

**在 WSL 中执行**：
```bash
# 进入项目目录
cd /home/rocky/.openclaw/workspace/mobile-app

# 安装依赖
npm install

# 安装 Expo CLI
npm install -g expo-cli

# 启动 Expo
npx expo start
```

#### 步骤 3：扫码连接

```
1. 手机打开 Expo Go App
2. 扫描电脑屏幕上的二维码
3. App 自动加载并运行
```

**优点**：
- ✅ 无需安装 Android Studio
- ✅ 无需配置环境
- ✅ 5 分钟即可测试
- ✅ 支持实时热更新

---

### 方式 3：使用在线模拟器 ⭐⭐

**适合**：没有 Android 手机

#### 选项 A：Expo Snack（推荐）

```
1. 访问：https://snack.expo.dev/
2. 上传 mobile-app 目录代码
3. 在线预览 iOS/Android 效果
```

#### 选项 B：Android Studio Emulator

```
1. 安装 Android Studio
2. AVD Manager 创建模拟器
3. 启动模拟器
4. npm run android
```

---

## 🚀 快速测试流程（Expo 方式）

### 步骤 1：安装 Expo

```bash
cd /home/rocky/.openclaw/workspace/mobile-app

# 安装 Expo CLI
npm install -g expo-cli

# 安装依赖
npm install
```

### 步骤 2：启动开发服务器

```bash
# 启动 Expo
npx expo start
```

**输出**：
```
┌────────────────────────────────────┐
│                                    │
│   Running on http://localhost:8081 │
│                                    │
│  Press a │ Android Emulator        │
│  Press i │ iOS simulator           │
│  Press w │ Open web                │
│  Press s │ Switch project          │
│                                    │
│  QR Code for Expo Go app           │
│  [扫描二维码在手机上运行]           │
│                                    │
└────────────────────────────────────┘
```

### 步骤 3：在手机上运行

**方法 A：扫描二维码**
```
1. 打开手机上的 Expo Go App
2. 点击 "Scan QR Code"
3. 扫描电脑屏幕上的二维码
4. App 自动加载运行
```

**方法 B：输入地址**
```
1. 打开 Expo Go App
2. 手动输入地址：exp://你的电脑 IP:8081
3. 点击连接
```

---

## 📱 功能测试清单

### 老师端测试

- [ ] 登录/注册
- [ ] 首页导航
- [ ] 作业生成（AI 剧本）
- [ ] 班级管理
- [ ] 学情统计

### 学生端测试

- [ ] 班级码登录
- [ ] 作业列表
- [ ] 游戏化做题
- [ ] 个人中心

---

## 🐛 常见问题

### Q1: 无法扫描二维码

**解决**：
```
1. 确保手机和电脑在同一 WiFi
2. 使用 Expo Go App 的 "Scan QR Code" 功能
3. 或手动输入地址：exp://电脑 IP:8081
```

### Q2: npm install 失败

**解决**：
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com
```

### Q3: Metro Bundler 启动失败

**解决**：
```bash
# 清除 Metro 缓存
npx expo start -c

# 或手动清除
rm -rf .expo
```

### Q4: App 闪退

**解决**：
```bash
# 检查 API 地址是否正确
# 编辑 src/api/index.ts
# 确保 baseURL 指向正确的后端地址

# 重新安装 App
# 卸载 Expo Go
# 重新从应用商店下载
```

---

## 📦 打包 APK（可选）

### 方式 1：使用 Expo EAS Build

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 配置 EAS
eas build:configure

# 构建 Android APK
eas build --platform android --profile preview

# 构建完成后下载 APK
```

### 方式 2：本地构建

```bash
# 需要安装 Android Studio
cd android
./gradlew assembleRelease

# APK 位置
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 推荐测试流程

### 最快方式（5 分钟）⭐⭐⭐⭐⭐

```bash
# 1. 安装 Expo Go（手机）
# 2. 启动 Expo（电脑）
cd mobile-app
npx expo start

# 3. 扫码运行（手机）
```

### 完整方式（30 分钟）⭐⭐⭐

```bash
# 1. 安装 Android Studio
# 2. 配置 SDK 和环境变量
# 3. 创建模拟器
# 4. npm run android
```

---

## 📊 当前状态

| 项目 | 状态 |
|------|------|
| GitHub 更新 | ✅ 完成 |
| App 代码 | ✅ 已推送 |
| Android 环境 | ❌ 需要安装 |
| 测试方式 | 推荐 Expo Go |

---

## 🎉 下一步

### 选项 A：使用 Expo Go 快速测试（推荐）

```bash
cd mobile-app
npx expo start
# 扫码运行
```

### 选项 B：安装完整 Android 环境

```
1. 下载 Android Studio
2. 安装并配置 SDK
3. 创建模拟器
4. npm run android
```

---

**小虾米，GitHub 已更新！**

**现在测试 App**：
- **最快方式**：使用 Expo Go（5 分钟）
- **完整方式**：安装 Android Studio（30 分钟）

**你想用哪种方式测试？** 🦞
