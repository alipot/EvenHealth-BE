const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp2')
const paginate = require('mongoose-paginate-v2')
const bcrypt = require('bcryptjs')

const { MODELS, USER_ROLES, USER_STATUSES } = require("../constants");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT,
    lowercase: true,
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUSES),
    default: USER_STATUSES.ACTIVE // Keeping this active for this test
  }
})

UserSchema.method(
  'validatePassword',
  function (password) {
    return bcrypt.compareSync(password, this.password)
  },
)


UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  this.resetCode = null
  return next()
})

UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  if (user.password) {
    delete user.password
  }
  return user
}

UserSchema.plugin(timestamp)
UserSchema.plugin(paginate)

module.exports = mongoose.model(MODELS.USER, UserSchema)
