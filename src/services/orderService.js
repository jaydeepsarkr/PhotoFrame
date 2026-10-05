import { initialOrders } from '@/data/orders'
import { apiRequest } from './apiClient'

const STORAGE_KEY = 'framevue_orders_v1'

function loadOrdersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed to parse orders from localStorage:', err)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders))
  return [...initialOrders]
}

function saveOrdersToStorage(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (err) {
    console.warn('Failed to save orders to localStorage:', err)
  }
}

export function generateOrderId(existingCount = 1) {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const seq = String(existingCount).padStart(3, '0')
  return `PF-${yyyy}${mm}${dd}-${seq}`
}

export const orderService = {
  /**
   * GET /api/orders
   */
  async getOrders(params = {}) {
    try {
      const queryStr = new URLSearchParams(params).toString()
      const res = await apiRequest(`/orders${queryStr ? '?' + queryStr : ''}`)
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        saveOrdersToStorage(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('API call to /api/orders failed, using local storage cache:', err.message)
    }
    return loadOrdersFromStorage()
  },

  /**
   * GET /api/orders/:id
   */
  async getOrderById(id) {
    try {
      const res = await apiRequest(`/orders/${id}`)
      if (res && res.success && res.data) {
        return res.data
      }
    } catch (err) {
      console.warn(`API call to /api/orders/${id} failed, using local storage cache:`, err.message)
    }
    const orders = loadOrdersFromStorage()
    return orders.find(o => String(o.id) === String(id)) || null
  },

  /**
   * POST /api/orders
   */
  async createOrder(orderPayload) {
    try {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: orderPayload
      })
      if (res && res.success && res.data) {
        const orders = loadOrdersFromStorage()
        saveOrdersToStorage([res.data, ...orders])
        return res.data
      }
    } catch (err) {
      console.warn('API createOrder failed, saving locally:', err.message)
    }

    const orders = loadOrdersFromStorage()
    const id = orderPayload.id || generateOrderId(orders.length + 1)
    const today = new Date().toISOString().split('T')[0]
    const newOrder = {
      id,
      date: today,
      status: 'New',
      displayStatus: 'Order Received',
      customer: orderPayload.customer,
      product: orderPayload.product,
      items: orderPayload.items || [orderPayload.product],
      customization: orderPayload.customization,
      pricing: orderPayload.pricing
    }
    const updated = [newOrder, ...orders]
    saveOrdersToStorage(updated)
    return newOrder
  },

  /**
   * PATCH /api/orders/:id/status
   */
  async updateOrderStatus(id, status) {
    try {
      const res = await apiRequest(`/orders/${id}/status`, {
        method: 'PATCH',
        body: { status }
      })
      if (res && res.success && res.data) {
        const orders = loadOrdersFromStorage()
        const idx = orders.findIndex(o => String(o.id) === String(id))
        if (idx !== -1) {
          orders.splice(idx, 1, res.data)
          saveOrdersToStorage(orders)
        }
        return res.data
      }
    } catch (err) {
      console.warn(`API updateOrderStatus ${id} failed, updating locally:`, err.message)
    }

    const orders = loadOrdersFromStorage()
    const idx = orders.findIndex(o => String(o.id) === String(id))
    if (idx === -1) throw new Error('Order not found')
    const updatedOrder = {
      ...orders[idx],
      status
    }
    orders.splice(idx, 1, updatedOrder)
    saveOrdersToStorage(orders)
    return updatedOrder
  },

  /**
   * GET /api/orders/deleted
   */
  async getDeletedOrders() {
    try {
      const res = await apiRequest('/orders/deleted')
      if (res && res.success && Array.isArray(res.data)) {
        return res.data
      }
    } catch (err) {
      console.warn('API call to /api/orders/deleted failed:', err.message)
    }
    return []
  },

  /**
   * DELETE /api/orders/:id (Move to trash)
   */
  async deleteOrder(id) {
    const res = await apiRequest(`/orders/${id}`, { method: 'DELETE' })
    return res
  },

  /**
   * PATCH /api/orders/:id/restore
   */
  async restoreOrder(id) {
    const res = await apiRequest(`/orders/${id}/restore`, { method: 'PATCH' })
    return res
  },

  /**
   * DELETE /api/orders/:id/permanent
   */
  async permanentDeleteOrder(id) {
    const res = await apiRequest(`/orders/${id}/permanent`, { method: 'DELETE' })
    return res
  },

  /**
   * POST /api/orders/bulk-delete
   */
  async bulkDeleteOrders(ids) {
    const res = await apiRequest('/orders/bulk-delete', {
      method: 'POST',
      body: { ids }
    })
    return res
  },

  /**
   * POST /api/orders/bulk-restore
   */
  async bulkRestoreOrders(ids) {
    const res = await apiRequest('/orders/bulk-restore', {
      method: 'POST',
      body: { ids }
    })
    return res
  },

  /**
   * POST /api/orders/bulk-permanent-delete
   */
  async bulkPermanentDeleteOrders(ids) {
    const res = await apiRequest('/orders/bulk-permanent-delete', {
      method: 'POST',
      body: { ids }
    })
    return res
  }
}
