const mongoose = require('mongoose')
const createError = require('http-errors')
const { auth } = require('../helpers')

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw createError(401, 'Authorization token is missing.')
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      throw createError(401, 'Authorization token is missing.')
    }
    try {
      const payload = auth.validateToken(token)
      req.payload = payload
      if (!req.payload) throw createError(401, 'Invalid token')
      if (!payload.role && req.url !== '/register') {
        throw createError(401, 'You are not allowed to access this route.')
      }

    } catch (err) {
      throw err
    }
    next()
  } catch (err) {
    next(err)
  }
}
