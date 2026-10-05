const cloudinary = require('cloudinary').v2
const { Readable } = require('stream')

/**
 * Configure Cloudinary with environment variables or CLOUDINARY_URL
 */
const configureCloudinary = () => {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
      secure: true
    })
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    })
  }
}

// Initial configuration
configureCloudinary()

/**
 * Checks if real, non-placeholder Cloudinary credentials are configured
 */
const isCloudinaryConfigured = () => {
  if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.includes('your_')) {
    return true
  }
  const name = process.env.CLOUDINARY_CLOUD_NAME
  const key = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET
  return Boolean(
    name &&
    key &&
    secret &&
    name !== 'your_cloud_name' &&
    name !== 'demo_framevue' &&
    secret !== 'sample_secret_key_change_me'
  )
}

/**
 * Uploads a file buffer directly to Cloudinary using upload_stream
 * with thorough console logging and resilient fallback
 */
const uploadBufferToCloudinary = (fileBuffer, options = {}) => {
  configureCloudinary()
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo_framevue'
  const targetFolder = options.folder || 'framevue/customer_photos'
  const fileSizeKb = (fileBuffer.length / 1024).toFixed(1)
  const isReal = isCloudinaryConfigured()

  console.log(`\n======================================================`)
  console.log(`☁️  [CLOUDINARY:UPLOAD] Starting Cloudinary image upload`)
  console.log(`   Cloud Name: ${cloudName}`)
  console.log(`   Target Folder: ${targetFolder}`)
  console.log(`   Buffer Size: ${fileSizeKb} KB`)
  console.log(`   Mode: ${isReal ? 'Live Cloudinary API' : 'Fallback Simulation Mode'}`)
  console.log(`======================================================`)

  return new Promise((resolve) => {
    // If real credentials are set, attempt direct Cloudinary upload stream
    if (isReal) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: targetFolder,
          resource_type: 'image',
          ...options
        },
        (error, result) => {
          if (error) {
            console.error(`❌ [CLOUDINARY:ERROR] Cloudinary API upload failed!`)
            console.error(`   Message: ${error.message}`)
            console.error(`   HTTP Code: ${error.http_code || 'N/A'}`)
            console.warn(`⚠️ [CLOUDINARY:FALLBACK] Using resilient fallback data URL so user session continues.`)
            console.log(`======================================================\n`)

            // Fallback response so customer flow doesn't crash
            const base64Data = fileBuffer.toString('base64')
            const mime = options.mimetype || 'image/jpeg'
            const dataUri = `data:${mime};base64,${base64Data}`
            return resolve({
              url: dataUri,
              secure_url: dataUri,
              public_id: `fallback_${Date.now()}`,
              format: mime.split('/')[1] || 'jpg',
              bytes: fileBuffer.length,
              cloudinary: false,
              error: error.message
            })
          }

          console.log(`✅ [CLOUDINARY:SUCCESS] Image uploaded successfully to Cloudinary!`)
          console.log(`   Public ID: ${result.public_id}`)
          console.log(`   Secure URL: ${result.secure_url}`)
          console.log(`   Format: ${result.format} | Size: ${result.width}x${result.height} | Bytes: ${result.bytes}`)
          console.log(`======================================================\n`)

          resolve({
            ...result,
            cloudinary: true
          })
        }
      )

      Readable.from(fileBuffer).pipe(uploadStream)
      return
    }

    // Fallback simulation mode
    console.warn(`⚠️ [CLOUDINARY:NOTICE] Live Cloudinary credentials are not configured in server/.env.`)
    console.warn(`   Current CLOUDINARY_CLOUD_NAME=${cloudName}`)
    console.warn(`   (To store photos directly on Cloudinary CDN, update server/.env with your Cloudinary credentials)`)
    
    const base64Data = fileBuffer.toString('base64')
    const mime = options.mimetype || 'image/jpeg'
    const dataUri = `data:${mime};base64,${base64Data}`

    console.log(`ℹ️ [CLOUDINARY:SIMULATION] Processed image buffer into high-res data URL (${fileSizeKb} KB).`)
    console.log(`======================================================\n`)

    resolve({
      url: dataUri,
      secure_url: dataUri,
      public_id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      format: mime.split('/')[1] || 'jpg',
      bytes: fileBuffer.length,
      cloudinary: false,
      mock: true
    })
  })
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadBufferToCloudinary
}
