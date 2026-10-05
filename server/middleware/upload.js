const multer = require('multer')

// Store files in memory so we can stream directly to Cloudinary
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP, GIF) are allowed!'), false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per image
  },
  fileFilter
})

module.exports = upload
