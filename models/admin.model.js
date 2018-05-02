const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp2')
const paginate = require('mongoose-paginate-v2')
const bcrypt = require('bcryptjs')

const { MODELS, USER_STATUSES, ADMIN_ROLES } = require('../constants')

const AdminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 255,
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
    enum: ADMIN_ROLES.values,
    default: ADMIN_ROLES.ADMIN,
    lowercase: true,
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUSES),
    default: USER_STATUSES.ACTIVE
  },
})

AdminSchema.method(
  'validatePassword',
  function (password) {
    return bcrypt.compareSync(password, this.password)
  },
)


AdminSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  this.resetCode = null
  return next()
})

AdminSchema.methods.toJSON = function () {
  const admin = this.toObject()
  if (admin.password) {
    delete admin.password
  }
  return admin
}

AdminSchema.plugin(timestamp)
AdminSchema.plugin(paginate)

module.exports = mongoose.model(MODELS.ADMIN, AdminSchema)
