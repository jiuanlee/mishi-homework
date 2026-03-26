Page({
  data: {
    stats: {
      completedCount: 0,
      totalScore: 0,
      badgesCount: 0,
      coinsCount: 0
    },
    recordList: []
  },

  onShow() {
    this.loadRecord()
  },

  loadRecord() {
    // 从本地缓存加载数据
    const stats = wx.getStorageSync('stats') || {
      completedCount: 12,
      totalScore: 1200,
      badgesCount: 8,
      coinsCount: 1500
    }

    const recordList = wx.getStorageSync('recordList') || [
      {
        id: 1,
        name: '密室逃脱 - 数学大冒险',
        date: '2024-03-25',
        mode: '密室逃脱',
        score: 95,
        duration: '18 分钟',
        coins: 100,
        badges: 1
      },
      {
        id: 2,
        name: '剧本杀 - 古诗词之谜',
        date: '2024-03-23',
        mode: '剧本杀',
        score: 88,
        duration: '25 分钟',
        coins: 80,
        badges: 1
      },
      {
        id: 3,
        name: '冒险闯关 - 英语单词',
        date: '2024-03-20',
        mode: '冒险闯关',
        score: 92,
        duration: '15 分钟',
        coins: 90,
        badges: 1
      }
    ]

    this.setData({ stats, recordList })
  }
})
