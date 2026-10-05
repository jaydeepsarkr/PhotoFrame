import { customerService } from '@/services/customerService'

export default {
  namespaced: true,
  state: () => ({
    customers: [],
    deletedCustomers: [],
    loading: false,
    error: null,
    lastDispatch: null
  }),
  getters: {
    allCustomers: (state) => state.customers,
    deletedCustomers: (state) => state.deletedCustomers,
    deletedCustomersCount: (state) => state.deletedCustomers.length,
    loading: (state) => state.loading,
    error: (state) => state.error,
    lastDispatch: (state) => state.lastDispatch,
    customerCount: (state) => state.customers.length,
    customerStats: (state) => {
      const list = state.customers || []
      const total = list.length
      const totalLtv = list.reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0)
      const repeatCustomers = list.filter(c => (Number(c.totalOrders) || 0) > 1).length
      const avgLtv = total > 0 ? Math.round(totalLtv / total) : 0
      return {
        total,
        totalLtv,
        repeatCustomers,
        avgLtv
      }
    },
    getCustomerByEmail: (state) => (email) => {
      if (!email) return null
      return state.customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null
    }
  },
  mutations: {
    SET_CUSTOMERS(state, customers) {
      state.customers = customers
    },
    SET_DELETED_CUSTOMERS(state, deleted) {
      state.deletedCustomers = deleted
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_LAST_DISPATCH(state, dispatchInfo) {
      state.lastDispatch = dispatchInfo
    }
  },
  actions: {
    async fetchCustomers({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await customerService.fetchCustomers()
        commit('SET_CUSTOMERS', data)
        return data
      } catch (err) {
        commit('SET_ERROR', err.message)
        return []
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchDeletedCustomers({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await customerService.fetchDeletedCustomers()
        commit('SET_DELETED_CUSTOMERS', data)
        return data
      } catch (err) {
        commit('SET_ERROR', err.message)
        return []
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteCustomer({ dispatch }, id) {
      const res = await customerService.deleteCustomer(id)
      await dispatch('fetchCustomers')
      await dispatch('fetchDeletedCustomers')
      return res
    },

    async restoreCustomer({ dispatch }, id) {
      const res = await customerService.restoreCustomer(id)
      await dispatch('fetchCustomers')
      await dispatch('fetchDeletedCustomers')
      return res
    },

    async permanentDeleteCustomer({ dispatch }, id) {
      const res = await customerService.permanentDeleteCustomer(id)
      await dispatch('fetchDeletedCustomers')
      return res
    },

    async bulkDeleteCustomers({ dispatch }, ids) {
      const res = await customerService.bulkDeleteCustomers(ids)
      await dispatch('fetchCustomers')
      await dispatch('fetchDeletedCustomers')
      return res
    },

    async bulkRestoreCustomers({ dispatch }, ids) {
      const res = await customerService.bulkRestoreCustomers(ids)
      await dispatch('fetchCustomers')
      await dispatch('fetchDeletedCustomers')
      return res
    },

    async bulkPermanentDeleteCustomers({ dispatch }, ids) {
      const res = await customerService.bulkPermanentDeleteCustomers(ids)
      await dispatch('fetchDeletedCustomers')
      return res
    },

    async sendCustomerEmail({ commit }, payload) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const res = await customerService.sendCustomerEmail(payload)
        commit('SET_LAST_DISPATCH', {
          timestamp: new Date().toISOString(),
          ...payload,
          result: res
        })
        return res
      } catch (err) {
        commit('SET_ERROR', err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}
