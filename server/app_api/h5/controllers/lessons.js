const mongoose = require('mongoose')
const config = require('../../config/config')
const validator = require('validator')
const moment = require('moment')
const request = require('request')

const Lesson = mongoose.model('Lesson')
const File = mongoose.model('File')
const Counter = mongoose.model('Counter')
const Join = mongoose.model('Join')

const ctrlSettings = require('./settings')
const utils = require('../../../utils/utils')

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

function validateLessonForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.title)) {
    isFormValid = false
    errors.title = '请填写【课程标题】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.openLessonList = function (req, res) {
  let page = Math.max(1, req.params.page)
  let query = {
    'status': '1'
  }
  let options = {
    select: 'lesson_id title teacher duration images',
    sort: {create_time: 'desc'},
    page: page,
    limit: config.perPage
  }

  Lesson.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    let lessons = []
    result.docs.forEach(function (doc) {
      let lesson = {}
      lesson.lesson_id = doc.lesson_id
      lesson.title = doc.title
      lesson.teacher = doc.teacher
      lesson.duration = doc.duration
      let base_image = ''
      if (doc.images.length > 0) {
        base_image = doc.images[0]
      }
      lesson.base_image = config.static_url + base_image
      lessons.push(lesson)
    })
    return res.tools.setJson(200, 0, 'success', {
      lessons: lessons,
      page: page,
      pages: result.pages
    })
  })
}

// 课程全部由管理员创建
module.exports.myCreateTopLesson = function (req, res) {
  let page = 1
  let query = {
    'status': '1'
  }
  let options = {
    select: 'lesson_id title',
    sort: {create_time: 'desc'},
    page: page,
    limit: 5
  }

  Lesson.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    return res.tools.setJson(200, 0, 'success', {
      lessons: result.docs
    })
  })
}

module.exports.myCreateLessonList = function (req, res) {
  let page = Math.max(1, req.params.page)
  let query = {
    'status': '1'
  }
  let options = {
    select: 'lesson_id title',
    sort: {create_time: 'desc'},
    page: page,
    limit: config.perPage
  }

  Lesson.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    return res.tools.setJson(200, 0, 'success', {
      lessons: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.myTeachTopLesson = function (req, res) {
  let page = 1
  let query = {
    'status': '1',
    'manage_user': req.user.user_id
  }
  let options = {
    select: 'lesson_id title',
    sort: {create_time: 'desc'},
    page: page,
    limit: 5
  }

  Lesson.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    return res.tools.setJson(200, 0, 'success', {
      lessons: result.docs
    })
  })
}

module.exports.myTeachLessonList = function (req, res) {
  let page = Math.max(1, req.params.page)
  let query = {
    'status': '1',
    'manage_user': req.user.user_id
  }
  let options = {
    select: 'lesson_id title',
    sort: {create_time: 'desc'},
    page: page,
    limit: config.perPage
  }

  Lesson.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    return res.tools.setJson(200, 0, 'success', {
      lessons: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.myJoinTopLesson = function (req, res) {
  let page = 1
  let query = {
    'user_id': req.user.user_id
  }
  let options = {
    select: 'lesson_id',
    sort: {join_time: 'desc'},
    page: page,
    limit: 5
  }

  Join.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    let lesson_ids = []
    result.docs.forEach(function (doc) {
      lesson_ids.push(doc.lesson_id)
    })
    Lesson.find({
      'lesson_id': {$in: lesson_ids}
    }).exec(function (err, result) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      let lessons = []
      result.forEach(function (doc) {
        let lesson = {}
        lesson.lesson_id = doc.lesson_id
        lesson.title = doc.title
        lessons.push(lesson)
      })
      return res.tools.setJson(200, 0, 'success', {
        lessons: lessons
      })
    })
  })
}

module.exports.myJoinLessonList = function (req, res) {
  let page = Math.max(1, req.params.page)
  let query = {
    'user_id': req.user.user_id
  }
  let options = {
    select: 'lesson_id',
    sort: {join_time: 'desc'},
    page: page,
    limit: config.perPage
  }

  Join.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    let lesson_ids = []
    result.docs.forEach(function (doc) {
      lesson_ids.push(doc.lesson_id)
    })
    Lesson.find({
      'lesson_id': {$in: lesson_ids}
    }).exec(function (err, result) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      let lessons = []
      result.forEach(function (doc) {
        let lesson = {}
        lesson.lesson_id = doc.lesson_id
        lesson.title = doc.title
        lessons.push(lesson)
      })
      return res.tools.setJson(200, 0, 'success', {
        lessons: lessons,
        page: page,
        pages: pages
      })
    })
  })
}

module.exports.lessonReadOne = function (req, res) {
  if (req.params && req.params.lessonId) {
    Lesson.findOne({'lesson_id': req.params.lessonId})
      .exec(function (err, doc) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        } else {
          let lesson = {}
          lesson.lesson_id = doc.lesson_id
          lesson.title = doc.title
          lesson.teacher = doc.teacher
          lesson.duration = doc.duration
          let start = moment(doc.start_time)
          let end = moment(doc.end_time)
          lesson.start = {
            date: start.format('YYYY-MM-DD'),
            time: start.format('HH:mm')
          }
          lesson.end = {
            date: end.format('YYYY-MM-DD'),
            time: end.format('HH:mm')
          }
          lesson.detail = doc.detail
          lesson.fee = doc.fee
          lesson.fee_description = doc.fee_description
          lesson.images = []
          doc.images.forEach(function (image) {
            lesson.images.push(config.static_url + image)
          })
          // 获取当前用户参与该活动的相关信息
          Join.findOne({
            lesson_id: req.params.lessonId,
            user_id: req.user.user_id
          })
            .exec(function (err, join) {
              if (err) {
                return res.tools.setJson(400, 1, err)
              }
              let me_joined = false
              if (join) {
                me_joined = true
              }
              lesson.me = {
                joined: me_joined
              }
              return res.tools.setJson(200, 0, 'success', {
                lesson: lesson
              })
            })
        }
      })
  }
}

module.exports.lessonReadOneForUpdate = function (req, res) {
  if (req.params && req.params.lessonId) {
    Lesson.findOne({'lesson_id': req.params.lessonId})
      .exec(function (err, doc) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        } else {
          let lesson = {}
          lesson.lesson_id = doc.lesson_id
          lesson.title = doc.title
          lesson.teacher = doc.teacher
          lesson.duration = doc.duration
          let start = moment(doc.start_time)
          let end = moment(doc.end_time)
          lesson.start = {
            date: start.format('YYYY-MM-DD'),
            time: start.format('HH:mm')
          }
          lesson.end = {
            date: end.format('YYYY-MM-DD'),
            time: end.format('HH:mm')
          }
          lesson.detail = doc.detail
          lesson.fee = doc.fee
          lesson.fee_description = doc.fee_description
          lesson.manage_user = doc.manage_user
          lesson.status = doc.status
          lesson.images = doc.images
          lesson.temp_images = []
          doc.images.forEach(function (image) {
            lesson.temp_images.push(config.static_url + image)
          })
          return res.tools.setJson(200, 0, 'success', {
            lesson: lesson
          })
        }
      })
  }
}

module.exports.lessonReadContents = function (req, res) {
  if (req.params && req.params.lessonId) {
    Lesson.findOne({'lesson_id': req.params.lessonId})
      .exec(function (err, doc) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        } else {
          let contents = []
          doc.contents.reverse()
          doc.contents.forEach(function (content) {
            contents.push(content)
          })
          return res.tools.setJson(200, 0, 'success', {
            contents: contents
          })
        }
      })
  }
}

module.exports.lessonCreateOne = function (req, res) {
  const validationResult = validateLessonForm(req.body)
  if (!validationResult.success) {
    return res.tools.setJson(400, 1, validationResult.errors)
  }

  if (req.body) {
    Lesson.create({
      title: req.body.title,
      teacher: req.body.teacher,
      duration: req.body.duration,
      start_time: req.body.start.date + " " + req.body.start.time,
      end_time: req.body.end.date + " " + req.body.end.time,
      detail: req.body.detail,
      fee: req.body.fee,
      fee_description: req.body.fee_description,
      images: req.body.images,
      manage_user: req.body.manage_user,
      create_user: req.user.user_id,
      status: req.body.status
    }, function (err) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      return res.tools.setJson(201, 0, 'success')
    })
  }
}

module.exports.lessonUpdateOne = function (req, res) {
  if (!req.params.lessonId) {
    return res.tools.setJson(400, 1, {
      'message': '没有找到需要更新的课程'
    })
  }
  const validationResult = validateLessonForm(req.body)
  if (!validationResult.success) {
    return res.tools.setJson(400, 1, validationResult.errors)
  }
  if (req.body) {
    Lesson.findOne({'lesson_id': req.params.lessonId})
      .exec(function (err, doc) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        }
        doc.title = req.body.title
        doc.teacher = req.body.teacher
        doc.duration = req.body.duration
        doc.start_time = req.body.start.date + ' ' + req.body.start.time
        doc.end_time = req.body.end.date + ' ' + req.body.end.time
        doc.detail = req.body.detail
        doc.fee = req.body.fee
        doc.fee_description = req.body.fee_description
        // doc.images = req.body.images
        doc.manage_user = req.body.manage_user
        doc.status = req.body.status
        doc.save(function (err) {
          if (err) {
            return res.tools.setJson(400, 1, err)
          }
          return res.tools.setJson(200, 0, 'success')
        })
      })
  }
}

module.exports.lessonContentCreateOne = function (req, res) {
  if (!req.params.lessonId) {
    return res.tools.setJson(400, 1, {
      'message': '没有找到需要更新的课程'
    })
  }
  if (req.body) {
    Lesson.findOne({'lesson_id': req.params.lessonId})
      .exec(function (err, doc) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        }
        console.log(doc.contents)
        let contents = doc.contents
        contents.push({
          start: req.body.start.date + ' ' + req.body.start.time,
          content: req.body.content,
          url: req.body.url
        })
        doc.save(function (err) {
          if (err) {
            return res.tools.setJson(400, 1, err)
          }
          return res.tools.setJson(200, 0, 'success')
        })
      })
  }
}

module.exports.lessonImagesAddOne = function (req, res) {
  if (!req.params.lessonId && !req.params[0]) {
    return res.tools.setJson(404, 1, {
      'message': '没有找到需要更新的课程'
    })
  }
  Lesson.findOne({'lesson_id': req.params.lessonId})
    .exec(function (err, doc) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      } else {
        doc.images.push(req.params[0])

        doc.save(function (err) {
          if (err) {
            return res.tools.setJson(400, 1, err)
          } else {
            return res.tools.setJson(200, 0, 'success')
          }
        })
      }
    })
}

module.exports.lessonImagesDeleteOne = function (req, res) {
  if (!req.params.lessonId && !req.params[0]) {
    return res.tools.setJson(404, 1, {
      'message': '没有找到需要更新的课程'
    })
  }
  // 尚未保存到课程中的临时文件
  if (parseInt(req.params.lessonId) === 0) {
    File.findOneAndRemove({'url': req.params[0]})
      .exec(function (err, file) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        } else {
          fs.unlink(file.path, function () {
            return res.tools.setJson(204, 0, 'success')
          })
        }
      })
  } else {
    Lesson.findOne({'lesson_id': req.params.lessonId})
      .exec(function (err, doc) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        } else {
          doc.images.pull(req.params[0])
          doc.save(function (err) {
            if (err) {
              return res.tools.setJson(400, 1, err)
            } else {
              File.findOneAndRemove({'url': req.params[0]})
                .exec(function (err, file) {
                  if (err) {
                    return res.tools.setJson(400, 1, err)
                  } else {
                    fs.unlink(file.path, function () {
                      return res.tools.setJson(204, 0, 'success')
                    })
                  }
                })
            }
          })
        }
      })
  }
}

module.exports.lessonJoin = function (req, res) {
  if (req.params && req.params.lessonId) {
    Join.create({
      lesson_id: req.params.lessonId,
      user_id: req.user.user_id,
    }, function (err) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      return res.tools.setJson(201, 0, 'success')
    })
  }
}

