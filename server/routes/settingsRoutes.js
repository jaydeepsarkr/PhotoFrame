const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settingsController')

router.route('/')
  .get(settingsController.getSettings)
  .put(settingsController.updateSettings)
  .post(settingsController.updateSettings)

module.exports = router
