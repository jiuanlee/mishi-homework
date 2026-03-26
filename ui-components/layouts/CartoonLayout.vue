<template>
  <div class="cartoon-layout">
    <header class="layout-header" :style="{ background: headerGradient }">
      <div class="header-content">
        <slot name="header">
          <h1 class="header-title">{{ title }}</h1>
        </slot>
      </div>
    </header>
    
    <main class="layout-main">
      <div class="main-content">
        <slot />
      </div>
    </main>
    
    <footer class="layout-footer" v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '密室做题家'
  },
  headerGradient: {
    type: String,
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
})
</script>

<style scoped lang="scss">
.cartoon-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.layout-header {
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-title {
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.layout-main {
  flex: 1;
  padding: 20px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.layout-footer {
  background: white;
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
