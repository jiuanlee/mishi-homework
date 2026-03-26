# 密室做题家 - 前端部署说明

## 项目结构

```
.
├── teacher-web/              # 老师端（Vue3 Web 应用）
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   ├── Login.vue           # 登录/注册页面
│   │   │   ├── ClassManagement.vue # 班级管理页面
│   │   │   ├── HomeworkGenerator.vue # 作业生成页面（核心）
│   │   │   ├── HomeworkManagement.vue # 作业管理页面
│   │   │   └── Statistics.vue      # 统计页面
│   │   ├── components/      # 公共组件
│   │   ├── assets/          # 静态资源
│   │   ├── utils/           # 工具函数
│   │   ├── store/           # 状态管理
│   │   ├── router/          # 路由配置
│   │   ├── App.vue          # 根组件
│   │   └── main.js          # 入口文件
│   ├── public/              # 公共资源
│   └── package.json         # 依赖配置
│
├── student-miniprogram/     # 学生端（微信小程序）
│   ├── pages/
│   │   ├── login/           # 登录页面（班级码）
│   │   ├── homework/        # 作业列表页面
│   │   ├── game/            # 游戏化做题界面
│   │   └── record/          # 作业记录页面
│   ├── components/          # 小程序组件
│   ├── utils/               # 工具函数
│   ├── assets/              # 静态资源
│   └── app.json             # 小程序配置
│
├── ui-components/           # 公共 UI 组件库
│   ├── buttons/
│   │   └── CartoonButton.vue       # 卡通按钮
│   ├── cards/
│   │   └── HomeworkCard.vue        # 作业卡片
│   ├── animations/
│   │   └── UnlockAnimation.vue     # 线索解锁动画
│   └── layouts/
│       └── CartoonLayout.vue       # 卡通布局
│
└── frontend-readme.md       # 本文件
```

## 技术栈

### 老师端（Web）
- **框架**: Vue 3.4 + Vite 5
- **UI 组件**: Element Plus 2.5
- **状态管理**: Pinia 2.1
- **路由**: Vue Router 4.2
- **HTTP**: Axios 1.6
- **样式**: SCSS
- **设计特点**: 
  - 响应式设计（适配 PC/平板）
  - 卡通化 UI（适配小学生审美）
  - 渐变色彩、圆角设计

### 学生端（微信小程序）
- **平台**: 微信小程序原生开发
- **样式**: WXSS（支持 SCSS 语法）
- **设计特点**:
  - 游戏化界面
  - 动画效果（解锁线索、通关）
  - 本地缓存（中断续做）

### 公共组件库
- **框架**: Vue 3
- **组件类型**:
  - 按钮组件（多种尺寸、状态）
  - 卡片组件（作业展示）
  - 动画组件（解锁特效）
  - 布局组件（统一风格）

## 核心功能清单

### 老师端页面
1. **登录/注册页面** (`/login`)
   - 用户名/密码登录
   - 邮箱注册
   - 表单验证

2. **班级管理页面** (`/classes`)
   - 班级列表展示
   - 新建班级（生成班级码）
   - 查看班级详情
   - 班级统计（学生数、作业数、完成率）

3. **作业生成页面** (`/homework/create`) ⭐核心
   - 四步生成流程:
     1. 选择知识点（年级/学科/知识点筛选）
     2. 选择剧情模式（密室逃脱/剧本杀/冒险闯关/侦探探案）
     3. 设置参数（题量、难度、时长、截止时间、奖励）
     4. 预览并生成
   - 一键生成作业

4. **作业管理页面** (`/homework`)
   - 作业列表
   - 搜索过滤
   - 查看详情
   - 查看统计

5. **完成情况统计页面** (`/statistics`)
   - 概览卡片（学生数、作业数、完成率、平均分）
   - 图表展示（完成情况趋势、知识点掌握、班级排名、模式分布）
   - 学生排行榜

### 学生端页面
1. **登录页面** (`pages/login`)
   - 班级码登录（6 位）
   - 姓名输入
   - 本地缓存

2. **作业列表页面** (`pages/homework`)
   - 作业卡片展示
   - 状态标识（待开始/进行中/已完成）
   - 进度条显示
   - 截止时间提醒

3. **游戏化做题界面** (`pages/game`) ⭐核心
   - **剧情展示**: 开场动画和故事背景
   - **游戏主界面**:
     - 顶部信息栏（计时器、得分、线索数）
     - 线索展示区（已解锁/未解锁）
     - 题目区域（题型、题干、选项）
     - 解锁动画（线索解锁特效）
   - **通关结算**: 得分、用时、正确率、奖励展示
   - **两种模式**:
     - 密室逃脱模式 🔐
     - 剧本杀模式 🎭

4. **作业记录页面** (`pages/record`)
   - 学习统计（完成数、总分、徽章、金币）
   - 历史记录列表
   - 每次作业详情（模式、得分、用时、奖励）

### 公共组件
1. **CartoonButton** - 卡通按钮
   - 多种类型（primary/success/warning/danger）
   - 多种尺寸（small/medium/large）
   - 图标支持
   - 加载状态

2. **HomeworkCard** - 作业卡片
   - 模式图标
   - 状态标签
   - 进度条
   - 截止时间

3. **UnlockAnimation** - 解锁动画
   - 全屏遮罩
   - 弹跳入场动画
   - 进度展示
   - 自动关闭

4. **CartoonLayout** - 卡通布局
   - 统一头部
   - 内容区域
   - 底部可选

## 部署步骤

### 老师端（Web）

```bash
# 1. 进入项目目录
cd teacher-web

# 2. 安装依赖
npm install

# 3. 开发模式
npm run dev

# 4. 生产构建
npm run build

# 5. 预览构建结果
npm run preview
```

**构建产物**: `dist/` 目录
**部署**: 将 `dist/` 目录部署到任意静态服务器（Nginx、Vercel、Netlify 等）

**环境变量配置**（可选）:
```bash
# .env.production
VITE_API_BASE_URL=https://api.yoursite.com
```

### 学生端（微信小程序）

```bash
# 1. 下载并安装微信开发者工具
# https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 2. 打开微信开发者工具

# 3. 导入项目
# - 选择 student-miniprogram 目录
# - 填写 AppID（测试账号可选）

# 4. 编译预览
# 点击编译按钮即可在模拟器中预览

# 5. 上传代码
# 点击上传按钮，填写版本号和备注

# 6. 提交审核
# 登录微信公众平台提交审核
```

**注意事项**:
- 需要在微信公众平台注册小程序账号
- 配置服务器域名（白名单）
- 提交审核前确保符合小程序规范

### 公共组件库使用

```bash
# 方式 1: 直接复制组件文件到项目
cp ui-components/buttons/CartoonButton.vue teacher-web/src/components/

# 方式 2: 发布为 npm 包（推荐）
cd ui-components
npm init -y
npm publish

# 然后在项目中安装
npm install @mishi-zuotijia/ui-components
```

## 开发规范

### 目录命名
- 小写字母
- 短横线分隔（kebab-case）
- 例：`homework-generator`

### 组件命名
- 大驼峰命名（PascalCase）
- 例：`CartoonButton.vue`

### 样式规范
- 使用 SCSS
- BEM 命名约定
- 响应式设计优先

### 代码风格
- 使用 ESLint + Prettier
- 缩进：2 空格
- 字符串：单引号

## API 接口对接

### 需要对接的后端接口

#### 认证相关
- `POST /api/auth/login` - 老师登录
- `POST /api/auth/register` - 老师注册
- `POST /api/student/login` - 学生登录（班级码）

#### 班级管理
- `GET /api/classes` - 获取班级列表
- `POST /api/classes` - 创建班级
- `DELETE /api/classes/:id` - 删除班级

#### 作业管理
- `GET /api/homework` - 获取作业列表
- `POST /api/homework` - 生成作业
- `GET /api/homework/:id` - 获取作业详情
- `PUT /api/homework/:id` - 更新作业

#### 题目相关
- `GET /api/questions` - 获取题目（带筛选）
- `POST /api/homework/:id/submit` - 提交答案

#### 统计相关
- `GET /api/statistics/overview` - 概览统计
- `GET /api/statistics/class/:id` - 班级统计
- `GET /api/statistics/student/:id` - 学生统计

## 本地缓存策略

### 学生端（微信小程序）
```javascript
// 登录信息
wx.setStorageSync('classCode', classCode)
wx.setStorageSync('studentName', studentName)

// 游戏进度
wx.setStorageSync('gameProgress', {
  homeworkId: id,
  currentQuestion: index,
  score: score,
  clues: clues
})

// 统计数据
wx.setStorageSync('stats', stats)
wx.setStorageSync('recordList', records)
```

### 老师端（Web）
```javascript
// 使用 Pinia 持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)
```

## 动画效果说明

### 解锁线索动画
- **触发时机**: 答对题目时
- **动画流程**:
  1. 全屏遮罩淡入
  2. 图标弹跳入场（bounceIn）
  3. 文字渐变显示
  4. 2 秒后自动关闭
- **配置参数**: duration, autoClose, showProgress

### 通关结算动画
- **触发时机**: 完成所有题目
- **动画流程**:
  1. 奖杯图标放大
  2. 统计数据逐个显示
  3. 奖励物品掉落效果
  4. 返回按钮淡入

## 响应式设计

### 断点设置
```scss
// 手机
$breakpoint-mobile: 768px;
// 平板
$breakpoint-tablet: 1024px;
// 桌面
$breakpoint-desktop: 1280px;
```

### 适配策略
- 老师端：优先桌面，适配平板
- 学生端：微信小程序原生适配各种手机屏幕

## 性能优化

### 代码分割
- 路由懒加载
- 组件按需引入

### 图片优化
- 使用 WebP 格式
- 懒加载
- CDN 加速

### 缓存策略
- 静态资源长期缓存
- API 数据短期缓存
- 本地存储游戏进度

## 安全考虑

### 老师端
- JWT Token 认证
- HTTPS 传输
- XSS 防护（Element Plus 内置）

### 学生端
- 班级码验证
- 答案加密传输
- 防作弊机制（计时、切屏检测）

## 后续优化方向

1. **PWA 支持**: 老师端添加离线访问
2. **WebSocket**: 实时推送作业提醒
3. **国际化**: 支持多语言
4. **主题切换**: 日间/夜间模式
5. **无障碍**: 支持屏幕阅读器
6. **性能监控**: 接入前端监控平台

## 常见问题

### Q: 微信小程序无法请求接口？
A: 需要在微信公众平台配置服务器域名白名单

### Q: 老师端打包后路由 404？
A: 需要配置服务器重定向规则，将所有请求指向 index.html

### Q: 动画效果卡顿？
A: 检查是否使用了 GPU 加速（transform/opacity），避免频繁重排

## 联系方式

如有问题，请联系开发团队。

---

**版本号**: v1.0.0
**更新日期**: 2024-03-26
