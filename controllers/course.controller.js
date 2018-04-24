const mongoose = require('mongoose')
const { model } = mongoose
const createError = require('http-errors')
const moment = require('moment')

const createCourse = async (courseData) => {
  try {
    const Course = model('Course')
    const { courseCode } = courseData

    const course = await Course.findOne({ courseCode }).lean().exec()
    if (course) {
      throw createError(409, 'Course with this code already exists')
    }
    return Course.create(courseData)
  } catch (err) {
    throw err
  }
}

const getCourseById = async (courseId) => {
  try {
    const Course = model('Course')

    const course = await Course.findById(courseId).lean().exec()
    if (!course) {
      throw createError(404, 'No course found against this id')
    }

    return course
  } catch (err) {
    throw err
  }
}

const updateCourse = async (courseId, courseData) => {
  try {
    const Course = model('Course')

    // ASSUMPTION: Course code can't be updated
    const allowedFields = ['description', 'capacity', 'professor']

    // Remove fields from payload that should not be updated
    for (const k in courseData) {
      if (!allowedFields.includes(k)) {
        delete courseData[k]
      }
    }

    return Course.findByIdAndUpdate(courseId, courseData, { new: true })
  } catch (err) {
    throw err
  }
}

const deleteCourse = async (courseId) => {
  try {
    const Course = model('Course')

    const course = await Course.findById(courseId).lean().exec()
    if (!course) {
      throw createError(404, 'No course found against this id')
    }

    return Course.findByIdAndUpdate(courseId, { isActive: false })
  } catch (err) {
    throw err
  }
}

const getCourses = async (query) => {
  try {
    const Course = model('Course')
    const findQuery = { ...query, isActive: true }

    // NOTE: To handle pagination use limit, offset with use modelName.paginate() method
    return Course.find(findQuery).populate('professor').populate('students')
  } catch (err) {
    throw err
  }
}

const enrollStudent = async (studentId, courseId) => {
  try {
    const Course = model('Course')
    const User = model('User')

    // SKIPPING Conditions for validating student, course
    return Course.findByIdAndUpdate(
      courseId,
      { $push: { students: studentId } },
      { new: true },
    )
  } catch (err) {
    throw err
  }
}

const unEnrollStudent = async (studentId, courseId) => {
  try {
    const Course = model('Course')
    const User = model('User')

    // SKIPPING Conditions for validating student, course
    return Course.findByIdAndUpdate(
      courseId,
      { $pullAll: { students: [studentId] } },
      { new: true },
    )
  } catch (err) {
    throw err
  }
}

const enrolledCourses = async (studentId) => {
  try {
    const Course = model('Course')

    // SKIPPING Conditions for validating student, course
    return Course.find({
      students: { $in: [mongoose.Types.ObjectId(studentId)] },
    }).populate('professor')
  } catch (err) {
    throw err
  }
}

module.exports = {
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourses,
  enrollStudent,
  unEnrollStudent,
  enrolledCourses,
}
