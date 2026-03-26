<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="unlock-overlay" @click="handleClick">
        <div class="unlock-content">
          <div class="unlock-icon-wrapper">
            <span class="unlock-icon">🎉</span>
            <span class="unlock-stars">✨</span>
          </div>
          <h2 class="unlock-title">线索解锁！</h2>
          <p class="unlock-clue-name">{{ clueName }}</p>
          <div class="unlock-progress" v-if="showProgress">
            <div class="progress-dots">
              <span 
                class="dot" 
                v-for="i in total" 
                :key="i"
                :class="{ active: i <= current }"
              ></span>
            </div>
            <p class="progress-text">{{ current }}/{{ total }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  clueName: {
    type: String,
    required: true
  },
  current: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 10
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['close', 'click'])

let timer = null

if (defineProps().autoClose && defineProps().visible) {
  timer = setTimeout(() => {
    emit('close')
  }, defineProps().duration)
}

const handleClick = (e) => {
  emit('click', e)
  if (defineProps().autoClose) {
    emit('close')
  }
}

// 清理定时器
defineExpose({
  clearTimer: () => {
    if (timer) clearTimeout(timer)
  }
})
</script>

<style scoped lang="scss">
.unlock-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.unlock-content {
  text-align: center;
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.unlock-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.unlock-icon {
  font-size: 120px;
  display: block;
  animation: pulse 1s infinite;
}

.unlock-stars {
  position: absolute;
  top: -20px;
  right: -40px;
  font-size: 60px;
  animation: twinkle 1.5s infinite;
}

.unlock-title {
  font-size: 40px;
  color: white;
  margin: 0 0 10px 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.unlock-clue-name {
  font-size: 28px;
  color: #ffd700;
  margin: 0 0 30px 0;
  font-weight: bold;
}

.unlock-progress {
  margin-top: 20px;
}

.progress-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s;

  &.active {
    background: #ffd700;
    transform: scale(1.2);
  }
}

.progress-text {
  color: white;
  font-size: 16px;
  margin: 0;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: rotate(0deg);
  }
  50% {
    opacity: 0.5;
    transform: rotate(180deg);
  }
}
</style>
