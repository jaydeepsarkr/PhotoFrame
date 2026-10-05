import { frameService } from '@/services/frameService'
import { initialFrames } from '@/data/frames'

const STORAGE_KEY = 'framevue_frames_v1'

function getInitialFrames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    // fallback
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFrames))
  return [...initialFrames]
}

export default {
  namespaced: true,
  state: () => ({
    frames: getInitialFrames(),
    deletedFrames: [],
    loading: false
  }),
  getters: {
    allFrames: (state) => state.frames,
    activeFrames: (state) => state.frames.filter(f => f.status !== 'inactive' && !f.isDeleted),
    featuredFrames: (state, getters) => {
      const popular = getters.activeFrames.filter(f => f.popular)
      return popular.length >= 4 ? popular.slice(0, 6) : getters.activeFrames.slice(0, 6)
    },
    getFrameById: (state) => (id) => {
      return state.frames.find(f => String(f.id) === String(id)) || state.frames[0] || null
    },
    deletedFrames: (state) => state.deletedFrames,
    deletedFramesCount: (state) => state.deletedFrames.length
  },
  mutations: {
    SET_FRAMES(state, frames) {
      state.frames = frames
    },
    SET_DELETED_FRAMES(state, frames) {
      state.deletedFrames = frames
    },
    ADD_FRAME(state, frame) {
      state.frames.unshift(frame)
    },
    UPDATE_FRAME(state, updatedFrame) {
      const idx = state.frames.findIndex(f => String(f.id) === String(updatedFrame.id))
      if (idx !== -1) {
        state.frames.splice(idx, 1, updatedFrame)
      }
    },
    DELETE_FRAME(state, deletedFrameOrId) {
      const id = typeof deletedFrameOrId === 'object' && deletedFrameOrId ? deletedFrameOrId.id : deletedFrameOrId
      const target = state.frames.find(f => String(f.id) === String(id))
      state.frames = state.frames.filter(f => String(f.id) !== String(id))
      if (target || (typeof deletedFrameOrId === 'object' && deletedFrameOrId)) {
        const item = typeof deletedFrameOrId === 'object' && deletedFrameOrId
          ? deletedFrameOrId
          : { ...target, isDeleted: true, deletedAt: new Date().toISOString() }
        if (!state.deletedFrames.some(f => String(f.id) === String(id))) {
          state.deletedFrames.unshift(item)
        }
      }
    },
    RESTORE_FRAME(state, restoredFrameOrId) {
      const id = typeof restoredFrameOrId === 'object' && restoredFrameOrId ? restoredFrameOrId.id : restoredFrameOrId
      const target = state.deletedFrames.find(f => String(f.id) === String(id))
      state.deletedFrames = state.deletedFrames.filter(f => String(f.id) !== String(id))
      if (target || (typeof restoredFrameOrId === 'object' && restoredFrameOrId)) {
        const item = typeof restoredFrameOrId === 'object' && restoredFrameOrId
          ? restoredFrameOrId
          : { ...target, isDeleted: false, deletedAt: null }
        if (!state.frames.some(f => String(f.id) === String(id))) {
          state.frames.unshift(item)
        }
      }
    },
    PERMANENT_DELETE_FRAME(state, id) {
      state.deletedFrames = state.deletedFrames.filter(f => String(f.id) !== String(id))
    },
    BULK_DELETE_FRAMES(state, ids) {
      const strIds = ids.map(String)
      const moving = state.frames.filter(f => strIds.includes(String(f.id)))
      state.frames = state.frames.filter(f => !strIds.includes(String(f.id)))
      const marked = moving.map(f => ({ ...f, isDeleted: true, deletedAt: new Date().toISOString() }))
      state.deletedFrames = [...marked, ...state.deletedFrames.filter(f => !strIds.includes(String(f.id)))]
    },
    BULK_RESTORE_FRAMES(state, ids) {
      const strIds = ids.map(String)
      const restoring = state.deletedFrames.filter(f => strIds.includes(String(f.id)))
      state.deletedFrames = state.deletedFrames.filter(f => !strIds.includes(String(f.id)))
      const unMarked = restoring.map(f => ({ ...f, isDeleted: false, deletedAt: null }))
      state.frames = [...unMarked, ...state.frames.filter(f => !strIds.includes(String(f.id)))]
    },
    BULK_PERMANENT_DELETE_FRAMES(state, ids) {
      const strIds = ids.map(String)
      state.deletedFrames = state.deletedFrames.filter(f => !strIds.includes(String(f.id)))
    }
  },
  actions: {
    async fetchFrames({ commit }) {
      const frames = await frameService.getFrames()
      commit('SET_FRAMES', frames)
      return frames
    },
    async fetchDeletedFrames({ commit }) {
      const frames = await frameService.getDeletedFrames()
      commit('SET_DELETED_FRAMES', frames)
      return frames
    },
    async addFrame({ commit }, frameData) {
      const created = await frameService.createFrame(frameData)
      commit('ADD_FRAME', created)
      return created
    },
    async updateFrame({ commit }, { id, data }) {
      const updated = await frameService.updateFrame(id, data)
      commit('UPDATE_FRAME', updated)
      return updated
    },
    async deleteFrame({ commit }, id) {
      const result = await frameService.deleteFrame(id)
      commit('DELETE_FRAME', result || id)
      return result
    },
    async restoreFrame({ commit }, id) {
      const result = await frameService.restoreFrame(id)
      commit('RESTORE_FRAME', result || id)
      return result
    },
    async permanentDeleteFrame({ commit }, id) {
      await frameService.permanentDeleteFrame(id)
      commit('PERMANENT_DELETE_FRAME', id)
      return id
    },
    async bulkDeleteFrames({ commit }, ids) {
      await frameService.bulkDeleteFrames(ids)
      commit('BULK_DELETE_FRAMES', ids)
      return ids
    },
    async bulkRestoreFrames({ commit }, ids) {
      await frameService.bulkRestoreFrames(ids)
      commit('BULK_RESTORE_FRAMES', ids)
      return ids
    },
    async bulkPermanentDeleteFrames({ commit }, ids) {
      await frameService.bulkPermanentDeleteFrames(ids)
      commit('BULK_PERMANENT_DELETE_FRAMES', ids)
      return ids
    }
  }
}
