const app = getApp()
const lessonApi = require('../../api/lesson.js')

Page({
  data: {
    userInfo: {},
    lessonCreate: [],
    lessonJoin: [],
    lessonTeach: []
  },
  onShow: function () {
    let that = this
    that.setData({
      userInfo: app.globalData.userInfo
    })
    if (that.data.userInfo.is_admin) {
      lessonApi.myCreateTopLesson(function (result) {
        let lessons = result.data.data.lessons
        that.setData({
          'lessonCreate': lessons,
        })
      })
    }
    lessonApi.myJoinTopLesson(function (result) {
      let lessons = result.data.data.lessons
      that.setData({
        'lessonJoin': lessons,
      })
    })
    lessonApi.myTeachTopLesson(function (result) {
      let lessons = result.data.data.lessons
      that.setData({
        'lessonTeach': lessons,
      })
    })
  }
})
