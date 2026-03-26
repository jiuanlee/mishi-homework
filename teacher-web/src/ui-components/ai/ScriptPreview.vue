<template>
  <div class="script-preview">
    <el-card class="preview-card">
      <template #header>
        <div class="card-header">
          <span>📜 剧本预览</span>
          <div class="header-actions">
            <el-button 
              :icon="isEditing ? 'Check' : 'Edit'" 
              :type="isEditing ? 'success' : 'primary'"
              size="small"
              @click="toggleEdit"
            >
              {{ isEditing ? '完成编辑' : '编辑剧本' }}
            </el-button>
            <el-button 
              type="success" 
              size="small"
              @click="$emit('distribute')"
            >
              📤 下发给学生
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="preview-content">
        <el-form 
          v-if="script"
          :model="script"
          label-width="100px"
        >
          <el-form-item label="剧本名称">
            <el-input 
              v-model="script.title" 
              :disabled="!isEditing"
              placeholder="输入剧本名称"
            />
          </el-form-item>
          
          <el-form-item label="主题">
            <el-tag size="large">{{ themeName }}</el-tag>
          </el-form-item>
          
          <el-form-item label="难度">
            <el-tag :type="difficultyType" size="large">{{ difficultyName }}</el-tag>
          </el-form-item>
          
          <el-form-item label="预计时长">
            <span>{{ script.time_limit }} 分钟</span>
          </el-form-item>
          
          <el-form-item label="适用年级">
            <el-tag>{{ gradeName }}</el-tag>
          </el-form-item>
          
          <el-form-item label="学科">
            <el-tag type="warning">{{ subjectName }}</el-tag>
          </el-form-item>
          
          <el-form-item label="涉及知识点">
            <div class="knowledge-tags">
              <el-tag 
                v-for="kp in knowledgePointNames" 
                :key="kp"
                size="small"
                style="margin: 5px"
              >
                {{ kp }}
              </el-tag>
            </div>
          </el-form-item>
          
          <el-divider />
          
          <el-form-item label="剧情背景">
            <el-input
              v-model="script.background"
              :disabled="!isEditing"
              type="textarea"
              :rows="3"
              placeholder="剧情背景介绍"
            />
          </el-form-item>
          
          <el-form-item label="角色设定">
            <el-input
              v-model="script.characters"
              :disabled="!isEditing"
              type="textarea"
              :rows="4"
              placeholder="角色描述"
            />
          </el-form-item>
          
          <el-form-item label="关卡设计">
            <div class="levels-container">
              <div 
                v-for="(level, index) in script.levels" 
                :key="index"
                class="level-item"
              >
                <el-tag type="info" size="small">第{{ index + 1 }}关</el-tag>
                <el-input
                  v-model="level.description"
                  :disabled="!isEditing"
                  type="textarea"
                  :rows="2"
                  :placeholder="`第${index + 1}关描述`"
                  style="margin-top: 10px"
                />
              </div>
            </div>
          </el-form-item>
          
          <el-form-item label="谜题内容">
            <el-input
              v-model="script.puzzles"
              :disabled="!isEditing"
              type="textarea"
              :rows="6"
              placeholder="谜题详细描述"
            />
          </el-form-item>
          
          <el-form-item label="结局">
            <el-input
              v-model="script.ending"
              :disabled="!isEditing"
              type="textarea"
              :rows="3"
              placeholder="故事结局"
            />
          </el-form-item>
        </el-form>
        
        <el-empty v-else description="暂无剧本内容，请先生成剧本" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  script: {
    type: Object,
    default: null
  },
  theme: {
    type: String,
    default: 'fairy'
  },
  difficulty: {
    type: String,
    default: 'medium'
  },
  grade: {
    type: [Number, String],
    default: 3
  },
  subject: {
    type: String,
    default: 'math'
  },
  knowledgePoints: {
    type: Array,
    default: () => []
  }
})

defineEmits(['distribute', 'update:script'])

const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value && props.script) {
    // 保存编辑
    // TODO: 可以添加自动保存逻辑
  }
}

const themeName = computed(() => {
  const themes = {
    fairy: '童话故事',
    detective: '侦探推理',
    adventure: '冒险探索',
    'sci-fi': '科幻未来'
  }
  return themes[props.theme] || props.theme
})

const difficultyName = computed(() => {
  const difficulties = {
    easy: '简单',
    medium: '中等',
    hard: '较难'
  }
  return difficulties[props.difficulty] || props.difficulty
})

const difficultyType = computed(() => {
  const types = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return types[props.difficulty] || 'info'
})

const gradeName = computed(() => {
  return `${props.grade}年级`
})

const subjectName = computed(() => {
  const subjects = {
    chinese: '语文',
    math: '数学',
    english: '英语',
    science: '科学'
  }
  return subjects[props.subject] || props.subject
})

const knowledgePointNames = computed(() => {
  // 这里应该从后端获取知识点名称，暂时用 ID 显示
  return props.knowledgePoints.map(kp => `知识点${kp}`)
})
</script>

<style scoped lang="scss">
.script-preview {
  margin-bottom: 20px;
}

.preview-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.preview-content {
  padding: 10px 0;
}

.knowledge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.levels-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.level-item {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}
</style>
