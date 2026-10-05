/**
 * Multi-Tenant SaaS Resolution Middleware
 * Scopes data (frames, designs, orders, settings, customers) per admin/studio
 */
const Admin = require('../models/Admin')

const DEFAULT_ADMIN_ID = 'jaydeep'

/**
 * Extracts and validates the active adminId for the request
 */
const resolveAdminId = (req) => {
  // 1. Authoritative check: If request has authenticated admin in session
  if (req.admin && req.admin.adminId) {
    return req.admin.adminId.toLowerCase().trim()
  }

  // 2. Custom tenant header: 'x-admin-id'
  const headerId = req.headers['x-admin-id']
  if (headerId && typeof headerId === 'string' && headerId.trim().length > 0) {
    return headerId.toLowerCase().trim()
  }

  // 3. Query parameter: ?adminId=...
  if (req.query && req.query.adminId && typeof req.query.adminId === 'string') {
    return req.query.adminId.toLowerCase().trim()
  }

  // 4. URL path parameters (e.g. /s/:adminId)
  if (req.params && req.params.adminId && typeof req.params.adminId === 'string') {
    return req.params.adminId.toLowerCase().trim()
  }

  // 5. Default fallback to primary flagship admin
  return DEFAULT_ADMIN_ID
}

const tenantMiddleware = (req, res, next) => {
  req.adminId = resolveAdminId(req)
  next()
}

module.exports = {
  tenantMiddleware,
  resolveAdminId,
  DEFAULT_ADMIN_ID
}
