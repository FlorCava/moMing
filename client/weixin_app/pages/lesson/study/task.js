const app = getApp()
const lessonApi = require('../../../api/lesson.js')

Page({
  data: {
    task: {
      lesson_id: 0,
      task_id: 0,
      description: '',
      review_user: '',
      review_time: null,
      review: '',
      images: []
    },
    tempImages: []
  },
  bindPreviewImage: function (e) {
    let imageUrlIndex = e.target.dataset.imageUrlIndex
    wx.previewImage({
      current: this.data.task.images[imageUrlIndex],
      urls: this.data.task.images
    })
  },
  bindBackButton: function () {
    wx.navigateBack({
      delta: 1   // 返回到课程学习页面
    })
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      task: app.globalData.temp.currentTask
    })
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