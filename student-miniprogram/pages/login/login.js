Page({
  data: {
    classCode: '',
    studentName: '',
    loading: false
  },

  onClassCodeInput(e) {
    this.setData({
      classCode: e.detail.value
    })
  },

  onNameInput(e) {
    this.setData({
      studentName: e.detail.value
    })
  },

  handleLogin() {
    const { classCode, studentName } = this.data
    
    if (!classCode || classCode.length !== 6) {
      wx.showToast({
        title: '请输入 6 位班级码',
        icon: 'none'
      })
      return
    }

    if (!studentName) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    // TODO: 调用登录 API
    setTimeout(() => {
      this.setData({ loading: false })
      wx.setStorageSync('classCode', classCode)
      wx.setStorageSync('studentName', studentName)
      wx.switchTab({
        url: '/pages/homework/homework'
      })
    }, 1000)
  }
})
