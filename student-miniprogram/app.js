App({
  onLaunch() {
    // 小程序启动时执行
    console.log('密室做题家小程序启动')
    
    // 检查登录状态
    const classCode = wx.getStorageSync('classCode')
    const studentName = wx.getStorageSync('studentName')
    
    if (!classCode || !studentName) {
      // 未登录，跳转到登录页
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  },

  globalData: {
    userInfo: null,
    classCode: '',
    studentName: ''
  }
})
