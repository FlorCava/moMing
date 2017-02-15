/**
 * 作业
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const taskSchema = Schema({
  lesson_id: Number,
  task_id: Number,
  description: String,
  images: [{
    type: String
  }],
  create_user: Number,
  create_time: {type: Date, default: Date.now},
  reviewed: {type: Boolean, default: false},
  review_user: Number,
  review_time: Date,
  review: String
})
taskSchema.plugin(mongoosePaginate)

const Counter = mongoose.model('Counter')

taskSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'task_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error) {
        return next(error)
      }
      doc.task_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

mongoose.model('Task', taskSchema)
