<template>
  <div class="homework-management">
    <div class="page-header">
      <h1>📚 作业管理</h1>
      <el-input
        v-model="searchQuery"
        placeholder="搜索作业..."
        prefix-icon="Search"
        style="width: 300px"
      />
    </div>

    <el-table :data="filteredHomework" style="width: 100%" stripe>
      <el-table-column prop="name" label="作业名称" />
      <el-table-column prop="className" label="班级" />
      <el-table-column prop="mode" label="模式">
        <template #default="{ row }">
          <el-tag :type="getModeType(row.mode)">{{ row.mode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="questionCount" label="题量" width="80" />
      <el-table-column prop="publishDate" label="发布时间" width="120" />
      <el-table-column prop="deadline" label="截止时间" width="120" />
      <el-table-column prop="completionRate" label="完成率" width="100">
        <template #default="{ row }">
          <el-progress 
            :percentage="row.completionRate" 
            :color="getProgressColor(row.completionRate)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row)">详情</el-button>
          <el-button size="small" type="primary" @click="viewStats(row)">统计</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const homework = ref([
  {
    id: 1,
    name: '密室逃脱 - 数学大冒险',
    className: '三年级 1 班',
    mode: '密室逃脱',
    questionCount: 10,
    publishDate: '2024-03-20',
    deadline: '2024-03-27',
    completionRate: 85
  },
  {
    id: 2,
    name: '剧本杀 - 古诗词之谜',
    className: '四年级 2 班',
    mode: '剧本杀',
    questionCount: 15,
    publishDate: '2024-03-18',
    deadline: '2024-03-25',
    completionRate: 92
  }
])

const filteredHomework = computed(() => {
  if (!searchQuery.value) return homework.value
  return homework.value.filter(h => 
    h.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getModeType = (mode) => {
  const types = {
    '密室逃脱': 'warning',
    '剧本杀': 'success',
    '冒险闯关': 'primary',
    '侦探探案': 'danger'
  }
  return types[mode] || 'info'
}

const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#67C23A'
  if (percentage >= 70) return '#E6A23C'
  return '#F56C6C'
}

const viewDetail = (row) => {
  console.log('查看详情:', row)
}

const viewStats = (row) => {
  console.log('查看统计:', row)
}
</script>

<style scoped lang="scss">
.homework-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    color: #333;
  }
}
</style>
