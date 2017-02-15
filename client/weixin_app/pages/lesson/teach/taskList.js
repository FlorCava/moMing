const app = getApp()
const lessonApi = require('../../../api/lesson.js')
let tabSliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    reviewTasks: [],
    lesson_id: 0,
    date: '',
    tabs: ["待点评作业", "全部作业"],
    tabActiveIndex: "0",
    tabSliderOffset: 0,
    tabSliderLeft: 0
  },
  bindTabs: function (e) {
    this.setData({
      tabSliderOffset: e.currentTarget.offsetLeft,
      tabActiveIndex: e.currentTarget.id
    })
  },
  bindShowTask: function (e) {
    let task = e.currentTarget.dataset.task
    app.globalData.temp.currentTask = task
    wx.navigateTo({
      url: '/pages/lesson/teach/taskReview'
    })
  },
  lessonReviewTaskList: function (resolve) {
    let that = this
    lessonApi.lessonReviewTaskList(that.data.lesson_id, that.data.date, function (result) {
      let reviewTasks = []
      result.data.data.reviewTasks.forEach(function (task) {
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
        reviewTasks.push(taskNew)
      })
      that.setData({
        'reviewTasks': reviewTasks
      })
      typeof resolve == "function" && resolve()
    })
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      tabSliderLeft: (app.globalData.systemInfo.windowWidth / that.data.tabs.length - tabSliderWidth) / 2,
      lesson_id: options.lesson_id,
      date: options.date
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    let that = this
    if (that.data.lesson_id !== 0 && that.data.date !== '') {
      that.lessonReviewTaskList()
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})