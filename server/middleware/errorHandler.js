const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.message || err)

  let message = err.message || 'Internal Server Error'
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  // Handle Mongoose connection and buffering timeouts specifically
  if (err.name === 'MongooseError' && (err.message.includes('buffering timed out') || err.message.includes('bufferCommands'))) {
    statusCode = 503
    message =
      'Database is currently offline. Please ensure MONGODB_URI is configured in Render Environment Variables and your MongoDB Atlas IP Access List includes 0.0.0.0/0 (Allow from anywhere).'
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

module.exports = errorHandler
