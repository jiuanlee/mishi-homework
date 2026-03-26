<template>
  <div class="homework-generator">
    <div class="page-header">
      <h1>📝 作业生成</h1>
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="选择知识点" />
        <el-step title="选择模式" />
        <el-step title="设置参数" />
        <el-step title="生成作业" />
      </el-steps>
    </div>

    <!-- 步骤 1: 选择知识点 -->
    <div v-show="currentStep === 0" class="step-content">
      <el-card class="filter-card">
        <template #header>
          <span>📚 筛选知识点</span>
        </template>
        <el-form :model="filters" label-width="100px">
          <el-form-item label="年级">
            <el-select v-model="filters.grade" placeholder="选择年级" multiple>
              <el-option label="一年级" value="1" />
              <el-option label="二年级" value="2" />
              <el-option label="三年级" value="3" />
              <el-option label="四年级" value="4" />
              <el-option label="五年级" value="5" />
              <el-option label="六年级" value="6" />
            </el-select>
          </el-form-item>
          <el-form-item label="学科">
            <el-select v-model="filters.subject" placeholder="选择学科" multiple>
              <el-option label="语文" value="chinese" />
              <el-option label="数学" value="math" />
              <el-option label="英语" value="english" />
              <el-option label="科学" value="science" />
            </el-select>
          </el-form-item>
          <el-form-item label="知识点">
            <el-select 
              v-model="filters.knowledgePoints" 
              placeholder="选择知识点" 
              multiple
              filterable
            >
              <el-option 
                v-for="kp in knowledgePoints" 
                :key="kp.id" 
                :label="kp.name" 
                :value="kp.id" 
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 步骤 2: 选择剧情模式 -->
    <div v-show="currentStep === 1" class="step-content">
      <el-card class="mode-card">
        <template #header>
          <span>🎭 选择剧情模式</span>
        </template>
        <div class="mode-grid">
          <div 
            v-for="mode in modes" 
            :key="mode.id"
            class="mode-item"
            :class="{ active: selectedMode === mode.id }"
            @click="selectedMode = mode.id"
          >
            <div class="mode-icon">{{ mode.icon }}</div>
            <h3>{{ mode.name }}</h3>
            <p>{{ mode.description }}</p>
            <div class="mode-tags">
              <el-tag 
                v-for="tag in mode.tags" 
                :key="tag" 
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 步骤 3: 设置参数 -->
    <div v-show="currentStep === 2" class="step-content">
      <el-card class="params-card">
        <template #header>
          <span>⚙️ 作业参数</span>
        </template>
        <el-form :model="params" label-width="120px">
          <el-form-item label="题目数量">
            <el-slider v-model="params.questionCount" :min="5" :max="50" :step="1" show-input />
          </el-form-item>
          <el-form-item label="难度系数">
            <el-rate v-model="params.difficulty" :max="5" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
          </el-form-item>
          <el-form-item label="预计时长">
            <el-select v-model="params.duration">
              <el-option label="15 分钟" value="15" />
              <el-option label="30 分钟" value="30" />
              <el-option label="45 分钟" value="45" />
              <el-option label="60 分钟" value="60" />
            </el-select>
          </el-form-item>
          <el-form-item label="截止时间">
            <el-date-picker
              v-model="params.deadline"
              type="datetime"
              placeholder="选择截止时间"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="奖励设置">
            <el-checkbox-group v-model="params.rewards">
              <el-checkbox label="coins">金币奖励</el-checkbox>
              <el-checkbox label="badges">徽章奖励</el-checkbox>
              <el-checkbox label="props">道具奖励</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 步骤 4: 生成预览 -->
    <div v-show="currentStep === 3" class="step-content">
      <el-card class="preview-card">
        <template #header>
          <span>📋 作业预览</span>
        </template>
        <div v-if="generating" class="generating">
          <el-icon class="is-loading"><Loading /></el-icon>
          <p>正在生成作业...</p>
        </div>
        <div v-else class="preview-content">
          <el-descriptions title="作业信息" :column="2" border>
            <el-descriptions-item label="作业名称">{{ homeworkInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="题目数量">{{ homeworkInfo.questionCount }}题</el-descriptions-item>
            <el-descriptions-item label="剧情模式">{{ homeworkInfo.mode }}</el-descriptions-item>
            <el-descriptions-item label="预计时长">{{ homeworkInfo.duration }}分钟</el-descriptions-item>
            <el-descriptions-item label="知识点" :span="2">
              {{ homeworkInfo.knowledgePoints.join(', ') }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </div>

    <!-- 底部操作按钮 -->
    <div class="step-actions">
      <el-button @click="prevStep" :disabled="currentStep === 0">上一步</el-button>
      <el-button 
        v-if="currentStep < 3" 
        type="primary" 
        @click="nextStep"
      >
        下一步
      </el-button>
      <el-button 
        v-else 
        type="success" 
        @click="generateHomework"
        :loading="generating"
      >
        一键生成
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const currentStep = ref(0)
const generating = ref(false)

const filters = reactive({
  grade: [],
  subject: [],
  knowledgePoints: []
})

const knowledgePoints = ref([
  { id: 1, name: '加减法运算' },
  { id: 2, name: '乘除法运算' },
  { id: 3, name: '分数认识' },
  { id: 4, name: '古诗词背诵' },
  { id: 5, name: '阅读理解' },
  { id: 6, name: '单词拼写' }
])

const modes = ref([
  {
    id: 'escape',
    name: '密室逃脱',
    icon: '🔐',
    description: '通过解题解锁线索，逃离密室',
    tags: ['悬疑', '解谜', '团队合作']
  },
  {
    id: 'murder',
    name: '剧本杀',
    icon: '🎭',
    description: '角色扮演，推理找出真相',
    tags: ['推理', '角色扮演', '剧情']
  },
  {
    id: 'adventure',
    name: '冒险闯关',
    icon: '🗺️',
    description: '闯关打怪，收集宝藏',
    tags: ['冒险', '收集', '成长']
  },
  {
    id: 'detective',
    name: '侦探探案',
    icon: '🔍',
    description: '调查线索，破解案件',
    tags: ['侦探', '推理', '观察']
  }
])

const selectedMode = ref('escape')

const params = reactive({
  questionCount: 10,
  difficulty: 3,
  duration: '30',
  deadline: null,
  rewards: ['coins', 'badges']
})

const homeworkInfo = reactive({
  name: '',
  questionCount: 0,
  mode: '',
  duration: '',
  knowledgePoints: []
})

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const generateHomework = async () => {
  generating.value = true
  // TODO: 调用生成作业 API
  setTimeout(() => {
    generating.value = false
    homeworkInfo.name = `密室逃脱 - 数学大冒险`
    homeworkInfo.questionCount = params.questionCount
    homeworkInfo.mode = modes.value.find(m => m.id === selectedMode.value)?.name
    homeworkInfo.duration = params.duration
    homeworkInfo.knowledgePoints = filters.knowledgePoints.map(id => {
      return knowledgePoints.value.find(kp => kp.id === id)?.name
    }).filter(Boolean)
  }, 2000)
}
</script>

<style scoped lang="scss">
.homework-generator {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;

  h1 {
    margin: 0 0 20px 0;
    color: #333;
  }
}

.step-content {
  margin-bottom: 20px;
}

.filter-card, .mode-card, .params-card, .preview-card {
  margin-bottom: 20px;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.mode-item {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    border-color: #409EFF;
    transform: translateY(-5px);
  }

  &.active {
    border-color: #409EFF;
    background: #ecf5ff;
  }

  .mode-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }

  h3 {
    margin: 10px 0;
    color: #333;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 10px 0;
  }

  .mode-tags {
    display: flex;
    justify-content: center;
    gap: 5px;
    flex-wrap: wrap;
  }
}

.generating {
  text-align: center;
  padding: 40px;

  .el-icon {
    font-size: 48px;
    color: #409EFF;
  }

  p {
    margin-top: 20px;
    color: #666;
  }
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style>
