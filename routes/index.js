const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

router
  .use(express.json())

router
  .route('/status')
  .get((req, res) => res.status(200).json({ success: true, message: 'Server running' }))

router
  .use(
    '/auth',
    require('./auth.routes'),
  )

router
  .use(
    '/user',
    require('./user.routes'),
  )

router
  .use(
    '/admin',
    require('./admin.routes'),
  )

router
  .use(
    '/course',
    require('./course.routes'),
  )

module.exports = router
