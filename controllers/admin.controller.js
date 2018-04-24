const mongoose = require('mongoose')
const { model } = mongoose
const createError = require('http-errors')
const moment = require('moment')

const { auth: authHelper, email: Email } = require('../helpers')

const login = async (email, password) => {
  try {
    const Admin = model('Admin')
    const user = await Admin.findOne({ email }).exec()
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
      Admin.findOne({ email }).lean().exec(),
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

const me = async (adminId) => {
  try {
    const Admin = model('Admin')
    return Admin.findById(adminId, { 'password': 0 }).lean().exec()
  } catch (err) {
    throw err
  }
}

// NOTE: This method is only used to create a test admin
const createTestAdmin = async () => {
  try {
    const Admin = model('Admin')
    
    const adminInfo = {
      firstName: 'LMS',
      lastName: 'Admin',
      email: 'admin@lms.com',
      password: '123456',
    }

    const admins = await Admin.find().lean().exec()
    if (!admins.length)
      await Admin.create(adminInfo)
  } catch (err) {
    throw err
  }
}

module.exports = {
  login,
  me,
  createTestAdmin
}
