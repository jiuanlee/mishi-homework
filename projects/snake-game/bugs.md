# Bug 列表

## Bug 汇总

| Bug ID | 严重程度 | 状态 | 关联测试 ID | 标题 |
|--------|----------|------|------------|------|
| BUG-001 | Major | Open | BF-008 | 食物生成可能无限循环 |
| BUG-002 | Major | Open | SC-006 | 最高分记录功能缺失 |
| BUG-003 | Minor | Open | GF-003 | 游戏暂停功能缺失 |
| BUG-004 | Minor | Open | GF-004 | 游戏继续功能缺失 |
| BUG-005 | Minor | Open | SC-004 | 无最高分显示 |
| BUG-006 | Minor | Open | README | 触屏操作未实现 |
| BUG-007 | Minor | Open | README | 难度等级选择未实现 |

**总计：** 7 个 Bug（2 个 Major，5 个 Minor）

---

## Bug 详情

### BUG-001: 食物生成可能无限循环

**严重程度：** Major

**状态：** Open

**关联测试 ID：** BF-008

**问题描述：**
`placeFood()` 函数使用 `do-while` 循环随机生成食物位置，并检查是否与蛇身重叠。当蛇身占满整个棋盘时（理论上 400 格），该循环将永远无法找到空位，导致无限循环，浏览器卡死。

**复现步骤：**
1. 修改代码使蛇身长度接近 400（或修改棋盘大小为较小值如 5x5）
2. 让蛇吃掉所有食物直到占满棋盘
3. 观察浏览器是否卡死

**预期结果：**
游戏应检测到棋盘已满，宣布玩家胜利并结束游戏。

**实际结果：**
`placeFood()` 函数进入无限循环，浏览器无响应。

**修复建议：**
```javascript
function placeFood() {
    let attempts = 0;
    const maxAttempts = tileCount * tileCount;
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        attempts++;
        if (attempts >= maxAttempts) {
            // 棋盘已满，游戏胜利
            endGame(true); // 需要修改 endGame 支持胜利参数
            return;
        }
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}
```

**影响范围：** 极端游戏情况，普通玩家难以触发

---

### BUG-002: 最高分记录功能缺失

**严重程度：** Major

**状态：** Open

**关联测试 ID：** SC-006

**问题描述：**
README 明确说明"游戏会自动保存本地最高分记录"，但代码中未实现 LocalStorage 存储功能。玩家无法查看历史最高分，也无法挑战自我记录。

**复现步骤：**
1. 开始游戏并获得分数（如 100 分）
2. 游戏结束后刷新页面
3. 再次开始游戏
4. 观察是否显示之前的最高分

**预期结果：**
界面应显示历史最高分，并在打破记录时提示玩家。

**实际结果：**
无最高分显示，每次游戏都是独立的。

**修复建议：**
```javascript
// 在 initGame 或页面加载时读取最高分
const highScore = localStorage.getItem('snakeHighScore') || 0;
// 在界面上添加最高分显示
// <div class="score">最高分：<span id="highScore">0</span></div>

// 在 endGame 函数中保存最高分
function endGame(isWin = false) {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // 更新最高分
    const currentHighScore = localStorage.getItem('snakeHighScore') || 0;
    if (score > currentHighScore) {
        localStorage.setItem('snakeHighScore', score);
        document.getElementById('highScore').textContent = score;
        // 可选：显示"新纪录!"提示
    }
    
    gameOverElement.style.display = 'block';
    startBtn.textContent = '重新开始';
}
```

**影响范围：** 用户体验，游戏核心功能之一

---

### BUG-003: 游戏暂停功能缺失

**严重程度：** Minor

**状态：** Open

**关联测试 ID：** GF-003

**问题描述：**
README 中说明"空格键暂停/继续"，但代码中未实现暂停功能。玩家无法在游戏中途暂停，影响游戏体验。

**复现步骤：**
1. 开始游戏
2. 按下空格键
3. 观察游戏是否暂停

**预期结果：**
游戏暂停，蛇停止移动，再次按空格键继续。

**实际结果：**
空格键无任何效果。

**修复建议：**
```javascript
let isPaused = false;

function togglePause() {
    if (!gameRunning) return;
    
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop);
        // 可选：显示"已暂停"提示
    } else {
        gameLoop = setInterval(() => {
            update();
            draw();
        }, 100);
    }
}

// 在键盘监听中添加
document.addEventListener('keydown', (e) => {
    // ... 现有代码 ...
    
    case ' ':
    case 'Spacebar':
        togglePause();
        break;
});
```

**影响范围：** 用户体验，非核心功能

---

### BUG-004: 游戏继续功能缺失

**严重程度：** Minor

**状态：** Open

**关联测试 ID：** GF-004

**问题描述：**
依赖暂停功能，由于暂停功能未实现，继续功能也不存在。

**修复建议：**
与 BUG-003 一起修复。

**影响范围：** 用户体验，非核心功能

---

### BUG-005: 无最高分显示

**严重程度：** Minor

**状态：** Open

**关联测试 ID：** SC-004

**问题描述：**
游戏界面只显示当前分数，没有最高分显示区域。玩家无法了解当前分数与历史最佳水平的差距。

**复现步骤：**
1. 打开游戏页面
2. 观察界面显示

**预期结果：**
界面应同时显示"当前得分"和"最高分"。

**实际结果：**
仅显示当前得分。

**修复建议：**
```html
<!-- 在 HTML 中添加 -->
<div class="score">得分：<span id="score">0</span></div>
<div class="score">最高分：<span id="highScore">0</span></div>
```

```javascript
// 在 JavaScript 中初始化
const highScoreElement = document.getElementById('highScore');
const highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;
```

**影响范围：** 用户体验

---

### BUG-006: 触屏操作未实现

**严重程度：** Minor

**状态：** Open

**关联测试 ID：** README

**问题描述：**
README 中详细说明"触屏操作"支持（向上滑动、向下滑动等），但代码中未实现任何触屏事件监听。移动端用户无法使用手势控制蛇的移动。

**复现步骤：**
1. 在手机或平板浏览器中打开游戏
2. 尝试滑动手势控制蛇

**预期结果：**
滑动手势可以控制蛇的移动方向。

**实际结果：**
触屏无任何效果，只能通过键盘控制（如果设备有键盘）。

**修复建议：**
```javascript
// 添加触屏支持
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning) return;
    
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // 判断滑动方向
    if (Math.abs(dx) > Math.abs(dy)) {
        // 水平滑动
        if (dx > 0 && direction.x !== -1) {
            nextDirection = { x: 1, y: 0 };
        } else if (dx < 0 && direction.x !== 1) {
            nextDirection = { x: -1, y: 0 };
        }
    } else {
        // 垂直滑动
        if (dy > 0 && direction.y !== -1) {
            nextDirection = { x: 0, y: 1 };
        } else if (dy < 0 && direction.y !== 1) {
            nextDirection = { x: 0, y: -1 };
        }
    }
    
    e.preventDefault();
}, { passive: false });
```

**影响范围：** 移动端用户体验

---

### BUG-007: 难度等级选择未实现

**严重程度：** Minor

**状态：** Open

**关联测试 ID：** README

**问题描述：**
README 中介绍了 4 个难度等级（简单、普通、困难、地狱），但代码中游戏速度固定为 100ms/帧，无难度选择功能。

**复现步骤：**
1. 打开游戏页面
2. 寻找难度选择选项

**预期结果：**
游戏开始前可以选择难度等级。

**实际结果：**
无难度选择，只有一种游戏速度。

**修复建议：**
```javascript
// 添加难度配置
const difficultySettings = {
    easy: 150,    // 慢速
    normal: 100,  // 中速
    hard: 70,     // 快速
    extreme: 40   // 极速
};

let gameSpeed = difficultySettings.normal;

// 添加难度选择 UI
function setDifficulty(level) {
    gameSpeed = difficultySettings[level];
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = setInterval(() => {
            update();
            draw();
        }, gameSpeed);
    }
}

// 在 startGame 中使用
gameLoop = setInterval(() => {
    update();
    draw();
}, gameSpeed);
```

**影响范围：** 游戏可玩性和挑战性

---

## Bug 状态说明

- **New**: 新发现的 Bug
- **Open**: 已确认，待修复
- **Fixed**: 已修复，待验证
- **Verified**: 已验证修复
- **Won't Fix**: 决定不修复
- **Duplicate**: 重复 Bug

## 严重程度说明

- **Critical**: 导致游戏无法运行或崩溃
- **Major**: 核心功能失效或与文档严重不符
- **Minor**: 功能缺失但不影响主要流程
- **Trivial**: 界面或体验问题

---

*最后更新：2026-03-25*
