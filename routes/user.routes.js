const express = require('express')
const joi = require('joi')
const { validate, auth, allow } = require('../middlewares')
const { user, question } = require('../controllers')

const router = express.Router()

router
  .route('/')
  .put(
    auth,
    validate({
      body: {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        gender: joi.string().valid('male', 'female', 'other').required(),
        dob: joi.string().required(),
        country: joi.string().required(),
        avatar: joi.string().optional(),
        willWinLottery: joi.boolean().required(),
        favoriteDecade: joi.string().valid('50s', '60s', '70s', '80s', '90s', '00s', '20s').required(),
        about: joi.string().optional(),
      },
    }),
    async (req, res, next) => {
      try {
        const { firstName,
          lastName,
          gender,
          dob,
          country,
          avatar,
          willWinLottery,
          favoriteDecade,
          about
        } = req.body
        const { id } = req.payload
        res.data = await user.updateProfile(id, {
          firstName,
          lastName,
          gender,
          dob,
          country,
          avatar,
          willWinLottery,
          favoriteDecade,
          about
        })
        next()
      } catch (err) {
        next(err)
      }
    },
  )

router
  .route('/:role')
  .get(
    auth,
    async (req, res, next) => {
      try {
        const { role } = req.params
        res.data = await user.getUsers(role)
        next()
      } catch (err) {
        next(err)
      }
    },
  )
  .post(
    auth,
    validate({
      body: {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        role: joi.string().valid('student', 'professor').required(),
      }
    }),
    async (req, res, next) => {
      try {
        const data = req.body
        const { role } = req.params
        if (role === 'professor') {
          res.data = await user.createInstructor(data)
        } else if (role === 'student') {
          // NOTE: Check/Error handle for student's selected courses
          res.data = await user.createStudent(data)
        }
        next()
      } catch (err) {
        next(err)
      }
    },
  )

router
  .route('/:role/:userId')
  .get(
    auth,
    // allow(['student', 'professor']),
    async (req, res, next) => {
      try {
        const { role, userId } = req.params
        if(role === 'student') res.data = await user.getStudentById(userId)
        // else if(role === 'professor') res.data = await user.getStudentById(userId)
      
        next()
      } catch (err) {
        next(err)
      }
    },
  )
  .put(
    auth,
    // allow(['student', 'professor']),
    async (req, res, next) => {
      try {
        const { role, userId } = req.params
        const body = req.body
        if(role === 'student') res.data = await user.updateStudent(userId, body)
        // else if(role === 'professor') res.data = await user.getStudentById(userId)
      
        next()
      } catch (err) {
        next(err)
      }
    },
  )
  .patch(
    auth,
    // allow(['student', 'professor']),
    async (req, res, next) => {
      try {
        const { role, userId } = req.params
        if(role === 'student') res.data = await user.suspendStudent(userId)
      
        next()
      } catch (err) {
        next(err)
      }
    },
  )


module.exports = router
