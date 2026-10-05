const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settingsController')
const authMiddleware = require('../middleware/auth')

// Public endpoint — storefront branding lookup by adminId (no auth needed)
router.get('/public/:adminId', settingsController.getPublicSettings)

// Protected studio settings — require auth
router.route('/')
  .get(settingsController.getSettings)
  .put(authMiddleware, settingsController.updateSettings)
  .post(authMiddleware, settingsController.updateSettings)

module.exports = router
