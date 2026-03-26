<template>
  <div class="ai-script-generator">
    <div class="page-header">
      <h1>✨ AI 剧本生成</h1>
      <p class="page-desc">一键生成沉浸式密室逃脱剧本，让学习更有趣</p>
    </div>

    <!-- 第一步：基础设置 -->
    <div v-show="currentStep === 0" class="step-content">
      <!-- 主题选择 -->
      <ThemeSelector v-model="form.theme" />

      <!-- 难度和时长 -->
      <el-card class="settings-card">
        <template #header>
          <span>⚙️ 难度与时长设置</span>
        </template>
        <el-form :model="form" label-width="120px">
          <el-form-item label="难度等级">
            <el-select v-model="form.difficulty" placeholder="选择难度">
              <el-option label="简单 - 适合低年级" value="easy" />
              <el-option label="中等 - 适合中年级" value="medium" />
              <el-option label="较难 - 适合高年级" value="hard" />
            </el-select>
          </el-form-item>
          <el-form-item label="游戏时长">
            <el-radio-group v-model="form.time_limit">
              <el-radio-button :label="15">15 分钟</el-radio-button>
              <el-radio-button :label="20">20 分钟</el-radio-button>
              <el-radio-button :label="30">30 分钟</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 第二步：教学设置 -->
    <div v-show="currentStep === 1" class="step-content">
      <el-card class="education-card">
        <template #header>
          <span>📚 教学参数设置</span>
        </template>
        <el-form :model="form" label-width="120px">
          <el-form-item label="年级">
            <el-select v-model="form.grade" placeholder="选择年级">
              <el-option label="一年级" :value="1" />
              <el-option label="二年级" :value="2" />
              <el-option label="三年级" :value="3" />
              <el-option label="四年级" :value="4" />
              <el-option label="五年级" :value="5" />
              <el-option label="六年级" :value="6" />
            </el-select>
          </el-form-item>
          <el-form-item label="学科">
            <el-select v-model="form.subject" placeholder="选择学科">
              <el-option label="语文" value="chinese" />
              <el-option label="数学" value="math" />
              <el-option label="英语" value="english" />
              <el-option label="科学" value="science" />
            </el-select>
          </el-form-item>
          <el-form-item label="知识点">
            <el-select 
              v-model="form.knowledge_points" 
              placeholder="选择知识点（可多选）" 
              multiple
              filterable
              allow-create
              default-first-option
            >
              <el-option 
                v-for="kp in knowledgePoints" 
                :key="kp.id" 
                :label="kp.name" 
                :value="kp.id" 
              />
            </el-select>
            <div class="knowledge-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>可选择多个知识点，AI 会自动融合到剧情中</span>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 第三步：生成进度 -->
    <div v-show="currentStep === 2" class="step-content">
      <GenerationProgress 
        :current-step="generationStep"
        :stream-content="streamContent"
        :progress-percentage="progressPercentage"
      />
    </div>

    <!-- 第四步：预览和下发 -->
    <div v-show="currentStep === 3" class="step-content">
      <ScriptPreview 
        v-model:script="generatedScript"
        :theme="form.theme"
        :difficulty="form.difficulty"
        :grade="form.grade"
        :subject="form.subject"
        :knowledge-points="form.knowledge_points"
        @distribute="handleDistribute"
      />
    </div>

    <!-- 底部操作按钮 -->
    <div class="step-actions">
      <el-button 
        @click="prevStep" 
        :disabled="currentStep === 0 || generating"
      >
        上一步
      </el-button>
      
      <el-button 
        v-if="currentStep < 2" 
        type="primary" 
        @click="nextStep"
      >
        下一步
      </el-button>
      
      <el-button 
        v-if="currentStep === 2" 
        type="warning" 
        @click="cancelGeneration"
        :disabled="progressPercentage === 100"
      >
        取消生成
      </el-button>
      
      <el-button 
        v-if="currentStep === 1" 
        type="success" 
        @click="generateScript"
        :loading="generating"
        :icon="MagicStick"
      >
        ✨ 一键生成剧本
      </el-button>
      
      <el-button 
        v-if="currentStep === 3" 
        type="primary" 
        @click="regenerate"
        :loading="generating"
      >
        重新生成
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled, MagicStick } from '@element-plus/icons-vue'
import ThemeSelector from '../../ui-components/ai/ThemeSelector.vue'
import GenerationProgress from '../../ui-components/ai/GenerationProgress.vue'
import ScriptPreview from '../../ui-components/ai/ScriptPreview.vue'

const currentStep = ref(0)
const generating = ref(false)
const generationStep = ref(0)
const streamContent = ref('')
const progressPercentage = ref(0)

const form = reactive({
  theme: 'fairy',
  difficulty: 'medium',
  time_limit: 20,
  grade: 3,
  subject: 'math',
  knowledge_points: []
})

const knowledgePoints = ref([
  { id: 1, name: '加减法运算' },
  { id: 2, name: '乘除法运算' },
  { id: 3, name: '分数认识' },
  { id: 4, name: '古诗词背诵' },
  { id: 5, name: '阅读理解' },
  { id: 6, name: '单词拼写' },
  { id: 7, name: '几何图形' },
  { id: 8, name: '应用题解题' }
])

const generatedScript = ref(null)

const prevStep = () => {
  if (currentStep.value > 0 && !generating.value) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

const generateScript = async () => {
  // 验证必填项
  if (!form.knowledge_points || form.knowledge_points.length === 0) {
    ElMessage.warning('请至少选择一个知识点')
    return
  }

  generating.value = true
  currentStep.value = 2
  generationStep.value = 0
  streamContent.value = ''
  progressPercentage.value = 0

  try {
    // 使用 SSE 流式输出
    await generateScriptWithSSE()
  } catch (error) {
    ElMessage.error('生成失败：' + error.message)
    generating.value = false
  }
}

const generateScriptWithSSE = () => {
  return new Promise((resolve, reject) => {
    // 模拟 SSE 流式输出
    const mockStream = [
      '正在分析选择的知识点...',
      '构建剧情框架中...',
      '设计谜题关卡...',
      '生成剧本内容...',
      '优化完善中...',
      '生成完成！'
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < mockStream.length) {
        streamContent.value += mockStream[index] + '\n'
        generationStep.value = index
        progressPercentage.value = Math.round(((index + 1) / mockStream.length) * 100)
        index++
      } else {
        clearInterval(interval)
        generating.value = false
        currentStep.value = 3
        
        // 生成示例剧本
        generatedScript.value = {
          title: `${form.grade}年级${form.subject === 'math' ? '数学' : form.subject === 'chinese' ? '语文' : form.subject === 'english' ? '英语' : '科学'}大冒险`,
          background: `在一个神奇的${form.theme === 'fairy' ? '童话世界' : form.theme === 'detective' ? '侦探事务所' : form.theme === 'adventure' ? '冒险岛屿' : '未来城市'}中，小朋友们需要通过解决${form.subject}问题来完成挑战。`,
          characters: `主角：小明（${form.grade}年级学生）\n助手：智慧精灵（引导者）\n反派：${form.theme === 'fairy' ? '迷雾魔王' : form.theme === 'detective' ? '神秘小偷' : form.theme === 'adventure' ? '宝藏守护者' : '邪恶机器人'}`,
          levels: [
            { description: '第一关：基础知识测试' },
            { description: '第二关：应用题挑战' },
            { description: '第三关：综合推理题' },
            { description: '最终关：BOSS 对决' }
          ],
          puzzles: `1. 基础计算题：设计${form.knowledge_points.length}道与知识点相关的计算题\n2. 应用题：将知识点融入实际场景\n3. 推理题：需要综合运用多个知识点`,
          ending: '恭喜你成功完成了所有挑战！你不仅解开了谜题，还掌握了重要的知识。继续加油！'
        }
        
        ElMessage.success('剧本生成成功！')
        resolve()
      }
    }, 800)

    // 实际应该使用 EventSource 连接 SSE
    // const eventSource = new EventSource(`/api/ai/generate-script/stream?${new URLSearchParams({
    //   theme: form.theme,
    //   difficulty: form.difficulty,
    //   time_limit: form.time_limit,
    //   grade: form.grade,
    //   subject: form.subject,
    //   knowledge_points: form.knowledge_points.join(',')
    // })}`)
    // 
    // eventSource.onmessage = (event) => {
    //   const data = JSON.parse(event.data)
    //   streamContent.value += data.content + '\n'
    //   generationStep.value = data.step
    //   progressPercentage.value = data.progress
    //   
    //   if (data.done) {
    //     eventSource.close()
    //     generatedScript.value = data.script
    //     generating.value = false
    //     currentStep.value = 3
    //     resolve()
    //   }
    // }
    // 
    // eventSource.onerror = (error) => {
    //   eventSource.close()
    //   reject(error)
    // }
  })
}

const cancelGeneration = () => {
  ElMessageBox.confirm('确定要取消生成吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    generating.value = false
    currentStep.value = 1
    ElMessage.info('已取消生成')
  }).catch(() => {})
}

const regenerate = () => {
  ElMessageBox.confirm('确定要重新生成剧本吗？当前内容将被覆盖', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    generateScript()
  }).catch(() => {})
}

const handleDistribute = () => {
  ElMessageBox.prompt('请选择要下发的班级', '下发剧本', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '输入班级名称或选择'
  }).then(({ value }) => {
    if (value) {
      // TODO: 调用下发 API
      ElMessage.success(`剧本已下发到班级：${value}`)
    }
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.ai-script-generator {
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

.step-content {
  margin-bottom: 20px;
}

.settings-card, .education-card {
  margin-bottom: 20px;
}

.knowledge-tip {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
  font-size: 12px;
  margin-top: 5px;

  .el-icon {
    color: #409EFF;
  }
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-bottom: 40px;
}
</style>
