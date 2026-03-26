<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <span class="logo-icon">🔐</span>
        <h1>密室做题家</h1>
        <p class="subtitle">老师端</p>
      </div>

      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password"
                placeholder="密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="login-btn"
                @click="handleLogin"
                :loading="loading"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
            <el-form-item prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="email">
              <el-input 
                v-model="registerForm.email" 
                placeholder="邮箱"
                prefix-icon="Message"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password"
                placeholder="密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password"
                placeholder="确认密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="register-btn"
                @click="handleRegister"
                :loading="loading"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('login')
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleLogin = async () => {
  loading.value = true
  // TODO: 调用登录 API
  setTimeout(() => {
    loading.value = false
    router.push('/classes')
  }, 1000)
}

const handleRegister = async () => {
  loading.value = true
  // TODO: 调用注册 API
  setTimeout(() => {
    loading.value = false
    activeTab.value = 'login'
  }, 1000)
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;

  .logo-icon {
    font-size: 60px;
    display: block;
    margin-bottom: 10px;
  }

  h1 {
    color: #333;
    font-size: 28px;
    margin: 0;
  }

  .subtitle {
    color: #666;
    font-size: 16px;
    margin-top: 5px;
  }
}

.login-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }

  .login-btn, .register-btn {
    width: 100%;
  }
}
</style>
