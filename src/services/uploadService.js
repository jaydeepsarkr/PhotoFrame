import { apiRequest } from './apiClient'

/**
 * Image upload service connecting to Cloudinary via backend API
 * with automatic fallback to local FileReader/Data URL for testing
 */
export const uploadService = {
  /**
   * Uploads a single file to Cloudinary via POST /api/upload/single
   */
  async uploadFileToCloudinary(file) {
    if (!file) throw new Error('No file provided')

    console.log(`📤 [UPLOAD] Initiating upload to Cloudinary for: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`)

    // Try uploading to backend / Cloudinary
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res = await apiRequest('/upload/single', {
        method: 'POST',
        body: formData
      })

      if (res && res.success && res.file) {
        console.log(`✅ [UPLOAD] Cloudinary response received for "${file.name}":`, res.file.url)
        return {
          id: res.file.id,
          url: res.file.url,
          name: res.file.name || file.name,
          size: res.file.size || file.size,
          cloudinary: Boolean(res.file.cloudinary)
        }
      }
    } catch (err) {
      console.warn(`⚠️ [UPLOAD] Direct API upload error for "${file.name}":`, err.message)
      console.info('ℹ️ [UPLOAD] Switching to client fallback reader.')
    }

    // Fallback: local FileReader data URL
    return this.readFileAsDataUrl(file)
  },

  /**
   * Uploads multiple files to Cloudinary via POST /api/upload/multiple
   */
  async uploadMultipleFilesToCloudinary(fileList) {
    const files = Array.from(fileList || []).filter(f => f && f.type.startsWith('image/'))
    if (!files.length) {
      throw new Error('Please select one or more valid image files.')
    }

    console.log(`📤 [UPLOAD:BATCH] Uploading ${files.length} images to Cloudinary...`)

    // Try backend multi-upload endpoint
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('photos', file)
      })

      const res = await apiRequest('/upload/multiple', {
        method: 'POST',
        body: formData
      })

      if (res && res.success && Array.isArray(res.files)) {
        console.log(`✅ [UPLOAD:BATCH] ${res.files.length} images successfully processed by Cloudinary endpoint!`)
        return res.files.map(f => ({
          id: f.id,
          url: f.url,
          name: f.name,
          size: f.size,
          cloudinary: Boolean(f.cloudinary)
        }))
      }
    } catch (err) {
      console.warn('⚠️ [UPLOAD:BATCH] Multi-upload endpoint unreachable, using client fallback:', err.message)
    }

    // Fallback: read locally
    return Promise.all(files.map(file => this.readFileAsDataUrl(file)))
  },

  /**
   * Converts a browser File object into a base64 Data URL
   */
  readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'))
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'))
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const maxDim = 900
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          try {
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82)
            resolve({
              id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              url: compressedDataUrl,
              name: file.name,
              size: file.size
            })
          } catch {
            resolve({
              id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              url: event.target.result,
              name: file.name,
              size: file.size
            })
          }
        }
        img.onerror = () => {
          resolve({
            id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            url: event.target.result,
            name: file.name,
            size: file.size
          })
        }
        img.src = event.target.result
      }
      reader.onerror = () => reject(new Error('Failed to read image file.'))
      reader.readAsDataURL(file)
    })
  },

  /**
   * Alias for backward compatibility
   */
  async readMultipleFilesAsDataUrls(fileList) {
    return this.uploadMultipleFilesToCloudinary(fileList)
  }
}
