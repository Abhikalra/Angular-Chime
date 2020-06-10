const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: false
}))

app.options('/*', (req, res, next) => {
  return res.json({})
})

// use this when deploying to K8s for health check endpoint
app.get('/health', (req, res, next) => {
  return res.json({ status: 'ok' })
})

app.use('/video-call', require('./route/video-call'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.statusCode || 500)
  const error = {
    message: err.message,
    status: 'fail',
    error: {
      message: err.message,
      status: err.statusCode || 500,
      statusCode: err.statusCode || 500,
      data: err.object || {}
    }
  }
  res.send(error)
})

module.exports = app
