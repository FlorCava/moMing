const app = getApp()
const lessonApi = require('../../api/lesson.js')

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
      images: []
    }
  },
  onShareAppMessage: function () {
    let that = this
    return {
      title: '墨铭学堂课程分享',
      desc: `快来报名课程-${that.data.lesson.title}`,
      path: `/pages/lesson/lesson?lesson_id=${that.data.lesson.lesson_id}`
    }
  },
  bindJoinButton: function () {
    let that = this
    lessonApi.lessonJoin(that.data.lesson.lesson_id, function (result) {
      that.setData({
        'lesson.me.joined': true
      })
      wx.showToast({
        title: '成功报名',
        icon: 'success',
        duration: 10000,
        success: function () {
          setTimeout(function () {
            wx.switchTab({
              url: `/pages/index/index`
            })
          }, 1500)
        }
      })
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    lessonApi.lessonReadOne(options.lesson_id, function (result) {
      let lesson = result.data.data.lesson
      that.setData({
        'lesson': lesson,
      })
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