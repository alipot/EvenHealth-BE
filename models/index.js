const mongoose = require('mongoose')
const bunyan = require('bunyan')

const log = bunyan.createLogger({ name: 'models/index.js' })

const { createTestAdmin } = require('../controllers/admin.controller')
const { createTestUsers } = require('../controllers/user.controller')

const {
  MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DATABASE,
} = process.env

// NOTE: This DB connectivity can be moved to a separate file
mongoose
  .connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true },
  )
  .then(() => {
    log.info('DB Connected')
    
    // NOTE: Test data creation
    createTestAdmin()
    createTestUsers()
  })
  .catch(err => log.error({ err }))

const disconnectMongoDBAndKillProcess = () => mongoose.disconnect(() => process.exit(1))

process.on('uncaughtException', (err) => {
  log.error(err)
  disconnectMongoDBAndKillProcess()
})
process.on('SIGINT', () => disconnectMongoDBAndKillProcess())

module.exports = {
  User: require('./user.model'),
  Admin: require('./admin.model'),
  Course: require('./course.model'),
}
