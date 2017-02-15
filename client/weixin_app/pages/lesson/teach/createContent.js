const app = getApp()
const lessonApi = require('../../../api/lesson.js')

Page({
  data: {
    content: {
      lesson_id: 0,
      url: '',
      start: {
        date: '',
        time: ''
      },
      content: ''
    }
  },
  bindUrlChange: function (e) {
    this.setData({
      'content.url': e.detail.value
    })
  },
  bindStartDateChange: function (e) {
    this.setData({
      'content.start.date': e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({
      'content.start.time': e.detail.value
    })
  },
  bindContentChange: function (e) {
    this.setData({
      'content.content': e.detail.value
    })
  },
  bindSaveButton: function () {
    let that = this
    lessonApi.lessonContentCreateOne(that.data.content.lesson_id, that.data.content, function (result) {
      wx.showToast({
        title: '每日课程添加成功',
        icon: 'success',
        duration: 10000,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1   // 返回到课程管理页面
            })
          }, 1500)
        }
      })
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    if (options.lesson_id !== undefined) {
      that.setData({
        'content.lesson_id': options.lesson_id
      })
    }
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