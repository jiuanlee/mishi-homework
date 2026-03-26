# 密室做题家 - 开发部署指南

## 📋 部署前检查清单

### 环境准备

- [ ] Node.js 18+ 已安装 (`node -v`)
- [ ] npm 或 yarn 已安装 (`npm -v`)
- [ ] Xcode 14+ (iOS 开发)
- [ ] Android Studio (Android 开发)
- [ ] Java JDK 11+ (`java -version`)
- [ ] CocoaPods (iOS, `sudo gem install cocoapods`)

### 配置文件检查

- [ ] `package.json` 依赖完整
- [ ] `tsconfig.json` 配置正确
- [ ] API 地址已配置 (`src/api/index.ts`)
- [ ] 应用名称和 ID 已设置

## 🚀 开发环境搭建

### 1. 安装依赖

```bash
cd mobile-app
npm install
```

### 2. iOS 环境配置

```bash
cd ios
pod install
cd ..
```

### 3. 启动开发服务器

```bash
# 终端 1 - 启动 Metro
npm start

# 终端 2 - 运行应用
npm run ios     # iOS
npm run android # Android
```

## 📱 真机调试

### iOS 真机

1. 在 Xcode 中选择你的开发团队
2. 连接 iPhone
3. 选择设备后点击运行

### Android 真机

1. 启用 USB 调试
2. 连接设备
3. `npm run android`

## 🔐 生产环境配置

### API 地址切换

创建 `.env` 文件:

```bash
# 开发环境
API_BASE_URL=https://dev-api.example.com

# 生产环境
API_BASE_URL=https://api.example.com
```

### 签名配置 (Android)

1. 生成签名密钥:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. 在 `android/gradle.properties` 添加:
```properties
MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

3. 在 `android/app/build.gradle` 配置签名

### 签名配置 (iOS)

1. 在 Apple Developer 创建证书和配置文件
2. 在 Xcode 中配置 Signing & Capabilities
3. 选择 Distribution 证书

## 📦 打包发布

### Android

```bash
# 使用脚本
bash build-apk.sh

# 或手动构建
cd android
./gradlew assembleRelease
```

输出位置：`android/app/build/outputs/apk/release/`

### iOS

1. Xcode -> Product -> Archive
2. 在 Organizer 中 Distribute App
3. 选择 App Store Connect 或 Ad Hoc

## 🧪 测试

### 单元测试

```bash
npm test
```

### E2E 测试 (可选)

使用 Detox 或 Appium 进行端到端测试

## 📊 性能优化

### 发布构建优化

1. 启用 ProGuard (Android)
2. 优化图片资源
3. 移除未使用依赖
4. 使用 Hermes 引擎

### 监控

集成性能监控工具:
- Firebase Performance
- Sentry
- Bugly

## 🐛 常见问题

### Metro 启动失败

```bash
watchman watch-del-all
npm start -- --reset-cache
```

### iOS 构建错误

```bash
cd ios
pod deintegrate
pod install
```

### Android 构建错误

```bash
cd android
./gradlew clean
```

## 📱 应用商店提交

### Google Play

1. 准备应用截图和描述
2. 创建 Google Play Console 账号
3. 上传 AAB 文件
4. 填写应用信息
5. 提交审核

### App Store

1. 准备应用截图和描述
2. 创建 App Store Connect 账号
3. 在 Xcode 上传构建
4. 在 App Store Connect 填写信息
5. 提交审核

## 🔧 维护

### 依赖更新

```bash
# 检查可更新的依赖
npm outdated

# 更新依赖
npm update
```

### 版本管理

遵循语义化版本规范:
- MAJOR: 不兼容的 API 变更
- MINOR: 向后兼容的功能
- PATCH: 向后兼容的 bug 修复

## 📞 技术支持

遇到问题请查看:
- React Native 官方文档
- 各依赖库的 GitHub Issues
- Stack Overflow

---

**最后更新**: 2024-01-26  
**版本**: 1.0.0
