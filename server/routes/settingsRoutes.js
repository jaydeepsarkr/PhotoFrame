const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settingsController')
const authMiddleware = require('../middleware/auth')

// Optional auth middleware for GET — resolves adminId if token provided, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return authMiddleware(req, res, next)
  }
  next()
}

// Public endpoint — storefront branding lookup by adminId (no auth needed)
router.get('/public/:adminId', settingsController.getPublicSettings)

// Protected studio settings — require auth for modifications, optional for lookup
router.route('/')
  .get(optionalAuth, settingsController.getSettings)
  .put(authMiddleware, settingsController.updateSettings)
  .post(authMiddleware, settingsController.updateSettings)

module.exports = router
