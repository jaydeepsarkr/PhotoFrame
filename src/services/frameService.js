import { initialFrames } from '@/data/frames'
import { apiRequest } from './apiClient'

const STORAGE_KEY = 'framevue_frames_v1'
const DELETED_STORAGE_KEY = 'framevue_deleted_frames_v1'

function loadFramesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed to parse frames from localStorage:', err)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFrames))
  return [...initialFrames]
}

function saveFramesToStorage(frames) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(frames))
  } catch (err) {
    console.warn('Failed to save frames to localStorage:', err)
  }
}

function loadDeletedFramesFromStorage() {
  try {
    const raw = localStorage.getItem(DELETED_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('Failed to parse deleted frames from localStorage:', err)
  }
  return []
}

function saveDeletedFramesToStorage(frames) {
  try {
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(frames))
  } catch (err) {
    console.warn('Failed to save deleted frames to localStorage:', err)
  }
}

export const frameService = {
  /**
   * GET /api/frames
   */
  async getFrames(params = {}) {
    try {
      const queryStr = new URLSearchParams(params).toString()
      const res = await apiRequest(`/frames${queryStr ? '?' + queryStr : ''}`)
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        saveFramesToStorage(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('API call to /api/frames failed, using local storage cache:', err.message)
    }
    return loadFramesFromStorage()
  },

  /**
   * GET /api/frames/:id
   */
  async getFrameById(id) {
    try {
      const res = await apiRequest(`/frames/${id}`)
      if (res && res.success && res.data) {
        return res.data
      }
    } catch (err) {
      console.warn(`API call to /api/frames/${id} failed, using local storage cache:`, err.message)
    }
    const frames = loadFramesFromStorage()
    return frames.find(f => String(f.id) === String(id)) || null
  },

  /**
   * POST /api/frames
   */
  async createFrame(frameData) {
    try {
      const res = await apiRequest('/frames', {
        method: 'POST',
        body: frameData
      })
      if (res && res.success && res.data) {
        const frames = loadFramesFromStorage()
        saveFramesToStorage([res.data, ...frames])
        return res.data
      }
    } catch (err) {
      console.warn('API createFrame failed, saving locally:', err.message)
    }

    // Local fallback
    const frames = loadFramesFromStorage()
    const newFrame = {
      id: Date.now(),
      name: frameData.name,
      description: frameData.description || '',
      material: frameData.material || 'Wood',
      style: frameData.style || 'Classic',
      price: Number(frameData.price) || 799,
      discountPrice: frameData.discountPrice ? Number(frameData.discountPrice) : null,
      sizes: Array.isArray(frameData.sizes) && frameData.sizes.length ? frameData.sizes : ['8x10', '12x18'],
      image: frameData.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      borderTexture: frameData.borderTexture || 'frame-texture-wood',
      borderColor: frameData.borderColor || '#4A2E1B',
      popular: Boolean(frameData.popular),
      isNew: true,
      status: frameData.status || 'active'
    }
    const updated = [newFrame, ...frames]
    saveFramesToStorage(updated)
    return newFrame
  },

  /**
   * PUT /api/frames/:id
   */
  async updateFrame(id, frameData) {
    try {
      const res = await apiRequest(`/frames/${id}`, {
        method: 'PUT',
        body: frameData
      })
      if (res && res.success && res.data) {
        const frames = loadFramesFromStorage()
        const idx = frames.findIndex(f => String(f.id) === String(id))
        if (idx !== -1) {
          frames.splice(idx, 1, res.data)
          saveFramesToStorage(frames)
        }
        return res.data
      }
    } catch (err) {
      console.warn(`API updateFrame ${id} failed, updating locally:`, err.message)
    }

    const frames = loadFramesFromStorage()
    const idx = frames.findIndex(f => String(f.id) === String(id))
    if (idx === -1) throw new Error('Frame not found')
    const updatedFrame = {
      ...frames[idx],
      ...frameData,
      id: frames[idx].id,
      price: Number(frameData.price ?? frames[idx].price),
      discountPrice: frameData.discountPrice ? Number(frameData.discountPrice) : null
    }
    frames.splice(idx, 1, updatedFrame)
    saveFramesToStorage(frames)
    return updatedFrame
  },

  /**
   * GET /api/frames/deleted
   */
  async getDeletedFrames() {
    try {
      const res = await apiRequest('/frames/deleted')
      if (res && res.success && Array.isArray(res.data)) {
        saveDeletedFramesToStorage(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('API call to /api/frames/deleted failed, using local cache:', err.message)
    }
    return loadDeletedFramesFromStorage()
  },

  /**
   * DELETE /api/frames/:id (Soft delete - move to trash)
   */
  async deleteFrame(id) {
    let deletedItem = null
    try {
      const res = await apiRequest(`/frames/${id}`, { method: 'DELETE' })
      if (res && res.success && res.data) {
        deletedItem = res.data
      }
    } catch (err) {
      console.warn(`API deleteFrame ${id} failed, deleting locally:`, err.message)
    }

    const frames = loadFramesFromStorage()
    const target = frames.find(f => String(f.id) === String(id))
    const filtered = frames.filter(f => String(f.id) !== String(id))
    saveFramesToStorage(filtered)

    const itemToStore = deletedItem || {
      ...(target || {}),
      id,
      isDeleted: true,
      deletedAt: new Date().toISOString()
    }
    const deleted = loadDeletedFramesFromStorage()
    saveDeletedFramesToStorage([itemToStore, ...deleted.filter(f => String(f.id) !== String(id))])

    return itemToStore
  },

  /**
   * PATCH /api/frames/:id/restore
   */
  async restoreFrame(id) {
    let restored = null
    try {
      const res = await apiRequest(`/frames/${id}/restore`, { method: 'PATCH' })
      if (res && res.success && res.data) {
        restored = res.data
      }
    } catch (err) {
      console.warn(`API restoreFrame ${id} failed, restoring locally:`, err.message)
    }

    const deleted = loadDeletedFramesFromStorage()
    const target = deleted.find(f => String(f.id) === String(id))
    saveDeletedFramesToStorage(deleted.filter(f => String(f.id) !== String(id)))

    const itemToRestore = restored || {
      ...(target || {}),
      id,
      isDeleted: false,
      deletedAt: null
    }
    const frames = loadFramesFromStorage()
    saveFramesToStorage([itemToRestore, ...frames.filter(f => String(f.id) !== String(id))])

    return itemToRestore
  },

  /**
   * DELETE /api/frames/:id/permanent
   */
  async permanentDeleteFrame(id) {
    try {
      await apiRequest(`/frames/${id}/permanent`, { method: 'DELETE' })
    } catch (err) {
      console.warn(`API permanentDeleteFrame ${id} failed:`, err.message)
    }
    const deleted = loadDeletedFramesFromStorage()
    saveDeletedFramesToStorage(deleted.filter(f => String(f.id) !== String(id)))
    return id
  },

  /**
   * POST /api/frames/bulk-delete
   */
  async bulkDeleteFrames(ids) {
    try {
      await apiRequest('/frames/bulk-delete', {
        method: 'POST',
        body: { ids }
      })
    } catch (err) {
      console.warn('API bulkDeleteFrames failed:', err.message)
    }
    const frames = loadFramesFromStorage()
    const strIds = ids.map(String)
    const moving = frames.filter(f => strIds.includes(String(f.id)))
    const remaining = frames.filter(f => !strIds.includes(String(f.id)))
    saveFramesToStorage(remaining)

    const deleted = loadDeletedFramesFromStorage()
    const marked = moving.map(f => ({ ...f, isDeleted: true, deletedAt: new Date().toISOString() }))
    saveDeletedFramesToStorage([...marked, ...deleted])
    return ids
  },

  /**
   * POST /api/frames/bulk-restore
   */
  async bulkRestoreFrames(ids) {
    try {
      await apiRequest('/frames/bulk-restore', {
        method: 'POST',
        body: { ids }
      })
    } catch (err) {
      console.warn('API bulkRestoreFrames failed:', err.message)
    }
    const deleted = loadDeletedFramesFromStorage()
    const strIds = ids.map(String)
    const restoring = deleted.filter(f => strIds.includes(String(f.id)))
    const remainingDeleted = deleted.filter(f => !strIds.includes(String(f.id)))
    saveDeletedFramesToStorage(remainingDeleted)

    const frames = loadFramesFromStorage()
    const unMarked = restoring.map(f => ({ ...f, isDeleted: false, deletedAt: null }))
    saveFramesToStorage([...unMarked, ...frames])
    return ids
  },

  /**
   * POST /api/frames/bulk-permanent-delete
   */
  async bulkPermanentDeleteFrames(ids) {
    try {
      await apiRequest('/frames/bulk-permanent-delete', {
        method: 'POST',
        body: { ids }
      })
    } catch (err) {
      console.warn('API bulkPermanentDeleteFrames failed:', err.message)
    }
    const deleted = loadDeletedFramesFromStorage()
    const strIds = ids.map(String)
    saveDeletedFramesToStorage(deleted.filter(f => !strIds.includes(String(f.id))))
    return ids
  }
}
