const DEFAULT_DURATION = 4000

export default {
  namespaced: true,
  state: () => ({
    toasts: []
  }),
  mutations: {
    ADD_TOAST(state, toast) {
      // Keep maximum 6 toasts at a time to prevent screen flooding
      if (state.toasts.length >= 6) {
        state.toasts.shift()
      }
      state.toasts.push(toast)
    },
    REMOVE_TOAST(state, id) {
      state.toasts = state.toasts.filter(t => t.id !== id)
    },
    CLEAR_TOASTS(state) {
      state.toasts = []
    }
  },
  actions: {
    show({ commit }, payload) {
      const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7)
      let toast = {}

      if (typeof payload === 'string') {
        toast = {
          id,
          message: payload,
          type: 'info',
          title: '',
          duration: DEFAULT_DURATION,
          createdAt: Date.now()
        }
      } else {
        toast = {
          id,
          message: payload.message || '',
          type: payload.type || 'info', // 'success' | 'error' | 'warning' | 'info'
          title: payload.title || '',
          duration: payload.duration !== undefined ? payload.duration : DEFAULT_DURATION,
          createdAt: Date.now()
        }
      }

      commit('ADD_TOAST', toast)

      if (toast.duration > 0) {
        setTimeout(() => {
          commit('REMOVE_TOAST', id)
        }, toast.duration)
      }

      return id
    },
    success({ dispatch }, payload) {
      const opts = typeof payload === 'string' ? { message: payload } : payload
      return dispatch('show', { ...opts, type: 'success' })
    },
    error({ dispatch }, payload) {
      const opts = typeof payload === 'string' ? { message: payload } : payload
      return dispatch('show', { ...opts, type: 'error' })
    },
    warning({ dispatch }, payload) {
      const opts = typeof payload === 'string' ? { message: payload } : payload
      return dispatch('show', { ...opts, type: 'warning' })
    },
    info({ dispatch }, payload) {
      const opts = typeof payload === 'string' ? { message: payload } : payload
      return dispatch('show', { ...opts, type: 'info' })
    },
    remove({ commit }, id) {
      commit('REMOVE_TOAST', id)
    },
    clear({ commit }) {
      commit('CLEAR_TOASTS')
    }
  },
  getters: {
    allToasts: (state) => state.toasts
  }
}
