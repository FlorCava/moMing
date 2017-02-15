const app = getApp()
const lessonApi = require('../../../api/lesson.js')
let tabSliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    lesson: {
      lesson_id: 0,
      title: '',
      teacher: '',
      duration: '',
      start: {
        date: '',
        time: ''
      },
      end: {
        date: '',
        time: ''
      },
      detail: '',
      fee: 0,
      fee_description: '',
      status: '1',
      images: [],
    },
    contents: [],
    contentOpenIndex: -1,
    tasks: [],
    lesson_id: 0,
    tabs: ["介绍", "每日课程", "我的作业"],
    tabActiveIndex: "1",
    tabSliderOffset: 0,
    tabSliderLeft: 0
  },
  onShareAppMessage: function () {
    let that = this
    return {
      title: '墨铭学堂课程分享',
      desc: `快来报名课程-${that.data.lesson.title}`,
      path: `/pages/lesson/lesson?lesson_id=${that.data.lesson.lesson_id}`
    }
  },
  bindTabs: function (e) {
    this.setData({
      tabSliderOffset: e.currentTarget.offsetLeft,
      tabActiveIndex: e.currentTarget.id
    })
  },
  bindContentToggle: function (e) {
    let contentIndex = e.currentTarget.dataset.contentIndex
    if (contentIndex === this.data.contentOpenIndex) {
      contentIndex = -1
    }
    this.setData({
      contentOpenIndex: contentIndex
    })
  },
  bindShowTask: function (e) {
    let task = e.currentTarget.dataset.task
    app.globalData.temp.currentTask = task
    wx.navigateTo({
      url: '/pages/lesson/study/task'
    })
  },
  myLessonTaskList: function (resolve) {
    let that = this
    lessonApi.myLessonTaskList(that.data.lesson_id, function (result) {
      let tasks = []
      result.data.data.tasks.forEach(function (task) {
        let date = new Date(task.create_time)
        let taskNew = {}
        taskNew.lesson_id = task.lesson_id
        taskNew.task_id = task.task_id
        taskNew.images = task.images
        taskNew.description = task.description
        taskNew.date = `${date.getMonth() + 1}月${date.getDate()}日`
        taskNew.review_user = task.review_user
        taskNew.review_time = task.review_time
        taskNew.review = task.review
        tasks.push(taskNew)
      })
      that.setData({
        'tasks': tasks
      })
      typeof resolve == "function" && resolve()
    })
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      tabSliderLeft: (app.globalData.systemInfo.windowWidth / that.data.tabs.length - tabSliderWidth) / 2,
      lesson_id: options.lesson_id
    })
    lessonApi.lessonReadOne(options.lesson_id, function (result) {
      let lesson = result.data.data.lesson
      that.setData({
        'lesson': lesson,
      })
    })
    lessonApi.lessonReadContents(options.lesson_id, function (result) {
      let contents = []
      result.data.data.contents.forEach(function (content) {
        let start = new Date(content.start)
        let contentNew = {}
        contentNew.url = content.url
        contentNew.startLabel = `${start.getMonth() + 1}月${start.getDate()}日`
        contentNew.start = `${start.getMonth() + 1}月${start.getDate()}日 ${start.getHours()}时${start.getMinutes()}分`
        contentNew.content = content.content
        contents.push(contentNew)
      })
      that.setData({
        'contents': contents
      })
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    let that = this
    if (that.data.lesson_id !== 0) {
      that.myLessonTaskList()
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})