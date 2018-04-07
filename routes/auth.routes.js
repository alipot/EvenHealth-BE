const express = require('express')
const joi = require('joi')

const { validate, auth } = require('../middlewares')
const { user, admin } = require('../controllers')

const router = express.Router()

router
  .route('/login')
  .post(
    validate({
      body: {
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
      },
    }),
    async (req, res, next) => {
      try {
        const { email, password } = req.body
        res.data = await user.login(email, password)
        next()
      } catch (err) {
        console.log(err)
        next(err)
      }
    },
  )


router
  .route('/logout')
  .post(auth,
    async (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1]
        res.data = await user.logout(req.payload.id, token)
        next()
      } catch (err) {
        next(err)
      }
    })


router
  .route('/signin')
  .post(
    validate({
      body: {
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
      },
    }),
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
  .route('/request-pin')
  .post(
    validate({
      body: {
        email: joi.string().email().required(),
      },
    }),
    async (req, res, next) => {
      try {
        const { email } = req.body
        res.data = await user.requestPasswordChange(email)
        next()
      } catch (err) {
        next(err)
      }
    },
  )

router
  .route('/reset-password')
  .post(
    validate({
      body: {
        email: joi.string().email().required(),
        pin: joi.string().required(),
        newPassword: joi.string().required(),
      },
    }),
    async (req, res, next) => {
      try {
        // const { email } = req.body
        res.data = await user.resetPassword(req.body)
        next()
      } catch (err) {
        next(err)
      }
    },
  )

router
  .route('/social/platform/auth')
  .post(
    async (req, res, next) => {
      try {
        const { provider, provider_id: providerId, email, name } = req.body;

        res.data = await user.loginUsingSocial({ provider, providerId, email, name })

        next()
      } catch (err) {
        next(err)
      }
    },
  )

module.exports = router
