<template>
  <button 
    class="cartoon-button" 
    :class="[type, size, { disabled: disabled, loading: loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner">⏳</span>
    <span v-if="icon && !loading" class="button-icon">{{ icon }}</span>
    <span class="button-text"><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'primary', // primary, success, warning, danger
    validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (e) => {
  emit('click', e)
}
</script>

<style scoped lang="scss">
.cartoon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 25px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 50%
    );
    border-radius: 25px;
  }

  &:active:not(.disabled):not(.loading) {
    transform: scale(0.95);
  }

  &.small {
    padding: 8px 16px;
    font-size: 14px;
  }

  &.medium {
    padding: 12px 24px;
    font-size: 16px;
  }

  &.large {
    padding: 16px 32px;
    font-size: 18px;
  }

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  &.success {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(86, 171, 47, 0.4);
  }

  &.warning {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
  }

  &.danger {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.loading {
    cursor: wait;
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  .button-icon {
    font-size: 1.2em;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
