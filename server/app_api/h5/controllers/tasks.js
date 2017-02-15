const mongoose = require('mongoose')
const config = require('../../config/config')
const validator = require('validator')
const moment = require('moment')
const request = require('request')

const Task = mongoose.model('Task')
const Lesson = mongoose.model('Lesson')
const File = mongoose.model('File')
const Counter = mongoose.model('Counter')

const utils = require('../../../utils/utils')

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

module.exports.lessonTaskList = function (req, res) {
  let page = Math.max(1, req.params.page)
  let query = {
    'lesson_id': req.params.lessonId,
  }
  let options = {
    sort: {create_time: 'desc'},
    page: page,
    limit: config.perPage
  }

  Task.paginate(query, options, function (err, result) {
    if (err) {
      return res.tools.setJson(400, 1, err)
    }
    let tasks = []
    result.docs.forEach(function (doc) {
      let task = {}
      task.lesson_id = doc.lesson_id
      task.task_id = doc.task_id
      task.create_user = doc.create_user
      task.create_time = doc.create_time
      task.description = doc.description
      task.review_user = doc.review_user
      task.review_time = doc.review_time
      task.review = doc.review
      task.images = []
      doc.images.forEach(function (image) {
        task.images.push(config.static_url + image)
      })
    })
    return res.tools.setJson(200, 0, 'success', {
      tasks: tasks,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.lessonReviewTaskList = function (req, res) {
  let dateBegin = moment(req.params.date)
  let dateEnd = moment(req.params.date).add(1, 'd')

  Task.find({
    lesson_id: req.params.lessonId,
    create_time: {
      "$gte": dateBegin.format(),
      "$lt": dateEnd.format()
    },
    reviewed:false
  })
    .sort({create_time: 'desc'})
    .exec(function (err, docs) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      let tasks = []
      docs.forEach(function (doc) {
        let task = {}
        task.lesson_id = doc.lesson_id
        task.task_id = doc.task_id
        task.create_user = doc.create_user
        task.create_time = doc.create_time
        task.description = doc.description
        task.reviewed = doc.reviewed
        task.review_user = doc.review_user
        task.review_time = doc.review_time
        task.review = doc.review
        task.images = []
        doc.images.forEach(function (image) {
          task.images.push(config.static_url + image)
        })
        tasks.push(task)
      })
      return res.tools.setJson(200, 0, 'success', {
        reviewTasks: tasks
      })
    })
}

module.exports.myLessonTaskList = function (req, res) {
  Task.find({
    'lesson_id': req.params.lessonId,
    'create_user': req.user.user_id
  })
    .sort({create_time: 'desc'})
    .exec(function (err, docs) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      let tasks = []
      docs.forEach(function (doc) {
        let task = {}
        task.lesson_id = doc.lesson_id
        task.task_id = doc.task_id
        task.create_user = doc.create_user
        task.create_time = doc.create_time
        task.description = doc.description
        task.review_user = doc.review_user
        task.review_time = doc.review_time
        task.review = doc.review
        task.images = []
        doc.images.forEach(function (image) {
          task.images.push(config.static_url + image)
        })
        tasks.push(task)
      })
      return res.tools.setJson(200, 0, 'success', {
        tasks: tasks
      })
    })
}

module.exports.lessonGroupTaskList = function (req, res) {
  let groupTasks = []
  Task.aggregate(
    {
      $match: {
        lesson_id: parseInt(req.params.lessonId)
      }
    },
    {
      $group: {
        _id: {year: {$year: '$create_time'}, month: {$month: '$create_time'}, day: {$dayOfMonth: '$create_time'}},
        count: {$sum: 1}
      }
    })
    .exec(function (err, docs) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      docs.forEach(function (doc) {
        let groupTask = {}
        groupTask._id = doc._id
        groupTask.date = `${doc._id.year}-${doc._id.month}-${doc._id.day}`
        groupTask.count = doc.count
        groupTask.reviewCount = 0
        groupTasks.push(groupTask)
      })
      Task.aggregate(
        {
          $match: {
            $and: [
              {lesson_id: parseInt(req.params.lessonId)},
              {reviewed: true}]
          }
        },
        {
          $group: {
            _id: {year: {$year: '$create_time'}, month: {$month: '$create_time'}, day: {$dayOfMonth: '$create_time'}},
            count: {$sum: 1}
          }
        })
        .exec(function (err, docs) {
          if (err) {
            return res.tools.setJson(400, 1, err)
          }
          docs.forEach(function (doc) {
            let date = `${doc._id.year}-${doc._id.month}-${doc._id.day}`
            let groupTask = groupTasks.find((task) => task.date == date)
            if (groupTask !== undefined) {
              groupTask.reviewCount = doc.count
            }
          })
          return res.tools.setJson(200, 0, 'success', {
            groupTasks: groupTasks
          })
        })
    })
}

module.exports.taskCreateOne = function (req, res) {
  if (req.body) {
    Task.create({
      lesson_id: req.params.lessonId,
      description: req.body.description,
      images: req.body.images,
      create_user: req.user.user_id,
      review_user: req.body.review_user,
      review_time: req.body.review_time,
      review: req.body.review,
    }, function (err) {
      if (err) {
        return res.tools.setJson(400, 1, err)
      }
      return res.tools.setJson(201, 0, 'success')
    })
  }
}

module.exports.taskUpdateReview = function (req, res) {
  if (!req.params.taskId) {
    return res.tools.setJson(400, 1, {
      'message': '没有找到需要点评的作业'
    })
  }
  if (req.body) {
    Task.findOne({'task_id': req.params.taskId})
      .exec(function (err, doc) {
        if (err) {
          return res.tools.setJson(400, 1, err)
        }
        doc.reviewed = true
        doc.review = req.body.review
        doc.review_user = req.body.review_user
        doc.review_time = req.body.review_time
        doc.save(function (err) {
          if (err) {
            return res.tools.setJson(400, 1, err)
          }
          return res.tools.setJson(200, 0, 'success')
        })
      })
  }
}

module.exports.taskImagesDeleteOne = function (req, res) {
  if (!req.params.taskId && !req.params[0]) {
    return res.tools.setJson(404, 1, {
      'message': '没有找到需要更新的作业'
    })
  }
  // 尚未保存到课程中的临时文件
  if (parseInt(req.params.taskId) === 0) {
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
    Task.findOne({'task_id': req.params.taskId})
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

