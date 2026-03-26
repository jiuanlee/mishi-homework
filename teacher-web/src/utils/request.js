import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 假设后端返回格式为 { code: 200, data: {}, message: 'success' }
    if (res.code !== 200) {
      console.error('API 错误:', res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data
  },
  error => {
    console.error('响应错误:', error)
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转登录
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('未知错误')
      }
    }
    return Promise.reject(error)
  }
)

export default request
