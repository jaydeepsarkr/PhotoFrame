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

const BASE_URL = getBaseUrl()

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('framevue_admin_token') : null

  const config = {
    headers: {
      'Content-Type': 'application/json',
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
