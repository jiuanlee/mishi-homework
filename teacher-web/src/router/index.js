import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/classes',
    name: 'ClassManagement',
    component: () => import('../pages/ClassManagement.vue')
  },
  {
    path: '/homework/create',
    name: 'HomeworkGenerator',
    component: () => import('../pages/HomeworkGenerator.vue')
  },
  {
    path: '/homework',
    name: 'HomeworkManagement',
    component: () => import('../pages/HomeworkManagement.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../pages/Statistics.vue')
  },
  {
    path: '/ai-script',
    name: 'AIScriptGenerator',
    component: () => import('../pages/AIScriptGenerator.vue')
  },
  {
    path: '/ai-script/preview',
    name: 'ScriptPreview',
    component: () => import('../pages/ScriptPreview.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
