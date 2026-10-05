import { initialDesigns } from '@/data/designs'
import { apiRequest } from './apiClient'

const STORAGE_KEY = 'framevue_designs_v1'
const DELETED_STORAGE_KEY = 'framevue_deleted_designs_v1'

function loadDesignsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed to parse designs from localStorage:', err)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDesigns))
  return [...initialDesigns]
}

function saveDesignsToStorage(designs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
  } catch (err) {
    console.warn('Failed to save designs to localStorage:', err)
  }
}

function loadDeletedDesignsFromStorage() {
  try {
    const raw = localStorage.getItem(DELETED_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('Failed to parse deleted designs from localStorage:', err)
  }
  return []
}

function saveDeletedDesignsToStorage(designs) {
  try {
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(designs))
  } catch (err) {
    console.warn('Failed to save deleted designs to localStorage:', err)
  }
}

export const designService = {
  /**
   * GET /api/designs
   */
  async getDesigns(params = {}) {
    try {
      const queryStr = new URLSearchParams(params).toString()
      const res = await apiRequest(`/designs${queryStr ? '?' + queryStr : ''}`)
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        saveDesignsToStorage(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('API call to /api/designs failed, using local storage cache:', err.message)
    }
    return loadDesignsFromStorage()
  },

  /**
   * GET /api/designs/:id
   */
  async getDesignById(id) {
    try {
      const res = await apiRequest(`/designs/${id}`)
      if (res && res.success && res.data) {
        return res.data
      }
    } catch (err) {
      console.warn(`API call to /api/designs/${id} failed, using local cache:`, err.message)
    }
    const designs = loadDesignsFromStorage()
    return designs.find(d => String(d.id) === String(id)) || null
  },

  /**
   * POST /api/designs
   */
  async createDesign(designData) {
    try {
      const res = await apiRequest('/designs', {
        method: 'POST',
        body: designData
      })
      if (res && res.success && res.data) {
        const designs = loadDesignsFromStorage()
        saveDesignsToStorage([res.data, ...designs])
        return res.data
      }
    } catch (err) {
      console.warn('API createDesign failed, saving locally:', err.message)
    }

    const designs = loadDesignsFromStorage()
    const newDesign = {
      id: Date.now(),
      name: designData.name,
      category: designData.category || 'Romantic',
      description: designData.description || '',
      image: designData.image || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
      matColor: designData.matColor || '#FDFBF7',
      accentColor: designData.accentColor || '#B07B38',
      badgeText: designData.badgeText || '✦',
      status: designData.status || 'active'
    }
    const updated = [newDesign, ...designs]
    saveDesignsToStorage(updated)
    return newDesign
  },

  /**
   * PUT /api/designs/:id
   */
  async updateDesign(id, designData) {
    try {
      const res = await apiRequest(`/designs/${id}`, {
        method: 'PUT',
        body: designData
      })
      if (res && res.success && res.data) {
        const designs = loadDesignsFromStorage()
        const idx = designs.findIndex(d => String(d.id) === String(id))
        if (idx !== -1) {
          designs.splice(idx, 1, res.data)
          saveDesignsToStorage(designs)
        }
        return res.data
      }
    } catch (err) {
      console.warn(`API updateDesign ${id} failed, updating locally:`, err.message)
    }

    const designs = loadDesignsFromStorage()
    const idx = designs.findIndex(d => String(d.id) === String(id))
    if (idx === -1) throw new Error('Design not found')
    const updatedDesign = {
      ...designs[idx],
      ...designData,
      id: designs[idx].id
    }
    designs.splice(idx, 1, updatedDesign)
    saveDesignsToStorage(designs)
    return updatedDesign
  },

  /**
   * GET /api/designs/deleted
   */
  async getDeletedDesigns() {
    try {
      const res = await apiRequest('/designs/deleted')
      if (res && res.success && Array.isArray(res.data)) {
        saveDeletedDesignsToStorage(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('API call to /api/designs/deleted failed, using local cache:', err.message)
    }
    return loadDeletedDesignsFromStorage()
  },

  /**
   * DELETE /api/designs/:id (Soft delete - move to trash)
   */
  async deleteDesign(id) {
    let deletedItem = null
    try {
      const res = await apiRequest(`/designs/${id}`, { method: 'DELETE' })
      if (res && res.success && res.data) {
        deletedItem = res.data
      }
    } catch (err) {
      console.warn(`API deleteDesign ${id} failed, deleting locally:`, err.message)
    }

    const designs = loadDesignsFromStorage()
    const target = designs.find(d => String(d.id) === String(id))
    const filtered = designs.filter(d => String(d.id) !== String(id))
    saveDesignsToStorage(filtered)

    const itemToStore = deletedItem || {
      ...(target || {}),
      id,
      isDeleted: true,
      deletedAt: new Date().toISOString()
    }
    const deleted = loadDeletedDesignsFromStorage()
    saveDeletedDesignsToStorage([itemToStore, ...deleted.filter(d => String(d.id) !== String(id))])

    return itemToStore
  },

  /**
   * PATCH /api/designs/:id/restore
   */
  async restoreDesign(id) {
    let restored = null
    try {
      const res = await apiRequest(`/designs/${id}/restore`, { method: 'PATCH' })
      if (res && res.success && res.data) {
        restored = res.data
      }
    } catch (err) {
      console.warn(`API restoreDesign ${id} failed, restoring locally:`, err.message)
    }

    const deleted = loadDeletedDesignsFromStorage()
    const target = deleted.find(d => String(d.id) === String(id))
    saveDeletedDesignsToStorage(deleted.filter(f => String(f.id) !== String(id)))

    const itemToRestore = restored || {
      ...(target || {}),
      id,
      isDeleted: false,
      deletedAt: null
    }
    const designs = loadDesignsFromStorage()
    saveDesignsToStorage([itemToRestore, ...designs.filter(d => String(d.id) !== String(id))])

    return itemToRestore
  },

  /**
   * DELETE /api/designs/:id/permanent
   */
  async permanentDeleteDesign(id) {
    try {
      await apiRequest(`/designs/${id}/permanent`, { method: 'DELETE' })
    } catch (err) {
      console.warn(`API permanentDeleteDesign ${id} failed:`, err.message)
    }
    const deleted = loadDeletedDesignsFromStorage()
    saveDeletedDesignsToStorage(deleted.filter(d => String(d.id) !== String(id)))
    return id
  },

  /**
   * POST /api/designs/bulk-delete
   */
  async bulkDeleteDesigns(ids) {
    try {
      await apiRequest('/designs/bulk-delete', {
        method: 'POST',
        body: { ids }
      })
    } catch (err) {
      console.warn('API bulkDeleteDesigns failed:', err.message)
    }
    const designs = loadDesignsFromStorage()
    const strIds = ids.map(String)
    const moving = designs.filter(d => strIds.includes(String(d.id)))
    const remaining = designs.filter(d => !strIds.includes(String(d.id)))
    saveDesignsToStorage(remaining)

    const deleted = loadDeletedDesignsFromStorage()
    const marked = moving.map(d => ({ ...d, isDeleted: true, deletedAt: new Date().toISOString() }))
    saveDeletedDesignsToStorage([...marked, ...deleted])
    return ids
  },

  /**
   * POST /api/designs/bulk-restore
   */
  async bulkRestoreDesigns(ids) {
    try {
      await apiRequest('/designs/bulk-restore', {
        method: 'POST',
        body: { ids }
      })
    } catch (err) {
      console.warn('API bulkRestoreDesigns failed:', err.message)
    }
    const deleted = loadDeletedDesignsFromStorage()
    const strIds = ids.map(String)
    const restoring = deleted.filter(d => strIds.includes(String(d.id)))
    const remainingDeleted = deleted.filter(d => !strIds.includes(String(d.id)))
    saveDeletedDesignsToStorage(remainingDeleted)

    const designs = loadDesignsFromStorage()
    const unMarked = restoring.map(d => ({ ...d, isDeleted: false, deletedAt: null }))
    saveDesignsToStorage([...unMarked, ...designs])
    return ids
  },

  /**
   * POST /api/designs/bulk-permanent-delete
   */
  async bulkPermanentDeleteDesigns(ids) {
    try {
      await apiRequest('/designs/bulk-permanent-delete', {
        method: 'POST',
        body: { ids }
      })
    } catch (err) {
      console.warn('API bulkPermanentDeleteDesigns failed:', err.message)
    }
    const deleted = loadDeletedDesignsFromStorage()
    const strIds = ids.map(String)
    saveDeletedDesignsToStorage(deleted.filter(d => !strIds.includes(String(d.id))))
    return ids
  }
}
