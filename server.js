const dotenv = require('dotenv')
const path = require('path');
const http = require('http');
const express = require('express');
const bunyan = require('bunyan')
var cors = require('cors')

const routes = require('./routes')
const { endPoint: { successEndpoint, errorEndpoint } } = require('./middlewares')

const log = bunyan.createLogger({ name: 'server.js' })
dotenv.config()
const app = express();

app.use(cors()) // include before other routes
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Loading models and routes
require('./models')
app.use(routes)

// Middlewares to modify success and error response
app.use(successEndpoint)
app.use(errorEndpoint)

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    log.error(err)
  }
  log.info(`Server is up and running on: ${PORT}`)
})