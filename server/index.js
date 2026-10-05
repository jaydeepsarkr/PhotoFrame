require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const { isCloudinaryConfigured } = require('./config/cloudinary')
const errorHandler = require('./middleware/errorHandler')
const { seedDatabase } = require('./seed/seedData')

// Route imports
const frameRoutes = require('./routes/frameRoutes')
const designRoutes = require('./routes/designRoutes')
const orderRoutes = require('./routes/orderRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const authRoutes = require('./routes/authRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const customerRoutes = require('./routes/customerRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose')
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

  res.json({
    status: 'ok',
    message: 'FrameVue API Server is active',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoStatus,
      cloudinary: isCloudinaryConfigured() ? 'configured' : 'fallback-simulation'
    }
  })
})

// Database Manual Seed Trigger
app.post('/api/seed', async (req, res) => {
  const seeded = await seedDatabase()
  res.json({
    success: seeded,
    message: seeded ? 'Database seeded successfully with initial frames, designs, and orders' : 'Seeding encountered an error'
  })
})

// Main Resource Routes
app.use('/api/frames', frameRoutes)
app.use('/api/designs', designRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/settings', settingsRoutes)

// Production Frontend Static File Serving (Render / All-in-One hosting)
const path = require('path')
const fs = require('fs')
const distPath = path.join(__dirname, '../dist')

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next()
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// 404 Route Handler for API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  })
})

// Global Error Handler
app.use(errorHandler)

// Initialize Database and Start Server
connectDB().then(async (connected) => {
  if (connected) {
    await seedDatabase()
  }

  app.listen(PORT, () => {
    console.log(`===============================================`)
    console.log(`  FrameVue Node.js Backend Server Active `)
    console.log(`  URL: http://localhost:${PORT}`)
    console.log(`  Health Check: http://localhost:${PORT}/api/health`)
    console.log(`  Cloudinary: ${isCloudinaryConfigured() ? 'Configured ✅' : 'Simulation Mode (update .env to connect)'}`)
    console.log(`===============================================`)
  })
})

module.exports = app
