# 项目目录结构 - 寓教于乐·密室做题家

```
密室做题家/
├── README.md                          # 项目说明
├── docs/                              # 文档目录
│   ├── technical-architecture.md      # 技术架构文档
│   ├── database-schema.md             # 数据库设计
│   ├── api-design.md                  # API 接口设计
│   └── deployment-guide.md            # 部署指南
│
├── backend/                           # 后端（NestJS）
│   ├── src/
│   │   ├── main.ts                    # 应用入口
│   │   ├── app.module.ts              # 根模块
│   │   │
│   │   ├── auth/                      # 认证模块
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── guards/
│   │   │       └── jwt-auth.guard.ts
│   │   │
│   │   ├── users/                     # 用户模块
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── knowledge/                 # 知识点模块
│   │   │   ├── knowledge.module.ts
│   │   │   ├── knowledge.controller.ts
│   │   │   ├── knowledge.service.ts
│   │   │   ├── entities/
│   │   │   │   └── knowledge-point.entity.ts
│   │   │   └── dto/
│   │   │       └── create-knowledge.dto.ts
│   │   │
│   │   ├── questions/                 # 题目模块
│   │   │   ├── questions.module.ts
│   │   │   ├── questions.controller.ts
│   │   │   ├── questions.service.ts
│   │   │   ├── entities/
│   │   │   │   └── question.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-question.dto.ts
│   │   │       └── update-question.dto.ts
│   │   │
│   │   ├── assignments/               # 作业模块
│   │   │   ├── assignments.module.ts
│   │   │   ├── assignments.controller.ts
│   │   │   ├── assignments.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── assignment.entity.ts
│   │   │   │   └── assignment-item.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-assignment.dto.ts
│   │   │       └── publish-assignment.dto.ts
│   │   │
│   │   ├── answers/                   # 答题模块
│   │   │   ├── answers.module.ts
│   │   │   ├── answers.controller.ts
│   │   │   ├── answers.service.ts
│   │   │   ├── entities/
│   │   │   │   └── answer.entity.ts
│   │   │   └── dto/
│   │   │       └── submit-answer.dto.ts
│   │   │
│   │   ├── progress/                  # 进度模块
│   │   │   ├── progress.module.ts
│   │   │   ├── progress.controller.ts
│   │   │   ├── progress.service.ts
│   │   │   ├── entities/
│   │   │   │   └── student-progress.entity.ts
│   │   │   └── dto/
│   │   │       └── update-progress.dto.ts
│   │   │
│   │   ├── rewards/                   # 奖励模块
│   │   │   ├── rewards.module.ts
│   │   │   ├── rewards.controller.ts
│   │   │   ├── rewards.service.ts
│   │   │   ├── entities/
│   │   │   │   └── reward.entity.ts
│   │   │   └── dto/
│   │   │       └── create-reward.dto.ts
│   │   │
│   │   ├── statistics/                # 统计模块
│   │   │   ├── statistics.module.ts
│   │   │   ├── statistics.controller.ts
│   │   │   └── statistics.service.ts
│   │   │
│   │   ├── files/                     # 文件上传模块
│   │   │   ├── files.module.ts
│   │   │   ├── files.controller.ts
│   │   │   └── files.service.ts
│   │   │
│   │   └── common/                    # 公共模块
│   │       ├── config/
│   │       │   ├── database.config.ts
│   │       │   ├── redis.config.ts
│   │       │   └── app.config.ts
│   │       ├── decorators/
│   │       │   ├── public.decorator.ts
│   │       │   └── roles.decorator.ts
│   │       ├── filters/
│   │       │   └── http-exception.filter.ts
│   │       ├── guards/
│   │       │   └── roles.guard.ts
│   │       ├── interceptors/
│   │       │   ├── response.interceptor.ts
│   │       │   └── logging.interceptor.ts
│   │       ├── middleware/
│   │       │   └── request-logger.middleware.ts
│   │       ├── pipes/
│   │       │   └── validation.pipe.ts
│   │       └── services/
│   │           ├── redis.service.ts
│   │           └── oss.service.ts
│   │
│   ├── test/                          # 测试目录
│   │   ├── auth/
│   │   │   └── auth.e2e-spec.ts
│   │   ├── assignments/
│   │   │   └── assignments.e2e-spec.ts
│   │   └── jest-e2e.json
│   │
│   ├── scripts/                       # 脚本目录
│   │   ├── seed.ts                    # 数据库初始化
│   │   └── migrate.ts                 # 数据库迁移
│   │
│   ├── .env.example                   # 环境变量示例
│   ├── .env                           # 环境变量（不提交）
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile
│
├── frontend-teacher/                  # 老师端（Vue 3 Web）
│   ├── src/
│   │   ├── main.ts                    # 应用入口
│   │   ├── App.vue
│   │   │
│   │   ├── api/                       # API 请求
│   │   │   ├── request.ts             # Axios 封装
│   │   │   ├── auth.ts
│   │   │   ├── assignment.ts
│   │   │   ├── question.ts
│   │   │   └── statistics.ts
│   │   │
│   │   ├── assets/                    # 静态资源
│   │   │   ├── images/
│   │   │   ├── styles/
│   │   │   │   ├── variables.scss
│   │   │   │   └── global.scss
│   │   │   └── icons/
│   │   │
│   │   ├── components/                # 组件
│   │   │   ├── common/
│   │   │   │   ├── PageHeader.vue
│   │   │   │   ├── DataTable.vue
│   │   │   │   └── UploadImage.vue
│   │   │   ├── assignment/
│   │   │   │   ├── AssignmentForm.vue
│   │   │   │   ├── QuestionSelector.vue
│   │   │   │   └── SceneConfig.vue
│   │   │   ├── question/
│   │   │   │   ├── QuestionEditor.vue
│   │   │   │   └── QuestionPreview.vue
│   │   │   └── knowledge/
│   │   │       └── KnowledgeTree.vue
│   │   │
│   │   ├── views/                     # 页面视图
│   │   │   ├── dashboard/
│   │   │   │   └── Index.vue
│   │   │   ├── assignment/
│   │   │   │   ├── List.vue
│   │   │   │   ├── Create.vue
│   │   │   │   ├── Edit.vue
│   │   │   │   └── Detail.vue
│   │   │   ├── question/
│   │   │   │   ├── List.vue
│   │   │   │   └── Editor.vue
│   │   │   └── statistics/
│   │   │       └── AssignmentStats.vue
│   │   │
│   │   ├── store/                     # 状态管理
│   │   │   ├── index.ts
│   │   │   ├── modules/
│   │   │   │   ├── user.ts
│   │   │   │   ├── assignment.ts
│   │   │   │   └── question.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── router/                    # 路由配置
│   │   │   └── index.ts
│   │   │
│   │   └── utils/                     # 工具函数
│   │       ├── auth.ts
│   │       ├── format.ts
│   │       └── validate.ts
│   │
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile
│
├── frontend-student/                  # 学生端（uni-app 小程序）
│   ├── src/
│   │   ├── main.ts                    # 应用入口
│   │   ├── App.vue
│   │   ├── pages.json                 # 页面配置
│   │   │
│   │   ├── api/                       # API 请求
│   │   │   ├── request.ts
│   │   │   ├── assignment.ts
│   │   │   ├── answer.ts
│   │   │   └── reward.ts
│   │   │
│   │   ├── assets/                    # 静态资源
│   │   │   ├── images/
│   │   │   │   ├── scenes/
│   │   │   │   │   ├── entrance.png
│   │   │   │   │   ├── corridor.png
│   │   │   │   │   └── treasure.png
│   │   │   │   ├── items/
│   │   │   │   └── icons/
│   │   │   └── styles/
│   │   │       └── global.scss
│   │   │
│   │   ├── components/                # 组件
│   │   │   ├── game/
│   │   │   │   ├── SceneView.vue
│   │   │   │   ├── StoryDialog.vue
│   │   │   │   └── RewardPopup.vue
│   │   │   ├── question/
│   │   │   │   ├── QuestionCard.vue
│   │   │   │   ├── ChoiceQuestion.vue
│   │   │   │   └── FillBlankQuestion.vue
│   │   │   └── reward/
│   │   │       ├── BadgeList.vue
│   │   │       └── PointsDisplay.vue
│   │   │
│   │   ├── pages/                     # 页面
│   │   │   ├── home/
│   │   │   │   └── index.vue
│   │   │   ├── assignment/
│   │   │   │   ├── list.vue
│   │   │   │   └── detail.vue
│   │   │   ├── game/
│   │   │   │   └── index.vue
│   │   │   ├── ranking/
│   │   │   │   └── index.vue
│   │   │   └── profile/
│   │   │       └── index.vue
│   │   │
│   │   ├── store/                     # 状态管理
│   │   │   ├── index.ts
│   │   │   └── modules/
│   │   │       ├── user.ts
│   │   │       └── game.ts
│   │   │
│   │   └── utils/                     # 工具函数
│   │       ├── auth.ts
│   │       └── format.ts
│   │
│   ├── static/                        # 小程序静态资源
│   │   └── tabbar/
│   │
│   ├── manifest.json                  # 应用配置
│   ├── uni.scss
│   ├── package.json
│   └── pages.json
│
├── deploy/                            # 部署配置
│   ├── docker/
│   │   ├── docker-compose.yml         # Docker Compose 配置
│   │   ├── docker-compose.prod.yml    # 生产环境配置
│   │   └── nginx/
│   │       └── nginx.conf
│   │
│   ├── k8s/                           # Kubernetes 配置（可选）
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   │
│   └── scripts/
│       ├── deploy.sh                  # 部署脚本
│       └── backup.sh                  # 备份脚本
│
├── .gitignore
├── .editorconfig
└── README.md
```

---

## 关键文件说明

### 后端核心文件

| 文件 | 说明 |
|------|------|
| `src/main.ts` | NestJS 应用入口，配置端口、CORS、全局管道等 |
| `src/app.module.ts` | 根模块，导入所有业务模块 |
| `src/common/config/` | 配置文件（数据库、Redis、OSS 等） |
| `src/common/guards/` | 认证和权限守卫 |
| `src/common/filters/` | 全局异常过滤器 |

### 老师端核心文件

| 文件 | 说明 |
|------|------|
| `src/main.ts` | Vue 3 应用入口 |
| `src/router/index.ts` | 路由配置（含权限路由） |
| `src/store/index.ts` | Pinia 状态管理 |
| `src/api/request.ts` | Axios 封装（拦截器、错误处理） |
| `src/views/assignment/` | 作业管理相关页面 |

### 学生端核心文件

| 文件 | 说明 |
|------|------|
| `src/pages.json` | uni-app 页面配置（路由、导航栏） |
| `src/manifest.json` | 小程序应用配置（appid、权限） |
| `src/pages/game/index.vue` | 游戏化做题主页面 |
| `src/components/game/` | 游戏场景相关组件 |

### 部署核心文件

| 文件 | 说明 |
|------|------|
| `deploy/docker/docker-compose.yml` | 本地开发/测试环境一键启动 |
| `deploy/docker/docker-compose.prod.yml` | 生产环境配置 |
| `deploy/docker/nginx/nginx.conf` | Nginx 配置（反向代理、SSL） |

---

## 开发环境快速启动

```bash
# 1. 启动数据库和 Redis
cd deploy/docker
docker-compose up -d db redis

# 2. 启动后端
cd backend
npm install
npm run start:dev

# 3. 启动老师端
cd frontend-teacher
npm install
npm run dev

# 4. 启动学生端
cd frontend-student
npm install
npm run dev:mp-weixin
```

---

*文档版本：v1.0*  
*创建日期：2026-03-26*  
*作者：架构师龙虾*
