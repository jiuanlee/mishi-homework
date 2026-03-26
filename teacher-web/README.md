# 老师端 - Vue3 Web 应用

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 技术栈

- Vue 3.4
- Vite 5
- Element Plus 2.5
- Pinia 2.1
- Vue Router 4.2
- Axios 1.6

## 目录结构

```
src/
├── pages/          # 页面组件
├── components/     # 公共组件
├── utils/          # 工具函数
├── store/          # 状态管理
├── router/         # 路由配置
├── assets/         # 静态资源
├── App.vue         # 根组件
└── main.js         # 入口文件
```

## 页面列表

1. Login.vue - 登录/注册
2. ClassManagement.vue - 班级管理
3. HomeworkGenerator.vue - 作业生成（核心）
4. HomeworkManagement.vue - 作业管理
5. Statistics.vue - 统计页面

## 开发规范

- 使用 Vue 3 Composition API
- 组件名使用 PascalCase
- 使用 SCSS 编写样式
- 遵循 Element Plus 设计规范
