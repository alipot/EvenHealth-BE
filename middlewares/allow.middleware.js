const createError = require('http-errors')
const mongoose = require('mongoose')

module.exports = (allowedRoles, { path, model } = {}) => async (req, res, next) => {
  try {
    if (req.payload.role && req.payload.role.includes('admin')) {
      req.isSuper = true
      return next()
    }

    let isAllowed = false
    const { role } = req.payload
    if (allowedRoles.includes(role)) isAllowed = true

    if (!isAllowed) next(createError(401, 'You are not authorized to perform the requested action'))

    if (path) {
      const pathArray = path.split('.')
      let resourceId = { body: { ...req.body }, params: { ...req.params }, query: { ...req.query } }

      for (const p of pathArray) resourceId = resourceId[p]

      const resource = await mongoose.model(model).findOne({
        _id: resourceId,
      })

      if (!resource) next(createError(401, 'You are not authorized to perform the requested action'))
    }
    return next()
  } catch (err) {
    return next(err)
  }
}
