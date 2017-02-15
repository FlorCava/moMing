const express = require('express')
const router = express.Router()
const passport = require('passport')
const path = require('path')
const fse = require('fs-extra')
const utils = require('../../../utils/utils')
const multer = require('multer')
const moment = require('moment')

const ctrlUsers = require('../controllers/users')
const ctrlFiles = require('../controllers/files')
const ctrlLessons = require('../controllers/lessons')
const ctrlTasks = require('../controllers/tasks')

/**
 * 用户 routing
 */
// 微信小程序用户登陆／注册
router.post('/users/wei_xin/auth',
  ctrlUsers.authWithWeiXinApp
)
// 修改我的用户名
router.put('/users/me/name',
  passport.authenticate('jwt', {session: false}),
  ctrlUsers.userUpdateName
)
// 修改我的手机号
router.put('/users/me/tel',
  passport.authenticate('jwt', {session: false}),
  ctrlUsers.userUpdateTel
)
// 修改我的电子邮箱
router.put('/users/me/email',
  passport.authenticate('jwt', {session: false}),
  ctrlUsers.userUpdateEmail
)
// 设置用户为授课师
router.put('/users/:userId/teacher', passport.authenticate('jwt-admin', {session: false}),
  ctrlUsers.userUpdateTeacher
)

/**
 * 课程 routing
 */
// 获取开放的课程列表（status === 1)
router.get('/lessons/page/:page',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.openLessonList
)
// 获取指定的课程
router.get('/lessons/:lessonId',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.lessonReadOne
)
// 获取指定的课程（用于更新课程）
router.get('/lessons/update/:lessonId',
  passport.authenticate('jwt-admin', {session: false}),
  ctrlLessons.lessonReadOneForUpdate
)
// 获取指定的课程的每日课程
router.get('/lessons/:lessonId/contents',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.lessonReadContents
)
// 获取我创建的课程（最新的5个）
router.get('/lessons/my/create',
  passport.authenticate('jwt-admin', {session: false}),
  ctrlLessons.myCreateTopLesson
)
// 获取我创建的课程列表
router.get('/lessons/my/create/page/:page',
  passport.authenticate('jwt-admin', {session: false}),
  ctrlLessons.myCreateLessonList
)
// 获取我讲解的课程（最新的5个）
router.get('/lessons/my/teach',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.myTeachTopLesson
)
// 获取我创建的课程列表
router.get('/lessons/my/teach/page/:page',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.myTeachLessonList
)
// 获取我参加的课程（最新的5个）
router.get('/lessons/my/join',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.myJoinTopLesson
)
// 获取我参加的课程列表
router.get('/lessons/my/join/page/:page',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.myJoinLessonList
)
// 创建新的课程
router.post('/lessons',
  passport.authenticate('jwt-admin', {session: false}),
  ctrlLessons.lessonCreateOne
)
// 更新课程
router.put('/lessons/:lessonId',
  passport.authenticate('jwt-admin', {session: false}),
  ctrlLessons.lessonUpdateOne
)
// 添加课程的每日课程
router.post('/lessons/:lessonId/contents',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.lessonContentCreateOne
)
// 添加指定产品图片
router.post('/lessons/:lessonId/images/*?',
  passport.authenticate('jwt-admin', {session: false}),
  ctrlLessons.lessonImagesAddOne
)
// 删除指定产品图片
router.delete('/lessons/:lessonId/images/*?',
  passport.authenticate('jwt-admin', {session: false}),
  ctrlLessons.lessonImagesDeleteOne
)
// 参加指定的课程
router.post('/lessons/:lessonId/join',
  passport.authenticate('jwt', {session: false}),
  ctrlLessons.lessonJoin
)
// 获取指定课程的作业列表
router.get('/lessons/:lessonId/tasks/page/:page',
  passport.authenticate('jwt', {session: false}),
  ctrlTasks.lessonTaskList
)
// 获取指定课程指定日期的未点评作业列表
router.get('/lessons/:lessonId/tasks/:date/review',
  passport.authenticate('jwt', {session: false}),
  ctrlTasks.lessonReviewTaskList
)
// 获取指定课程汇总的作业列表
router.get('/lessons/:lessonId/tasks/group',
  passport.authenticate('jwt', {session: false}),
  ctrlTasks.lessonGroupTaskList
)
// 获取我的作业列表
router.get('/lessons/:lessonId/my/tasks',
  passport.authenticate('jwt', {session: false}),
  ctrlTasks.myLessonTaskList
)
// 创建新的作业
router.post('/lessons/:lessonId/tasks',
  passport.authenticate('jwt', {session: false}),
  ctrlTasks.taskCreateOne
)
// 点评作业
router.put('/lessons/:lessonId/tasks/:taskId/review',
  passport.authenticate('jwt', {session: false}),
  ctrlTasks.taskUpdateReview
)
// 删除指定作业图片
router.delete('/lessons/:lessonId/tasks/:taskId/images/*?',
  passport.authenticate('jwt', {session: false}),
  ctrlTasks.taskImagesDeleteOne
)

/**
 * 课程文件服务 routing
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let year = moment().get('year')
    let month = moment().get('month') + 1
    let day = moment().get('date')
    let filePath = path.resolve(__dirname, `../../../public/image/lessons/${year}/${month}/${day}`)

    fse.ensureDir(filePath, function () {
      cb(null, filePath)
    })
  },
  filename: function (req, file, cb) {
    let name = utils.randomWord(false, 12)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      name = name + '.jpg'
    } else if (file.mimetype === 'image/png') {
      name = name + '.png'
    }
    cb(null, name)
  }
})
const upload = multer({storage: storage})
// todo:需要加入权限验证才能进行上传／删除文件
router.post('/file/lesson',
  upload.single('image'),
  ctrlFiles.fileCreate
)
/**
 * 作业文件服务 routing
 */
const storageTask = multer.diskStorage({
  destination: function (req, file, cb) {
    let year = moment().get('year')
    let month = moment().get('month') + 1
    let day = moment().get('date')
    let filePath = path.resolve(__dirname, `../../../public/image/tasks/${year}/${month}/${day}`)

    fse.ensureDir(filePath, function () {
      cb(null, filePath)
    })
  },
  filename: function (req, file, cb) {
    let name = utils.randomWord(false, 12)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      name = name + '.jpg'
    } else if (file.mimetype === 'image/png') {
      name = name + '.png'
    }
    cb(null, name)
  }
})
const uploadTask = multer({storage: storageTask})
router.post('/file/task',
  uploadTask.single('image'),
  ctrlFiles.fileCreate
)
router.delete('/file/*?',
  ctrlFiles.fileDeleteOne
)

module.exports = router
