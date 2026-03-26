Page({
  data: {
    studentName: '',
    classCode: '',
    homeworkList: []
  },

  onLoad() {
    this.loadUserInfo()
    this.loadHomeworkList()
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadHomeworkList()
  },

  loadUserInfo() {
    const studentName = wx.getStorageSync('studentName')
    const classCode = wx.getStorageSync('classCode')
    this.setData({ studentName, classCode })
  },

  loadHomeworkList() {
    // TODO: 从 API 加载作业列表
    // 这里使用模拟数据
    const homeworkList = [
      {
        id: 1,
        name: '密室逃脱 - 数学大冒险',
        mode: '密室逃脱',
        modeIcon: '🔐',
        questionCount: 10,
        duration: '30',
        status: 'doing',
        statusText: '进行中',
        progress: 60,
        deadline: '2024-03-27 23:59'
      },
      {
        id: 2,
        name: '剧本杀 - 古诗词之谜',
        mode: '剧本杀',
        modeIcon: '🎭',
        questionCount: 15,
        duration: '45',
        status: 'pending',
        statusText: '待开始',
        progress: 0,
        deadline: '2024-03-28 23:59'
      },
      {
        id: 3,
        name: '冒险闯关 - 英语单词',
        mode: '冒险闯关',
        modeIcon: '🗺️',
        questionCount: 20,
        duration: '30',
        status: 'completed',
        statusText: '已完成',
        progress: 100,
        deadline: '2024-03-25 23:59'
      }
    ]

    this.setData({ homeworkList })
  },

  enterHomework(e) {
    const homeworkId = e.currentTarget.dataset.id
    const homework = this.data.homeworkList.find(h => h.id === homeworkId)
    
    if (homework.status === 'completed') {
      // 已完成的作业可以查看记录
      wx.showToast({
        title: '已完成，可查看记录',
        icon: 'none'
      })
    } else {
      // 进入做题界面
      wx.navigateTo({
        url: `/pages/game/game?id=${homeworkId}&mode=${homework.mode}`
      })
    }
  }
})
