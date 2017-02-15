const app = getApp()
const lessonApi = require('../../../api/lesson.js')

Page({
  data: {
    userInfo: {},
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
      manage_user: '',
      status: '1',
      images: []
    },
    tempImages: []
  },
  bindTitleChange: function (e) {
    this.setData({
      'lesson.title': e.detail.value
    })
  },
  bindTeacherChange: function (e) {
    this.setData({
      'lesson.teacher': e.detail.value
    })
  },
  bindDurationChange: function (e) {
    this.setData({
      'lesson.duration': e.detail.value
    })
  },
  bindStartDateChange: function (e) {
    this.setData({
      'lesson.start.date': e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({
      'lesson.start.time': e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    this.setData({
      'lesson.end.date': e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      'lesson.end.time': e.detail.value
    })
  },
  bindDetailChange: function (e) {
    this.setData({
      'lesson.detail': e.detail.value
    })
  },
  bindFeeChange: function (e) {
    this.setData({
      'lesson.fee': e.detail.value
    })
  },
  bindFeeDescriptionChange: function (e) {
    this.setData({
      'lesson.fee_description': e.detail.value
    })
  },
  bindStatusChange: function (e) {
    this.setData({
      'lesson.status': e.detail.value
    })
  },
  bindChooseImage: function () {
    let that = this
    let images = that.data.lesson.images
    let tempImages = that.data.tempImages
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: function (res) {
        let tempImage = res.tempFilePaths[0]
        tempImages.push(tempImage)
        that.setData({
          tempImages: tempImages
        })
        lessonApi.lessonImageUpload(tempImage, function (res) {
          let data = JSON.parse(res.data)
          let imageUrl = data.data.file.url
          images.push(imageUrl)
          that.setData({
            'lesson.images': images
          })
          let lessonId = that.data.lesson.lesson_id
          if (lessonId !== 0) {
            lessonApi.lessonImagesAddOne(lessonId, imageUrl)
          }
        })
      }
    })
  },
  bindPreviewImage: function (e) {
    let imageUrlIndex = e.target.dataset.imageUrlIndex
    wx.previewImage({
      current: this.data.tempImages[imageUrlIndex],
      urls: this.data.tempImages
    })
  },
  bindRemoveImage: function (e) {
    let that = this
    let lessonId = that.data.lesson.lesson_id
    let imageUrl = e.target.dataset.imageUrl
    let imageUrlIndex = e.target.dataset.imageUrlIndex
    lessonApi.lessonImagesDeleteOne(lessonId, imageUrl, function (res) {
      let images = that.data.lesson.images
      let tempImages = that.data.tempImages
      images.splice(imageUrlIndex, 1)
      tempImages.splice(imageUrlIndex, 1)
      that.setData({
        'lesson.images': images,
        'tempImages': tempImages
      })
    })
  },
  bindSaveButton: function () {
    let that = this
    if (that.data.lesson.lesson_id === 0) {
      lessonApi.lessonCreateOne(that.data.lesson, function (result) {
        wx.showToast({
          title: '课程创建成功',
          icon: 'success',
          duration: 10000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1   // 返回到我的首页
              })
            }, 1500)
          }
        })
      })
    } else {
      lessonApi.lessonUpdateOne(that.data.lesson.lesson_id, that.data.lesson, function (result) {
        wx.showToast({
          title: '课程更新成功',
          icon: 'success',
          duration: 10000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1   // 返回到我的首页
              })
            }, 1500)
          }
        })
      })
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    if (options.lesson_id !== undefined) {
      lessonApi.lessonReadOneForUpdate(options.lesson_id, function (result) {
        let lesson = result.data.data.lesson
        that.setData({
          'lesson': lesson,
          'tempImages': lesson.temp_images
        })
      })
    }
    // Todo:需要更新为选择的用户
    that.setData({
      userInfo: app.globalData.userInfo,
      'lesson.manage_user': app.globalData.userInfo.user_id
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