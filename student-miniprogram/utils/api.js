/**
 * API 请求封装
 */

const BASE_URL = 'https://api.yoursite.com' // TODO: 替换为实际 API 地址

/**
 * 封装 wx.request
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') || ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * 学生登录
 * @param {string} classCode 班级码
 * @param {string} studentName 姓名
 */
const studentLogin = (classCode, studentName) => {
  return request({
    url: '/api/student/login',
    method: 'POST',
    data: { classCode, studentName }
  })
}

/**
 * 获取作业列表
 */
const getHomeworkList = () => {
  return request({
    url: '/api/student/homework',
    method: 'GET'
  })
}

/**
 * 获取作业详情
 * @param {number} homeworkId 作业 ID
 */
const getHomeworkDetail = (homeworkId) => {
  return request({
    url: `/api/student/homework/${homeworkId}`,
    method: 'GET'
  })
}

/**
 * 获取题目
 * @param {number} homeworkId 作业 ID
 * @param {number} questionIndex 题目索引
 */
const getQuestion = (homeworkId, questionIndex) => {
  return request({
    url: `/api/student/homework/${homeworkId}/question/${questionIndex}`,
    method: 'GET'
  })
}

/**
 * 提交答案
 * @param {number} homeworkId 作业 ID
 * @param {number} questionIndex 题目索引
 * @param {number} answer 答案选项索引
 */
const submitAnswer = (homeworkId, questionIndex, answer) => {
  return request({
    url: `/api/student/homework/${homeworkId}/answer`,
    method: 'POST',
    data: { questionIndex, answer }
  })
}

/**
 * 完成作业
 * @param {number} homeworkId 作业 ID
 */
const finishHomework = (homeworkId) => {
  return request({
    url: `/api/student/homework/${homeworkId}/finish`,
    method: 'POST'
  })
}

/**
 * 获取学习记录
 */
const getRecord = () => {
  return request({
    url: '/api/student/record',
    method: 'GET'
  })
}

module.exports = {
  request,
  studentLogin,
  getHomeworkList,
  getHomeworkDetail,
  getQuestion,
  submitAnswer,
  finishHomework,
  getRecord
}
