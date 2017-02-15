/**
 * 用户参与课程
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const joinSchema = Schema({
  lesson_id: Number,
  user_id: Number,
  join_time: {type: Date, default: Date.now},
  fee: Number
})
joinSchema.plugin(mongoosePaginate)

mongoose.model('Join', joinSchema)
