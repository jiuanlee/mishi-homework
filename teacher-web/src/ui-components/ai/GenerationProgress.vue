<template>
  <div class="generation-progress">
    <el-card class="progress-card">
      <template #header>
        <span>✨ AI 正在生成剧本...</span>
      </template>
      <div class="progress-content">
        <div class="progress-animation">
          <div class="loading-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <el-icon class="ai-icon"><MagicStick /></el-icon>
        </div>
        
        <div class="progress-steps">
          <div 
            v-for="(step, index) in progressSteps" 
            :key="index"
            class="progress-step"
            :class="{ 
              completed: currentStep > index,
              active: currentStep === index 
            }"
          >
            <el-icon class="step-icon">
              <Check v-if="currentStep > index" />
              <Loading v-else-if="currentStep === index" />
              <CircleClose v-else />
            </el-icon>
            <span class="step-text">{{ step }}</span>
          </div>
        </div>

        <div v-if="streamContent" class="stream-output">
          <el-input
            type="textarea"
            :model-value="streamContent"
            readonly
            :rows="6"
            placeholder="正在接收 AI 生成内容..."
          />
        </div>

        <div class="progress-info">
          <el-progress 
            :percentage="progressPercentage" 
            :status="progressPercentage === 100 ? 'success' : undefined"
          />
          <p class="progress-text">{{ progressText }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loading, Check, CircleClose, MagicStick } from '@element-plus/icons-vue'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 0
  },
  streamContent: {
    type: String,
    default: ''
  },
  progressPercentage: {
    type: Number,
    default: 0
  }
})

const progressSteps = [
  '分析知识点',
  '构建剧情框架',
  '设计谜题关卡',
  '生成剧本内容',
  '优化完善'
]

const progressText = computed(() => {
  if (props.progressPercentage === 100) {
    return '剧本生成完成！'
  }
  return `正在${progressSteps[props.currentStep] || '生成中'}...`
})
</script>

<style scoped lang="scss">
.generation-progress {
  margin-bottom: 20px;
}

.progress-card {
  margin-bottom: 20px;
}

.progress-content {
  padding: 20px 0;
}

.progress-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.loading-dots {
  display: flex;
  gap: 5px;
}

.dot {
  width: 10px;
  height: 10px;
  background: #409EFF;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.ai-icon {
  font-size: 48px;
  color: #409EFF;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
}

.progress-steps {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 10px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #999;
  
  &.completed {
    color: #67C23A;
  }
  
  &.active {
    color: #409EFF;
  }
  
  .step-icon {
    font-size: 24px;
  }
  
  .step-text {
    font-size: 12px;
    text-align: center;
  }
}

.stream-output {
  margin-bottom: 20px;
}

.progress-info {
  text-align: center;
  
  .progress-text {
    margin-top: 10px;
    color: #666;
    font-size: 14px;
  }
}
</style>
