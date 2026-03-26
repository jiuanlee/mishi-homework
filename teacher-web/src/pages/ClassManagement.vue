<template>
  <div class="class-management">
    <div class="page-header">
      <h1>🏫 班级管理</h1>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新建班级
      </el-button>
    </div>

    <div class="class-list">
      <el-card 
        v-for="cls in classes" 
        :key="cls.id" 
        class="class-card"
        shadow="hover"
      >
        <div class="class-header">
          <div class="class-info">
            <h3>{{ cls.name }}</h3>
            <p class="class-code">班级码：<span class="code">{{ cls.code }}</span></p>
          </div>
          <div class="class-actions">
            <el-button size="small" @click="viewClass(cls)">查看</el-button>
            <el-button size="small" type="primary" @click="createHomework(cls)">
              布置作业
            </el-button>
            <el-button size="small" type="danger" @click="deleteClass(cls)">
              删除
            </el-button>
          </div>
        </div>
        <div class="class-stats">
          <div class="stat-item">
            <span class="stat-label">学生数</span>
            <span class="stat-value">{{ cls.studentCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">作业数</span>
            <span class="stat-value">{{ cls.homeworkCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均完成率</span>
            <span class="stat-value">{{ cls.completionRate }}%</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 新建班级对话框 -->
    <el-dialog v-model="showCreateDialog" title="新建班级" width="500px">
      <el-form :model="newClass" label-width="80px">
        <el-form-item label="班级名称">
          <el-input v-model="newClass.name" placeholder="例如：三年级 1 班" />
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="newClass.grade" placeholder="选择年级">
            <el-option label="一年级" value="1" />
            <el-option label="二年级" value="2" />
            <el-option label="三年级" value="3" />
            <el-option label="四年级" value="4" />
            <el-option label="五年级" value="5" />
            <el-option label="六年级" value="6" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createClass">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const showCreateDialog = ref(false)

const classes = ref([
  {
    id: 1,
    name: '三年级 1 班',
    code: 'ABC123',
    grade: '3',
    studentCount: 45,
    homeworkCount: 12,
    completionRate: 85
  },
  {
    id: 2,
    name: '四年级 2 班',
    code: 'XYZ789',
    grade: '4',
    studentCount: 42,
    homeworkCount: 8,
    completionRate: 90
  }
])

const newClass = reactive({
  name: '',
  grade: ''
})

const viewClass = (cls) => {
  router.push(`/classes/${cls.id}`)
}

const createHomework = (cls) => {
  router.push(`/homework/create?classId=${cls.id}`)
}

const deleteClass = (cls) => {
  // TODO: 调用删除 API
  console.log('删除班级:', cls)
}

const createClass = () => {
  // TODO: 调用创建班级 API
  showCreateDialog.value = false
  newClass.name = ''
  newClass.grade = ''
}
</script>

<style scoped lang="scss">
.class-management {
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

.class-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.class-card {
  .class-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;

    .class-info {
      h3 {
        margin: 0 0 8px 0;
        color: #333;
      }

      .class-code {
        margin: 0;
        color: #666;
        font-size: 14px;

        .code {
          color: #409EFF;
          font-weight: bold;
          font-family: monospace;
        }
      }
    }

    .class-actions {
      display: flex;
      gap: 8px;
    }
  }

  .class-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 15px;
    border-top: 1px solid #eee;

    .stat-item {
      text-align: center;

      .stat-label {
        display: block;
        color: #999;
        font-size: 12px;
        margin-bottom: 5px;
      }

      .stat-value {
        display: block;
        color: #333;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
