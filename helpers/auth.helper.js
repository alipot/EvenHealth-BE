const jwt = require('jwt-simple')
const generatePassword = require('generate-password')

function generateToken(payload) {
  return jwt.encode(payload, process.env.JWT_KEY)
}

function validateToken(token) {
  try {
    return jwt.decode(token, process.env.JWT_KEY)
  } catch (err) {
    throw err
  }
}

module.exports = {
  generateToken,
  validateToken,
}
