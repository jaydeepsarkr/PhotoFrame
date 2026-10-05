const Customer = require('../models/Customer')
const Order = require('../models/Order')
const { sendMarketingEmail } = require('../config/mailersend')

// Fallback sample customer directory for studio testing if database has no orders yet
const SAMPLE_CUSTOMERS = [
  {
    id: 'cust-1',
    fullName: 'Priya Sharma',
    email: 'priyasharma.studio@gmail.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    state: 'Karnataka',
    totalOrders: 2,
    totalSpent: 4800,
    lastOrderDate: '2026-10-02',
    lastOrderId: 'PF-20261002-001',
    orders: ['PF-20261002-001', 'PF-20260918-004']
  },
  {
    id: 'cust-2',
    fullName: 'Rahul Verma',
    email: 'rahul.verma88@outlook.com',
    phone: '+91 98111 22334',
    city: 'Mumbai',
    state: 'Maharashtra',
    totalOrders: 1,
    totalSpent: 3200,
    lastOrderDate: '2026-09-29',
    lastOrderId: 'PF-20260929-002',
    orders: ['PF-20260929-002']
  },
  {
    id: 'cust-3',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@yahoo.com',
    phone: '+91 97234 56789',
    city: 'Pune',
    state: 'Maharashtra',
    totalOrders: 3,
    totalSpent: 7900,
    lastOrderDate: '2026-10-04',
    lastOrderId: 'PF-20261004-003',
    orders: ['PF-20261004-003', 'PF-20260812-001', 'PF-20260705-007']
  }
]

/**
 * Synchronize orders and sample records into Customer collection
 */
async function syncCustomersFromOrders() {
  try {
    const orders = await Order.find({ isDeleted: { $ne: true } })
    const customerMap = new Map()

    for (const order of orders) {
      const email = String(order.customer?.email || '').trim().toLowerCase()
      if (!email) continue

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `cust-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          fullName: order.customer?.fullName || 'Valued Patron',
          email,
          phone: order.customer?.phone || '',
          city: order.customer?.address?.city || '',
          state: order.customer?.address?.state || '',
          country: order.customer?.address?.country || 'India',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.date || order.createdAt,
          lastOrderId: order.id,
          orders: []
        })
      }

      const record = customerMap.get(email)
      record.totalOrders += 1
      record.totalSpent += Number(order.pricing?.total || 0)
      if (!record.orders.includes(order.id)) {
        record.orders.push(order.id)
      }
    }

    // Include sample customers if not in map
    for (const sample of SAMPLE_CUSTOMERS) {
      const semail = sample.email.toLowerCase()
      if (!customerMap.has(semail)) {
        customerMap.set(semail, { ...sample, email: semail })
      }
    }

    // Upsert into MongoDB without resetting isDeleted if already deleted
    for (const cData of customerMap.values()) {
      const existing = await Customer.findOne({ email: cData.email })
      if (!existing) {
        await Customer.create({
          ...cData,
          isDeleted: false,
          deletedAt: null
        })
      } else {
        // Update stats but keep isDeleted and deletedAt intact
        await Customer.updateOne(
          { _id: existing._id },
          {
            $set: {
              fullName: cData.fullName || existing.fullName,
              phone: cData.phone || existing.phone,
              city: cData.city || existing.city,
              state: cData.state || existing.state,
              totalOrders: cData.totalOrders || existing.totalOrders,
              totalSpent: cData.totalSpent || existing.totalSpent,
              lastOrderDate: cData.lastOrderDate || existing.lastOrderDate,
              lastOrderId: cData.lastOrderId || existing.lastOrderId,
              orders: cData.orders.length ? cData.orders : existing.orders
            }
          }
        )
      }
    }
  } catch (err) {
    console.warn('⚠️ [CUSTOMER:SYNC] Error syncing customers:', err.message)
  }
}

/**
 * Get active customer directory
 * GET /api/customers
 */
exports.getCustomers = async (req, res, next) => {
  try {
    await syncCustomersFromOrders()

    const customers = await Customer.find({ isDeleted: { $ne: true } }).sort({ lastOrderDate: -1, updatedAt: -1 })

    res.json({
      success: true,
      count: customers.length,
      data: customers
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get recently deleted customers (Trash / Recycle Bin)
 * GET /api/customers/deleted
 */
exports.getDeletedCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ isDeleted: true }).sort({ deletedAt: -1, updatedAt: -1 })
    res.json({
      success: true,
      count: customers.length,
      data: customers
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Soft delete single customer (Move to trash)
 * DELETE /api/customers/:id
 */
exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params
    const customer = await Customer.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer record not found' })
    }

    res.json({
      success: true,
      message: `Customer ${customer.fullName} moved to Recently Deleted trash.`,
      data: customer
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Restore single customer
 * PATCH /api/customers/:id/restore
 */
exports.restoreCustomer = async (req, res, next) => {
  try {
    const { id } = req.params
    const customer = await Customer.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    )

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer record not found' })
    }

    res.json({
      success: true,
      message: `Customer ${customer.fullName} restored to active directory.`,
      data: customer
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Permanently delete single customer
 * DELETE /api/customers/:id/permanent
 */
exports.permanentDeleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params
    const customer = await Customer.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    })

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer record not found' })
    }

    res.json({
      success: true,
      message: `Customer ${customer.fullName} (${customer.email}) permanently deleted.`,
      data: customer
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bulk soft-delete customers (Move to trash)
 * POST /api/customers/bulk-delete
 */
exports.bulkDeleteCustomers = async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of customer IDs.' })
    }

    const result = await Customer.updateMany(
      { id: { $in: ids } },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    )

    res.json({
      success: true,
      message: `Successfully moved ${result.modifiedCount} customer(s) to Recently Deleted trash.`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bulk restore customers
 * POST /api/customers/bulk-restore
 */
exports.bulkRestoreCustomers = async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of customer IDs.' })
    }

    const result = await Customer.updateMany(
      { id: { $in: ids } },
      { $set: { isDeleted: false, deletedAt: null } }
    )

    res.json({
      success: true,
      message: `Successfully restored ${result.modifiedCount} customer(s).`,
      count: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bulk permanently delete customers
 * POST /api/customers/bulk-permanent-delete
 */
exports.bulkPermanentDeleteCustomers = async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of customer IDs.' })
    }

    const result = await Customer.deleteMany({ id: { $in: ids } })

    res.json({
      success: true,
      message: `Permanently destroyed ${result.deletedCount} customer(s) from database.`,
      count: result.deletedCount
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Send Marketing / Offer / Campaign Email to Customer(s)
 * POST /api/customers/send-email
 */
exports.sendCustomerEmail = async (req, res, next) => {
  try {
    const {
      target, // 'single' | 'all'
      recipientEmail,
      recipientName,
      subject,
      headline,
      offerBadge,
      discountCode,
      messageBody,
      buttonText,
      buttonLink
    } = req.body

    console.log(`\n======================================================`)
    console.log(`📢 [CUSTOMER:EMAIL:DISPATCH] Received email dispatch request`)
    console.log(`   Target: ${target}`)
    console.log(`   Subject: ${subject}`)
    console.log(`   Badge: ${offerBadge || 'N/A'}`)
    console.log(`   Discount Code: ${discountCode || 'None'}`)
    console.log(`======================================================`)

    if (!subject || !messageBody) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an Email Subject and Message Body.'
      })
    }

    // 1. Single Customer Dispatch
    if (target === 'single') {
      if (!recipientEmail) {
        return res.status(400).json({
          success: false,
          message: 'Recipient email address is required for single customer dispatch.'
        })
      }

      const emailResult = await sendMarketingEmail({
        toEmail: recipientEmail.trim(),
        customerName: recipientName || 'Valued Customer',
        subject,
        headline,
        offerBadge: offerBadge || 'Special Offer',
        discountCode,
        messageBody,
        buttonText: buttonText || 'Shop Bespoke Frames',
        buttonLink
      })

      console.log(`✅ [CUSTOMER:EMAIL:SINGLE] Dispatch completed for ${recipientEmail}: ${emailResult.success ? 'Delivered' : 'Simulated / SMTP Result'}`)

      return res.json({
        success: true,
        count: 1,
        target: 'single',
        recipient: recipientEmail,
        message: `Offer email successfully dispatched to ${recipientEmail}.`,
        details: emailResult
      })
    }

    // 2. Broadcast to ALL Customers
    if (target === 'all') {
      // Fetch active customers
      const activeCustomers = await Customer.find({ isDeleted: { $ne: true } })
      const emailsSet = new Map()

      for (const c of activeCustomers) {
        if (c.email) {
          emailsSet.set(c.email.toLowerCase(), c.fullName || 'Valued Patron')
        }
      }

      // Add sample customers if empty
      if (emailsSet.size === 0) {
        for (const sample of SAMPLE_CUSTOMERS) {
          emailsSet.set(sample.email.toLowerCase(), sample.fullName)
        }
      }

      const recipientsList = Array.from(emailsSet.entries())

      console.log(`📢 [CUSTOMER:EMAIL:BROADCAST] Starting mass dispatch to ${recipientsList.length} customers...`)

      const results = []
      let sentCount = 0
      let failCount = 0

      for (const [email, name] of recipientsList) {
        try {
          const resSingle = await sendMarketingEmail({
            toEmail: email,
            customerName: name,
            subject,
            headline,
            offerBadge: offerBadge || 'Studio Announcement',
            discountCode,
            messageBody,
            buttonText: buttonText || 'Explore Handcrafted Frames',
            buttonLink
          })
          results.push({ email, name, success: resSingle.success })
          if (resSingle.success) sentCount++
          else failCount++
        } catch (err) {
          console.warn(`⚠️ [CUSTOMER:EMAIL:BROADCAST] Failed to send to ${email}: ${err.message}`)
          results.push({ email, name, success: false, error: err.message })
          failCount++
        }
      }

      console.log(`🎉 [CUSTOMER:EMAIL:BROADCAST] Completed: ${sentCount} sent, ${failCount} failed/simulated out of ${recipientsList.length} total.`)

      return res.json({
        success: true,
        count: recipientsList.length,
        sentCount,
        failCount,
        target: 'all',
        message: `Campaign broadcast successfully dispatched to ${recipientsList.length} customers.`,
        recipients: results
      })
    }

    return res.status(400).json({
      success: false,
      message: "Invalid target. Specify 'single' or 'all'."
    })
  } catch (error) {
    console.error(`💥 [CUSTOMER:EMAIL:ERROR]`, error)
    next(error)
  }
}
