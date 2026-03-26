# 微信公众号文章模板

**适用场景**: OpenClaw 技术教程类文章  
**风格参考**: 《2 万字 OpenClaw 保姆教程》  
**字数建议**: 15000-25000 字  
**阅读时间**: 30-45 分钟

---

## 📋 模板结构

```markdown
# （可能全网最全/长的）XX 万字 XXX 保姆教程

![封面图](封面图链接)

# XXX 新手起飞指南 🚀

✨ **写在前面**：  
这是一份专门为你**精简提炼**的"保姆级"新手指南。  
我们剔除了早期不需要懂的底层配置和部署逻辑，为你找到了一条**最平缓的入门曲线 (Sweet Spot)**：

**从零基础 -> 成功安装 -> 接入 XX -> 安全配置 -> 学会使用**

准备好了吗？系好安全带，我们要发车了！

---

## 第一部分：揭开面纱（XXX 到底是什么）

🎯 **本章目标**：学完这章，你能向朋友清楚解释 XXX 是什么、能做什么、不能做什么

⏱️ **预计时间**：3 分钟

### 本章你将学会什么

- [ ] 用一句话解释 XXX
- [ ] 说出 3 个真实使用场景
- [ ] 澄清 3 个常见误解

### 1.1 一句话解释：你的 XX 助理，住在你的电脑里

想象一下：你招了一个实习生，这个实习生特别聪明，能帮你查资料、写文档、整理数据，还能 24 小时在线。但你不需要给它交社保，也不用担心它跳槽。

**XXX 就是这个实习生，只不过它住在你的电脑里。**

更准确地说：

XXX 是一个**AI 智能体平台**（Agent Platform），让你能在自己的电脑上运行 AI 助理，并把它接入到你日常使用的工具里——比如微信、钉钉、飞书。

几个核心概念，先混个脸熟（后面章节会详细讲）：

`127.0.0.1:18789`

别慌，这些词现在看着陌生，用几遍就熟了。

### 1.2 它能做什么：三个真实场景

光说概念太虚，来看三个真实的使用场景。

#### 1.2.1 场景一：自动整理日报（拯救打工人）

小王每天下班前要发日报，总结今天做了什么。以前他要翻聊天记录、看邮件、回忆一天的工作，至少花 20 分钟。

现在他@微信里的 XXX 机器人：

"帮我整理今天的日报，从项目群提取关键进展，从邮件提取待跟进事项。"

机器人自动：
- ✅ 读取你的日历
- ✅ 查看项目群消息
- ✅ 整理邮件待办
- ✅ 生成结构化日报

**省下的 20 分钟，小王可以准时下班了。**

#### 1.2.2 场景二：查资料写报告（研究员的福音）

小李需要写一篇行业分析报告，涉及大量资料搜集。以前他要在十几个网站间来回切换，复制粘贴到手软。

现在他告诉 XXX：

"搜索 2026 年 AI 编程助手的市场规模，整理成表格，包含数据来源。"

Agent 自动：
- 🔍 搜索多个数据源
- 📊 整理成结构化表格
- 📝 标注数据来源
- ✨ 生成可直接使用的报告

**小李从"体力活"中解放出来，专注在分析和判断上。**

#### 1.2.3 场景三：微信里@它办事（团队协作神器）

团队群里经常有人问：
- "昨天的会议纪要在哪？"
- "这个项目进度怎么样了？"
- "谁能帮我查一下这个数据？"

现在直接在群里@机器人：

"@小助手 把刚才发的 PDF 转成 Markdown 格式"

机器人立即处理，把结果发回群里。

**不用麻烦同事，不用切换工具，在聊天中就把事办了。**

### 1.3 它不是什么：澄清常见误解

XXX 很强大，但它不是万能的。以下几个误解，越早澄清越好。

#### 1.3.1 误解一：它是 ChatGPT 替代品

**不是。**

ChatGPT 是一个 AI 对话产品，你打开网页就能聊。XXX 是一个**平台**，让你能搭建自己的 AI 助理。

你可以这样理解：
- ChatGPT = 成品菜（直接吃）
- XXX = 厨房 + 厨具（自己做菜）

实际上，XXX 可以接入 ChatGPT 的 API，也可以接入 Claude、KIMI、MiniMax 等其他模型。它是**模型的使用者**，不是**模型的竞争者**。

#### 1.3.2 误解二：它是云端服务，数据存在别人服务器上

**不是。**

这是 XXX 最大的特点之一：**它运行在你的电脑上**。

对于担心数据隐私的企业和个人，这是巨大的优势。

⚠️ **注意**：虽然 XXX 本身在本地运行，但它调用 AI 模型时需要联网。你的消息会发送到对应的 AI 服务商（如 OpenAI、KIMI 等）。

#### 1.3.3 误解三：它会自己上网乱买东西、乱发邮件

**不会。**

XXX 的设计理念是**最小权限原则**。默认情况下，它什么都不能做。

而且，高风险操作可以设置**二次确认**，确保它不会"自作主张"。

### 1.4 为什么 2026 年它突然火了

AI Agent 的概念不是 2026 年才有的，为什么现在才火？

#### 1.4.1 原因一：大模型能力到了"可用"的临界点

2024 年的 GPT-4 和 Claude 3 已经很强，但还不够稳定。2025-2026 年的模型（Claude Opus 4.6/Sonnet 4.6、GPT-5.3-Codex、KIMI K2.5 等）在**理解复杂指令**和**稳定输出格式**上有了质的飞跃。

简单说：以前的 AI 助理经常"听不懂人话"，现在的能听懂了。

#### 1.4.2 原因二：工程化工具成熟了

光有聪明的大脑不够，还需要：
- 能稳定运行的平台
- 容易上手的配置工具
- 丰富的技能生态

XXX 把这些工程难题都解决了，让普通用户也能搭起自己的 AI 助理。

#### 1.4.3 原因三：从"玩具"到"工具"的转变

早期的 AI Agent 更多是极客的玩具，现在它们真的能**解决实际工作问题**。

**当省下的时间超过学习成本时，普及就水到渠成了。**

### 1.5 阅读路线图：三种读者的最短路径

这篇文章有 X 章，但你不需要全部读完。根据你的需求，选择最适合的路径：

#### 1.5.1 路径 A：我只想快速用起来（推荐所有人先走这条）

**目标**：在微信里@AI 机器人，让它帮你办事

**阅读顺序**：
1. 第 1 章：了解概念
2. 第 2 章：准备工作
3. 第 3 章：安装配置
4. 第 4 章：接入微信
5. 第 5 章：安全配置

**预计时间**：2-3 小时

#### 1.5.2 路径 B：我想深度定制，让它做特定任务

**目标**：让 AI 助理完成我的专属任务（如数据分析、报告生成）

**阅读顺序**：
1. 路径 A 的全部内容
2. 第 6 章：模型选择
3. 第 7 章：技能配置
4. 第 8 章：高级用法

**预计时间**：1-2 天

#### 1.5.3 路径 C：我是技术用户，想部署到服务器

**目标**：在服务器上稳定运行，团队共享使用

**阅读顺序**：
1. 路径 B 的全部内容
2. 第 9 章：服务器部署
3. 第 10 章：性能优化
4. 第 11 章：监控与维护

**预计时间**：2-3 天

#### 本部分小结

来，我们回顾一下：
- [ ] 能用一句话解释 XXX 是什么
- [ ] 能说出 3 个真实使用场景
- [ ] 能澄清 3 个常见误解
- [ ] 知道自己适合哪条阅读路径

#### 动手试试

在评论区留言：
> 你最想用 XXX 帮你做什么工作？

---

## 第二部分：开工准备（你只需要这三样东西）

🎯 **本章目标**：学完这章，你能确认自己具备开始的所有条件，并准备好 API Key

⏱️ **预计时间**：10 分钟

### 本章你将学会什么

- [ ] 确认电脑能运行 XXX
- [ ] 申请到 API Key
- [ ] 准备好 10 分钟时间

### 2.1 别慌，你只需要这三样东西

很多技术书一上来就列一堆要求，看得人想放弃。咱们换个方式：

**你只需要三样东西：**

| 物品 | 说明 | 获取方式 |
|------|------|---------|
| 💻 一台电脑 | 近 5 年的电脑都行 | 你已经有 |
| 🔑 一个 API Key | AI 模型的访问凭证 | 5 分钟申请 |
| ⏱️ 10 分钟时间 | 完成准备工作 | 现在就有 |

没了。不需要你是程序员，不需要你懂 AI，不需要买服务器。

### 2.2 第一样东西：一台电脑

#### 2.2.1 系统要求

| 系统 | 要求 | 备注 |
|------|------|------|
| macOS | 10.15+ | Intel 和 Apple Silicon 都支持 |
| Windows | 10/11 | 推荐用 WSL2（后面会讲） |
| Linux | 主流发行版 | Ubuntu/Debian/CentOS/Fedora都行 |

**简单说：只要是近 5 年的电脑，基本都能跑。**

#### 2.2.2 网络要求

你需要能访问：
- GitHub（下载软件）
- AI 服务商 API（如 KIMI、MiniMax 等）

国内用户注意：XXX 本身不需要翻墙，但部分 AI 服务商可能需要。

### 2.3 第二样东西：一个 API Key

#### 2.3.1 API Key 是什么？

**API Key（应用编程接口密钥）**，听起来很高大上，其实就是**一串密码**。

类比一下：
- API Key = 银行卡密码
- AI 服务商 = ATM 机
- Token = 存款

每次 XXX 让 AI 帮你干活，都要出示这个 Key。AI 服务商根据 Key 来：
1. 验证你是谁
2. 计算用了多少 Token
3. 从你的账户扣费

#### 2.3.2 国内三家 Coding Plan（推荐）

对于国内用户，我推荐优先选择以下三家。它们都有专门针对开发者的 Coding Plan，且本章统一使用国内站口径（不使用国际站路径）。

##### 2.3.2.1 方案 A：KIMI Coding Plan（推荐）

**网址**：https://www.kimi.com/code

**申请步骤**：
1. 访问 Kimi Code 页面
2. 登录/注册账号
3. 选择订阅档位（49/99/199/699 元）
4. 完成支付
5. 在"API Key 管理"创建 Key
6. 复制并保存 Key（格式：`sk-xxxxxxxx`）

💡 **提示**：Key 创建后只显示一次，务必保存好。如果丢了，只能重新创建。

##### 2.3.2.2 方案 B：MiniMax Coding Plan（推荐）

**网址**：https://platform.minimaxi.com/subscribe/coding-plan

**申请步骤**：
1. 访问 MiniMax Coding Plan 页面
2. 登录/注册账号
3. 选择订阅档位（29/49/119 元）
4. 完成支付
5. 在控制台创建 API Key
6. 复制并保存 Key

##### 2.3.2.3 方案 C：GLM Coding Plan（推荐）

**网址**：https://bigmodel.cn/glm-coding

**申请步骤**：
1. 访问 GLM Coding 页面
2. 登录/注册账号
3. 选择订阅档位（49/149/469 元）
4. 完成支付
5. 在 usercenter 管理计划与 Key
6. 复制并保存 Key

#### 2.3.3 三家对比表

| 特性 | KIMI | MiniMax | GLM |
|------|------|---------|-----|
| 月费（2026-02-18 核验） | 49/99/199/699 元 | 29/49/119 元 | 49/149/469 元 |
| 推荐模型 | kimi-k2.5 | MiniMax-M2.5 | glm-5 |
| 特点 | 长文档处理强 | 速度快 | 均衡稳定 |
| 适合场景 | 报告/论文 | 日常对话 | 代码/推理 |

💡 **说明**：以上价格均按御三家国内站结算页口径记录；后续如有活动变动，请以实时页面为准。

#### 2.3.4 备选方案

如果上述三家都不适合你，还有以下选择：

##### 2.3.4.1 OpenRouter

**特点**：一个 API 对接多家模型（Claude、GPT、Llama 等）  
**网址**：https://openrouter.ai  
**适合**：想用一个 Key 调用多种模型的用户  
**注意**：国内访问可能需要代理

##### 2.3.4.2 Anthropic（Claude 官方）

**特点**：Claude 模型官方 API，质量顶尖  
**网址**：https://console.anthropic.com  
**适合**：追求最高质量回复的用户  
**注意**：国内访问需要代理，价格较高

### 2.4 第三样东西：10 分钟时间

这 10 分钟你要做什么？

| 时间 | 动作 |
|------|------|
| 2 分钟 | 检查电脑系统版本 |
| 5 分钟 | 申请 API Key（如果还没申请） |
| 3 分钟 | 把 Key 保存在安全的地方 |

**保存 Key 的建议**：
- ✅ 使用密码管理器（如 1Password、Bitwarden）
- ✅ 写在纸上锁进抽屉
- ❌ 不要存在微信文件传输助手
- ❌ 不要发到群里
- ❌ 不要上传到 GitHub

⚠️ **重要**：API Key 就像银行卡密码，泄露了别人就能花你的钱。妥善保管！

### 2.5 提前看看你会得到什么

完成本文学习后，你将拥有：

**一个能在微信里@的 AI 机器人**：
- 在群里@它，让它查资料
- 私聊让它写文档
- 24 小时随时待命

**一个可定制的 AI 助理**：
- 配置专属技能
- 接入你的工具链
- 学习你的工作习惯

**完全掌控的数据隐私**：
- 数据存在你的电脑
- 不经过第三方服务器
- 随时可以审计

#### 本部分小结

来，检查一下你的准备清单：
- [ ] 电脑系统符合要求
- [ ] API Key 已申请并保存
- [ ] 预留了 10 分钟时间

## 如果都准备好了

恭喜！你已经具备开始的所有条件。

#### 动手试试

在评论区留言：
> 我已经准备好了！我选择的模型厂商是：KIMI / MiniMax / GLM / 其他

---

## 第三部分：极速安装（5 分钟把神兽接回家）

🎯 **本章目标**：学完这章，你能完成 XXX 安装并发出第一条消息

⏱️ **预计时间**：5 分钟

📋 **前置要求**：已完成第 2 章（准备工作）

### 本章你将学会什么

- [ ] 检查 Node.js 环境
- [ ] 执行安装命令
- [ ] 完成初始化向导
- [ ] 发出第一条消息

### 3.1 环境检查：Node.js 是什么？

#### 3.1.1 Node.js 简介

**Node.js**是一个让 JavaScript 能在电脑本地运行的环境。简单说：
- 浏览器 = JavaScript 在网页里跑
- Node.js = JavaScript 在电脑里跑

Node.js 就像 JavaScript 的"翻译官"，让它能在浏览器之外的地方工作。

你不需要深入理解它，只需要确认电脑上已经安装了。

#### 3.1.2 检查 Node.js 版本

打开你的终端（Terminal），输入：

```bash
node --version
```

**期望看到的结果**：

```
v22.x.x
```

**判断标准**：
- ✅ `v22.x.x` 或更高 → 完美，继续
- ⚠️ `v18.x.x` 到 `v21.x.x` → 可以用，建议升级
- ❌ `v16.x.x` 或更低 → 必须升级

#### 3.1.3 如果 Node.js 不符合要求

##### macOS 安装/升级

```bash
# 使用 Homebrew 安装（推荐）
brew install node

# 如果已安装但版本低，升级
brew upgrade node
```

##### Windows 安装/升级

**推荐方式：使用 winget**

```bash
winget install OpenJS.NodeJS.LTS
```

**或者手动下载**：
1. 访问 https://nodejs.org/
2. 下载 LTS 版本
3. 运行安装程序

💡 **Windows 用户注意**：官方推荐在 WSL2 中运行 XXX，能避免很多奇怪问题。WSL2 安装指南：https://docs.microsoft.com/zh-cn/windows/wsl/install

##### Linux 安装/升级

**Ubuntu/Debian**：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL/Fedora**：

```bash
sudo dnf install nodejs
```

#### 3.1.4 验证安装

安装完成后，再次检查：

```bash
node --version
npm --version
```

两个命令都应该返回版本号。

⚠️ **常见问题**：如果安装后还是提示"command not found"，尝试**重启终端**或**重新登录系统**。

### 3.2 安装命令：就一行，复制粘贴

确认 Node.js >= v22 后，执行安装命令：

```bash
npm install -g openclaw@latest
```

**这行命令在做什么？**

| 部分 | 含义 |
|------|------|
| `npm` | Node.js 的包管理器 |
| `install` | 安装 |
| `-g` | 全局安装（任何地方都能用） |
| `openclaw` | 要安装的软件名 |
| `@latest` | 最新版本 |

**等待时间**：取决于你的网络，通常 30 秒到 2 分钟。

#### 3.2.1 验证安装成功

```bash
openclaw --version
```

期望看到类似输出：

```
2026.2.17
```

❌ **如果提示"command not found"**

可能原因：npm 全局路径未加入系统 PATH

解决方法：

```bash
npm prefix -g
```

### 3.3 运行向导：openclaw onboard

安装完成后，运行初始化向导：

```bash
openclaw onboard --install-daemon
```

**参数说明**：
- `onboard` = 初始化向导
- `--install-daemon` = 同时安装后台服务（Gateway）

#### 3.3.1 向导第一步：风险确认 + 已有配置处理

启动向导后，通常会先看到：

```
? I understand this is powerful and inherently risky. Continue?
❯ Yes
  No
```

这里选 `Yes` 继续。

如果你之前装过 XXX，还会看到：

```
Existing config detected
...
? Config handling
❯ Use existing values
  Update values
  Reset
```

**怎么选？**
- `Use existing values` = 保留现有配置
- `Update values` = 在现有基础上修改（推荐）
- `Reset` = 全部重置（谨慎）

#### 3.3.2 向导第二步：选择模式（Onboarding mode）

向导会问你：

```
? Onboarding mode
❯ QuickStart - Minimal setup, get running fast
  Manual - Full control over all settings
```

**怎么选？**

| 选项 | 适合谁 | 结果 |
|------|------|------|
| QuickStart | 新手，想快速跑起来 | 自动配置推荐设置 |
| Manual | 想完全掌控配置 | 逐个配置每个选项 |

**我的建议**：第一次选 **QuickStart**，后面可以随时改配置。

#### 3.3.3 向导第三步：先选模型厂商（Provider）

向导会提示你选择模型提供商：

```
? Which model provider would you like to use?
  OpenAI
  Anthropic
❯ KIMI
  MiniMax
  GLM
  Other (custom endpoint)
```

**先选你在第 2 章申请的厂商**（KIMI / MiniMax / GLM）。

#### 3.3.4 向导第四步：再选鉴权方式（Auth method，容易漏）

在你选完厂商后，通常不会立刻要 Key，而是先进入该厂商的鉴权方式选择。

常见会看到类似：

```
? <Provider> auth method
❯ Coding Plan / OAuth
  API Key
```

**国内读者建议：优先选 Coding Plan 对应项。**

#### 3.3.5 向导第五步：输入 API Key 并选模型

##### 如果选择 KIMI

```
? Enter your KIMI API Key: [粘贴你的 Key]
? Select model: ❯ kimi-k2.5
```

##### 如果选择 MiniMax

```
? Enter your MiniMax API Key: [粘贴你的 Key]
? Select model: ❯ MiniMax-M2.5
```

##### 如果选择 GLM

```
? Enter your GLM API Key: [粘贴你的 Key]
? Select model: ❯ glm-5
```

💡 **提示**：粘贴 API Key 时，终端不会显示任何字符（为了安全），这是正常的。直接粘贴后按回车即可。

#### 3.3.6 向导第六步：配置 Channel（先 Skip！）

在 QuickStart 路径下，向导会直接进入渠道单选列表：

```
? Select channel (QuickStart)
  ...
  WeChat (微信)
  ...
❯ Skip for now (You can add channels later via `openclaw channels add`)
```

**首次建议直接选 `Skip for now`。**

**为什么先 Skip？**
- Channel 配置需要额外步骤
- 先让核心功能跑起来
- 第 4 章会详细讲微信接入

**放心，第 4 章会详细讲微信接入。**

#### 3.3.7 向导第七步：配置 Skills（建议开）

Channel 之后，向导会进入 Skills 检查与可选安装：

```
Skills status
Eligible: ...
Missing requirements: ...
...

? Configure skills now? (recommended)
❯ Yes
  No
```

**首次建议选 `Yes`**，原因很简单：
现在就把"能自动装的依赖"装掉，后面少踩坑。

接下来常见会看到：

```
? Install missing skill dependencies
❯ Skip for now
  <某个 skill 依赖项...>

? Preferred node manager for skill installs
❯ npm
  pnpm
  bun
```

**给新手的默认建议：**
- `Install missing skill dependencies` → `Skip for now`
- `node manager` → `npm`

#### 3.3.8 向导第八步：配置 Hooks（建议最小开启）

Skills 后会进入 Hooks 配置：

```
Hooks
...
? Enable hooks?
❯ Skip for now
  <hook 列表...>
```

官方说明里，Hooks 用来"在某些命令触发时自动执行动作"（例如 `/new` 时做会话记忆整理）。

**本书建议的最小策略：**
- `session-memory` → 启用（会话记忆很有用）
- 其他 → `Skip for now`

#### 3.3.9 向导第九步：选择 Hatch 方式（关键）

在收尾阶段，向导会给你一个启动入口选择：

```
? How do you want to hatch your bot?
❯ Hatch in TUI (recommended)
  Open the Web UI
  Do this later
```

**怎么选？**
- `Hatch in TUI (recommended)` → 在终端界面启动（推荐）
- `Open the Web UI` → 打开网页界面
- `Do this later` → 稍后再说

**为什么默认选 TUI：**
- 更直观看到启动过程
- 方便排查问题
- 后续可以随时切 Web UI

#### 3.3.10 向导第十步：记录 Dashboard 链接与 Gateway 状态

在你完成 Hatch 选择后，向导会输出控制台访问信息与 Gateway 状态（如 `Web UI`、`Gateway WS`、`Gateway: reachable`）。

如果你选了 `Open the Web UI`，一般会直接给出带 token 的 Dashboard 链接并尝试自动打开浏览器。

如果你选了 `Do this later`，后续可用：

```bash
openclaw dashboard --no-open
```

再次获取控制台入口。

### 3.4 首次对话：先完成 bootstrap（真正初始化）

onboard 完成后，建议先在 TUI 里完成第一轮 bootstrap 对话。

官方流程会把它当成"把 Agent 变成你的 Agent"的关键动作（源码里有 `Wake up, my friend!` 引导）。

这一步建议你主动讲清楚下面 5 件事：
1. 你的名字/称呼
2. 你的工作领域
3. 你希望它怎么称呼你
4. 你的工作习惯
5. 你的禁忌/偏好

这一步做得越清楚，后续它越像"你自己的实例"，而不是"一个通用聊天机器人"。

💡 你也可以把这些信息落盘到工作区里的 `BOOTSTRAP.md / IDENTITY.md / USER.md / SOUL.md`，让后续会话更稳定。

### 3.5 Bootstrap 后，再发第一条"低上下文"消息

完成 bootstrap 后，建议先发一条**不依赖你工作背景**的消息做冒烟测试。

推荐你先用这条：

```
请给我一个"今天就能执行"的 5 条待办清单（每条不超过 18 个字），并按优先级排序。
```

如果你想测"查询能力"，可再补一条：

```
请告诉我北京今天的天气，并给出穿衣建议（1 句话）。
```

按回车发送。

**期望的回复**：

它应该直接给出结构化结果（清单或天气建议），而不是继续做泛泛自我介绍。

**如果看到回复，恭喜你！安装成功！** 🎉

### 3.6 如果出错了怎么办

#### 3.6.1 问题一：Gateway 启动失败

**症状**：向导提示 `Gateway failed to start`

**可能原因**：
- 端口 18789 被占用
- 配置文件错误
- 权限不足

**解决方法**：

```bash
# 查看端口占用
lsof -i :18789

# 或者换端口启动
openclaw gateway start --port 18790
```

#### 3.6.2 问题二：发送消息无回复

**症状**：消息发送后，一直显示"正在输入"但没有回复

**可能原因**：
- API Key 无效
- 网络连接问题
- 模型服务不可用

**解决方法**：

```bash
# 检查配置
openclaw config get

# 检查模型连接
openclaw doctor

# 查看日志
openclaw logs
```

#### 3.6.3 问题三：Web UI 打不开

**症状**：浏览器访问 `127.0.0.1:18789` 显示无法连接

**可能原因**：
- Gateway 未启动
- 端口被防火墙阻止
- 浏览器缓存问题

**解决方法**：

```bash
# 确认 Gateway 在运行
openclaw status

# 如果未运行，手动启动
openclaw gateway start
```

#### 本部分小结

来，回顾一下今天的成果：
- [ ] Node.js >= v22
- [ ] 执行 `npm install -g openclaw@latest`
- [ ] 运行 `openclaw onboard --install-daemon`
- [ ] 选择 `Hatch in TUI (recommended)`
- [ ] 完成 bootstrap 对话
- [ ] 发出第一条消息并收到回复

#### 动手试试

在评论区留言：
> 安装成功！我的第一条消息是：XXX

---

## 第四部分：微信接入（让它能在群里陪你聊天）

🎯 **本章目标**：学完这章，你能在微信里@AI 机器人，让它帮你办事

⏱️ **预计时间**：30 分钟

📋 **前置要求**：已完成第 3 章（安装成功，并在 TUI 完成 bootstrap 首轮对话）

### 本章你将学会什么

- [ ] 在微信开放平台创建应用
- [ ] 配置 OpenClaw 微信渠道
- [ ] 完成配对与测试
- [ ] 开启群聊功能

### 4.1 为什么第 3 章让你先 Skip Channel

还记得第 3 章的配置向导吗？我们在 Channel 那一步选择了 Skip。

**这不是省略，而是有意为之。**

实测经验告诉我们：
1. 先让 XXX 跑起来，确认基础功能正常
2. 再配置 Channel，避免问题叠加
3. 排障时更容易定位问题

如果你已经完成第 3 章，并且在 TUI 里完成了 bootstrap 初始化，这一章就是你的下一步。

### 4.2 微信接入的整体流程

不管你接的是哪家平台，基本都遵循同一条流水线：

```
1. 微信开放平台创建应用 → 2. 获取 AppID 和 AppSecret
         ↓
3. OpenClaw 配置微信 Channel → 4. 启动 Gateway
         ↓
5. 配置回调 URL → 6. 配对与放行 → 7. 测试私聊 → 8. 测试群聊
```

你可以把这 5 步理解为"固定骨架"。本章先把微信走通，其他渠道请走补充章或官方渠道文档。

### 4.3 阶段一：微信私聊机器人（降低复杂度）

本节按两段走：
1. 先搞定私聊机器人（本章）
2. 再开启群聊功能（4.8 节）

**为什么要分两段？**
- 私聊配置简单，容易成功
- 群聊涉及更多权限和配置
- 排障时，私聊比群聊简单得多

先确保私聊通，再搞群聊，能大幅降低复杂度。

### 4.4 Step 1：在微信开放平台创建应用

#### 4.4.1 打开平台并创建企业应用

1. 访问 https://open.weixin.qq.com/
2. 登录微信开放平台账号
3. 进入"管理中心" → "企业应用"
4. 点击"创建应用"

![创建企业应用]()

#### 4.4.2 获取 AppID 与 AppSecret

创建完成后，进入应用详情页：

- **AppID**: `cli_xxxxxxxxxxxxxxxx`
- **AppSecret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

![获取凭据]()

⚠️ **重要**：AppSecret 务必保密，不要截图外传，不要发到群里。泄露了别人就能控制你的机器人。

#### 4.4.3 权限配置（批量导入）

这是最容易出错的步骤，仔细跟着做。

在"权限管理"页面，添加以下权限：

```json
{
  "scopes": {
    "tenant": [
      "im:chat:read",
      "im:chat:write",
      "im:robot:write",
      "im:bot:menu:write"
    ]
  }
}
```

![配置权限]()

**这些权限是做什么的？**

| 权限 | 作用 |
|------|------|
| im:chat:write | 以机器人身份发送消息 |
| im:chat:read | 读取消息内容 |
| im:robot:write | 机器人权限 |

#### 4.4.4 启用 Bot 能力

在"机器人"页面，启用 Bot 能力。

![启用 Bot 能力]()

#### 4.4.5 首次发布应用（⚠️ 关键步骤！）

**切记：这一步必须在开启长连接之前完成！**

实测经验：如果还没先发布应用就直接开启"长连接订阅"，通常会持续失败。

**发布步骤**：
1. 点击"版本管理与发布"
2. 填写版本信息
3. 提交审核（通常 1-2 个工作日）
4. 审核通过后，应用状态变为"已发布"

💡 **提示**：审批通过后，应用状态会变为"已发布"。这时候才能进行下一步。

### 4.5 Step 2：在 OpenClaw 配置微信

#### 4.5.1 启用微信插件

先查看插件列表：

```bash
openclaw plugins list
```

如果存在 `wechat` 且状态是 `disabled`，启用它：

```bash
openclaw plugins enable wechat
```

💡 **提示**：官方文档也给出 `openclaw plugins install @openclaw/wechat`。但结合本书的实测，优先启用内置插件更稳定。

#### 4.5.2 交互式添加 Channel

运行命令：

```bash
openclaw channels add
```

按提示完成配置：

**问题 1：选择渠道类型**

```
? Select channel type:
❯ WeChat (微信)
  DingTalk (钉钉)
  Feishu (飞书)
  ...
```

选择 `WeChat (微信)`

**问题 2：输入 AppID**

```
? Enter WeChat AppID: cli_xxxxxxxxxxxxxxxx
```

粘贴你在 4.4.2 获取的 AppID

**问题 3：输入 AppSecret**

```
? Enter WeChat AppSecret: [粘贴 Secret]
```

粘贴你在 4.4.2 获取的 AppSecret（粘贴时不显示字符，这是正常的）

**问题 4：选择微信域名**

```
? Which WeChat domain?
❯ weixin.qq.com (国内版)
  wechat.com (国际版)
```

国内用户选 `weixin.qq.com`

**问题 5：群聊策略**

```
? Group chat policy:
❯ disabled (先不通群聊)
  enabled
```

**先选 `disabled`**，等私聊通了再开群聊。

**问题 6：需要 mention 才回复？**

```
? Require mention in group chats?
❯ yes (群里需要@才回复)
  no
```

选 `yes`，避免机器人在群里乱说话。

#### 4.5.3 验证配置

配置完成后，查看 Channel 列表：

```bash
openclaw channels list
```

应该显示：

```
NAME    TYPE    STATUS
wechat  wechat  configured
```

### 4.6 Step 3：开启事件订阅（长连接）

#### 4.6.1 关键时序（⚠️ 血的教训）

**正确的时序是**：
1. `openclaw channels add`（配置 Channel）
2. `openclaw gateway start`（启动 Gateway）
3. 在微信平台开启事件订阅

**如果顺序错了**，长连接会订阅失败，表现为"消息发出去，机器人没反应"。

#### 4.6.2 启动 Gateway

```bash
openclaw gateway start
```

确认输出：

```
✓ Gateway started on http://127.0.0.1:18789
```

#### 4.6.3 在微信平台开启事件订阅

在"开发" → "基本配置"页面，配置服务器地址。

![配置事件订阅]()

#### 4.6.4 添加事件订阅

在"订阅事件"区域，点击"添加事件"：

选择 `im.message.receive_v1`（收到消息时通知我）

### 4.7 Step 4：配对与放行

#### 4.7.1 私聊机器人触发配对

在微信里：
1. 找到你创建的机器人
2. 发送消息："你好"

这时候消息还到不了 XXX，因为需要先"配对"。

在默认 `dmPolicy: pairing` 下，机器人会在微信私聊里直接回一条配对提示，里面包含一段配对码（Pairing code）。

这就是对用户最直观、最容易拿到 code 的路径。

#### 4.7.2 方式 A（推荐）：直接用私聊里的配对码批准

让用户把微信私聊里看到的 `Pairing code` 发给管理员（或你自己复制）。

然后在终端执行：

```bash
openclaw pairing approve wechat <CODE>
```

例如：

```bash
openclaw pairing approve wechat A1B2C3D4
```

（把 `A1B2C3D4` 替换成微信私聊里看到的真实配对码）

#### 4.7.3 方式 B（备选）：在 OpenClaw 里查配对请求

如果你没看到私聊里的 code，或者想二次核对，再在终端运行：

```bash
openclaw pairing list wechat
```

应该显示：

```
Code      ID          Meta        Requested
A1B2C3D4  ou_xxx...   {...}       2026-02-18T10:10:00.000Z
```

再执行批准：

```bash
openclaw pairing approve wechat A1B2C3D4
```

（把 `A1B2C3D4` 换成上一步看到的真实配对码 `Code`）

#### 4.7.4 验证私聊

回到微信，再次发送消息：

```
你好，请介绍一下你自己
```

**期望结果**：机器人回复消息！✅

### 4.8 Step 5：开启群聊（可选）

私聊通了之后，可以开启群聊功能。

#### 4.8.1 修改 Channel 配置

```bash
openclaw channels add --channel wechat
```

修改：
- `groupChat`: `enabled`
- `requireMention`: `true`

#### 4.8.2 把机器人拉进群

在微信里把机器人拉进项目群。

#### 4.8.3 群里@机器人测试

在群里发送：

```
@AI 助手 你好
```

**期望结果**：机器人回复消息！✅

### 4.9 验收清单

完成本章后，你应该能：
- [ ] 在微信里私聊机器人
- [ ] 机器人能正确回复
- [ ] 在群里@机器人
- [ ] 机器人能识别@消息

#### 本部分小结

微信接入的核心要点：
1. 先发布应用，再开事件订阅
2. 先配 Channel，再启动 Gateway
3. 先搞定私聊，再开群聊
4. 群聊一定要开 `requireMention`

#### 动手试试

在评论区留言：
> 微信接入成功！我的机器人名字叫：XXX

---

## 第五部分：安全防护（别让它在公司大群乱回消息）

🎯 **本章目标**：学完这章，你能掌握微信渠道的安全配置，避免"机器人乱回"的尴尬

⏱️ **预计时间**：20 分钟

📋 **前置要求**：已完成第 4 章（微信基础接入）

### 本章你将学会什么

- [ ] 配置私聊策略
- [ ] 配置群聊策略
- [ ] 设置预算上限
- [ ] 限制高风险工具

### 5.1 为什么需要安全配置

先讲一个"血的教训"：

> 某公司把 XXX 机器人接入微信，没做安全配置。结果机器人被拉进一个有 500 人的大群，有人@它问了个敏感问题，机器人直接回复了内部数据。群里瞬间炸了。

**安全问题不是"会不会发生"，而是"什么时候发生"。**

本章的配置，就是给你的机器人上把锁。

### 5.2 私聊策略：谁能和机器人说话

XXX 提供三种私聊策略，在配置 Channel 时选择：

#### 5.2.1 策略一：pairing（推荐）

**机制**：用户必须先发送消息申请配对，管理员批准后才能对话

**适用场景**：
- ✅ 企业内部使用
- ✅ 需要控制访问权限
- ✅ 首次部署

**配置方式**：

```bash
openclaw channels add --channel wechat
```

设置 `privateChat`: `pairing`

**用户流程**：
1. 用户发送消息
2. 机器人回复配对码
3. 管理员执行 `openclaw pairing list wechat`
4. 获取 `Code`
5. 执行 `openclaw pairing approve wechat <CODE>`

#### 5.2.2 策略二：allowlist

**机制**：只有白名单里的用户能和机器人对话

**适用场景**：
- ✅ 小团队（<10 人）
- ✅ 固定用户使用

**配置方式**：

```json
{
  "privateChat": "allowlist",
  "allowFrom": ["user1@company.com", "user2@company.com"]
}
```

#### 5.2.3 策略三：all（不推荐）

**机制**：任何人都能和机器人对话

**适用场景**：
- ⚠️ 公开测试环境

**风险**：
- ❌ 任何人都能访问
- ❌ 可能被滥用
- ❌ 预算可能爆炸

### 5.3 群聊策略：别让它乱回消息

#### 5.3.1 requireMention：群聊的保险栓

**这个配置强烈建议开启！**

**机制**：机器人在群里只回复@它的消息，无视其他消息

**为什么重要？**

想象这个场景：
- 机器人在 500 人大群里
- 有人讨论敏感话题
- 机器人自动回复了内部数据
- **全群都看到了**

**配置方式**：

```bash
openclaw channels add --channel wechat
```

设置 `requireMention`: `true`

#### 5.3.2 群聊白名单：谁能拉机器人进群

即使开启了 requireMention，也建议配置群聊白名单：

```json
{
  "groupChat": "enabled",
  "groupAllowFrom": ["group1_id", "group2_id"],
  "requireMention": true
}
```

**怎么获取群 ID？**

在微信群里，点击群设置 → 群信息，可以看到群 ID。

### 5.4 风控 checklist：上线前的 5 个检查项

在把机器人正式投入使用前，按这个清单检查：

#### 5.4.1 Checklist

```
□ 私聊策略已配置（推荐 pairing）
□ 群聊 requireMention 已开启
□ 预算上限已设置
□ 高风险工具已限制
□ 日志记录已开启
```

#### 5.4.2 设置预算上限

```bash
# 查看当前预算设置
openclaw config get budget.monthly

# 设置月度预算上限（美元）
openclaw config set budget.monthly 50
```

#### 5.4.3 限制高风险工具

在配置文件中，限制 Agent 能使用的工具：

```json
{
  "agents": {
    "default": {
      "tools": {
        "allow": ["read_file", "write_file", "search_web"],
        "deny": ["execute_command", "send_email"]
      }
    }
  }
}
```

### 5.5 常见问题排查

#### 5.5.1 问题一：长连接订阅失败

**症状**：微信平台显示"长连接订阅失败"或"连接超时"

**可能原因**：
- Gateway 未启动
- 回调 URL 配置错误
- 网络防火墙阻止

**解决步骤**：
1. 检查 Gateway 状态：`openclaw status`
2. 检查回调 URL 是否正确
3. 检查防火墙规则

#### 5.5.2 问题二：消息发出去，机器人没反应

**症状**：微信里发消息，机器人不回复

**排查流程**：
```
1. 检查 Gateway 状态
   openclaw status

2. 检查 Channel 状态
   openclaw channels list

3. 检查配对状态
   openclaw pairing list wechat

4. 查看日志
   openclaw logs
```

**常见原因**：
- Gateway 未启动
- Channel 未正确配置
- 配对未完成
- 回调 URL 配置错误

#### 5.5.3 问题三：@机器人没反应

**症状**：群里@机器人，但它不回复

**排查步骤**：
1. 检查 `requireMention` 是否为 `true`
2. 查看群聊策略是否 `enabled`
3. 检查日志 `openclaw logs --follow`

#### 5.5.4 问题四：机器人回复很慢

**症状**：消息发出去，要等很久才收到回复

**可能原因**：
- 网络延迟
- 模型响应慢
- Gateway 负载高

**优化建议**：
- 检查网络连接
- 切换到更快的模型
- 增加 Gateway 资源

#### 5.5.5 问题五：机器人乱回消息

**症状**：机器人在不该回复的时候回复了

**立即处理**：
1. 临时关闭 Channel：`openclaw config set channels.wechat.enabled false`
2. 检查安全配置
3. 重新启用：`openclaw config set channels.wechat.enabled true`

### 5.6 安全配置最佳实践

#### 5.6.1 企业级部署建议

```json
{
  "channels": {
    "wechat": {
      "privateChat": "pairing",
      "groupChat": "enabled",
      "groupAllowFrom": ["approved_group_1", "approved_group_2"],
      "requireMention": true,
      "maxMessageLength": 2000,
      "rateLimit": {
        "perUser": 30,
        "perGroup": 100
      }
    }
  }
}
```

#### 5.6.2 个人使用建议

```json
{
  "channels": {
    "wechat": {
      "privateChat": "pairing",
      "groupChat": "disabled",
      "requireMention": true
    }
  }
}
```

#### 本部分小结

安全配置的核心原则：
1. 最小权限原则
2. 二次确认机制
3. 预算控制
4. 日志审计

#### 动手试试

在评论区留言：
> 我的安全配置已完成！我设置的月度预算是：XX 美元

---

## 第六部分：挑选大脑（KIMI、MiniMax、GLM 怎么选）

🎯 **本章目标**：学完这章，你能根据需求选择最适合的模型，并正确配置

⏱️ **预计时间**：20 分钟

📋 **前置要求**：已完成第 3 章（基础安装）

### 本章你将学会什么

- [ ] 对比三家模型特点
- [ ] 配置主模型和备用模型
- [ ] 设置预算监控

### 6.1 三家对比（国内站口径）

#### 6.1.1 快速对比表

| 维度 | KIMI（国内） | MiniMax（国内） | GLM（国内） |
|------|-------------|----------------|------------|
| 订阅入口 | https://www.kimi.com/code | https://platform.minimaxi.com/subscribe/coding-plan | https://bigmodel.cn/glm-coding |
| 本书默认模型 | `moonshot/kimi-k2.5` | `minimax/MiniMax-M2.5` | `zai/glm-5` |
| 月费档位（2026-02-18 核验） | 49/99/199/699 元 | 29/49/119 元 | 49/149/469 元 |
| 购买/管理路径 | Kimi Code 页面内订阅与管理 | Coding Plan 页面内订阅，控制台管理 Key | GLM Coding 页面订阅，usercenter 管理计划与 Key |
| 本章结论 | 长文档任务优先试用 | 速度优先任务优先试用 | 均衡任务优先试用 |

💡 **说明**：本章只使用御三家国内站口径；价格会随活动变动，购买前请以结算页实时显示为准。

#### 6.1.2 我的建议

**先选你已开通套餐的一家（最稳妥）**

先跑通、再优化，是对小白最友好的路径。先用已开通套餐的那一家完成第 3 章的安装和首轮对话，避免在起步阶段增加变量。

**如果三家都能用，再按任务类型切：**
- 长文档/报告 → `moonshot/kimi-k2.5`
- 快速回复 → `minimax/MiniMax-M2.5`
- 代码/推理 → `zai/glm-5`

上述建议是实操经验路径，不是官方性能排名；最终以你自己的任务实测为准。

### 6.2 KIMI Coding Plan 配置

#### 6.2.1 获取 API Key

访问 https://www.kimi.com/code，创建 API Key（格式：`sk-xxxxxxxx`）

#### 6.2.2 在 OpenClaw 配置 KIMI

**方式一：通过向导配置**

```bash
openclaw onboard
```

选择 KIMI，粘贴 API Key。

**方式二：手动配置**

```bash
# 先完成 KIMI 鉴权
openclaw onboard --auth-choice kimi-code-api-key

# 设置默认模型（provider/model）
openclaw models set moonshot/kimi-k2.5
```

#### 6.2.3 KIMI 可用模型

| 模型 | 上下文长度 | 特点 |
|------|-----------|------|
| kimi-k2.5 | 256K | 稳定主力，综合能力强 |
| kimi-k2-0905-preview | 256K | 新版本预览，适合尝鲜 |
| kimi-k2-thinking | 256K | 推理更强，速度略慢 |

**推荐**：日常使用选 `kimi-k2.5`，复杂推理再切 `kimi-k2-thinking`。

### 6.3 MiniMax Coding Plan 配置

#### 6.3.1 获取 API Key

访问 https://platform.minimaxi.com/subscribe/coding-plan，创建 API Key

#### 6.3.2 在 OpenClaw 配置 MiniMax

**通过向导配置**：

```bash
openclaw onboard
```

选择 MiniMax，粘贴 API Key。

**手动配置**：

```bash
# 先完成 MiniMax 鉴权（优先 Coding Plan/OAuth）
openclaw onboard --auth-choice minimax-portal

# 设置默认模型（provider/model）
openclaw models set minimax/MiniMax-M2.5
```

#### 6.3.3 MiniMax 可用模型

| 模型 | 特点 |
|------|------|
| MiniMax-M2.5 | 主力模型，质量和稳定性更均衡 |
| MiniMax-M2.5-Lightning | 速度更快，适合高并发场景 |
| MiniMax-M2.1 | 兼容旧配置时可用 |

**推荐**：默认选 `minimax/MiniMax-M2.5`，追求速度再切 Lightning。

### 6.4 GLM Coding Plan 配置

#### 6.4.1 获取 API Key

访问 https://bigmodel.cn/glm-coding，创建 API Key

#### 6.4.2 在 OpenClaw 配置 GLM

**通过向导配置**：

```bash
openclaw onboard
```

选择 GLM，粘贴 API Key。

**手动配置**：

```bash
# 先完成 Z.AI 鉴权（GLM）
openclaw onboard --auth-choice zai-api-key

# 设置默认模型（provider/model）
openclaw models set zai/glm-5
```

#### 6.4.3 GLM 可用模型

| 模型 | 特点 |
|------|------|
| glm-5 | 新一代主力模型，代码与推理能力更强 |
| glm-4.7 | 次新版本，稳定可用 |
| glm-4.7-flash | 更快更省，适合轻任务 |

**推荐**：默认选 `zai/glm-5`，轻任务可切 `zai/glm-4.7-flash`。

### 6.5 模型切换与回退

#### 6.5.1 配置主模型和备用模型

XXX 支持配置主模型（primary）和备用模型（fallbacks）：

```json
{
  "models": {
    "primary": {
      "provider": "kimi",
      "model": "kimi-k2.5",
      "apiKey": "sk-xxx"
    },
    "fallbacks": [
      {
        "provider": "minimax",
        "model": "MiniMax-M2.5",
        "apiKey": "xxx"
      },
      {
        "provider": "glm",
        "model": "glm-5",
        "apiKey": "xxx"
      }
    ]
  }
}
```

**工作原理**：
1. 优先使用主模型
2. 主模型失败时，自动切换到备用模型
3. 确保服务不中断

#### 6.5.2 动态切换模型

在对话中临时切换模型：

```
@agent 使用 MiniMax 回答这个问题
```

或在配置中设置规则：

```json
{
  "routing": {
    "byTask": {
      "coding": "kimi",
      "quickReply": "minimax",
      "longDoc": "kimi"
    }
  }
}
```

### 6.6 成本监控

#### 6.6.1 设置预算上限

```bash
# 设置月度预算（美元）
openclaw config set budget.monthly 50

# 设置单日预算
openclaw config set budget.daily 5
```

达到预算上限后，XXX 会：
- ⚠️ 发送警告通知
- 🛑 停止新的 API 调用
- 📊 生成使用报告

#### 6.6.2 查看使用统计

```bash
# 查看本月使用情况
openclaw gateway usage-cost

# 输出示例：
# Provider    Requests    Tokens    Cost(USD)
# kimi        1,234       5.2M      $12.34
# minimax     567         2.1M      $5.67
# Total                   7.3M      $18.01
```

#### 6.6.3 成本控制技巧

**限制单次请求 Token 数**：

```json
{
  "models": {
    "primary": {
      "maxTokens": 4000
    }
  }
}
```

**设置速率限制**：

```json
{
  "rateLimit": {
    "perMinute": 30,
    "perHour": 500
  }
}
```

#### 本部分小结

模型配置的核心要点：
1. 先选已开通套餐的一家
2. 按任务类型选择模型
3. 配置备用模型防中断
4. 设置预算上限控成本

#### 动手试试

在评论区留言：
> 我的主力模型是：XXX，月度预算设置为：XX 美元

---

## 第七部分：装备技能（让它学会自动生成日报）

🎯 **本章目标**：学完这章，你能搜索、安装、使用现成的 Skills

⏱️ **预计时间**：15 分钟

📋 **前置要求**：已完成第 10 章（了解 Tools）

### 本章你将学会什么

- [ ] 理解 ClawHub 是什么
- [ ] 搜索和安装 Skills
- [ ] 验证 Skills 可用性
- [ ] 调用 Skills 完成任务

### 7.1 ClawHub 是什么

#### 7.1.1 类比理解

> 📱 手机 App Store = 给手机装应用  
> 🤖 ClawHub = 给 XXX 装技能

#### 7.1.2 ClawHub 的特点

- ✅ **海量技能**：13,000+ 个 Skills
- ✅ **一键安装**：`clawhub install <skill-name>`
- ✅ **社区维护**：开发者贡献，持续更新
- ✅ **安全扫描**：自动检测恶意代码

#### 7.1.3 ClawHub 地址

网站：https://clawhub.com

### 7.2 搜索与安装

#### 7.2.1 命令行搜索

```bash
# 搜索关键词（推荐带引号）
openclaw skills list --eligible "daily report"
openclaw skills list --eligible "github review"
openclaw skills list --eligible "meeting notes"
```

**输出示例**：

```
NAME              DESCRIPTION              VERSION
----              -----------              -------
daily-report      自动生成日报             1.2.0
daily-summary     总结一天的工作内容       1.0.5
github-pr-helper  GitHub PR 审查助手       2.1.0
```

#### 7.2.2 安装 Skill

```bash
# 安装指定 Skill
不需要手动 install，Agent 会在需要时自动检索并拉取 daily-report
```

如果你要安装特定版本：

```bash
不需要手动 install，Agent 会在需要时自动检索并拉取 daily-report --version 1.2.0
```

安装过程：
1. 从 ClawHub 下载 Skill 代码
2. 安装依赖
3. 注册到 XXX
4. 更新 `~/.openclaw/workspace/skills/`

#### 7.2.3 查看已安装清单（ClawHub 侧）

```bash
clawhub list
```

### 7.3 验证可用性

#### 7.3.1 查看已安装 Skills

```bash
# 列出所有已安装 Skills
openclaw skills list

# 输出示例：
# NAME              VERSION    STATUS
# ----              -------    ------
# daily-report      1.2.0      installed
# github-pr-helper  2.1.0      installed
```

#### 7.3.2 检查 Skills 是否可用

```bash
# 检查所有 Skills 的可用性
openclaw skills list --eligible

# 输出示例：
# NAME              STATUS      REASON
# ----              ------      ------
# daily-report      ✓ eligible  All requirements met
# github-pr-helper  ✗ missing   Missing tool: github_api
```

**eligible** 表示：
- ✅ 所有依赖已安装
- ✅ 配置正确
- ✅ 可以立即使用

#### 7.3.3 查看 Skill 详情

```bash
openclaw skills info daily-report
```

**输出示例**：

```
Name: daily-report
Version: 1.2.0
Path: ~/.openclaw/workspace/skills/daily-report
Requirements:
  - read_file ✓
  - write_file ✓
  - fetch_url ✓
Inputs:
  - date: 日期（可选，默认今天）
  - sources: 数据源（如：email,calendar）
```

提醒：实际路径以你的 workspace 为准，通常是 `<workspace>/skills/<name>/SKILL.md`，默认 workspace 常见为 `~/.openclaw/workspace`。

### 7.4 第一个 Skill：从安装到调用

#### 7.4.1 安装示例 Skill

我们以 `daily-report` 为例：

```bash
# 安装
不需要手动 install，Agent 会在需要时自动检索并拉取 daily-report

# 验证安装
openclaw skills list --eligible
```

#### 7.4.2 调用 Skill

**方式一：在对话中直接调用**

```
用户：运行 daily-report 生成今天的日报
Agent：调用 daily-report Skill，生成日报
```

**方式二：使用命令**

```bash
openclaw agent --message "调用 daily-report 生成今天的日报"
```

**方式三：带参数调用**

```bash
openclaw agent --message "调用 daily-report，日期=2026-02-18，数据源=email,calendar"
```

#### 7.4.3 查看执行结果

Skill 执行后，会：

```
✓ daily-report executed successfully
  Output: /home/user/reports/daily-2026-02-18.md
  Time: 3.2s
```

### 7.5 更新与回退处理

#### 7.5.1 更新 Skills

```bash
# 更新指定 Skill
clawhub update daily-report

# 更新所有 Skills
clawhub update --all
```

#### 7.5.2 回退或覆盖安装

```bash
# 强制覆盖当前目录中的同名 Skill
不需要手动 install，Agent 会在需要时自动检索并拉取 daily-report --force
```

如果你要"停用"某个 Skill，建议在 XXX 配置里将对应条目 `enabled: false`，而不是直接删除文件夹。

### 7.6 推荐 Skills 清单

#### 7.6.1 生产力类

| Skill | 功能 | 适用场景 |
|-------|------|---------|
| daily-report | 自动生成日报 | 每天写日报的打工人 |
| meeting-notes | 会议纪要整理 | 会议记录员 |
| email-digest | 邮件摘要 | 邮件太多的用户 |

#### 7.6.2 开发类

| Skill | 功能 | 适用场景 |
|-------|------|---------|
| github-pr-helper | PR 审查 | 开发者 |
| code-review | 代码审查 | 代码审查员 |
| release-notes | 生成发布说明 | 产品经理 |

#### 7.6.3 内容类

| Skill | 功能 | 适用场景 |
|-------|------|---------|
| article-summarizer | 文章摘要 | 内容创作者 |
| translation-helper | 翻译助手 | 需要翻译的用户 |
| markdown-formatter | Markdown 格式化 | 写文档的用户 |

#### 本部分小结

使用 Skills 的核心要点：
1. 用 `openclaw skills list --eligible` 搜索
2. Agent 会自动安装需要的 Skill
3. 用 `openclaw skills list` 验证
4. 在对话中直接调用

#### 动手试试

在评论区留言：
> 我安装的第一个 Skill 是：XXX，用来做：XXX

---

## 🎉 结语：你的 AI 助理已经准备就绪

恭喜你！读到这里，你已经成功跨越了 XXX 的新手村。

你现在不仅拥有了一个能在终端里跑的智能体，还把它成功接到了微信里，并且学会了如何给它上"安全锁"、如何挑选最划算的国产大模型，甚至掌握了给它配置"技能"的方法。

**从今天起，它不再是冷冰冰的代码，而是你专属的、7x24 小时随时待命的 AI 实习生！**

接下来的路，就看你如何发挥想象力，用它来解放你的双手了。如果未来你需要把它部署到服务器上，或者想自己动手写一个独一无二的 Skill，再去翻阅完整的官方文档也不迟。

祝你和你的 XXX 合作愉快！🚀

---

**觉得有用？欢迎转发给需要的朋友！** 📲

**有问题？在评论区留言！** 💬

**有创意？在评论区分享你的用法！** 🌟

---

**微信扫一扫**  
关注该公众号

![作者二维码]()
![作者头像]()

微信扫一扫可打开此内容，  
使用完整服务
```

---

## 📝 模板使用说明

### 1. 替换占位符

| 占位符 | 替换为 |
|--------|--------|
| `XXX` | 你的产品名称（如 OpenClaw） |
| `微信` | 你的目标渠道（钉钉/飞书等） |
| `KIMI/MiniMax/GLM` | 实际支持的模型厂商 |
| 链接和图片 | 实际的链接和图片地址 |

### 2. 配图建议

| 位置 | 建议内容 |
|------|---------|
| 封面图 | 产品 Logo + 标题 |
| 场景图 | 实际使用截图 |
| 配置图 | 配置界面截图 |
| 对比图 | 模型对比表格截图 |

### 3. 排版建议

- 使用**加粗**强调重点
- 使用 `代码块` 展示命令
- 使用表格对比信息
- 使用 emoji 增加可读性
- 每章结尾有"动手试试"互动

### 4. 互动设计

每章结尾设置互动话题：
- 安装成功留言
- 配置完成打卡
- 使用场景分享

---

**小虾米，模板已生成！** 🎉

**文件位置**: `/home/rocky/.openclaw/workspace/articles/wechat-article-template.md`

**需要我帮你**：
1. 填充具体内容？
2. 调整模板结构？
3. 生成配图建议？

告诉我！🐝📝