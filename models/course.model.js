const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp2')
const paginate = require('mongoose-paginate-v2')

const { MODELS } = require('../constants')

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
  },
  description: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODELS.USER
  },
  isActive: {
    type: Boolean,
    default: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: MODELS.USER,
  }],
})

CourseSchema.plugin(timestamp)
CourseSchema.plugin(paginate)

module.exports = mongoose.model(MODELS.COURSE, CourseSchema)
