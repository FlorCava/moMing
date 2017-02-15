const app = getApp()
const lessonApi = require('../../api/lesson.js')

Page({
  data: {
    lessonOpen: [],
    currentPage: 0,
    totalPages: 0,
    loading: false
  },
  openLessonList: function (page, resolve) {
    let that = this
    that.setData({
      'loading': true
    })
    lessonApi.openLessonList(page, function (result) {
      let lessonOpen = that.data.lessonOpen
      let lessons = result.data.data.lessons
      lessonOpen = lessonOpen.concat(lessons)
      let page = result.data.data.page
      let pages = result.data.data.pages
      that.setData({
        'loading': false,
        'lessonOpen': lessonOpen,
        'currentPage': page,
        'totalPages': pages
      })
      typeof resolve == "function" && resolve()
    })
  },
  bindLoadMore: function () {
    let page = this.data.currentPage + 1
    this.openLessonList(page)
  },
  onPullDownRefresh: function () {
    let page = 1
    this.setData({
      lessonOpen:[]
    })
    this.openLessonList(page, function () {
      wx.stopPullDownRefresh()
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let page = this.data.currentPage + 1
    this.openLessonList(page)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
