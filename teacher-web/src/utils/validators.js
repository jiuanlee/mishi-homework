/**
 * 表单验证规则
 */

/**
 * 验证用户名
 * @param {string} username 用户名
 * @returns {Object} 验证结果
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return { valid: false, message: '用户名不能为空' }
  }
  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: '用户名长度 3-20 个字符' }
  }
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    return { valid: false, message: '用户名只能包含字母、数字、下划线和中文' }
  }
  return { valid: true, message: '' }
}

/**
 * 验证密码
 * @param {string} password 密码
 * @returns {Object} 验证结果
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { valid: false, message: '密码不能为空' }
  }
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少 6 位' }
  }
  if (password.length > 32) {
    return { valid: false, message: '密码长度不能超过 32 位' }
  }
  return { valid: true, message: '' }
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {Object} 验证结果
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, message: '邮箱不能为空' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: '邮箱格式不正确' }
  }
  return { valid: true, message: '' }
}

/**
 * 验证班级码
 * @param {string} code 班级码
 * @returns {Object} 验证结果
 */
export const validateClassCode = (code) => {
  if (!code || code.trim() === '') {
    return { valid: false, message: '班级码不能为空' }
  }
  if (code.length !== 6) {
    return { valid: false, message: '班级码为 6 位' }
  }
  if (!/^[A-Z0-9]+$/.test(code)) {
    return { valid: false, message: '班级码只能包含大写字母和数字' }
  }
  return { valid: true, message: '' }
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {Object} 验证结果
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { valid: false, message: '手机号不能为空' }
  }
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: '手机号格式不正确' }
  }
  return { valid: true, message: '' }
}

/**
 * 验证确认密码
 * @param {string} password 密码
 * @param {string} confirmPassword 确认密码
 * @returns {Object} 验证结果
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { valid: false, message: '请确认密码' }
  }
  if (password !== confirmPassword) {
    return { valid: false, message: '两次密码不一致' }
  }
  return { valid: true, message: '' }
}
