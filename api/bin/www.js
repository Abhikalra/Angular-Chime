#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app')
var http = require('http')
let numCPUs = require('os').cpus().length
const cluster = require('cluster')
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8070')
app.set('port', port)
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }
  return false
}

if (cluster.isMaster) {
  if (process.env.mode === 'development') numCPUs = 1
  for (var i = 0; i < numCPUs; i++) { cluster.fork() }

  // If a worker dies, log it to the console and start another worker.
  cluster.on('exit', function (worker, code, signal) {
    console.error(`Worker ${worker.process.pid} died.`)
    cluster.fork()
  })

  // Log when a worker starts listening
  cluster.on('listening', function (worker, address) {
    console.info(`Worker started with PID ${worker.process.pid}.`)
  })
} else {
  /**
   * Create HTTP server.
   */
  const server = http.createServer(app)
  /**
   * Event listener for HTTP server "error" event.
   */
  const onError = (error) => {
    if (error.syscall !== 'listen') throw error
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
      // fall through
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
      // fall through
      default:
        throw error
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  const onListening = () => {
    var addr = server.address()
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.log('Listening on ' + bind)
  }

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
}
