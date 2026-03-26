<template>
  <div class="homework-card" :class="status" @click="handleClick">
    <div class="card-header">
      <div class="mode-icon">{{ modeIcon }}</div>
      <div class="homework-info">
        <h3 class="homework-name">{{ name }}</h3>
        <p class="homework-meta">
          <span>{{ questionCount }}题</span>
          <span class="separator">·</span>
          <span>{{ duration }}分钟</span>
        </p>
      </div>
      <div class="status-tag" :class="status">{{ statusText }}</div>
    </div>
    
    <div class="card-footer">
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-label">进度</span>
          <span class="progress-value">{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>
      <div class="deadline">
        <span class="deadline-icon">🕐</span>
        <span class="deadline-text">{{ deadline }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  questionCount: {
    type: Number,
    default: 10
  },
  duration: {
    type: String,
    default: '30'
  },
  progress: {
    type: Number,
    default: 0
  },
  deadline: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending', // pending, doing, completed
    validator: (value) => ['pending', 'doing', 'completed'].includes(value)
  }
})

const emit = defineEmits(['click'])

const modeIcons = {
  '密室逃脱': '🔐',
  '剧本杀': '🎭',
  '冒险闯关': '🗺️',
  '侦探探案': '🔍'
}

const statusTexts = {
  'pending': '待开始',
  'doing': '进行中',
  'completed': '已完成'
}

const modeIcon = modeIcons[defineProps().mode] || '📝'
const statusText = statusTexts[defineProps().status]

const handleClick = (e) => {
  emit('click', e)
}
</script>

<style scoped lang="scss">
.homework-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
  }

  &.completed {
    opacity: 0.7;
  }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.mode-icon {
  font-size: 48px;
  margin-right: 15px;
}

.homework-info {
  flex: 1;

  .homework-name {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #333;
  }

  .homework-meta {
    margin: 0;
    font-size: 14px;
    color: #999;

    .separator {
      margin: 0 8px;
    }
  }
}

.status-tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;

  &.pending {
    background: #fff7e6;
    color: #ff9900;
  }

  &.doing {
    background: #ecf5ff;
    color: #409EFF;
  }

  &.completed {
    background: #f0f9ff;
    color: #67C23A;
  }
}

.card-footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.progress-section {
  margin-bottom: 12px;

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .progress-label {
      font-size: 14px;
      color: #666;
    }

    .progress-value {
      font-size: 14px;
      color: #667eea;
      font-weight: bold;
    }
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }
  }
}

.deadline {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999;

  .deadline-icon {
    margin-right: 5px;
  }

  .deadline-text {
    color: #f56c6c;
  }
}
</style>
