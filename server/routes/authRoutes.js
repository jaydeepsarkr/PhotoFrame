const express = require('express')
const router = express.Router()
const {
  login,
  verifyOtp,
  signup,
  verifySignupOtp,
  resendOtp,
  getMe,
  getAdminByAdminId
} = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

// Public routes for 2-step authentication & admin registration
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/signup', signup)
router.post('/register', signup)
router.post('/verify-signup-otp', verifySignupOtp)
router.post('/resend-otp', resendOtp)

// Public: Check if a given adminId/slug belongs to a registered store
router.get('/store/:adminId', getAdminByAdminId)

// Protected route to check token session validity
router.get('/me', authMiddleware, getMe)

module.exports = router
