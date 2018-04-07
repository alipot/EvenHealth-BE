module.exports = {
  auth: require('./auth.middleware'),
  // cors: require('./cors.middleware'),
  endPoint: require('./endpoint.middleware'),
  validate: require('./validate.middleware'),
  allow: require('./allow.middleware'),
}
