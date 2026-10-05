const { uploadBufferToCloudinary, isCloudinaryConfigured } = require('../config/cloudinary')

/**
 * Upload single image to Cloudinary
 * POST /api/upload/single
 */
exports.uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      console.warn('⚠️ [UPLOAD:SINGLE] Received upload request with no file attached.')
      return res.status(400).json({ success: false, message: 'No image file uploaded' })
    }

    const { originalname, size, mimetype } = req.file
    console.log(`\n======================================================`)
    console.log(`📸 [UPLOAD:SINGLE] Incoming image upload request`)
    console.log(`   Filename: ${originalname}`)
    console.log(`   Size: ${(size / 1024).toFixed(1)} KB`)
    console.log(`   MIME: ${mimetype}`)
    console.log(`   Timestamp: ${new Date().toISOString()}`)
    console.log(`======================================================`)

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'framevue/customer_photos',
      mimetype: req.file.mimetype
    })

    const finalUrl = result.secure_url || result.url
    console.log(`🎯 [UPLOAD:SINGLE] Final image asset resolved:`)
    console.log(`   ID: ${result.public_id || 'photo_' + Date.now()}`)
    console.log(`   URL: ${finalUrl.startsWith('data:') ? finalUrl.slice(0, 50) + '... (Data URI)' : finalUrl}`)
    console.log(`   Cloudinary Hosted: ${result.cloudinary ? 'YES' : 'NO (Fallback)'}`)
    console.log(`======================================================\n`)

    res.json({
      success: true,
      configured: isCloudinaryConfigured(),
      cloudinary: Boolean(result.cloudinary),
      file: {
        id: result.public_id || `photo_${Date.now()}`,
        url: finalUrl,
        name: req.file.originalname,
        size: req.file.size,
        format: result.format,
        cloudinary: Boolean(result.cloudinary)
      }
    })
  } catch (error) {
    console.error('💥 [UPLOAD:SINGLE] Error processing image:', error.message)
    next(error)
  }
}

/**
 * Upload multiple images to Cloudinary (up to 6 photos for collage)
 * POST /api/upload/multiple
 */
exports.uploadMultiple = async (req, res, next) => {
  try {
    const files = req.files
    if (!files || !files.length) {
      console.warn('⚠️ [UPLOAD:MULTIPLE] Received multi-upload request with no files attached.')
      return res.status(400).json({ success: false, message: 'No image files uploaded' })
    }

    console.log(`\n======================================================`)
    console.log(`📸 [UPLOAD:MULTIPLE] Incoming batch upload request (${files.length} images)`)
    files.forEach((f, idx) => {
      console.log(`   #${idx + 1}: ${f.originalname} (${(f.size / 1024).toFixed(1)} KB, ${f.mimetype})`)
    })
    console.log(`======================================================`)

    const uploadPromises = files.map(async (file, idx) => {
      const result = await uploadBufferToCloudinary(file.buffer, {
        folder: 'framevue/customer_photos',
        mimetype: file.mimetype
      })
      const finalUrl = result.secure_url || result.url
      return {
        id: result.public_id || `photo_${Date.now()}_${idx}`,
        url: finalUrl,
        name: file.originalname,
        size: file.size,
        format: result.format,
        cloudinary: Boolean(result.cloudinary)
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    console.log(`🎯 [UPLOAD:MULTIPLE] Batch upload complete: ${uploadedFiles.length} images processed.`)
    console.log(`======================================================\n`)

    res.json({
      success: true,
      configured: isCloudinaryConfigured(),
      count: uploadedFiles.length,
      files: uploadedFiles
    })
  } catch (error) {
    console.error('💥 [UPLOAD:MULTIPLE] Batch upload error:', error.message)
    next(error)
  }
}
