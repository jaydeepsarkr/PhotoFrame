const mongoose = require('mongoose')

// Reduce buffering timeout from default 10000ms to 3000ms so operations fail fast when offline
mongoose.set('bufferTimeoutMS', 3000)

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/framevue'
  const isDefaultUri = !process.env.MONGODB_URI

  if (isDefaultUri) {
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
      console.error(`\n🚨 [MONGODB] CRITICAL: 'MONGODB_URI' is NOT configured in Render Environment Variables!`)
      console.error(`   The server fell back to 'mongodb://127.0.0.1:27017/framevue', which does not exist in production.`)
      console.error(`   👉 Open Render Dashboard -> Your Service -> Environment -> Add 'MONGODB_URI' with your MongoDB Atlas connection string.\n`)
    } else {
      console.log(`ℹ️ [MONGODB] Using local MongoDB fallback (mongodb://127.0.0.1:27017/framevue)`)
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    })
    console.log(`✅ [MONGODB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`)
    return true
  } catch (error) {
    console.error(`❌ [MONGODB] Connection Error: ${error.message}`)
    if (error.message.includes('ECONNREFUSED 127.0.0.1') || error.message.includes('127.0.0.1:27017')) {
      console.error(`   👉 Connection refused on 127.0.0.1. MONGODB_URI is not set in Render Environment Variables!`)
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error(`   👉 Authentication failed. Verify your database username and password in MONGODB_URI.`)
    } else if (error.message.includes('querySrv') || error.message.includes('timed out') || error.message.includes('Server selection timed out')) {
      console.error(`   👉 Network Timeout. In MongoDB Atlas: Network Access -> Add IP Address -> 'Allow Access from Anywhere' (0.0.0.0/0).`)
    }
    return false
  }
}

module.exports = connectDB
