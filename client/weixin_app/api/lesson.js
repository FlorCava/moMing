import config from '../utils/config'
const common = require('./common')

module.exports.openLessonList = function (page, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/page/${page}`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonReadOne = function (lessonId, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonReadOneForUpdate = function (lessonId, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/update/${lessonId}`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonReadContents = function (lessonId, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/contents`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.myCreateTopLesson = function (resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/my/create`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.myCreateLessonList = function (page, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/my/create/page/${page}`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.myJoinTopLesson = function (resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/my/join`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.myJoinLessonList = function (page, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/my/join/page/${page}`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.myTeachTopLesson = function (resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/my/teach`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.myTeachLessonList = function (page, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/my/teach/page/${page}`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonCreateOne = function (lesson, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons`,
        method: 'POST',
        header: common.setHeaders(),
        data: lesson,
        success: resolve
    })
}

module.exports.lessonUpdateOne = function (lessonId, lesson, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}`,
        method: 'PUT',
        header: common.setHeaders(),
        data: lesson,
        success: resolve
    })
}

module.exports.lessonContentCreateOne = function (lessonId, content, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/contents`,
        method: 'POST',
        header: common.setHeaders(),
        data: content,
        success: resolve
    })
}

module.exports.lessonImagesAddOne = function (lessonId, image, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/images/${image}`,
        method: 'POST',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonImagesDeleteOne = function (lessonId, image, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/images/${image}`,
        method: 'DELETE',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonImageUpload = function (image, resolve) {
    wx.uploadFile({
        url: `${config.API_URL}/file/lesson`,
        filePath: image,
        name: 'image',
        header: common.setFileHeaders(),
        success: resolve
    })
}

module.exports.lessonJoin = function (lessonId, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/join`,
        method: 'POST',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonTaskList = function (lessonId, page, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/tasks/page/${page}`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonReviewTaskList = function (lessonId, date, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/tasks/${date}/review`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.lessonGroupTaskList = function (lessonId, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/tasks/group`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.myLessonTaskList = function (lessonId, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/my/tasks`,
        method: 'GET',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.taskCreateOne = function (lessonId, task, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/tasks`,
        method: 'POST',
        header: common.setHeaders(),
        data: task,
        success: resolve
    })
}

module.exports.taskUpdateReview = function (lessonId, taskId, review, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/tasks/${taskId}/review`,
        method: 'PUT',
        header: common.setHeaders(),
        data: review,
        success: resolve
    })
}

module.exports.taskImagesDeleteOne = function (lessonId, taskId, image, resolve) {
    wx.request({
        url: `${config.API_URL}/lessons/${lessonId}/tasks/${taskId}/images/${image}`,
        method: 'DELETE',
        header: common.setHeaders(),
        success: resolve
    })
}

module.exports.taskImageUpload = function (image, resolve) {
    wx.uploadFile({
        url: `${config.API_URL}/file/task`,
        filePath: image,
        name: 'image',
        header: common.setFileHeaders(),
        success: resolve
    })
}