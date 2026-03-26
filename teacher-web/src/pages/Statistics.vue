<template>
  <div class="statistics">
    <div class="page-header">
      <h1>📊 完成情况统计</h1>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </div>

    <!-- 概览卡片 -->
    <div class="overview-cards">
      <el-card class="stat-card">
        <div class="card-icon">👥</div>
        <div class="card-info">
          <div class="card-value">{{ stats.totalStudents }}</div>
          <div class="card-label">总学生数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="card-icon">📝</div>
        <div class="card-info">
          <div class="card-value">{{ stats.totalHomework }}</div>
          <div class="card-label">已布置作业</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="card-icon">✅</div>
        <div class="card-info">
          <div class="card-value">{{ stats.completionRate }}%</div>
          <div class="card-label">平均完成率</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="card-icon">🏆</div>
        <div class="card-info">
          <div class="card-value">{{ stats.averageScore }}</div>
          <div class="card-label">平均得分</div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <el-card class="chart-card">
        <template #header>
          <span>每日完成情况</span>
        </template>
        <div class="chart-placeholder">
          📈 折线图：每日作业完成趋势
        </div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <span>知识点掌握情况</span>
        </template>
        <div class="chart-placeholder">
          🎯 雷达图：各知识点掌握程度
        </div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <span>班级排名</span>
        </template>
        <div class="chart-placeholder">
          🏅 柱状图：班级平均完成率排名
        </div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <span>作业模式分布</span>
        </template>
        <div class="chart-placeholder">
          🥧 饼图：各剧情模式使用比例
        </div>
      </el-card>
    </div>

    <!-- 学生排行榜 -->
    <el-card class="ranking-card">
      <template #header>
        <span>🏆 学生排行榜</span>
      </template>
      <el-table :data="rankings" style="width: 100%">
        <el-table-column type="index" label="排名" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="className" label="班级" />
        <el-table-column prop="completedCount" label="完成作业数" />
        <el-table-column prop="averageScore" label="平均分" />
        <el-table-column prop="badges" label="徽章数" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const dateRange = ref([])

const stats = reactive({
  totalStudents: 156,
  totalHomework: 48,
  completionRate: 87,
  averageScore: 92
})

const rankings = ref([
  { name: '张小明', className: '三年级 1 班', completedCount: 45, averageScore: 98, badges: 28 },
  { name: '李小红', className: '三年级 1 班', completedCount: 44, averageScore: 96, badges: 25 },
  { name: '王小刚', className: '四年级 2 班', completedCount: 43, averageScore: 95, badges: 23 },
  { name: '赵小丽', className: '四年级 2 班', completedCount: 42, averageScore: 94, badges: 22 },
  { name: '孙小强', className: '三年级 1 班', completedCount: 41, averageScore: 93, badges: 20 }
])
</script>

<style scoped lang="scss">
.statistics {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    margin: 0;
    color: #333;
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;

  .card-icon {
    font-size: 48px;
    margin-right: 20px;
  }

  .card-info {
    .card-value {
      font-size: 32px;
      font-weight: bold;
      color: #409EFF;
    }

    .card-label {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  .chart-placeholder {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    border-radius: 8px;
    color: #999;
    font-size: 16px;
  }
}

.ranking-card {
  margin-top: 20px;
}
</style>
