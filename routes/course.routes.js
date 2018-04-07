const express = require('express')
const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)
const { validate, auth, allow } = require('../middlewares')
const { user, question, course } = require('../controllers')

const router = express.Router()

router
  .route('/')
  .get(
    auth,
    allow(['admin', 'professor', 'student']),
    async (req, res, next) => {
      try {
        const { id, role } = req.payload
        const query = {}
        if(role === 'professor') query.professor = id;
        // NOTE: Not implementing pagination
        res.data = await course.getCourses(query)
        next()
      } catch (err) {
        next(err)
      }
    },
  )
  .post(
    auth,
    allow(['admin']),
    async (req, res, next) => {
      try {
        const data = req.body
        const response = await course.createCourse(data)
        res.data = response
        next()
      } catch (err) {
        next(err)
      }
    },
  )

// We can also use PATCH
router
  .route('/:courseId')
  .get(
    auth,
    async (req, res, next) => {
      try {
        const { courseId } = req.params
        const body = req.body
        res.data = await course.getCourseById(courseId)
        next()
      } catch (err) {
        next(err)
      }
    },
  )
  .put(
    auth,
    validate({
      body: {
        description: joi.string().required(),
        capacity: joi.number().required(),
        professor: joi.objectId().required(),
      }
    }),
    async (req, res, next) => {
      try {
        const { courseId } = req.params
        const body = req.body
        res.data = await course.updateCourse(courseId, body)
        next()
      } catch (err) {
        next(err)
      }
    },
  )
  .delete(
    auth,
    async (req, res, next) => {
      try {
        const { courseId } = req.params
        res.data = await course.deleteCourse(courseId)
        next()
      } catch (err) {
        next(err)
      }
    },
  )

router
  .route('/:courseId/enroll/:studentId')
  .put(
    auth,
    async (req, res, next) => {
      try {
        const { courseId, studentId } = req.params
        // const { id } = req.payload
        res.data = await course.enrollStudent(studentId, courseId)
        next()
      } catch (err) {
        next(err)
      }
    },
  )

router
  .route('/:courseId/un-enroll')
  .put(
    auth,
    async (req, res, next) => {
      try {
        const { courseId } = req.params
        const { id } = req.payload
        res.data = await course.unEnrollStudent(id, courseId)
        next()
      } catch (err) {
        next(err)
      }
    },
  )


router
.route('/student/enrolled-courses')
.get(
  auth,
  async (req, res, next) => {
    try {
      const { id } = req.payload
      res.data = await course.enrolledCourses(id)
      next()
    } catch (err) {
      next(err)
    }
  },
)


module.exports = router
