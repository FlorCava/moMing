/**
 * 课程
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 每日课程内容
const contentSchema = Schema({
  start: {type: Date, default: Date.now},
  content: String,
  url: String
})

const lessonSchema = Schema({
  lesson_id: Number,
  title: {type: String, default: ''},
  teacher: String,
  duration: String,
  start_time: Date,
  end_time: Date,
  detail: String, // 讲课形式
  fee: Number,
  fee_description: String, // 费用说明
  images: [{
    type: String
  }], // 课程详情轮播图
  manage_user: Number, // 课程管理员（每天课程信息，作业点评等）
  create_user: Number,
  create_time: {type: Date, default: Date.now},
  status: {type: String, default: '1'}, // 1 - 进行中； 2 - 已结束；
  contents: [contentSchema],
})
lessonSchema.plugin(mongoosePaginate)

const Counter = mongoose.model('Counter')

lessonSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'lesson_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error) {
        return next(error)
      }
      doc.lesson_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

mongoose.model('Lesson', lessonSchema)
