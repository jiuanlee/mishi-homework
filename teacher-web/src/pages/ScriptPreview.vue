<template>
  <div class="script-preview-page">
    <div class="page-header">
      <h1>📜 剧本预览与编辑</h1>
      <p class="page-desc">查看、编辑和下发 AI 生成的剧本</p>
    </div>

    <ScriptPreview 
      v-model:script="script"
      :theme="query.theme"
      :difficulty="query.difficulty"
      :grade="query.grade"
      :subject="query.subject"
      :knowledge-points="query.knowledgePoints"
      @distribute="handleDistribute"
    />

    <el-card class="actions-card">
      <template #header>
        <span>📋 操作选项</span>
      </template>
      <div class="action-buttons">
        <el-button type="primary" @click="handleSave">
          💾 保存修改
        </el-button>
        <el-button type="success" @click="handleDistribute">
          📤 下发给学生
        </el-button>
        <el-button type="warning" @click="handleExport">
          📥 导出 PDF
        </el-button>
        <el-button type="info" @click="handleCopy">
          📋 复制链接
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import ScriptPreview from '../ui-components/ai/ScriptPreview.vue'

const route = useRoute()

const query = reactive({
  theme: route.query.theme || 'fairy',
  difficulty: route.query.difficulty || 'medium',
  grade: route.query.grade || 3,
  subject: route.query.subject || 'math',
  knowledgePoints: route.query.knowledgePoints ? 
    route.query.knowledgePoints.split(',').map(Number) : []
})

const script = ref({
  title: '数学大冒险 - 密室逃脱',
  background: '在一个神奇的数学王国中，小朋友们需要通过解决数学问题来解锁线索，最终逃离密室。',
  characters: '主角：小明（三年级学生）\n助手：智慧精灵（数学王国的守护者）\n反派：迷雾魔王（制造谜题的坏蛋）',
  time_limit: 20,
  levels: [
    { description: '第一关：加减法运算 - 需要计算正确的答案才能打开第一道门' },
    { description: '第二关：乘除法挑战 - 解开乘法密码锁' },
    { description: '第三关：分数谜题 - 将分数与图形匹配' },
    { description: '最终关：综合应用题 - 运用所有知识击败迷雾魔王' }
  ],
  puzzles: '1. 基础计算题：25 + 37 = ?\n2. 乘法题：8 × 9 = ?\n3. 分数题：1/2 + 1/4 = ?\n4. 应用题：小明有 15 个苹果，分给 3 个朋友，每人几个？',
  ending: '恭喜你成功完成了所有挑战！你不仅解开了谜题，还掌握了重要的数学知识。继续加油！'
})

onMounted(() => {
  // 如果有 scriptId，从后端加载剧本
  if (route.query.scriptId) {
    loadScript(route.query.scriptId)
  }
})

const loadScript = async (scriptId) => {
  try {
    // TODO: 调用 API 加载剧本
    // const response = await fetch(`/api/ai/script/${scriptId}`)
    // script.value = await response.json()
    ElMessage.info('加载剧本中...')
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  }
}

const handleSave = async () => {
  try {
    // TODO: 调用保存 API
    // await fetch('/api/ai/script/save', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(script.value)
    // })
    ElMessage.success('保存成功！')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  }
}

const handleDistribute = () => {
  ElMessageBox.prompt('请选择要下发的班级', '下发剧本', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '输入班级名称'
  }).then(({ value }) => {
    if (value) {
      // TODO: 调用下发 API
      ElMessage.success(`剧本已下发到班级：${value}`)
    }
  }).catch(() => {})
}

const handleExport = () => {
  ElMessage.info('正在生成 PDF...')
  // TODO: 调用导出 PDF API
  setTimeout(() => {
    ElMessage.success('PDF 导出成功！')
  }, 1500)
}

const handleCopy = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}
</script>

<style scoped lang="scss">
.script-preview-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;

  h1 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 28px;
  }

  .page-desc {
    color: #666;
    font-size: 16px;
  }
}

.actions-card {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
</style>
