import { apiRequest } from './apiClient'

const TOKEN_KEY = 'framevue_admin_token'
const USER_KEY = 'framevue_admin_user'

export const authService = {
  /**
   * Step 1: Admin Login with Email & Password -> Triggers MailerSend OTP
   */
  async login(credentials) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: credentials
    })
    return data
  },

  /**
   * Step 2: Verify 6-digit OTP -> Obtains JWT
   */
  async verifyOtp(payload) {
    const data = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: payload
    })

    if (data && data.token) {
      this.saveAuth(data.token, data.admin)
    }

    return data
  },

  /**
   * Admin Signup / Registration -> Dispatches MailerSend Activation OTP
   */
  async signup(formData) {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: formData
    })
    return data
  },

  /**
   * Verify Signup Activation OTP -> Obtains JWT and logs admin in
   */
  async verifySignupOtp(payload) {
    const data = await apiRequest('/auth/verify-signup-otp', {
      method: 'POST',
      body: payload
    })

    if (data && data.token) {
      this.saveAuth(data.token, data.admin)
    }

    return data
  },

  /**
   * Resend OTP code via MailerSend
   */
  async resendOtp(payload) {
    const data = await apiRequest('/auth/resend-otp', {
      method: 'POST',
      body: payload
    })
    return data
  },

  /**
   * Get current admin profile
   */
  async getMe() {
    return await apiRequest('/auth/me', {
      method: 'GET'
    })
  },

  saveAuth(token, admin) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(admin))
    }
  },

  clearAuth() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  },

  getStoredToken() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  },

  getStoredUser() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(USER_KEY) : null
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  }
}
