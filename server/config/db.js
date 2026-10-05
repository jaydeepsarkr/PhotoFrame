const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/framevue', {
      serverSelectionTimeoutMS: 4000
    })
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
    return true
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`)
    console.warn(`ℹ️  Running in resilient mode. Database queries will return helpful error/fallback responses until MongoDB is active.`)
    return false
  }
}

module.exports = connectDB
