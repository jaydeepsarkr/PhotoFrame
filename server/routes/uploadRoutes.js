const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const upload = require('../middleware/upload')

// Single photo upload to Cloudinary
router.post('/single', upload.single('photo'), uploadController.uploadSingle)

// Multiple photos upload to Cloudinary (up to 6 photos for collage frames)
router.post('/multiple', upload.array('photos', 6), uploadController.uploadMultiple)

module.exports = router
