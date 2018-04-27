const mongoose = require('mongoose')
const { model } = mongoose
const createError = require('http-errors')
const moment = require('moment')

const {
  auth: authHelper,
  utility
} = require('../helpers')

const login = async (email, password) => {
  try {
    const User = model('User')
    const user = await User.findOne({ email }).exec()
    if (!user || !user.validatePassword(password)) {
      throw createError(401, 'Invalid Email or Password')
    }
    const expiryDate = new Date(moment().add(90, 'days'))
    const [token, _user = {}] = await Promise.all([
      authHelper.generateToken({
        id: user._id,
        role: user.role,
        expiry: expiryDate,
      }),
      User.findOne({ email }).lean().exec(),
    ])
    user.token = token
    delete _user.password
    return {
      user: _user,
      token,
    }
  } catch (err) {
    throw err
  }
}

const createInstructor = async (instructorData) => {
  try {
    const User = model('User')
    const { email } = instructorData

    // ASSUMPTION: An email can only be associated with one user (STUDENT/PROFESSOR)
    // We can handle this case by managing roles
    const instructor = await User.findOne({ email }).lean().exec()
    if (instructor) {
      throw createError(409, 'User with this email already exists')
    }
    return User.create(instructorData)
  } catch (err) {
    throw err
  }
}

const createStudent = async (studentData) => {
  try {
    const User = model('User')
    const { email } = studentData

    // if (!courses || !courses.length) {
    //   throw createError(400, 'Kindly provide atleast one course to add a student')
    // }

    const std = await User.findOne({ email }).lean().exec()
    if (std) {
      throw createError(409, 'User already exists')
    }
    return User.create(studentData)
  } catch (err) {
    throw err
  }
}


const getStudentById = async (id) => {
  try {
    const User = model('User')

    const student = await User.findById(id).lean().exec()
    if (!student) {
      throw createError(404, 'No student found against this id')
    }

    return student
  } catch (err) {
    throw err
  }
}

const updateStudent = async (studentId, studentData) => {
  try {
    const User = model('User')

    // ASSUMPTION: Each student has a unique id, using auto-generated _id as that unique id
    // ASSUMPTION: Only following fields can be updated for a student
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
    ]

    // Remove fields from payload that should not be updated
    for (const k in studentData) {
      if (!allowedFields.includes(k)) {
        delete studentData[k]
      }
    }

    return User.findByIdAndUpdate(studentId, studentData, { new: true })
  } catch (err) {
    throw err
  }
}

const suspendStudent = async (studentId) => {
  try {
    const User = model('User')

    const student = await User.findById(studentId).lean().exec()
    if (!student) {
      throw createError(404, 'No student found against this id')
    }

    return User.findByIdAndUpdate(studentId, { status: 'suspended' })
  } catch (err) {
    throw err
  }
}

const getUsers = async (role) => {
  try {
    const User = model('User')
    const query = { status: 'active', role }

    // NOTE: To handle pagination use limit, offset with use modelName.paginate() method
    return User.find(query)
  } catch (err) {
    throw err
  }
}

// NOTE: This method is only used to create a test users
const createTestUsers = async () => {
  try {
    const User = model('User')

    const instructorInfo = {
      firstName: 'LMS',
      lastName: 'Instructor',
      email: 'instructor@lms.com',
      password: '123456',
      role: 'professor'
    }

    const studentInfo = {
      firstName: 'LMS',
      lastName: 'Student',
      email: 'studentlms@lms.com',
      password: '123456',
      role: 'student'
    }

    const profs = await User.find({ email: instructorInfo.email }).lean().exec()
    const students = await User.find({ email: studentInfo.email }).lean().exec()

    if (!profs.length)
      await User.create(instructorInfo)
    if (!students.length)
      await User.create(studentInfo)
  } catch (err) {
    throw err
  }
}

module.exports = {
  login,
  createInstructor,
  createStudent,
  getStudentById,
  getUsers,
  updateStudent,
  suspendStudent,
  createTestUsers
}
