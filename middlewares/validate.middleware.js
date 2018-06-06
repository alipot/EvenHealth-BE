const joi = require('joi')
const createError = require('http-errors')

module.exports = ({ query, body }) => (req, res, next) => {
  let result
  const options = {
    allowUnknown: true,
  }
  if (query) {
    const schema = joi.object(query)
    result = schema.validate(req.query, options)
    if (result && result.error && result.error.details) {
      next(createError(400, result.error.details[0].message))
      return
    }
  }
  if (body) {
    const schema = joi.object(body)
    result = schema.validate(req.body, options)
    if (result && result.error && result.error.details) {
      next(createError(400, result.error.details[0].message))
      return
    }
  }
  next()
}
