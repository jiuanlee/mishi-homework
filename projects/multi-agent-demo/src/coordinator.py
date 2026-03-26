#!/usr/bin/env python3
"""
多 Agent 协作系统 - 协调 Agent 实现

这个模块实现了 Little Bee 协调 Agent，负责协调多个专业 Agent 完成开发任务。
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from pathlib import Path

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/multi-agent.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class AgentConfig:
    """Agent 配置"""
    name: str
    system_prompt: str
    max_tokens: int = 4000
    timeout: int = 600
    enabled: bool = True


@dataclass
class TaskResult:
    """任务结果"""
    agent_name: str
    success: bool
    output: str
    error: Optional[str] = None
    duration: float = 0.0
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class CollaborationReport:
    """协作报告"""
    task: str
    start_time: datetime
    end_time: Optional[datetime] = None
    total_duration: float = 0.0
    agent_results: Dict[str, TaskResult] = field(default_factory=dict)
    summary: str = ""
    status: str = "running"  # running, completed, failed


class MultiAgentCoordinator:
    """多 Agent 协调器"""
    
    def __init__(self, config_path: str = "agents/config.yaml"):
        """
        初始化协调器
        
        Args:
            config_path: 配置文件路径
        """
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.agents: Dict[str, Any] = {}
        self.current_report: Optional[CollaborationReport] = None
        
        logger.info(f"多 Agent 协调器已初始化，配置文件：{config_path}")
    
    def _load_config(self) -> Dict:
        """加载配置文件"""
        import yaml
        
        if not self.config_path.exists():
            raise FileNotFoundError(f"配置文件不存在：{self.config_path}")
        
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    
    def initialize_agents(self) -> None:
        """初始化所有 Agent"""
        logger.info("开始初始化 Agent...")
        
        # 初始化协调 Agent（Little Bee）
        coordinator_config = self.config.get('coordinator', {})
        self.agents['coordinator'] = {
            'name': coordinator_config.get('name', 'Little Bee'),
            'system_prompt': coordinator_config.get('system_prompt', ''),
            'type': 'coordinator'
        }
        
        # 初始化专业 Agent
        agents_config = self.config.get('agents', {})
        for agent_id, agent_config in agents_config.items():
            if agent_config.get('enabled', True):
                self.agents[agent_id] = {
                    'name': agent_config.get('name', agent_id),
                    'system_prompt': agent_config.get('system_prompt', ''),
                    'max_tokens': agent_config.get('max_tokens', 4000),
                    'timeout': agent_config.get('timeout', 600),
                    'type': 'specialist'
                }
                logger.info(f"✓ Agent 已初始化：{agent_id} ({agent_config.get('name', agent_id)})")
        
        logger.info(f"共初始化 {len(self.agents)} 个 Agent")
    
    async def execute_task(self, task: str) -> CollaborationReport:
        """
        执行多 Agent 协作任务
        
        Args:
            task: 任务描述
            
        Returns:
            CollaborationReport: 协作报告
        """
        start_time = datetime.now()
        
        # 创建协作报告
        self.current_report = CollaborationReport(
            task=task,
            start_time=start_time
        )
        
        logger.info(f"开始执行多 Agent 协作任务：{task}")
        
        try:
            # 步骤 1：规划阶段
            logger.info("【阶段 1/4】规划 Agent 分析需求...")
            plan_result = await self._call_agent(
                agent_id='planner',
                prompt=f"请分析这个需求并制定详细计划：\n\n{task}"
            )
            self.current_report.agent_results['planner'] = plan_result
            
            if not plan_result.success:
                raise Exception(f"规划阶段失败：{plan_result.error}")
            
            # 步骤 2：编码阶段
            logger.info("【阶段 2/4】编码 Agent 编写代码...")
            code_result = await self._call_agent(
                agent_id='coder',
                prompt=f"请根据以下规划编写代码：\n\n{plan_result.output}"
            )
            self.current_report.agent_results['coder'] = code_result
            
            if not code_result.success:
                raise Exception(f"编码阶段失败：{code_result.error}")
            
            # 步骤 3：测试阶段
            logger.info("【阶段 3/4】测试 Agent 生成测试...")
            test_result = await self._call_agent(
                agent_id='tester',
                prompt=f"请为以下代码生成全面的测试：\n\n{code_result.output}"
            )
            self.current_report.agent_results['tester'] = test_result
            
            if not test_result.success:
                logger.warning(f"测试阶段警告：{test_result.error}")
            
            # 步骤 4：审查阶段
            logger.info("【阶段 4/4】审查 Agent 代码审查...")
            review_result = await self._call_agent(
                agent_id='reviewer',
                prompt=f"请审查以下代码：\n\n{code_result.output}"
            )
            self.current_report.agent_results['reviewer'] = review_result
            
            if not review_result.success:
                logger.warning(f"审查阶段警告：{review_result.error}")
            
            # 汇总结果
            logger.info("汇总所有结果...")
            summary = await self._generate_summary(
                task=task,
                plan=plan_result.output,
                code=code_result.output,
                test=test_result.output,
                review=review_result.output
            )
            
            # 更新报告
            end_time = datetime.now()
            self.current_report.end_time = end_time
            self.current_report.total_duration = (end_time - start_time).total_seconds()
            self.current_report.summary = summary
            self.current_report.status = "completed"
            
            logger.info(f"✓ 多 Agent 协作任务完成，总耗时：{self.current_report.total_duration:.2f}秒")
            
            return self.current_report
            
        except Exception as e:
            logger.error(f"✗ 多 Agent 协作任务失败：{str(e)}", exc_info=True)
            
            end_time = datetime.now()
            self.current_report.end_time = end_time
            self.current_report.total_duration = (end_time - start_time).total_seconds()
            self.current_report.status = "failed"
            self.current_report.summary = f"任务执行失败：{str(e)}"
            
            return self.current_report
    
    async def _call_agent(self, agent_id: str, prompt: str) -> TaskResult:
        """
        调用单个 Agent
        
        Args:
            agent_id: Agent ID
            prompt: 提示词
            
        Returns:
            TaskResult: 任务结果
        """
        start_time = datetime.now()
        
        if agent_id not in self.agents:
            return TaskResult(
                agent_name=agent_id,
                success=False,
                output="",
                error=f"Agent 不存在：{agent_id}"
            )
        
        agent = self.agents[agent_id]
        logger.info(f"调用 Agent: {agent['name']}")
        
        try:
            # 这里应该调用实际的 LLM API
            # 为了演示，我们使用模拟响应
            output = await self._simulate_agent_response(agent_id, prompt)
            
            duration = (datetime.now() - start_time).total_seconds()
            
            logger.info(f"✓ Agent {agent['name']} 执行完成，耗时：{duration:.2f}秒")
            
            return TaskResult(
                agent_name=agent['name'],
                success=True,
                output=output,
                duration=duration
            )
            
        except Exception as e:
            duration = (datetime.now() - start_time).total_seconds()
            
            logger.error(f"✗ Agent {agent['name']} 执行失败：{str(e)}")
            
            return TaskResult(
                agent_name=agent['name'],
                success=False,
                output="",
                error=str(e),
                duration=duration
            )
    
    async def _simulate_agent_response(self, agent_id: str, prompt: str) -> str:
        """
        模拟 Agent 响应（演示用）
        
        实际使用时应该替换为真实的 LLM API 调用
        """
        await asyncio.sleep(2)  # 模拟延迟
        
        if agent_id == 'planner':
            return """
## 📋 规划报告

### 需求分析
[需求理解和拆解]

### 任务列表
1. [ ] 任务 1 - 优先级：高 - 预估：2h
2. [ ] 任务 2 - 优先级：中 - 预估：1h
3. [ ] 任务 3 - 优先级：低 - 预估：0.5h

### 技术选型
- 框架：XXX
- 数据库：XXX
- 依赖：XXX

### 风险评估
- 风险 1：[描述] - 缓解措施：[方案]
"""
        
        elif agent_id == 'coder':
            return """
## 💻 编码报告

### 文件列表
- `src/main.py` - 主逻辑
- `src/utils.py` - 工具函数
- `requirements.txt` - 依赖

### 代码实现
```python
# 代码内容
```

### 实现说明
[关键实现点说明]
"""
        
        elif agent_id == 'tester':
            return """
## ✅ 测试报告

### 测试结果
- 总计：10 个测试用例
- 通过：10 个
- 失败：0 个
- 覆盖率：95%

### 测试详情
所有测试通过，代码质量良好！
"""
        
        elif agent_id == 'reviewer':
            return """
## 🔍 审查报告

### 代码质量评分
- 规范性：⭐⭐⭐⭐⭐
- 可维护性：⭐⭐⭐⭐
- 安全性：⭐⭐⭐⭐⭐

### 发现问题
1. ⚠️ 问题 1 - 严重程度：中 - 建议：[建议]
2. ✅ 无严重问题

### 综合评分：92/100
"""
        
        return "Agent 响应内容"
    
    async def _generate_summary(
        self,
        task: str,
        plan: str,
        code: str,
        test: str,
        review: str
    ) -> str:
        """
        生成汇总报告
        
        Args:
            task: 原始任务
            plan: 规划输出
            code: 编码输出
            test: 测试输出
            review: 审查输出
            
        Returns:
            str: 汇总报告
        """
        end_time_str = self.current_report.end_time.strftime('%Y-%m-%d %H:%M:%S') if self.current_report.end_time else "未完成"
        
        summary = f"""
# 🎯 多 Agent 协作完成报告

## 任务概览
**任务**: {task}
**开始时间**: {self.current_report.start_time.strftime('%Y-%m-%d %H:%M:%S')}
**结束时间**: {end_time_str}
**总耗时**: {self.current_report.total_duration:.2f}秒

## 各阶段执行状态

| 阶段 | Agent | 状态 | 耗时 |
|------|-------|------|------|
"""
        
        for agent_id, result in self.current_report.agent_results.items():
            status = "✅ 完成" if result.success else "❌ 失败"
            summary += f"| {agent_id} | {result.agent_name} | {status} | {result.duration:.2f}s |\n"
        
        summary += f"""
## 交付物

### 规划文档
{plan[:500]}...

### 源代码
{code[:500]}...

### 测试报告
{test[:500]}...

### 审查报告
{review[:500]}...

## 下一步建议

1. [ ] 修复审查发现的问题
2. [ ] 部署到测试环境
3. [ ] 进行集成测试
4. [ ] 准备上线

---

**报告生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        return summary
    
    def save_report(self, report: Optional[CollaborationReport] = None) -> str:
        """
        保存报告到文件
        
        Args:
            report: 协作报告（可选，默认使用当前报告）
            
        Returns:
            str: 报告文件路径
        """
        if report is None:
            report = self.current_report
        
        if report is None:
            raise ValueError("没有可保存的报告")
        
        # 创建报告目录
        report_dir = Path(self.config.get('output', {}).get(
            'report_dir',
            '~/.openclaw/workspace/projects/multi-agent-demo/reports/'
        )).expanduser()
        report_dir.mkdir(parents=True, exist_ok=True)
        
        # 生成文件名
        timestamp = report.start_time.strftime('%Y%m%d-%H%M%S')
        filename = f"report-{timestamp}.md"
        filepath = report_dir / filename
        
        # 保存报告
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report.summary)
        
        logger.info(f"报告已保存：{filepath}")
        
        return str(filepath)


async def main():
    """主函数 - 演示多 Agent 协作"""
    
    # 创建协调器
    coordinator = MultiAgentCoordinator()
    
    # 初始化 Agent
    coordinator.initialize_agents()
    
    # 执行任务
    task = """
开发一个用户登录功能

要求：
1. 支持邮箱和密码登录
2. 密码强度检查（至少 8 位，包含大小写和数字）
3. 登录失败 5 次锁定账户
4. Session 管理
"""
    
    print("\n" + "="*60)
    print("🚀 开始多 Agent 协作")
    print("="*60 + "\n")
    
    # 执行协作
    report = await coordinator.execute_task(task)
    
    # 打印报告
    print("\n" + "="*60)
    print("📊 协作报告")
    print("="*60)
    print(report.summary)
    
    # 保存报告
    report_path = coordinator.save_report()
    print(f"\n💾 报告已保存到：{report_path}")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
