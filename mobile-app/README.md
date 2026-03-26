# 密室做题家 - React Native App

一款支持 iOS 和 Android 的教育类移动应用，包含老师端和学生端功能，通过游戏化方式提升学生学习兴趣。

## 📱 功能特性

### 老师端
- **登录/注册** - 手机号验证、教师认证
- **首页** - 快捷入口、班级概览
- **作业生成** - AI 剧本生成、传统作业生成
- **班级管理** - 学生列表、班级码管理
- **学情统计** - 完成率、正确率图表分析

### 学生端
- **登录** - 班级码登录
- **作业列表** - 未完成/已完成作业管理
- **游戏化做题** - 密室逃脱、剧本杀模式
- **个人中心** - 做题记录、错题本

## 🛠 技术栈

- **框架**: React Native 0.73+
- **语言**: TypeScript
- **UI 组件**: React Native Paper
- **导航**: React Navigation 6
- **状态管理**: Zustand
- **网络请求**: Axios
- **本地存储**: AsyncStorage
- **图表**: react-native-chart-kit

## 📦 项目结构

```
mobile-app/
├── App.tsx                 # 应用入口
├── package.json            # 依赖配置
├── tsconfig.json           # TypeScript 配置
├── babel.config.js         # Babel 配置
├── metro.config.js         # Metro 配置
├── src/
│   ├── pages/              # 页面组件
│   │   ├── teacher/        # 老师端页面
│   │   │   ├── TeacherLoginScreen.tsx
│   │   │   ├── TeacherHomeScreen.tsx
│   │   │   ├── HomeworkGenerationScreen.tsx
│   │   │   ├── ClassManagementScreen.tsx
│   │   │   └── LearningStatsScreen.tsx
│   │   └── student/        # 学生端页面
│   │       ├── StudentLoginScreen.tsx
│   │       ├── StudentHomeScreen.tsx
│   │       ├── GamePracticeScreen.tsx
│   │       └── StudentProfileScreen.tsx
│   ├── components/         # 公共组件
│   │   ├── LoadingScreen.tsx
│   │   └── EmptyState.tsx
│   ├── navigation/         # 路由配置
│   │   └── AppNavigator.tsx
│   ├── store/              # 状态管理
│   │   ├── authStore.ts
│   │   ├── classStore.ts
│   │   └── homeworkStore.ts
│   ├── api/                # API 封装
│   │   ├── index.ts
│   │   └── endpoints.ts
│   └── utils/              # 工具函数
│       ├── helpers.ts
│       └── theme.ts
├── README.md               # 项目说明
└── build-apk.sh            # Android 打包脚本
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn
- Xcode 14+ (iOS 开发)
- Android Studio (Android 开发)

### 安装依赖

```bash
cd mobile-app
npm install
```

### iOS 运行

```bash
# 安装 iOS 依赖
cd ios && pod install && cd ..

# 启动 Metro
npm start

# 运行 iOS
npm run ios
```

### Android 运行

```bash
# 启动 Metro
npm start

# 运行 Android
npm run android
```

## 📱 页面说明

### 老师端页面 (5 个)

1. **TeacherLoginScreen** - 登录/注册页
   - 手机号验证
   - 验证码登录
   - 教师认证注册

2. **TeacherHomeScreen** - 首页
   - 快捷入口卡片
   - 班级概览统计
   - 数据概览

3. **HomeworkGenerationScreen** - 作业生成
   - AI 剧本生成模式
   - 传统作业生成模式
   - 科目/年级/难度选择

4. **ClassManagementScreen** - 班级管理
   - 班级列表
   - 班级码展示
   - 学生管理

5. **LearningStatsScreen** - 学情统计
   - 完成率趋势图
   - 科目正确率分布
   - 学生排行榜

### 学生端页面 (4 个)

1. **StudentLoginScreen** - 登录页
   - 班级码输入
   - 姓名验证

2. **StudentHomeScreen** - 作业列表
   - 作业筛选
   - 完成状态展示
   - 统计数据

3. **GamePracticeScreen** - 游戏化做题
   - 密室逃脱模式
   - 剧本杀模式
   - 答题计时
   - 提示功能

4. **StudentProfileScreen** - 个人中心
   - 个人信息
   - 成就展示
   - 错题本
   - 做题记录

## 🔧 配置说明

### API 配置

在 `src/api/index.ts` 中修改 API 地址:

```typescript
const API_BASE_URL = 'https://your-api-domain.com';
```

### 主题配置

在 `src/utils/theme.ts` 中自定义主题:

```typescript
export const colors = {
  primary: '#6200ee',  // 主色调
  secondary: '#03dac6', // 次要色
  // ...
};
```

## 📦 打包发布

### Android APK 打包

```bash
# 使用打包脚本
bash build-apk.sh

# 或手动打包
cd android
./gradlew assembleRelease
```

APK 文件位置：`android/app/build/outputs/apk/release/`

### iOS 打包

1. 在 Xcode 中选择 `Product` -> `Archive`
2. 在 Organizer 中上传到 App Store Connect

## 📝 开发注意事项

1. **状态管理**: 使用 Zustand 进行全局状态管理
2. **导航**: 使用 React Navigation 6 进行页面导航
3. **UI 组件**: 统一使用 React Native Paper 组件
4. **类型安全**: 所有代码使用 TypeScript 编写
5. **API 调用**: 统一在 `src/api/` 中管理 API 接口

## 🔌 依赖说明

### 主要依赖

- `react-native-paper` - Material Design UI 组件
- `@react-navigation/native` - 导航框架
- `zustand` - 轻量级状态管理
- `axios` - HTTP 客户端
- `@react-native-async-storage/async-storage` - 本地存储
- `react-native-chart-kit` - 图表库

### 开发依赖

- `typescript` - 类型系统
- `@react-native/metro-config` - Metro 配置
- `eslint` - 代码检查
- `prettier` - 代码格式化

## 📄 License

MIT

## 👥 团队

密室做题家开发团队

---

**版本**: 1.0.0  
**最后更新**: 2024-01-26
