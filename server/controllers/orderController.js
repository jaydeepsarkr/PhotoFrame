const Order = require('../models/Order')
const { sendNewOrderNotificationEmail } = require('../config/mailersend')

const generateOrderId = async () => {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const count = (await Order.countDocuments()) + 1
  const seq = String(count).padStart(3, '0')
  return `PF-${yyyy}${mm}${dd}-${seq}`
}

/**
 * GET /api/orders
 * Returns active (non-deleted) orders
 */
exports.getOrders = async (req, res, next) => {
  try {
    const { status, q } = req.query
    const query = { isDeleted: { $ne: true } }

    if (status && status !== 'All') {
      query.status = status
    }

    if (q) {
      const regex = new RegExp(q, 'i')
      query.$and = [
        { isDeleted: { $ne: true } },
        {
          $or: [
            { id: regex },
            { 'customer.fullName': regex },
            { 'customer.phone': regex },
            { 'customer.email': regex },
            { 'product.frameName': regex }
          ]
        }
      ]
    }

    const orders = await Order.find(query).sort({ createdAt: -1 })
    res.json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/orders/deleted
 * Returns recently deleted orders (Trash / Recycle Bin)
 */
exports.getDeletedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ isDeleted: true }).sort({ deletedAt: -1, updatedAt: -1 })
    res.json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/orders/:id
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params
    let order = await Order.findOne({ id })
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id)
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/orders
 */
exports.createOrder = async (req, res, next) => {
  try {
    const orderId = req.body.id || (await generateOrderId())
    const today = new Date().toISOString().split('T')[0]

    const orderData = {
      ...req.body,
      id: orderId,
      date: req.body.date || today,
      status: req.body.status || 'New',
      displayStatus: 'Order Received',
      isDeleted: false,
      deletedAt: null
    }

    const order = await Order.create(orderData)

    // Send instant notification email with order details to Admin Gmail
    let emailResult = { success: false }
    try {
      emailResult = await sendNewOrderNotificationEmail({ order })
      console.log(`📨 [ORDER:CREATE] Admin email notification dispatch status for ${order.id}: ${emailResult.success ? 'Delivered' : 'Failed'}`)
    } catch (emailError) {
      console.warn(`⚠️ [ORDER:CREATE] Error sending admin order notification email for ${order.id}: ${emailError.message}`)
    }

    res.status(201).json({
      success: true,
      data: order,
      adminEmailSent: Boolean(emailResult?.success)
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/orders/:id/status
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['New', 'Confirmed', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

    let order = await Order.findOneAndUpdate(
      { id },
      { status },
      { new: true, runValidators: true }
    )

    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/orders/:id (Soft delete - move to trash)
 */
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await Order.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    res.json({
      success: true,
      message: `Order ${order.id} moved to Recently Deleted trash.`,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/orders/:id/restore
 */
exports.restoreOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await Order.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    res.json({
      success: true,
      message: `Order ${order.id} restored to active orders.`,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/orders/:id/permanent
 */
exports.permanentDeleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await Order.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    })

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    res.json({
      success: true,
      message: `Order ${order.id} permanently deleted from database.`,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/orders/bulk-delete
 */
exports.bulkDeleteOrders = async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of order IDs.' })
    }

    const result = await Order.updateMany(
      { id: { $in: ids } },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    )

    res.json({
      success: true,
      message: `Successfully moved ${result.modifiedCount} order(s) to Recently Deleted trash.`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/orders/bulk-restore
 */
exports.bulkRestoreOrders = async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of order IDs.' })
    }

    const result = await Order.updateMany(
      { id: { $in: ids } },
      { $set: { isDeleted: false, deletedAt: null } }
    )

    res.json({
      success: true,
      message: `Successfully restored ${result.modifiedCount} order(s).`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/orders/bulk-permanent-delete
 */
exports.bulkPermanentDeleteOrders = async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of order IDs.' })
    }

    const result = await Order.deleteMany({ id: { $in: ids } })

    res.json({
      success: true,
      message: `Permanently destroyed ${result.deletedCount} order(s) from database.`,
      count: result.deletedCount
    })
  } catch (error) {
    next(error)
  }
}
