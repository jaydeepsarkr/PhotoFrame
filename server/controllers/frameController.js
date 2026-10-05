const Frame = require('../models/Frame')
const { uploadBufferToCloudinary } = require('../config/cloudinary')
const { DEFAULT_ADMIN_ID } = require('../middleware/tenant')

// Fallback seed data in case database is freshly booting
const defaultFrames = [
  {
    id: 1,
    adminId: 'jaydeep',
    name: 'Classic Wooden Frame',
    description: 'Hand-finished solid walnut wood frame with a warm satin grain and museum-grade archival matboard.',
    material: 'Wood',
    style: 'Classic',
    price: 799,
    discountPrice: 699,
    sizes: ['8x10', '12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-wood',
    borderColor: '#4A2E1B',
    popular: true,
    isNew: false,
    status: 'active'
  }
]

function buildFrameQuery(id, adminId) {
  const orConditions = []
  if (!isNaN(id)) {
    orConditions.push({ id: Number(id), adminId })
  }
  if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
    orConditions.push({ _id: id, adminId })
  }
  orConditions.push({ id: id, adminId })
  return { $or: orConditions }
}

function buildBulkQuery(ids, adminId) {
  const numIds = ids.map(x => isNaN(x) ? null : Number(x)).filter(x => x !== null)
  const hexIds = ids.filter(x => typeof x === 'string' && x.match(/^[0-9a-fA-F]{24}$/))
  const orConditions = []
  if (numIds.length > 0) orConditions.push({ id: { $in: numIds }, adminId })
  if (hexIds.length > 0) orConditions.push({ _id: { $in: hexIds }, adminId })
  orConditions.push({ id: { $in: ids }, adminId })
  return { $or: orConditions }
}

exports.getFrames = async (req, res, next) => {
  try {
    const mongoose = require('mongoose')
    const adminId = req.adminId || DEFAULT_ADMIN_ID

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: defaultFrames.length,
        data: defaultFrames,
        warning: 'Database query fallback used'
      })
    }

    const { material, style, status, sort } = req.query
    const query = { adminId, isDeleted: { $ne: true } }

    if (material && material !== 'All') query.material = material
    if (style && style !== 'All') query.style = style
    if (status && status !== 'All') query.status = status

    let sortOption = { createdAt: -1 }
    if (sort === 'price-asc') sortOption = { price: 1 }
    else if (sort === 'price-desc') sortOption = { price: -1 }
    else if (sort === 'popular') sortOption = { popular: -1, createdAt: -1 }
    else if (sort === 'newest') sortOption = { isNew: -1, createdAt: -1 }

    const frames = await Frame.find(query).sort(sortOption)
    res.json({
      success: true,
      count: frames.length,
      data: frames
    })
  } catch (error) {
    res.json({
      success: true,
      count: defaultFrames.length,
      data: defaultFrames,
      warning: 'Database query fallback used'
    })
  }
}

/**
 * GET /api/frames/deleted
 * Returns recently deleted frames (Trash Bin) — admin only
 */
exports.getDeletedFrames = async (req, res, next) => {
  try {
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const frames = await Frame.find({ adminId, isDeleted: true }).sort({ deletedAt: -1, updatedAt: -1 })
    res.json({
      success: true,
      count: frames.length,
      data: frames
    })
  } catch (error) {
    next(error)
  }
}

exports.getFrameById = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildFrameQuery(id, adminId)
    const frame = await Frame.findOne(query)

    if (!frame) {
      return res.status(404).json({ success: false, message: 'Frame not found' })
    }

    res.json({ success: true, data: frame })
  } catch (error) {
    next(error)
  }
}

exports.createFrame = async (req, res, next) => {
  try {
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    let imageUrl = req.body.image

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: `framevue/${adminId}/frames`,
        mimetype: req.file.mimetype
      })
      imageUrl = uploadResult.secure_url || uploadResult.url
    }

    const frameData = {
      ...req.body,
      adminId,
      id: req.body.id ? Number(req.body.id) : Date.now(),
      price: Number(req.body.price),
      discountPrice: req.body.discountPrice ? Number(req.body.discountPrice) : null,
      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : typeof req.body.sizes === 'string'
        ? req.body.sizes.split(',').map((s) => s.trim())
        : ['8x10', '12x18'],
      image: imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      popular: req.body.popular === 'true' || req.body.popular === true,
      isNew: true,
      isDeleted: false,
      deletedAt: null
    }

    const frame = await Frame.create(frameData)
    res.status(201).json({ success: true, data: frame })
  } catch (error) {
    next(error)
  }
}

exports.updateFrame = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    let imageUrl = req.body.image

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: `framevue/${adminId}/frames`,
        mimetype: req.file.mimetype
      })
      imageUrl = uploadResult.secure_url || uploadResult.url
    }

    const updateData = { ...req.body }
    delete updateData.adminId // Cannot change adminId via update
    if (imageUrl) updateData.image = imageUrl
    if (updateData.price) updateData.price = Number(updateData.price)
    if (updateData.discountPrice !== undefined) {
      updateData.discountPrice = updateData.discountPrice ? Number(updateData.discountPrice) : null
    }

    const query = buildFrameQuery(id, adminId)
    const frame = await Frame.findOneAndUpdate(query, updateData, { new: true, runValidators: true })

    if (!frame) {
      return res.status(404).json({ success: false, message: 'Frame not found' })
    }

    res.json({ success: true, data: frame })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/frames/:id (Soft delete - move to trash)
 */
exports.deleteFrame = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildFrameQuery(id, adminId)
    const frame = await Frame.findOneAndUpdate(
      query,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )

    if (!frame) {
      return res.status(404).json({ success: false, message: 'Frame not found' })
    }

    res.json({
      success: true,
      message: `Frame "${frame.name}" moved to Recently Deleted trash.`,
      data: frame
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/frames/:id/restore
 */
exports.restoreFrame = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildFrameQuery(id, adminId)
    const frame = await Frame.findOneAndUpdate(
      query,
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    )

    if (!frame) {
      return res.status(404).json({ success: false, message: 'Frame not found' })
    }

    res.json({
      success: true,
      message: `Frame "${frame.name}" restored to active inventory.`,
      data: frame
    })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/frames/:id/permanent
 */
exports.permanentDeleteFrame = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildFrameQuery(id, adminId)
    const frame = await Frame.findOneAndDelete(query)

    if (!frame) {
      return res.status(404).json({ success: false, message: 'Frame not found' })
    }

    res.json({
      success: true,
      message: `Frame "${frame.name}" permanently deleted from database.`,
      data: frame
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/frames/bulk-delete
 */
exports.bulkDeleteFrames = async (req, res, next) => {
  try {
    const { ids } = req.body
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of frame IDs.' })
    }

    const query = buildBulkQuery(ids, adminId)
    const result = await Frame.updateMany(
      query,
      { $set: { isDeleted: true, deletedAt: new Date() } }
    )

    res.json({
      success: true,
      message: `Successfully moved ${result.modifiedCount} frame(s) to Recently Deleted trash.`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/frames/bulk-restore
 */
exports.bulkRestoreFrames = async (req, res, next) => {
  try {
    const { ids } = req.body
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of frame IDs.' })
    }

    const query = buildBulkQuery(ids, adminId)
    const result = await Frame.updateMany(
      query,
      { $set: { isDeleted: false, deletedAt: null } }
    )

    res.json({
      success: true,
      message: `Successfully restored ${result.modifiedCount} frame(s).`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/frames/bulk-permanent-delete
 */
exports.bulkPermanentDeleteFrames = async (req, res, next) => {
  try {
    const { ids } = req.body
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of frame IDs.' })
    }

    const query = buildBulkQuery(ids, adminId)
    const result = await Frame.deleteMany(query)

    res.json({
      success: true,
      message: `Permanently destroyed ${result.deletedCount} frame(s) from database.`,
      count: result.deletedCount
    })
  } catch (error) {
    next(error)
  }
}
