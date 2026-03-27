# 密室做题家 - 批量导入试题 API 文档

## 📋 概述

批量导入试题功能允许老师一次性导入多道试题到题库，支持选择题、填空题、判断题、问答题等多种题型。

---

## 🔑 认证

所有 API 需要 JWT Token 认证。

**获取 Token**：
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**使用 Token**：
```bash
-H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📥 批量导入试题

### 接口信息

- **URL**: `POST /api/batch-import/questions`
- **认证**: 需要（老师角色）
- **Content-Type**: `application/json`

### 请求参数

```json
{
  "knowledgePoint": "二次方程",
  "subject": "数学",
  "difficulty": "medium",
  "questions": [
    {
      "title": "解方程：x² - 5x + 6 = 0",
      "type": "choice",
      "options": ["x=2", "x=3", "x=2 或 x=3", "无解"],
      "answer": "x=2 或 x=3",
      "explanation": "因式分解得 (x-2)(x-3)=0"
    },
    {
      "title": "一元二次方程的一般形式是？",
      "type": "fill",
      "answer": "ax²+bx+c=0 (a≠0)",
      "explanation": "这是一元二次方程的标准形式"
    }
  ]
}
```

### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `knowledgePoint` | string | 否 | 知识点 |
| `subject` | string | 否 | 科目（数学/语文/英语等） |
| `difficulty` | string | 否 | 难度（easy/medium/hard） |
| `questions` | array | 是 | 试题数组 |
| `questions[].title` | string | 是 | 试题标题/题干 |
| `questions[].type` | string | 是 | 题型（choice/fill/judge/essay） |
| `questions[].options` | array | 否 | 选项（选择题需要） |
| `questions[].answer` | string | 是 | 答案 |
| `questions[].explanation` | string | 否 | 解析 |

### 成功响应

```json
{
  "success": true,
  "message": "成功导入 2 道试题",
  "count": 2
}
```

### 失败响应

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "试题标题不能为空",
      "path": "questions[0].title",
      "location": "body"
    }
  ]
}
```

---

## 📤 导出试题

### 接口信息

- **URL**: `GET /api/batch-import/questions/export`
- **认证**: 需要（老师角色）
- **Query Parameters**: 可选筛选条件

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `knowledgePoint` | string | 否 | 知识点筛选 |
| `subject` | string | 否 | 科目筛选 |
| `difficulty` | string | 否 | 难度筛选 |

### 请求示例

```bash
curl -X GET "http://localhost:3000/api/batch-import/questions/export?subject=数学&difficulty=medium" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 成功响应

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "knowledge_point": "二次方程",
      "subject": "数学",
      "difficulty": "medium",
      "title": "解方程：x² - 5x + 6 = 0",
      "type": "choice",
      "options": "[\"x=2\",\"x=3\",\"x=2 或 x=3\",\"无解\"]",
      "answer": "x=2 或 x=3",
      "explanation": "因式分解得 (x-2)(x-3)=0",
      "teacher_id": 1,
      "created_at": "2026-03-27T05:17:02.000Z"
    }
  ],
  "count": 1
}
```

---

## 💡 使用示例

### 示例 1：批量导入数学题

```bash
# 1. 获取 Token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))")

# 2. 批量导入试题
curl -X POST http://localhost:3000/api/batch-import/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "knowledgePoint": "二次方程",
    "subject": "数学",
    "difficulty": "medium",
    "questions": [
      {
        "title": "解方程：x² - 5x + 6 = 0",
        "type": "choice",
        "options": ["x=2", "x=3", "x=2 或 x=3", "无解"],
        "answer": "x=2 或 x=3",
        "explanation": "因式分解得 (x-2)(x-3)=0"
      },
      {
        "title": "一元二次方程根的判别式是？",
        "type": "choice",
        "options": ["b²-4ac", "b²+4ac", "4ac-b²", "以上都不对"],
        "answer": "b²-4ac",
        "explanation": "判别式Δ=b²-4ac"
      },
      {
        "title": "当Δ>0 时，方程有____个实数根",
        "type": "fill",
        "answer": "2",
        "explanation": "判别式大于 0 时有两个不相等的实数根"
      }
    ]
  }'
```

### 示例 2：导出所有数学题

```bash
curl -X GET "http://localhost:3000/api/batch-import/questions/export?subject=数学" \
  -H "Authorization: Bearer $TOKEN"
```

### 示例 3：导出特定知识点的难题

```bash
curl -X GET "http://localhost:3000/api/batch-import/questions/export?knowledgePoint=二次方程&difficulty=hard" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 支持的题型

### 1. 选择题 (choice)

```json
{
  "title": "下列哪个是质数？",
  "type": "choice",
  "options": ["4", "6", "7", "9"],
  "answer": "7",
  "explanation": "7 只能被 1 和自身整除"
}
```

### 2. 填空题 (fill)

```json
{
  "title": "圆的面积公式是 S=____",
  "type": "fill",
  "answer": "πr²",
  "explanation": "圆的面积等于π乘以半径的平方"
}
```

### 3. 判断题 (judge)

```json
{
  "title": "三角形的内角和等于 180 度",
  "type": "judge",
  "answer": "正确",
  "explanation": "平面三角形内角和定理"
}
```

### 4. 问答题 (essay)

```json
{
  "title": "请解释什么是勾股定理",
  "type": "essay",
  "answer": "直角三角形两直角边的平方和等于斜边的平方",
  "explanation": "a² + b² = c²"
}
```

---

## 🔧 批量导入模板

### Excel/CSV 转 JSON 脚本

```python
import csv
import json

# 读取 CSV
questions = []
with open('questions.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        questions.append({
            "title": row['title'],
            "type": row['type'],
            "options": row['options'].split('|') if row.get('options') else None,
            "answer": row['answer'],
            "explanation": row.get('explanation', '')
        })

# 生成 JSON
import_data = {
    "knowledgePoint": "二次方程",
    "subject": "数学",
    "difficulty": "medium",
    "questions": questions
}

# 保存
with open('import.json', 'w', encoding='utf-8') as f:
    json.dump(import_data, f, ensure_ascii=False, indent=2)

print(f"✅ 成功转换 {len(questions)} 道试题")
```

### CSV 格式示例

```csv
title,type,options,answer,explanation
"解方程：x² - 5x + 6 = 0",choice,"x=2|x=3|x=2 或 x=3|无解","x=2 或 x=3","因式分解得 (x-2)(x-3)=0"
"一元二次方程的一般形式？",fill,,"ax²+bx+c=0 (a≠0)","标准形式"
```

---

## ⚠️ 注意事项

1. **批量限制**
   - 建议每次导入不超过 100 道题
   - 超大批量建议分批导入

2. **数据验证**
   - 试题标题不能为空
   - 答案不能为空
   - 题型必须是：choice/fill/judge/essay

3. **性能优化**
   - 使用数据库事务批量插入
   - 单次请求处理时间 < 30 秒

4. **错误处理**
   - 如果某道题验证失败，整批导入会失败
   - 建议先小批量测试

---

## 📝 更新日志

### v1.0.0 (2026-03-27)

- ✅ 批量导入试题 API
- ✅ 试题导出 API
- ✅ 支持 4 种题型
- ✅ 支持筛选导出
- ✅ 数据验证

---

## 🆘 故障排除

### 问题 1：认证失败

**错误**：`"未提供认证令牌"`

**解决**：
```bash
# 确保请求头包含 Token
-H "Authorization: Bearer YOUR_TOKEN"
```

### 问题 2：数据验证失败

**错误**：`"试题必须是数组"`

**解决**：
```json
// 确保 questions 是数组
{
  "questions": [
    {"title": "...", "type": "..."}
  ]
}
```

### 问题 3：导入数量不对

**检查**：
```bash
# 查看数据库中的试题数量
curl -X GET "http://localhost:3000/api/batch-import/questions/export" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('data',[])))"
```

---

**文档创建时间**: 2026-03-27  
**API 版本**: v1.0.0
