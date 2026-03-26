# 备考计划基础数据同步流程

## 📊 完整流程图

```mermaid
flowchart TD
    subgraph S1[场景 1：编辑备考计划配置]
        A1[编辑备考计划配置] --> A2[新增/修改考纲<br/>新增课程]
        A2 --> A3[ai-plan 服务]
        A3 --> A4[延迟队列<br/>延迟 2 分钟]
        A4 --> A5[sailjob<br/>写缓存执行队列]
        A5 --> A6[第二天凌晨执行]
        A6 --> A7[learning 服务<br/>批量打标签任务]
    end

    subgraph S2[场景 2：大纲条目资源变动]
        B1[大纲条目资源变动] --> B2[ep-backend 反查<br/>满足条件的课程阶段]
        B2 --> B3[调用 learning 服务]
        B3 --> B4[触发基础数据同步]
    end

    subgraph S3[批量写入标签条件判断]
        C1{考纲是否关联<br/>考点？} -->|是 | C2{课程大纲 unit 下<br/>是否有考点？}
        C2 -->|是 | C3{条件 1 和 2<br/>是否有交集？}
        C3 -->|是 | C4[✅ 满足条件]
        C4 --> C5[写入 zs_learning_exam_syllabus_knowledge]
        C5 --> C6[写入 zs_learning_particle_relationship]
        
        C1 -->|否 | C7[❌ 不满足]
        C2 -->|否 | C7
        C3 -->|否 | C7
    end

    subgraph S4[接口调用]
        D1[learning.gaodun.com] --> D2[POST /api/ailearning/save-plan-all-resource]
        D2 --> D3[参数：<br/>courseId, syllabusId]
    end

    A7 --> C1
    B4 --> C1
    C7 --> D1

    style S1 fill:#e1f5fe
    style S2 fill:#fff3e0
    style S3 fill:#f3e5f5
    style S4 fill:#e8f5e9
    style C5 fill:#c8e6c9
    style C8 fill:#ffcdd2
```

---

## 🔄 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant AIPlan as ai-plan 服务
    participant Queue as 延迟队列
    participant SailJob as sailjob
    participant Learning as learning 服务
    participant DB as 数据库
    participant EP as ep-backend

    Note over User,DB: 场景 1：编辑备考计划配置
    User->>AIPlan: 编辑备考计划<br/>(新增/修改考纲、课程)
    AIPlan->>Queue: 发送延迟消息<br/>(延迟 2 分钟)
    Note right of Queue: 写入待执行缓存队列<br/>第二天凌晨执行
    Queue->>SailJob: 触发执行
    SailJob->>Learning: 调用批量打标签任务
    
    loop 每个课程 × 每个阶段
        Learning->>Learning: 条件判断
        alt 满足所有条件
            Learning->>DB: 写入 zs_learning_exam_syllabus_knowledge
            Learning->>DB: 写入 zs_learning_particle_relationship
            Learning->>Learning: 调用 /api/ailearning/save-plan-all-resource
        else 不满足条件
            Note over Learning: 跳过该课程
        end
    end

    Note over User,DB: 场景 2：大纲条目资源变动
    User->>EP: 大纲条目资源变动
    EP->>EP: 反查满足条件的课程阶段
    EP->>Learning: 调用同步接口
    Learning->>Learning: 执行基础数据同步
```

---

## 📋 条件判断详细流程（更新后）

```mermaid
flowchart TD
    Start[开始] --> C1[条件 1: 考纲关联了考点]
    C1 -->|✅ | C2[条件 2: 课程大纲 unit 下有考点<br/>查询 resource_knowledge<br/>zs_learning_module.knowledge_point_ids]
    C1 -->|❌ | End[结束 - 不写入]
    
    C2 -->|✅ | C3[条件 3: 条件 1 和 2 有交集]
    C2 -->|❌ | End
    
    C3 -->|✅ | Write1[写入 zs_learning_exam_syllabus_knowledge]
    C3 -->|❌ | End
    
    Write1 --> Write2[写入 zs_learning_particle_relationship]
    Write2 --> API[调用接口<br/>POST /api/ailearning/save-plan-all-resource]
    API --> End

    style Start fill:#bbdefb
    style End fill:#ffcdd2
    style Write1 fill:#c8e6c9
    style Write2 fill:#c8e6c9
    style API fill:#c8e6c9
```

---

## 📊 接口调用次数计算

```mermaid
flowchart LR
    A[备考计划] --> B[关联课程数量]
    B --> C[每个课程关联阶段数]
    C --> D[总调用次数]
    
    B -->|例：3 个课程 | E[课程 1 + 课程 2 + 课程 3]
    C -->|例：2 个阶段 | F[阶段 1 + 阶段 2]
    E --> G[3 × 2 = 6 次调用]
    
    style D fill:#ffeb3b
    style G fill:#ffeb3b
```

**计算公式**：
```
总调用次数 = 课程数量 × 每个课程的阶段数量
```

**示例**：
- 3 个课程 × 2 个阶段 = **6 次接口调用**
- 5 个课程 × 3 个阶段 = **15 次接口调用**

---

## 🔧 接口详情

| 项目 | 详情 |
|------|------|
| **服务** | learning.gaodun.com |
| **方法** | POST |
| **URL** | `/api/ailearning/save-plan-all-resource` |
| **参数** | `{"courseId": 91784, "syllabusId": 175030}` |

---

## 📝 数据表说明

| 表名 | 说明 |
|------|------|
| `zs_learning_exam_syllabus_knowledge` | 考纲 - 考点关联表 |
| `zs_learning_particle_relationship` | 知识点关系表 |
| `resource_knowledge` | 资源 - 知识点关联表 |
| `zs_learning_module` | 学习模块表（含 knowledge_point_ids） |

---

## 🔄 更新说明

**2026-03-26 更新**：移除了"考纲和课程科目一致"的限制条件

### 更新前（4 个条件）
1. ❌ ~~考纲和课程科目一致~~ **（已移除）**
2. ✅ 考纲关联了考点
3. ✅ 课程大纲 unit 下有考点
4. ✅ 条件 2 和 3 有交集

### 更新后（3 个条件）
1. ✅ 考纲关联了考点
2. ✅ 课程大纲 unit 下有考点
3. ✅ 条件 1 和 2 有交集

**影响**：更多考纲 - 课程组合可以满足条件，触发批量写入标签

---

## ⏰ 执行时间线

```mermaid
gantt
    title 备考计划同步执行时间线
    dateFormat HH:mm
    axisFormat %H:%M
    
    section 场景 1
    编辑备考计划 :done, edit, 10:00, 2m
    延迟队列等待 :active, delay, 10:02, 2m
    写入缓存队列 :crit, cache, 10:04, 1m
    第二天凌晨执行 :crit, exec, 02:00, 30m
    
    section 场景 2
    大纲资源变动 :done, change, 11:00, 1m
    实时同步 :active, sync, 11:01, 5m
```

---

*文档生成时间：2026-03-26*
