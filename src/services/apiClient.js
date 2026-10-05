/**
 * Centralized API Client with automated server detection & graceful fallback
 */
const BASE_URL =
  process.env.VUE_APP_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '8080' ? '/api' : 'http://localhost:5000/api')

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
