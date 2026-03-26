# UI 组件库

公共 UI 组件，可在老师端和学生端复用。

## 组件列表

### Buttons 按钮

- **CartoonButton.vue** - 卡通风格按钮
  - 支持多种类型（primary/success/warning/danger）
  - 支持多种尺寸（small/medium/large）
  - 支持图标
  - 支持加载状态

### Cards 卡片

- **HomeworkCard.vue** - 作业展示卡片
  - 模式图标展示
  - 状态标签（待开始/进行中/已完成）
  - 进度条
  - 截止时间

### Animations 动画

- **UnlockAnimation.vue** - 线索解锁动画
  - 全屏遮罩
  - 弹跳入场动画
  - 进度展示
  - 自动关闭

### Layouts 布局

- **CartoonLayout.vue** - 卡通风格布局
  - 统一头部
  - 内容区域
  - 底部可选

## 使用方式

### 方式 1: 直接复制

```bash
cp ui-components/buttons/CartoonButton.vue your-project/src/components/
```

### 方式 2: 发布 npm 包

```bash
cd ui-components
npm init -y
npm publish

# 然后在项目中安装
npm install @mishi-zuotijia/ui-components
```

### 方式 3: Git Submodule

```bash
git submodule add <repo-url> ui-components
```

## 设计规范

- 卡通化风格
- 圆角设计（border-radius: 20px+）
- 渐变色彩
- 阴影效果
- 动画过渡

## 颜色规范

```scss
$primary: #667eea;
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

$success: #67C23A;
$warning: #ff9900;
$danger: #f56c6c;

$bg-color: #f5f7fa;
$text-color: #333;
$text-secondary: #666;
$text-placeholder: #999;
```

## 动画规范

- 入场动画：bounceIn（0.5s）
- 淡入淡出：fade（0.3s）
- 脉冲动画：pulse（1s infinite）
- 闪烁动画：twinkle（1.5s infinite）

## 响应式断点

```scss
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
$breakpoint-desktop: 1280px;
```
