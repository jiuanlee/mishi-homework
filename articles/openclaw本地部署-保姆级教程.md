# OpenClaw 本地部署实战 + 多渠道接入实战指南

**作者**: 吃咸鱼的小虾米  

---

## ✨ 写在前面

> ⚠️ **重要提示**：这是一份**实战导向**的部署指南，基于作者真实配置编写。所有步骤都经过验证，你可以放心跟着做。

**你将学到什么**：

- ✅ OpenClaw 本地部署全流程
- ✅ MiniMax 模型配置
- ✅ 安全加固配置（防公网扫描、端口暴露）
- ✅ 接入钉钉企业机器人（Stream 模式）
- ✅ 接入企业微信机器人（长连接 模式）
- ✅ 必备 Skills 安装（skill-vetter、Tavily Search）

**适合谁看**：

- 想在企业内部部署 AI 助理的开发者
- 希望自动化日常工作的打工人
- 对 AI Agent 感兴趣的技术爱好者

---

## 一、OpenClaw 是什么？

### 1.1 一句话解释

**OpenClaw 是一个 AI 智能体平台，让你能在自己的电脑上运行 AI 助理，并把它接入到日常使用的工具里。**

想象一下：你招了一个实习生，这个实习生特别聪明，能帮你查资料、写文档、整理数据，还能 24 小时在线。但你不需要给它交社保，也不用担心它跳槽。

**OpenClaw 就是这个实习生，只不过它住在你的电脑里。**

### 1.2 核心特点

| 特点 | 说明 | 优势 |
|------|------|------|
| 🏠 **本地部署** | 运行在你的电脑上 | 数据隐私可控 |
| 🔌 **多渠道接入** | 钉钉、企业微信、飞书、Telegram 等 | 在哪都能用 |
| 🧩 **技能扩展** | 通过 ClawHub 安装 Skills | 功能无限扩展 |
| 🛡️ **安全可控** | 最小权限原则 | 不会乱来 |

---

## 二、开工准备（你只需要这三样东西）

### 2.1 别慌，你只需要这三样东西

| 物品 | 说明 | 获取方式 |
|------|------|---------|
| 💻 一台电脑 | 近 5 年的电脑都行 | 默认你有 |
| 🔑 模型 API Key | AI 模型的访问凭证 | 5 分钟申请 |
| ⏱️ 60 分钟时间 | 完成部署 + 安全配置 | 照着文档做 |

### 2.2 系统要求

| 系统 | 要求 | 备注 |
|------|------|------|
| macOS | 10.15+ | Intel 和 Apple Silicon 都支持 |
| Windows | 10/11 | 推荐用 WSL2(本文实战用) |
| Linux | 主流发行版 | Ubuntu/Debian/CentOS 都行 |

### 2.3 申请 模型 API Key

**本文以MiniMax为例。**

#### 步骤 1：访问 MiniMax 开放平台

打开 https://platform.minimaxi.com/


#### 步骤 2：注册/登录账号

1. 使用手机号或邮箱注册
2. 完成实名认证（需要，用于 API 调用）


#### 步骤 3：创建 API Key

1. 进入"用户中心" → "API Key 管理"
2. 点击"创建新的 API Key"
3. 复制并保存 Key（格式：`xxxxxxxxxxxxxxxx`）

📸 [apiKey](./images/minimax1.png)

---

## 三、极速安装（5 分钟把神兽接回家）

### 3.1 检查 Node.js

OpenClaw 需要 Node.js v22 或更高版本。

```bash
node --version
```

**期望输出**：`v22.x.x` 或更高

**如果版本太低**：

```bash
# macOS
brew install node@22

# Windows (winget)
winget install OpenJS.NodeJS.LTS

# Linux (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3.2 安装命令

```bash
npm install -g openclaw@latest
```

**等待时间**：取决于你的网络，通常 30 秒到 2 分钟。安装方式很多，用自己最喜欢的方式。
参考：https://docs.openclaw.ai/install

### 3.3 验证安装

```bash
openclaw --version
```

期望输出类似：`2026.3.2`

---

## 四、Onboard 向导配置（关键步骤）

### 4.1 启动向导

安装完成后，运行初始化向导：

```bash
openclaw onboard --install-daemon
```

📸 **截图位置 7**：向导启动界面

### 4.2 向导配置步骤

#### 第一步：风险确认

```
? I understand this is powerful and inherently risky. Continue?
❯ Yes
  No
```

选 **`Yes`** 继续。

📸 [风险确认对话框](./images/sec-warn.png)

#### 第二步：选择模式

```
? Onboarding mode
❯ QuickStart - Minimal setup, get running fast
  Manual - Full control over all settings
```

**新手选 `QuickStart`**，后面可以随时改配置。

📸 [模式选择界面](./images/model_choose.png)

#### 第三步：选择模型厂商

```
? Which model provider would you like to use?
```

**选 `MiniMax`**。

📸 [模型厂商选择](./images/model_choose2.png)

#### 第四步：输入 API Key

```
? Enter your MiniMax API Key: [粘贴你的 Key]
```

粘贴刚才在 MiniMax 平台创建的 API Key。

💡 **提示**：粘贴时终端不会显示字符（为了安全），这是正常的。直接粘贴后按回车即可。

#### 第五步：选择模型

```
? Select model:
❯ MiniMax-M2.5
  MiniMax-M2.5-Lightning
  MiniMax-M2.1
```

**推荐选 `MiniMax-M2.5`**。


#### 第六步：配置 Channel（先 Skip！）

```
? Select channel (QuickStart)
  ...
  DingTalk (钉钉)
  WeCom (企业微信)
  ...
❯ Skip for now (You can add channels later)
```

**第一次先选 `Skip for now`**，后续章会详细讲钉钉和企业微信接入。

📸 [Channel 配置跳过](./images/channel_sel.png)

#### 第七步：配置 Skills

```
? Configure skills now? (recommended)
❯ Yes
  No
```

**选 `Yes`**，把能自动装的依赖装掉，后面少踩坑，安装可能会花几分钟的时间。

#### manager for skill installs

node manager 选你本机已经在用的那个（不确定就用 npm）。

[管理skill](./images/skill_manager.png)

#### 设置一些key

[设置key](./images/setSomeKey.png)

根据自己的情况，选择YES/NO。

#### 设置hooks

官方说明里，Hooks 用来“在某些命令触发时自动执行动作”（例如 /new 时做会话记忆整理）。

1. 首次可先启用 1 个最核心 hook（最小可用，优先 session-memory，若列表里有）；
2. 如果你现在还分不清 hook 的作用，也可以先 Skip for now；

[设置hooks](./images/sethooks.png)

#### 向导第九步：选择 Hatch 方式（关键）

```
? How do you want to hatch your bot?
❯ Hatch in TUI (recommended)
  Open the Web UI
  Do this later
```

怎么选：

1. Hatch in TUI (recommended)：终端里直接进入交互（推荐）；若选择这个，向导会输出控制台访问信息与网关状态（如 Web UI、Gateway WS、Gateway: reachable）。
2.  Open the Web UI 通过浏览器控制台（图形化）；选择后，一般会直接给出带 token 的 Dashboard 链接并尝试自动打开浏览器。
3.  Do this later：先结束向导，稍后再进。 通过下面的命令，再次获取控制台入口。

    ```
    openclaw dashboard --no-open
    ```

为什么默认选 TUI：

1. 我们无法假设你一定在本机操作；很多读者是在云主机/VPS 上跑。
2. 如果是 VPS，Open the Web UI 往往还要做端口转发，对新手不友好。
3. 选 Hatch in TUI 可以立刻开始对话，不被网络与端口问题卡住。

### 4.3 首次对话：先完成 bootstrap（真正初始化）

onboard 完成后，建议先在 TUI 里完成第一轮 bootstrap 对话。官方流程会把它当成“把 Agent 变成你的 Agent”的关键动作（源码里有 Wake up, my friend! 引导）。

这一步建议你主动讲清楚下面 5 件事：

1. 定义你自己：怎么称呼你、你的时区和语言。
2. 你是什么角色：比如“编程大牛”。
3. 你的工作场景：常用工具、文件目录、沟通方式（企微等）。
4. 你的风格偏好：回答风格、方式、是否先给结论等。
5. 你的底线：哪些操作必须先确认、哪些内容不要碰。这一步做得越清楚，后续它越像“你自己的实例”，而不是“一个通用聊天机器人”。
6. [OpenClaw 个性化配置模板与场景示例](https://help.aliyun.com/zh/simple-application-server/use-cases/openclaw-personalized-configuration-template-and-scenario-example?spm=a2c4g.11186623.help-menu-58607.d_3_0_0_8.b98466eeic6vfa&scm=20140722.H_3021890._.OR_help-T_cn~zh-V_1)


**恭喜你到这里，你的openclaw基本就安装成功并能和你称兄道弟了** 🎉

---

## 五、安全加固配置

> ⚠️ **重要**：这一章非常重要！配置不当可能导致你的 OpenClaw 被公网扫描，API Key 泄露，甚至被勒索！

### 5.1 为什么需要安全配置？

**真实案例**（2026 年 2 月）：
> 某开发者部署 OpenClaw 后，没有修改默认配置，Gateway 绑定在 `0.0.0.0:18789`，被公网扫描发现。攻击者利用未授权的 API 访问，窃取了配置的 API Key，并产生了约 5000 元的费用。

**常见风险**：

1. 🔴 **端口暴露** - Gateway 绑定 `0.0.0.0`，被公网扫描
2. 🔴 **无认证** - 未配置 Token，任何人都能访问
3. 🔴 **API Key 泄露** - 配置文件未加密，被窃取
4. 🔴 **内网穿透滥用** - Cloudflare Tunnel 配置不当，暴露内网服务

### 5.2 核心安全配置（必做！）

#### 配置一：绑定本地回环地址

**问题**：默认配置可能绑定 `0.0.0.0`（所有网卡），导致公网可访问。

**解决方案**：强制绑定 `127.0.0.1`（仅本地访问）。

**步骤**：

1. 编辑配置文件：

```bash
nano ~/.openclaw/openclaw.json
```

2. 修改 `gateway` 配置：

```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",  // ← 关键：绑定本地回环
    "auth": {
      "mode": "token",
      "token": "你的强密码 Token"
    }
  }
}
```

3. 验证配置：

```bash
openclaw config get gateway.bind
# 应该输出："loopback"
```

📸[显示](./images/loopback.png)

4. 重启 Gateway：

```bash
openclaw gateway restart
```

#### 配置二：配置强密码 Token

**问题**：默认 Token 可能太弱，容易被爆破。

**解决方案**：生成强密码 Token。

**步骤**：

1. 生成强密码：

```bash
# 生成 32 字符随机 Token
openssl rand -hex 32
```

**输出示例**：`74fc76328dc9bca231891ae24bf83a0cea6a3f5de0ea44bf`

2. 配置 Token：

```bash
openclaw config set gateway.auth.token "生成的 Token"
```

3. 验证配置：

```bash
openclaw config get gateway.auth
```

📸 [Token 配置验证](./images/token.png)

⚠️ **重要**：

- Token 至少 32 字符
- 包含大小写字母、数字、特殊字符
- 不要使用默认 Token
- 定期更换（建议每月）

#### 配置三：配置防火墙/内网穿透

因为本次部署在windows的wsl中，防火墙配置以及内网穿透相关的设置没有配置，可自行google或咨询自己的龙虾。


#### 5.3 API Key 安全存储

**问题**：API Key 明文存储在配置文件中，可能被窃取。

**解决方案**：使用密钥管理服务。

#### 方案一：使用环境变量（推荐）

1. 创建环境变量文件：
```bash
nano ~/.openclaw/.env
```

2. 添加内容（不要提交到 Git！）：
```bash
MINIMAX_API_KEY="你的 API Key"
```

3. 设置文件权限：
```bash
chmod 600 ~/.openclaw/.env
```

4. 在配置中引用：
```json
{
  "models": {
    "providers": {
      "minimax": {
        "apiKey": "${MINIMAX_API_KEY}"
      }
    }
  }
}
```

#### 方案二：使用系统密钥环

**macOS (Keychain)**：

```bash
# 存储 API Key
security add-generic-password -s "openclaw-minimax" -a "api-key" -w "你的 API Key"

# 读取 API Key
security find-generic-password -s "openclaw-minimax" -a "api-key" -w
```

**Linux (Secret Service)**：

```bash
# 安装
sudo apt install gnome-keyring

# 存储 API Key
secret-tool store --label='OpenClaw MiniMax API Key' service openclaw account minimax

# 读取 API Key
secret-tool lookup service openclaw account minimax
```

**Windows (Credential Manager)**：

```powershell
# 使用 Windows Credential Manager
# 控制面板 → 用户账户 → 凭据管理器 → Windows 凭据 → 添加凭据
```

### 5.4 定期安全检查

#### 检查清单（每月执行）

```bash
# 1. 检查端口绑定
netstat -tlnp | grep 18789
# 应该只看到 127.0.0.1:18789

# 2. 检查 Token 强度
openclaw config get gateway.auth.token
# 应该至少 32 字符

# 3. 检查 API Key 是否泄露
# 访问 MiniMax（模型供应商） 控制台，查看调用日志
# 检查是否有异常调用

# 4. 检查 OpenClaw 版本
openclaw --version
# 确保是最新版本（安全更新）

# 5. 检查已安装 Skills
openclaw skills list --eligible
# 移除不需要的 Skills

# 6. 检查日志
openclaw logs | grep -i "error\|warning"
# 查看是否有安全相关的警告
```

---

## 六、推荐 Skills 安装

### 6.1 ClawHub

> 📱 **手机 App Store** = 给手机装应用  
> 🤖 **ClawHub** = 给 OpenClaw 装技能

**ClawHub** 是 OpenClaw 的 Skills 市场，开发者可以上传和分享 Skills。

#### 特点

- ✅ **海量技能**：13,000+ 个 Skills
- ✅ **一键安装**：`clawhub install <skill-name>`
- ✅ **社区维护**：开发者贡献，持续更新
- ✅ **安全扫描**：自动检测恶意代码

#### 地址

网站：https://clawhub.com

📸 [ClawHub 网站首页](./images/clawhub.png)

### 6.2 如何评估 Skill 安全性

在 ClawHub 上安装任何 Skill 之前，**务必查看安全报告**！

#### 6.2.1 安全扫描报告解读

每个 Skill 都有安全扫描报告，包含以下维度：

| 检测项 | 说明 | 风险等级 |
|--------|------|---------|
| **Purpose & Capability** | 名称/描述是否与实际代码一致 | ✅ 必须一致 |
| **Instruction Scope** | 指令范围是否合理 | ⚠️ 注意文件写入权限 |
| **Install Mechanism** | 安装机制是否安全 | ⚠️ 避免自动下载执行 |
| **Credentials** | 是否索要凭证 | ❌ 索要 API Key 要警惕 |
| **Persistence & Privilege** | 持久化和权限 | ⚠️ 注意 always:true |

#### 6.2.2 风险信号

看到这些信号要**高度警惕**：

| 信号 | 风险 | 建议 |
|------|------|------|
| 🔴 VirusTotal 标记可疑 | 可能含恶意代码 | 不要安装 |
| 🔴 索要 API Key/凭证 | 可能窃取凭证 | 仔细审查代码 |
| 🔴 自动下载执行 | 可能执行恶意脚本 | 避免安装 |
| 🟡 无下载量/新发布 | 未经验证 | 观望一段时间 |
| 🟡 代码混淆 | 隐藏真实意图 | 要求开源审查 |

[安全报告](./images/skill-3.png)

#### 6.2.3 安全实践

```
1. 优先选择下载量高的 Skills（>1000 次）
2. 查看发布时间（>3 个月更可靠）
3. 阅读安全扫描报告（至少 Benign）
4. 审查代码（如果会看的话）
5. 在测试环境先试用
```

### 6.3 推荐skill

#### 6.3.1 skill-vetter（安全扫描器）

**作用**：在安装任何 Skill 之前，自动扫描代码，检查恶意行为。

**为什么必装**：

- 🔍 **恶意代码检测** - 检测偷 API Key、注入恶意代码
- 🛡️ **权限审查** - 检查 Skill 申请的权限是否合理
- 📊 **安全评级** - SAFE/CAUTION/DANGEROUS 三档评级
- ⚠️ **风险预警** - 发现可疑行为立即警告

#### 安装命令

```bash
clawhub install skill-vetter
```

#### 验证安装

```bash
openclaw skills list --eligible | grep vetter
```

期望看到 `skill-vetter` 在列表中。

#### 使用示例

安装其他 Skill 时，skill-vetter 会自动运行：

```bash
clawhub install github
```

会显示安全扫描报告：

```
🔍 Scanning github...
✅ VirusTotal: Benign
✅ OpenClaw: Benign (high confidence)
✅ Purpose & Capability: Match
⚠️ Instruction Scope: Review file write permissions
```

#### 6.3.2 Tavily Search（网络搜索）

**作用**：让 OpenClaw 能够搜索互联网，获取实时信息。

**为什么必装**：

- 🔍 **实时搜索** - 获取最新新闻、数据、文档
- 📊 **结构化结果** - 返回干净的摘要，不是垃圾链接
- 🎯 **AI 优化** - 专门为 AI Agent 优化的搜索 API
- ⚡ **速度快** - 平均响应时间 <2 秒

##### 申请 Tavily API Key

1. 访问 https://tavily.com/
2. 注册账号（支持 GitHub 登录）
3. 进入 Dashboard → API Keys
4. 创建 API Key（格式：`tvly-xxxxxxxx`）

📸 [Tavily API Key 创建](./images/tavily-search.png)

💰 **免费额度**：每月 1000 次搜索（个人使用足够）

##### 安装命令

```bash
clawhub install openclaw-tavily
```

##### 配置 API Key

```bash
openclaw config set skills.tavily.apiKey "tvly-xxxxxxxx"
```

#### 6.3.3 self-improving-agent

- **功能**：记录错误、学习经验、持续进化
- **适用场景**：希望 AI 持续学习的用户
- **安全评分**：✅ Benign

##### 安装命令
```bash
clawhub install self-improving-agent
```

#### 6.4 capability-evolver进化引擎类

- **功能**：基于 GEP 协议的 AI 自我进化
- **适用场景**：需要 AI 自动改进工作流
- **GitHub**：1.2k+ stars


##### 安装命令

```bash
clawhub install capability-evolver
```

#### 6.3.4 其他推荐 Skills

| Skill | 功能 | 安装命令 |
|-------|------|---------|
| **github** | GitHub 集成 | `clawhub install github` |
| **debug-pro** | 调试方法论 | `clawhub install debug-pro` |
| **coding-agent** | 编程助手 | `clawhub install coding-agent` |

可以根据自己的需要，在列表筛选出安装需要的skill。
 
#### 6.4 可能遇到的问题

ClawHub 限流怎么办？

解决方案：

1. 等待 5-10 分钟再试
2. 使用手动安装（Git 克隆）
3. [腾讯skillbub](https://skillhub.tencent.com/#featured)  
[选中skill](./images/skillhub.png)

---

## 八、钉钉接入（Stream 模式）

### 8.1 为什么选择 Stream 模式？

| 方式 | Webhook（短连接） | Stream（长连接） |
|------|---------|---------|
| 连接方式 | 每次回调建立新连接 | 复用已建立的长连接 |
| 延迟 | 较高（每次需建连） | 低（复用连接） |
| 实时性 | 一般 | 好 |
| **服务端要求** | **需要公网可访问的 URL** | **无需固定的公网 IP** |
| 加解密 | 需要对消息加解密 | 无需加解密 |
| 复杂度 | 低 | 较高（需维护心跳） |
| **适用场景** | 有公网 IP | **本地部署/内网环境** |

**结论**：本地部署选 **Stream 模式**！

### 8.2 Step 1：在钉钉开放平台创建应用

#### 8.2.1 打开平台并创建应用

1. 访问 https://open-dev.dingtalk.com/
2. 登录钉钉开发者账号
3. 点击"创建应用" → 选择"企业内部开发"

📸 [创建应用弹窗](./images/dingtalk模板.png)

#### 8.2.2 获取凭证

创建完成后，进入应用详情页：

- **AppKey**: `dingxxxxxxxxxxxxxx`
- **AppSecret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

[AppKey/AppSecret](./images/ding_secret.png)
[CorpId](./images/corpId.png)

⚠️ **重要**：AppSecret 务必保密，不要截图外传！

#### 8.2.3 权限配置

在"权限管理"页面，添加以下权限：

```
Card.Streaming.Write  # AI卡片流式更新权限
Card.Instance.Write   # 互动卡片实例写权限
```

📸 [权限管理页面](./images/right.png)

需要什么权限，搜索添加即可。

#### 8.2.4 发布应用

1. 点击"版本管理与发布"
2. 填写版本信息
3. 提交审核
4. 审核通过后，应用状态变为"已发布"

### 8.3 Step 2：在 OpenClaw 配置钉钉

#### 8.3.1 启用钉钉插件

```bash
openclaw plugins install @dingtalk-real-ai/dingtalk-connector
openclaw plugins list
openclaw plugins enable dingtalk
```

#### 8.3.2 交互式添加 Channel

运行命令：

```bash
openclaw channels add
```

按提示输入：

- Channel 类型：`DingTalk (钉钉)`
- AppKey：粘贴 AppKey
- AppSecret：粘贴 AppSecret
- 群聊策略：先选 `disabled`
- 需要 mention：选 `yes`

📸 [channel列表](./images/dingding.png)

📸 [Channel 配置过程](./images/dingtaklk2.png)

📸 [clientId输入](./images/dingtaklk2.png)
 将相关key 按照知识黏贴即可。

#### 8.3.3 验证配置

```bash
openclaw channels list
```

列表中会有显示

### 8.4 Step 3：启动 Gateway

```bash
openclaw gateway start
```

### 8.5 Step 4：配对与放行

#### 8.5.1 私聊机器人触发配对

在钉钉里找到机器人，发送消息："你好"

机器人会回复一条配对提示，包含配对码。

#### 8.5.2 批准配对

```bash
openclaw pairing list dingtalk
openclaw pairing approve dingtalk A1B2C3D4
```

#### 8.5.3 验证私聊

回到钉钉，再次发送消息：钉钉私聊，机器人成功回复，done!


```bash
openclaw channels add --channel dingtalk
```

修改：

- `groupChat`: `enabled`
- `requireMention`: `true`

把机器人拉进群，@它测试。

[钉钉本地接入指南](https://open.dingtalk.com/document/dingstart/install-openclaw-locally)

### 企微接入

[企微接入指南](https://open.work.weixin.qq.com/help2/pc/cat?doc_id=21657)

---

## 九、常用命令速查

### 安装与配置

```bash
# 安装 OpenClaw
npm install -g openclaw@latest

# 初始化向导
openclaw onboard --install-daemon

# 查看版本
openclaw --version
```

### Gateway 管理

```bash
# 启动 Gateway
openclaw gateway start

# 停止 Gateway
openclaw gateway stop

# 重启 Gateway
openclaw gateway restart

# 查看状态
openclaw status
```

### Channel 管理

```bash
# 添加 Channel
openclaw channels add

# 查看 Channel 列表
openclaw channels list

# 修改 Channel 配置
openclaw channels add --channel dingtalk
```

### 配对管理

```bash
# 查看配对请求
openclaw pairing list dingtalk

# 批准配对
openclaw pairing approve dingtalk <CODE>

# 拒绝配对
openclaw pairing reject dingtalk <CODE>
```

### 日志与排查

```bash
# 查看日志
openclaw logs

# 实时查看日志
openclaw logs --follow

# 健康检查
openclaw doctor

```

### Skills 管理

```bash
# 搜索 Skills
openclaw skills list --eligible "keyword"

# 安装 Skill
clawhub install <skill-name>

# 查看已安装 Skills
openclaw skills list

# 更新 Skills
clawhub update --all
```

## 十、写在最后：这只是开始 🚀

恭喜你完成了整个部署流程！🎉

现在，你已经拥有了一只属于自己的"AI龙虾"（OpenClaw），它可以：

- ✅ 在钉钉/企业微信群里帮你办事
- ✅ 搜索互联网获取实时信息
- ✅ 7x24 小时待命，随时待命

**但这只是 OpenClaw 能力的冰山一角。**

### 🌟 更多可能性等你探索

#### 多 Agent 协作

想象一下这个场景：

```
用户："开发一个新功能"
   ↓
协调 Agent（你）
   ↓
├─→ 规划 Agent：分析需求，制定计划
├─→ 编码 Agent：编写代码
├─→ 测试 Agent：生成并运行测试
├─→ 审查 Agent：代码审查
└─→ 部署 Agent：自动部署到服务器
```

这就是 **多 Agent 协作** 的威力！

OpenClaw 支持：

- **Agent Teams** - 多个 Agent 并行工作
- **任务分配** - 自动分配任务给合适的 Agent
- **结果汇总** - 自动整合各 Agent 的工作成果

**怎么做？** 探索 `agent-teams` 相关文档，创建你的第一个 Agent 团队！

### 🐟 让你的龙虾越来越厉害

OpenClaw 就像一只智能龙虾🦞：

- **刚出生时**：只会基本的对话
- **配置 Skills 后**：学会了各种技能
- **接入 Channels 后**：可以在多个平台工作
- **配置 MCP 后**：可以连接各种工具
- **训练 Memory 后**：记住你的偏好和习惯
- **多 Agent 协作后**：可以处理复杂任务

**每一次配置，每一次探索，都会让它变得更强大。**

### 🌈 最后的鼓励

这篇文章只是一个**起点**，真正的精彩在于你的**探索和实践**。

- 不要害怕犯错 - 每个错误都是学习的机会
- 不要局限思维 - AI 的创造力超乎你的想象
- 不要独自摸索 - 加入社区，和其他开发者交流

**期待看到你用 OpenClaw 创造出什么精彩的应用！** 🚀

---

**觉得有用？欢迎转发给需要的朋友！** 📲

**有问题？在评论区留言！** 💬
