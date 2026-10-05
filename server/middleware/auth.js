const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const authMiddleware = async (req, res, next) => {
  try {
    let token = null

    // Check Authorization header: 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing. Please sign in to access this admin resource.'
      })
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_framevue_atelier_cadre_2026'
    const decoded = jwt.verify(token, secret)

    // Optional database check to ensure admin still exists & active
    const admin = await Admin.findById(decoded.id).select('-password -otp -otpExpires')
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'The administrator account associated with this token no longer exists.'
      })
    }

    req.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your admin session has expired. Please sign in again.'
      })
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    })
  }
}

module.exports = authMiddleware
