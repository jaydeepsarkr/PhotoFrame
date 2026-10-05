import { orderService } from '@/services/orderService'
import { initialOrders } from '@/data/orders'

const STORAGE_KEY = 'framevue_orders_v1'

function getInitialOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    // fallback
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders))
  return [...initialOrders]
}

export const ORDER_STATUSES = [
  'New',
  'Confirmed',
  'Processing',
  'Ready',
  'Shipped',
  'Delivered',
  'Cancelled'
]

export default {
  namespaced: true,
  state: () => ({
    orders: getInitialOrders(),
    deletedOrders: [],
    lastPlacedOrder: null
  }),
  getters: {
    allOrders: (state) => state.orders,
    deletedOrders: (state) => state.deletedOrders,
    deletedOrdersCount: (state) => state.deletedOrders.length,
    lastPlacedOrder: (state) => state.lastPlacedOrder,
    getOrderById: (state) => (id) => {
      return state.orders.find(o => String(o.id) === String(id)) || null
    },
    orderStats: (state) => {
      const total = state.orders.length
      const pending = state.orders.filter(o => ['New', 'Confirmed'].includes(o.status)).length
      const processing = state.orders.filter(o => ['Processing', 'Ready', 'Shipped'].includes(o.status)).length
      const completed = state.orders.filter(o => o.status === 'Delivered').length
      const cancelled = state.orders.filter(o => o.status === 'Cancelled').length
      const revenue = state.orders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (Number(o.pricing?.total) || 0), 0)

      return {
        total,
        pending,
        processing,
        completed,
        cancelled,
        revenue
      }
    }
  },
  mutations: {
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    SET_DELETED_ORDERS(state, deleted) {
      state.deletedOrders = deleted
    },
    ADD_ORDER(state, order) {
      state.orders.unshift(order)
      state.lastPlacedOrder = order
    },
    UPDATE_ORDER_STATUS(state, { id, status }) {
      const idx = state.orders.findIndex(o => String(o.id) === String(id))
      if (idx !== -1) {
        state.orders.splice(idx, 1, {
          ...state.orders[idx],
          status
        })
      }
    }
  },
  actions: {
    async fetchOrders({ commit }) {
      const orders = await orderService.getOrders()
      commit('SET_ORDERS', orders)
      return orders
    },
    async fetchDeletedOrders({ commit }) {
      const deleted = await orderService.getDeletedOrders()
      commit('SET_DELETED_ORDERS', deleted)
      return deleted
    },
    async createOrder({ commit }, orderPayload) {
      const created = await orderService.createOrder(orderPayload)
      commit('ADD_ORDER', created)
      return created
    },
    async updateOrderStatus({ commit }, { id, status }) {
      const updated = await orderService.updateOrderStatus(id, status)
      commit('UPDATE_ORDER_STATUS', { id, status: updated.status })
      return updated
    },
    async deleteOrder({ dispatch }, id) {
      const res = await orderService.deleteOrder(id)
      await dispatch('fetchOrders')
      await dispatch('fetchDeletedOrders')
      return res
    },
    async restoreOrder({ dispatch }, id) {
      const res = await orderService.restoreOrder(id)
      await dispatch('fetchOrders')
      await dispatch('fetchDeletedOrders')
      return res
    },
    async permanentDeleteOrder({ dispatch }, id) {
      const res = await orderService.permanentDeleteOrder(id)
      await dispatch('fetchDeletedOrders')
      return res
    },
    async bulkDeleteOrders({ dispatch }, ids) {
      const res = await orderService.bulkDeleteOrders(ids)
      await dispatch('fetchOrders')
      await dispatch('fetchDeletedOrders')
      return res
    },
    async bulkRestoreOrders({ dispatch }, ids) {
      const res = await orderService.bulkRestoreOrders(ids)
      await dispatch('fetchOrders')
      await dispatch('fetchDeletedOrders')
      return res
    },
    async bulkPermanentDeleteOrders({ dispatch }, ids) {
      const res = await orderService.bulkPermanentDeleteOrders(ids)
      await dispatch('fetchDeletedOrders')
      return res
    }
  }
}
