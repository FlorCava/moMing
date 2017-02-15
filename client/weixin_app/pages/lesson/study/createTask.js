const app = getApp()
const lessonApi = require('../../../api/lesson.js')

Page({
  data: {
    task: {
      lesson_id: 0,
      task_id: 0,
      description: '',
      images: []
    },
    tempImages: []
  },
  bindDescriptionChange: function (e) {
    this.setData({
      'task.description': e.detail.value
    })
  },
  bindChooseImage: function () {
    let that = this
    let images = that.data.task.images
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
        lessonApi.taskImageUpload(tempImage, function (res) {
          let data = JSON.parse(res.data)
          let imageUrl = data.data.file.url
          images.push(imageUrl)
          that.setData({
            'task.images': images
          })
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
    let lessonId = that.data.task.lesson_id
    let taskId = that.data.task.task_id
    let imageUrl = e.target.dataset.imageUrl
    let imageUrlIndex = e.target.dataset.imageUrlIndex
    lessonApi.taskImagesDeleteOne(lessonId, taskId, imageUrl, function (res) {
      let images = that.data.task.images
      let tempImages = that.data.tempImages
      images.splice(imageUrlIndex, 1)
      tempImages.splice(imageUrlIndex, 1)
      that.setData({
        'task.images': images,
        'tempImages': tempImages
      })
    })
  },
  bindSaveButton: function () {
    let that = this
    lessonApi.taskCreateOne(that.data.task.lesson_id, that.data.task, function (result) {
      wx.showToast({
        title: '每日作业添加成功',
        icon: 'success',
        duration: 10000,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1   // 返回到课程学习页面
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
        'task.lesson_id': options.lesson_id
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