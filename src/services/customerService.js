import { apiRequest } from './apiClient'

export const customerService = {
  /**
   * Fetch unique active customers from database
   */
  async fetchCustomers() {
    try {
      const res = await apiRequest('/customers')
      if (res && res.data) {
        return res.data
      }
      return []
    } catch (err) {
      console.warn('⚠️ [CUSTOMER:SERVICE] Failed to fetch customers from API:', err.message)
      return []
    }
  },

  /**
   * Fetch recently deleted customers
   */
  async fetchDeletedCustomers() {
    try {
      const res = await apiRequest('/customers/deleted')
      if (res && res.data) {
        return res.data
      }
      return []
    } catch (err) {
      console.warn('⚠️ [CUSTOMER:SERVICE] Failed to fetch deleted customers from API:', err.message)
      return []
    }
  },

  /**
   * Soft delete single customer (Move to trash)
   */
  async deleteCustomer(id) {
    return await apiRequest(`/customers/${id}`, { method: 'DELETE' })
  },

  /**
   * Restore single customer
   */
  async restoreCustomer(id) {
    return await apiRequest(`/customers/${id}/restore`, { method: 'PATCH' })
  },

  /**
   * Permanently delete single customer
   */
  async permanentDeleteCustomer(id) {
    return await apiRequest(`/customers/${id}/permanent`, { method: 'DELETE' })
  },

  /**
   * Bulk soft-delete customers
   */
  async bulkDeleteCustomers(ids) {
    return await apiRequest('/customers/bulk-delete', {
      method: 'POST',
      body: { ids }
    })
  },

  /**
   * Bulk restore customers
   */
  async bulkRestoreCustomers(ids) {
    return await apiRequest('/customers/bulk-restore', {
      method: 'POST',
      body: { ids }
    })
  },

  /**
   * Bulk permanently delete customers
   */
  async bulkPermanentDeleteCustomers(ids) {
    return await apiRequest('/customers/bulk-permanent-delete', {
      method: 'POST',
      body: { ids }
    })
  },

  /**
   * Send single customer offer email or broadcast to all customers
   */
  async sendCustomerEmail(payload) {
    console.log('📤 [CUSTOMER:SERVICE] Sending email request:', payload)
    const res = await apiRequest('/customers/send-email', {
      method: 'POST',
      body: payload
    })
    return res
  }
}
