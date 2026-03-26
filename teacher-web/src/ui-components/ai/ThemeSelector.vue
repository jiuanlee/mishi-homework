<template>
  <div class="theme-selector">
    <el-card class="theme-card">
      <template #header>
        <span>🎭 选择剧本主题</span>
      </template>
      <div class="theme-grid">
        <div 
          v-for="theme in themes" 
          :key="theme.id"
          class="theme-item"
          :class="{ active: modelValue === theme.id }"
          @click="$emit('update:modelValue', theme.id)"
        >
          <div class="theme-icon">{{ theme.icon }}</div>
          <h3>{{ theme.name }}</h3>
          <p>{{ theme.description }}</p>
          <div class="theme-tags">
            <el-tag 
              v-for="tag in theme.tags" 
              :key="tag" 
              size="small"
              :type="modelValue === theme.id ? 'primary' : 'info'"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: 'fairy'
  }
})

defineEmits(['update:modelValue'])

const themes = ref([
  {
    id: 'fairy',
    name: '童话故事',
    icon: '🧚',
    description: '经典童话改编，充满魔法与奇迹',
    tags: ['奇幻', '温馨', '教育']
  },
  {
    id: 'detective',
    name: '侦探推理',
    icon: '🔍',
    description: '破解谜案，锻炼逻辑思维能力',
    tags: ['推理', '悬疑', '智力']
  },
  {
    id: 'adventure',
    name: '冒险探索',
    icon: '🗺️',
    description: '探索未知世界，勇敢闯关',
    tags: ['冒险', '探索', '勇气']
  },
  {
    id: 'sci-fi',
    name: '科幻未来',
    icon: '🚀',
    description: '未来科技，激发想象力',
    tags: ['科幻', '科技', '创新']
  }
])
</script>

<style scoped lang="scss">
.theme-selector {
  margin-bottom: 20px;
}

.theme-card {
  margin-bottom: 20px;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.theme-item {
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

  .theme-icon {
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

  .theme-tags {
    display: flex;
    justify-content: center;
    gap: 5px;
    flex-wrap: wrap;
    margin-top: 10px;
  }
}
</style>
