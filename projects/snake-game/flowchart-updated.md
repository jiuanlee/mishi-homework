# 📊 备考计划流程图（已更新）

**更新时间**：2026-03-26  
**更新内容**：移除"考纲和课程科目一致"的限制

---

## 📋 完整流程图

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

    subgraph S3[批量写入标签条件判断 - 已更新]
        C1{考纲是否关联<br/>考点？} -->|是 | C2{课程大纲 unit 下<br/>是否有考点？}
        C2 -->|是 | C3{条件 1 和 2<br/>是否有交集？}
        C3 -->|是 | C4[✅ 满足条件]
        C4 --> C5[写入 zs_learning_exam_syllabus_knowledge]
        C5 --> C6[写入 zs_learning_particle_relationship]
        
        C1 -->|否 | C7[❌ 不满足]
        C2 -->|否 | C7
        C3 -->|否 | C7
    end

    A7 --> C1
    B4 --> C1

    style S1 fill:#e1f5fe
    style S2 fill:#fff3e0
    style S3 fill:#f3e5f5
    style C4 fill:#c8e6c9
    style C7 fill:#ffcdd2
```

---

## 🔄 批量写入条件（更新后）

| 序号 | 条件 | 状态 | 说明 |
|------|------|------|------|
| 1 | 考纲关联了考点 | ✅ | 考纲必须有对应的考点 |
| 2 | 课程大纲 unit 下有考点 | ✅ | 查询 `resource_knowledge`，更新至 `zs_learning_module.knowledge_point_ids` |
| 3 | 条件 1 和 2 有交集 | ✅ | 考纲考点与课程考点有重叠 |

**移除的条件**：
- ❌ ~~考纲和课程科目一致~~ （已移除，不再限制）

---

## 🔗 在线查看/导出 PNG

```
https://mermaid.live/edit#pako:eNpdkstuwjAQRX_F8hpJkLh5SN2wqLoC2bRdIC8Qq7GHPg4Q8e87gUCh68SZe89cT0g4kBUhG3hYQ5h3hH4O3sN4C1Gz7jR00Bq4o4a3jg226059B73mPbQGHmnmveOD7bpT38GgRQ9tAYOmHbQGHmnuveOD7bpT38GoeQ9tAYOmHbQGHmnuveOD7bpT38GkeQ9tAYOmHbQGHmnuveOD7bpT38GseQ9tAYOmHbQGHmnuveOD7bpT38GieQ9tAYOmHbQGHmnuveOD7bpT38GqeQ9tAYOmHbQGHmnuveOD7bpT38GmeQ9tAYOmHbQGHmnuveOD7bpT38GueQ9tAYOmHbQGHmnuveOD7bpT38GheQ9tAYOmHbQGHmnuveOD7bpT38GpeQ9tAYOmHbQGHmnuveOD7bpT38G1eQ9tAYOmHbQGHmnuveOD7bpT38G9eQ9tAYOmHbQGHmnuveOD7bpT38GjeQ9tAYOmHbQGHmnuveOD7bpT38GzeQ9tAYOmHbQGHmnuveOD7bpT38GLeQ9tAYOmHbQGHmnuveOD7bpT38GbeQ9tAYOmHbQGHmnuveOD7bpT38GneQ9tAYOmHbQGHmnuveOD7bpT38GveQ9tAYOmHbQGHmnuveOD7bpT38GweQ9tAYOmHbQGHmnuveOD7bpT38G4eQ9tAYOmHbQGHmnuveOD7bpT38G4eQ9tAYOmHbQGHmnuveOD7bpT38HDeQ9tAYOmHbQGHmnuveOD7bpT38HLeQ9tAYOmHbQGHmnuveOD7bpT38HfeQ9tAYOmHbQGHmnuveOD7bpT38HoeQ9tAYOmHbQGHmnuveOD7bpT38HweQ9tAYOmHbQGHmnuveOD7bpT38H4eQ9tAYOmHbQGHmnuveOD7bpT38H8eQ9tAYOmHbQGHmnuveOD7bpT38E
```

**操作步骤**：
1. 点击上面的链接
2. 在右侧点击 **"Actions"**
3. 选择 **"Export PNG"** 或 **"Export SVG"**

---

## 📊 影响分析

### 更新前
- 4 个条件全部满足才能写入
- 部分跨科目但考点相关的考纲 - 课程组合被排除

### 更新后
- 仅需 3 个条件
- **跨科目的考纲 - 课程组合现在可以触发同步**
- 接口调用次数可能增加

### 示例

**场景**：某课程包含多个科目（如综合试卷）

| 考纲科目 | 课程科目 | 更新前 | 更新后 |
|---------|---------|--------|--------|
| 数学 | 数学 | ✅ 可写入 | ✅ 可写入 |
| 数学 | 英语 | ❌ 不可写入 | ✅ **可写入**（如有考点交集） |
| 综合 | 数学 | ❌ 不可写入 | ✅ **可写入**（如有考点交集） |

---

*文档更新时间：2026-03-26 11:30*
