import { authService } from '@/services/authService'

export default {
  namespaced: true,
  state: () => ({
    token: authService.getStoredToken(),
    admin: authService.getStoredUser(),
    loading: false,
    error: null,
    step: 'credentials', // 'credentials' | 'otp'
    pendingEmail: ''
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    currentAdmin: (state) => state.admin,
    adminRole: (state) => state.admin?.role || 'admin',
    adminEmail: (state) => state.admin?.email || '',
    adminName: (state) => state.admin?.name || 'Administrator',
    authLoading: (state) => state.loading,
    authError: (state) => state.error,
    loginStep: (state) => state.step,
    pendingEmail: (state) => state.pendingEmail
  },
  mutations: {
    SET_AUTH(state, { token, admin }) {
      state.token = token
      state.admin = admin
      state.error = null
    },
    CLEAR_AUTH(state) {
      state.token = null
      state.admin = null
      state.step = 'credentials'
      state.pendingEmail = ''
      state.error = null
    },
    SET_LOADING(state, status) {
      state.loading = Boolean(status)
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_STEP(state, step) {
      state.step = step
    },
    SET_PENDING_EMAIL(state, email) {
      state.pendingEmail = email
    }
  },
  actions: {
    /**
     * Step 1: Request OTP with credentials
     */
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await authService.login(credentials)
        commit('SET_PENDING_EMAIL', credentials.email)
        commit('SET_STEP', 'otp')
        return response
      } catch (error) {
        commit('SET_ERROR', error.message || 'Login failed. Please check your credentials.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * Step 2: Verify OTP and acquire JWT token
     */
    async verifyOtp({ commit, state }, { otp }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await authService.verifyOtp({
          email: state.pendingEmail,
          otp
        })

        commit('SET_AUTH', {
          token: response.token,
          admin: response.admin
        })
        commit('SET_STEP', 'credentials')

        return response
      } catch (error) {
        commit('SET_ERROR', error.message || 'Invalid or expired OTP code.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * Admin Signup / Registration
     */
    async signup({ commit }, formData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await authService.signup(formData)
        commit('SET_PENDING_EMAIL', formData.email)
        commit('SET_STEP', 'otp')
        return response
      } catch (error) {
        commit('SET_ERROR', error.message || 'Registration failed. Please check the details.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * Verify Signup Activation OTP & Activate Admin
     */
    async verifySignupOtp({ commit, state }, { otp }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await authService.verifySignupOtp({
          email: state.pendingEmail,
          otp
        })

        commit('SET_AUTH', {
          token: response.token,
          admin: response.admin
        })
        commit('SET_STEP', 'credentials')

        return response
      } catch (error) {
        commit('SET_ERROR', error.message || 'Invalid or expired activation code.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * Resend OTP code
     */
    async resendOtp({ commit, state }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await authService.resendOtp({
          email: state.pendingEmail
        })
        return response
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to resend code.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * Reset login step back to credentials
     */
    resetStep({ commit }) {
      commit('SET_STEP', 'credentials')
      commit('SET_ERROR', null)
    },

    /**
     * Terminate admin session
     */
    logout({ commit }) {
      authService.clearAuth()
      commit('CLEAR_AUTH')
    },

    /**
     * Validate active session against server
     */
    async checkAuth({ commit, state, dispatch }) {
      if (!state.token) return false

      try {
        const response = await authService.getMe()
        if (response.success && response.admin) {
          commit('SET_AUTH', {
            token: state.token,
            admin: response.admin
          })
          return true
        }
      } catch (error) {
        console.warn('Session verification failed, clearing auth session.')
        dispatch('logout')
        return false
      }
    }
  }
}
