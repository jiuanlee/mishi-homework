/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的字符串
 */
const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 格式化日期
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的字符串
 */
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].map(formatNumber).join('-')}`
}

/**
 * 补零函数
 * @param {number} n 数字
 * @returns {string} 补零后的字符串
 */
const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 倒计时格式化
 * @param {number} seconds 秒数
 * @returns {string} 格式化后的倒计时
 */
const formatCountdown = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`
}

/**
 * 防抖函数
 * @param {Function} fn 需要防抖的函数
 * @param {number} delay 延迟时间
 * @returns {Function} 防抖后的函数
 */
const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 需要节流的函数
 * @param {number} interval 间隔时间
 * @returns {Function} 节流后的函数
 */
const throttle = (fn, interval = 300) => {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 保存到本地缓存
 * @param {string} key 键名
 * @param {any} value 值
 */
const saveToLocal = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    console.error('保存本地缓存失败:', e)
  }
}

/**
 * 从本地缓存读取
 * @param {string} key 键名
 * @returns {any} 值
 */
const loadFromLocal = (key) => {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    console.error('读取本地缓存失败:', e)
    return null
  }
}

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  formatCountdown,
  debounce,
  throttle,
  saveToLocal,
  loadFromLocal
}
