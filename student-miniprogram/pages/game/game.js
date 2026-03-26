Page({
  data: {
    currentStage: 'story', // story, game, result
    storyInfo: {
      title: '密室逃脱：数学城堡',
      content: '你被困在了一座神秘的数学城堡里！只有通过解答所有的数学谜题，收集足够的线索，才能找到出口。时间紧迫，城堡将在 30 分钟后关闭，你必须在此之前逃出去！准备好接受挑战了吗？'
    },
    timer: 0,
    score: 0,
    clues: 0,
    totalQuestions: 10,
    currentQuestionIndex: 0,
    currentQuestion: {
      type: '选择题',
      text: '25 + 37 = ?',
      options: ['52', '62', '72', '82'],
      image: null
    },
    selectedOption: null,
    showUnlockAnimation: false,
    unlockedClueName: '',
    accuracy: 0,
    rewards: {
      coins: 100,
      badges: 1
    }
  },

  onLoad(options) {
    this.homeworkId = options.id
    this.loadHomework()
  },

  loadHomework() {
    // TODO: 加载作业详情
    console.log('加载作业:', this.homeworkId)
  },

  startGame() {
    this.setData({ currentStage: 'game' })
    this.startTimer()
  },

  startTimer() {
    this.timer = setInterval(() => {
      this.setData({
        timer: this.data.timer + 1
      })
    }, 1000)
  },

  selectOption(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedOption: index })
  },

  submitAnswer() {
    const { selectedOption, currentQuestionIndex } = this.data
    
    // TODO: 验证答案
    const isCorrect = true // 模拟正确答案
    
    if (isCorrect) {
      this.setData({
        score: this.data.score + 10,
        clues: this.data.clues + 1,
        unlockedClueName: `线索 ${this.data.clues + 1}`,
        showUnlockAnimation: true
      })

      setTimeout(() => {
        this.setData({ showUnlockAnimation: false })
        this.nextQuestion()
      }, 2000)
    } else {
      wx.showToast({
        title: '答案错误，再想想~',
        icon: 'none'
      })
    }

    this.setData({ selectedOption: null })
  },

  nextQuestion() {
    const { currentQuestionIndex, totalQuestions } = this.data
    
    if (currentQuestionIndex >= totalQuestions - 1) {
      this.finishGame()
    } else {
      this.setData({
        currentQuestionIndex: currentQuestionIndex + 1
      })
      // TODO: 加载下一题
    }
  },

  finishGame() {
    clearInterval(this.timer)
    const { score, totalQuestions } = this.data
    this.setData({
      currentStage: 'result',
      accuracy: Math.round((score / (totalQuestions * 10)) * 100)
    })
    // TODO: 保存作业进度
  },

  backToHomework() {
    wx.switchTab({
      url: '/pages/homework/homework'
    })
  },

  onUnload() {
    clearInterval(this.timer)
    // TODO: 保存游戏进度到本地缓存
  }
})
