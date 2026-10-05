const Design = require('../models/Design')
const { uploadBufferToCloudinary } = require('../config/cloudinary')
const { DEFAULT_ADMIN_ID } = require('../middleware/tenant')

function buildDesignQuery(id, adminId) {
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

exports.getDesigns = async (req, res, next) => {
  try {
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const { category, status } = req.query
    const query = { adminId, isDeleted: { $ne: true } }

    if (category && category !== 'All') query.category = category
    if (status && status !== 'All') query.status = status

    const designs = await Design.find(query).sort({ createdAt: -1 })
    res.json({
      success: true,
      count: designs.length,
      data: designs
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/designs/deleted
 * Returns recently deleted design templates (Trash Bin)
 */
exports.getDeletedDesigns = async (req, res, next) => {
  try {
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const designs = await Design.find({ adminId, isDeleted: true }).sort({ deletedAt: -1, updatedAt: -1 })
    res.json({
      success: true,
      count: designs.length,
      data: designs
    })
  } catch (error) {
    next(error)
  }
}

exports.getDesignById = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildDesignQuery(id, adminId)
    const design = await Design.findOne(query)

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' })
    }

    res.json({ success: true, data: design })
  } catch (error) {
    next(error)
  }
}

exports.createDesign = async (req, res, next) => {
  try {
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    let imageUrl = req.body.image

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: `framevue/${adminId}/designs`,
        mimetype: req.file.mimetype
      })
      imageUrl = uploadResult.secure_url || uploadResult.url
    }

    const designData = {
      ...req.body,
      adminId,
      id: req.body.id ? Number(req.body.id) : Date.now(),
      image: imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
      isDeleted: false,
      deletedAt: null
    }

    const design = await Design.create(designData)
    res.status(201).json({ success: true, data: design })
  } catch (error) {
    next(error)
  }
}

exports.updateDesign = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    let imageUrl = req.body.image

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: `framevue/${adminId}/designs`,
        mimetype: req.file.mimetype
      })
      imageUrl = uploadResult.secure_url || uploadResult.url
    }

    const updateData = { ...req.body }
    delete updateData.adminId
    if (imageUrl) updateData.image = imageUrl

    const query = buildDesignQuery(id, adminId)
    const design = await Design.findOneAndUpdate(query, updateData, { new: true, runValidators: true })

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' })
    }

    res.json({ success: true, data: design })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/designs/:id (Soft delete - move to trash)
 */
exports.deleteDesign = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildDesignQuery(id, adminId)
    const design = await Design.findOneAndUpdate(
      query,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' })
    }

    res.json({
      success: true,
      message: `Design "${design.name}" moved to Recently Deleted trash.`,
      data: design
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/designs/:id/restore
 */
exports.restoreDesign = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildDesignQuery(id, adminId)
    const design = await Design.findOneAndUpdate(
      query,
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    )

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' })
    }

    res.json({
      success: true,
      message: `Design "${design.name}" restored to active catalog.`,
      data: design
    })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/designs/:id/permanent
 */
exports.permanentDeleteDesign = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    const query = buildDesignQuery(id, adminId)
    const design = await Design.findOneAndDelete(query)

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' })
    }

    res.json({
      success: true,
      message: `Design "${design.name}" permanently deleted from database.`,
      data: design
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/designs/bulk-delete
 */
exports.bulkDeleteDesigns = async (req, res, next) => {
  try {
    const { ids } = req.body
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of design IDs.' })
    }

    const query = buildBulkQuery(ids, adminId)
    const result = await Design.updateMany(
      query,
      { $set: { isDeleted: true, deletedAt: new Date() } }
    )

    res.json({
      success: true,
      message: `Successfully moved ${result.modifiedCount} design template(s) to Recently Deleted trash.`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/designs/bulk-restore
 */
exports.bulkRestoreDesigns = async (req, res, next) => {
  try {
    const { ids } = req.body
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of design IDs.' })
    }

    const query = buildBulkQuery(ids, adminId)
    const result = await Design.updateMany(
      query,
      { $set: { isDeleted: false, deletedAt: null } }
    )

    res.json({
      success: true,
      message: `Successfully restored ${result.modifiedCount} design template(s).`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/designs/bulk-permanent-delete
 */
exports.bulkPermanentDeleteDesigns = async (req, res, next) => {
  try {
    const { ids } = req.body
    const adminId = req.adminId || DEFAULT_ADMIN_ID
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of design IDs.' })
    }

    const query = buildBulkQuery(ids, adminId)
    const result = await Design.deleteMany(query)

    res.json({
      success: true,
      message: `Permanently destroyed ${result.deletedCount} design template(s) from database.`,
      count: result.deletedCount
    })
  } catch (error) {
    next(error)
  }
}
