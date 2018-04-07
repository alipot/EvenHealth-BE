const express = require('express')
const joi = require('joi')
const { validate, auth, allow } = require('../middlewares')
const { admin } = require('../controllers')

const router = express.Router()

router
  .route('/login')
  .post(
    async (req, res, next) => {
      try {
        const { email, password } = req.body
        res.data = await admin.login(email, password)
        next()
      } catch (err) {
        next(err)
      }
    },
  )

router
  .route('/my-profile')
  .get(
    auth,
    allow('admin'),
    async (req, res, next) => {
      try {
        const { id: userId } = req.payload
        res.data = await admin.me(userId)
        next()
      } catch (err) {
        next(err)
      }
    },
  )

module.exports = router
