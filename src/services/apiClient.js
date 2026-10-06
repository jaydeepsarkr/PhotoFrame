function getBaseUrl() {
  if (process.env.VUE_APP_API_URL) {
    return process.env.VUE_APP_API_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0'

    // In production environments (e.g. https://framevue.onrender.com):
    // Always use relative '/api' so all requests hit the same origin securely without CORS or loopback issues
    if (!isLocalhost) {
      return '/api'
    }

    // Local dev: Port 8080 is proxied to backend via vue.config.js
    if (window.location.port === '8080' || window.location.port === '5000') {
      return '/api'
    }

    return 'http://localhost:5000/api'
  }
  return '/api'
}

export function getActiveAdminId() {
  if (typeof window === 'undefined') return 'jaydeep'

  // 1. If currently inside admin dashboard or admin routes, ALWAYS prioritize authenticated admin
  if (window.location.pathname.startsWith('/admin')) {
    try {
      const rawUser = localStorage.getItem('framevue_admin_user')
      if (rawUser) {
        const adminUser = JSON.parse(rawUser)
        if (adminUser && adminUser.adminId) {
          return adminUser.adminId.toLowerCase().trim()
        }
      }
      const adminIdOnly = localStorage.getItem('framevue_admin_id')
      if (adminIdOnly && adminIdOnly.trim()) {
        return adminIdOnly.toLowerCase().trim()
      }
    } catch (e) { /* ignore */ }
  }

  // 2. From URL path: /s/:adminId/...
  const match = window.location.pathname.match(/^\/s\/([a-zA-Z0-9_-]+)/)
  if (match && match[1]) {
    return match[1].toLowerCase().trim()
  }

  // 3. From URL query param: ?adminId=...
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const qAdminId = urlParams.get('adminId')
    if (qAdminId) {
      return qAdminId.toLowerCase().trim()
    }
  } catch (e) { /* ignore */ }

  // 4. From localStorage active storefront tenant
  try {
    const storedActive = localStorage.getItem('framevue_active_admin_id')
    if (storedActive && storedActive.trim()) {
      return storedActive.toLowerCase().trim()
    }
  } catch (e) { /* ignore */ }

  // 5. If logged in as admin, use that admin's adminId
  try {
    const rawUser = localStorage.getItem('framevue_admin_user')
    if (rawUser) {
      const adminUser = JSON.parse(rawUser)
      if (adminUser && adminUser.adminId) {
        return adminUser.adminId.toLowerCase().trim()
      }
    }
    const adminIdOnly = localStorage.getItem('framevue_admin_id')
    if (adminIdOnly && adminIdOnly.trim()) {
      return adminIdOnly.toLowerCase().trim()
    }
  } catch (e) { /* ignore */ }

  return 'jaydeep'
}

export function setActiveAdminId(adminId) {
  if (typeof localStorage !== 'undefined' && adminId) {
    localStorage.setItem('framevue_active_admin_id', adminId.toLowerCase().trim())
  }
}

const BASE_URL = getBaseUrl()

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('framevue_admin_token') : null
  const activeAdminId = getActiveAdminId()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-admin-id': activeAdminId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  }

  // If body is FormData, do not set Content-Type header so browser sets boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type']
  } else if (typeof config.body === 'object' && config.body !== null) {
    config.body = JSON.stringify(config.body)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    config.signal = controller.signal

    const response = await fetch(url, config)
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Return structured failure so services can decide to use mock fallback
    throw error
  }
}
