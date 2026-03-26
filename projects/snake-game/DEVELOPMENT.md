# 🛠️ 贪吃蛇 - 开发文档

> 为开发者准备的详细技术文档

## 📋 目录

1. [项目架构](#-项目架构)
2. [核心模块](#-核心模块)
3. [代码结构详解](#-代码结构详解)
4. [开发环境搭建](#-开发环境搭建)
5. [扩展指南](#-扩展指南)
6. [调试技巧](#-调试技巧)
7. [性能优化](#-性能优化)
8. [常见问题](#-常见问题)

---

## 🏗️ 项目架构

### 整体架构图

```
┌─────────────────────────────────────────┐
│            游戏主循环 (Game Loop)         │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Snake  │  │  Food   │  │  Score  │ │
│  │  Module │  │ Module  │  │ Module  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │       │
│       └────────────┼────────────┘       │
│                    │                    │
│           ┌────────▼────────┐          │
│           │   Game Engine   │          │
│           │   (核心引擎)     │          │
│           └────────┬────────┘          │
│                    │                    │
│  ┌─────────────────┼─────────────────┐ │
│  │                 │                 │ │
│  ▼                 ▼                 ▼ │
│ ┌─────┐      ┌──────────┐      ┌─────┐│
│ │Input│      │  Render  │      │Audio││
│ │处理  │      │  渲染引擎  │      │音效 ││
│ └─────┘      └──────────┘      └─────┘│
└─────────────────────────────────────────┘
```

### 设计模式

- **游戏循环模式**: 使用 `requestAnimationFrame` 实现流畅动画
- **观察者模式**: 事件监听和解耦
- **单例模式**: 游戏状态管理
- **工厂模式**: 游戏对象创建

---

## 🔧 核心模块

### 1. Game 类（游戏主控制器）

```javascript
class Game {
  constructor(canvasId, options) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.snake = null;
    this.food = null;
    this.score = 0;
    this.isRunning = false;
    this.isPaused = false;
  }

  init() { /* 初始化游戏 */ }
  start() { /* 开始游戏 */ }
  pause() { /* 暂停游戏 */ }
  resume() { /* 继续游戏 */ }
  gameOver() { /* 游戏结束 */ }
  reset() { /* 重置游戏 */ }
  update() { /* 更新游戏状态 */ }
  render() { /* 渲染画面 */ }
  gameLoop() { /* 主循环 */ }
}
```

**职责**:
- 管理游戏状态
- 控制游戏循环
- 协调各模块工作
- 处理游戏结束逻辑

### 2. Snake 类（蛇）

```javascript
class Snake {
  constructor(gridSize, initialLength) {
    this.gridSize = gridSize;
    this.body = [];  // 蛇身坐标数组
    this.direction = 'right';
    this.nextDirection = 'right';
    this.growPending = false;
  }

  move() { /* 移动蛇 */ }
  grow() { /* 增长蛇身 */ }
  checkCollision(walls) { /* 碰撞检测 */ }
  setDirection(dir) { /* 设置方向 */ }
  getHead() { /* 获取蛇头位置 */ }
}
```

**关键属性**:
- `body`: 蛇身坐标数组 `[{x, y}, {x, y}, ...]`
- `direction`: 当前移动方向
- `nextDirection`: 下一帧的移动方向（防止快速按键导致自撞）

### 3. Food 类（食物）

```javascript
class Food {
  constructor(gridSize, canvasSize) {
    this.gridSize = gridSize;
    this.position = { x: 0, y: 0 };
    this.type = 'normal'; // normal, bonus, special
  }

  spawn(snakeBody) { /* 生成食物（避开蛇身） */ }
  draw(ctx) { /* 绘制食物 */ }
  getPosition() { /* 获取位置 */ }
}
```

### 4. InputHandler 类（输入处理）

```javascript
class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = {};
  }

  bindEvents() { /* 绑定事件监听 */ }
  handleKeydown(e) { /* 键盘按下处理 */ }
  handleTouch(e) { /* 触屏处理 */ }
}
```

### 5. ScoreManager 类（分数管理）

```javascript
class ScoreManager {
  constructor() {
    this.currentScore = 0;
    this.highScores = this.loadHighScores();
  }

  addScore(points) { /* 加分 */ }
  saveHighScore() { /* 保存高分 */ }
  loadHighScores() { /* 加载高分记录 */ }
  reset() { /* 重置分数 */ }
}
```

---

## 📂 代码结构详解

### 目录结构

```
snake-game/
├── index.html              # 入口 HTML 文件
├── css/
│   └── style.css          # 样式表
├── js/
│   ├── main.js            # 程序入口
│   ├── game.js            # Game 类
│   ├── snake.js           # Snake 类
│   ├── food.js            # Food 类
│   ├── input.js           # InputHandler 类
│   ├── score.js           # ScoreManager 类
│   ├── audio.js           # 音效管理
│   └── utils.js           # 工具函数
├── assets/
│   ├── images/            # 图片资源
│   │   ├── snake-head.png
│   │   ├── snake-body.png
│   │   └── food.png
│   └── audio/             # 音效资源
│       ├── eat.mp3
│       ├── crash.mp3
│       └── bgm.mp3
└── docs/
    ├── README.md
    ├── DEVELOPMENT.md
    └── USER-GUIDE.md
```

### 核心代码示例

#### 游戏主循环

```javascript
gameLoop() {
  if (!this.isRunning || this.isPaused) return;

  // 清空画布
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // 更新状态
  this.update();

  // 渲染画面
  this.render();

  // 下一帧
  setTimeout(() => {
    requestAnimationFrame(() => this.gameLoop());
  }, 1000 / this.fps);
}
```

#### 蛇移动逻辑

```javascript
move() {
  // 更新实际方向
  this.direction = this.nextDirection;

  // 计算新蛇头位置
  const head = this.getHead();
  const newHead = { ...head };

  switch (this.direction) {
    case 'up':    newHead.y -= this.gridSize; break;
    case 'down':  newHead.y += this.gridSize; break;
    case 'left':  newHead.x -= this.gridSize; break;
    case 'right': newHead.x += this.gridSize; break;
  }

  // 添加新蛇头
  this.body.unshift(newHead);

  // 如果不需要增长，移除蛇尾
  if (!this.growPending) {
    this.body.pop();
  } else {
    this.growPending = false;
  }
}
```

#### 碰撞检测

```javascript
checkCollision(canvasWidth, canvasHeight) {
  const head = this.getHead();

  // 墙壁碰撞
  if (head.x < 0 || head.x >= canvasWidth ||
      head.y < 0 || head.y >= canvasHeight) {
    return true;
  }

  // 自身碰撞（从第 4 节开始检查）
  for (let i = 4; i < this.body.length; i++) {
    if (head.x === this.body[i].x && head.y === this.body[i].y) {
      return true;
    }
  }

  return false;
}
```

---

## 💻 开发环境搭建

### 前置要求

- Node.js 16+（可选，用于开发服务器）
- 现代浏览器（Chrome/Firefox/Safari/Edge）
- 代码编辑器（VS Code 推荐）

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd snake-game

# 2. 安装依赖（如有）
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器访问
# http://localhost:3000
```

### 开发服务器配置

```javascript
// webpack.config.js 或 vite.config.js
export default {
  server: {
    port: 3000,
    open: true,
    hot: true
  }
};
```

### 推荐的 VS Code 扩展

- Live Server
- ESLint
- Prettier
- JavaScript (ES6) code snippets

---

## 🔌 扩展指南

### 添加新食物类型

1. 在 `food.js` 中添加新类型：

```javascript
const FOOD_TYPES = {
  NORMAL: { color: 'red', points: 10, probability: 0.7 },
  BONUS: { color: 'gold', points: 30, probability: 0.2 },
  SPEED: { color: 'blue', points: 15, effect: 'speed', probability: 0.1 }
};
```

2. 在 `snake.js` 中处理特殊效果：

```javascript
eatFood(food) {
  this.growPending = true;
  this.score += food.points;

  if (food.effect === 'speed') {
    this.game.setSpeed(this.game.speed * 1.2);
  }
}
```

### 添加新游戏模式

1. 创建新模式类：

```javascript
class TimeAttackMode extends GameMode {
  constructor() {
    super();
    this.timeLimit = 60; // 秒
  }

  update() {
    this.timeLimit -= this.deltaTime;
    if (this.timeLimit <= 0) {
      this.game.gameOver();
    }
  }
}
```

2. 在游戏初始化时选择模式：

```javascript
init(mode = 'classic') {
  switch (mode) {
    case 'classic':
      this.mode = new ClassicMode();
      break;
    case 'timeAttack':
      this.mode = new TimeAttackMode();
      break;
  }
}
```

### 添加多人对战功能

```javascript
class MultiplayerGame extends Game {
  constructor() {
    super();
    this.players = [];
    this.socket = null;
  }

  connect(serverUrl) {
    this.socket = io(serverUrl);
    this.socket.on('playerJoin', (player) => {
      this.players.push(player);
    });
  }

  sendPosition() {
    this.socket.emit('move', {
      playerId: this.playerId,
      position: this.snake.getHead()
    });
  }
}
```

### 自定义主题

在 `style.css` 中添加主题变量：

```css
:root {
  --snake-color: #4ade80;
  --food-color: #ef4444;
  --bg-color: #1f2937;
  --grid-color: #374151;
}

[data-theme="dark"] {
  --snake-color: #22c55e;
  --food-color: #dc2626;
  --bg-color: #111827;
}

[data-theme="retro"] {
  --snake-color: #00ff00;
  --food-color: #ff00ff;
  --bg-color: #000000;
}
```

---

## 🐛 调试技巧

### 启用调试模式

```javascript
const DEBUG = true;

if (DEBUG) {
  // 显示网格线
  this.drawGrid();

  // 显示碰撞盒
  this.drawCollisionBoxes();

  // 输出日志
  console.log('Snake position:', this.snake.body);
}
```

### 常用调试命令

```javascript
// 浏览器控制台可用命令
debugCommands = {
  godMode: () => { /* 无敌模式 */ },
  addScore: (n) => { game.score += n; },
  setSpeed: (n) => { game.speed = n; },
  pause: () => { game.pause(); },
  restart: () => { game.reset(); }
};
```

### 性能分析

```javascript
// 使用 Chrome DevTools Performance 面板
// 或添加性能监控
const perfMonitor = {
  frameCount: 0,
  lastTime: performance.now(),

  tick() {
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      console.log(`FPS: ${this.frameCount}`);
      this.frameCount = 0;
      this.lastTime = now;
    }
  }
};
```

---

## ⚡ 性能优化

### 渲染优化

1. **使用离屏 Canvas**

```javascript
// 预渲染静态元素
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');

// 渲染背景到离屏 Canvas
this.renderBackground(offscreenCtx);

// 主循环中直接绘制
this.ctx.drawImage(offscreenCanvas, 0, 0);
```

2. **减少重绘区域**

```javascript
// 只重绘变化区域
const dirtyRects = this.getDirtyRects();
dirtyRects.forEach(rect => {
  this.ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
});
```

### 内存优化

```javascript
// 对象池复用
class ObjectPool {
  constructor(createFn, maxSize = 100) {
    this.pool = [];
    this.createFn = createFn;
  }

  get() {
    return this.pool.length > 0 ? this.pool.pop() : this.createFn();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
    }
  }
}

// 复用食物对象
const foodPool = new ObjectPool(() => new Food());
```

### 代码优化

```javascript
// 使用位运算替代部分数学运算
const gridSize = 20;
const gridX = x >> 4; // 替代 x / 16
const gridY = y & 0xF; // 替代 y % 16

// 缓存 DOM 查询
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
// 避免在循环中重复查询
```

---

## ❓ 常见问题

### Q1: 蛇移动不流畅怎么办？

**A**: 检查以下几点：
- 确保使用 `requestAnimationFrame` 而非 `setInterval`
- 调整 FPS 设置（建议 15-30 FPS 用于复古感）
- 检查是否有其他耗时操作阻塞主线程

### Q2: 快速按键时蛇会自撞？

**A**: 使用 `nextDirection` 缓冲：

```javascript
setDirection(newDir) {
  const opposites = {
    'up': 'down', 'down': 'up',
    'left': 'right', 'right': 'left'
  };

  // 禁止直接反向
  if (opposites[newDir] !== this.direction) {
    this.nextDirection = newDir;
  }
}
```

### Q3: 如何适配移动端？

**A**: 
1. 添加触屏事件监听
2. 使用 CSS 媒体查询适配不同屏幕
3. 禁用页面默认滚动行为

```javascript
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  this.touchStartX = e.touches[0].clientX;
  this.touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // 防止滚动
});
```

### Q4: 分数记录不保存？

**A**: 检查 LocalStorage 权限和容量：

```javascript
try {
  localStorage.setItem('highScore', score);
} catch (e) {
  console.warn('LocalStorage 不可用:', e);
  // 降级到内存存储
}
```

---

## 📚 参考资源

- [MDN Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [HTML5 Game Development](https://developer.mozilla.org/zh-CN/docs/Games)
- [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)

---

**👨‍💻 Happy Coding!**
