import { designService } from '@/services/designService'
import { initialDesigns, DESIGN_CATEGORIES } from '@/data/designs'

const STORAGE_KEY = 'framevue_designs_v1'

function getInitialDesigns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    // fallback
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDesigns))
  return [...initialDesigns]
}

export default {
  namespaced: true,
  state: () => ({
    designs: getInitialDesigns(),
    deletedDesigns: [],
    categories: DESIGN_CATEGORIES
  }),
  getters: {
    allDesigns: (state) => state.designs,
    activeDesigns: (state) => state.designs.filter(d => d.status !== 'inactive' && !d.isDeleted),
    popularDesigns: (state, getters) => getters.activeDesigns.slice(0, 8),
    categories: (state) => state.categories,
    getDesignById: (state) => (id) => {
      return state.designs.find(d => String(d.id) === String(id)) || state.designs[0] || null
    },
    getDesignsByCategory: (state, getters) => (category) => {
      if (!category || category === 'All') return getters.activeDesigns
      return getters.activeDesigns.filter(
        d => d.category.toLowerCase() === category.toLowerCase()
      )
    },
    deletedDesigns: (state) => state.deletedDesigns,
    deletedDesignsCount: (state) => state.deletedDesigns.length
  },
  mutations: {
    SET_DESIGNS(state, designs) {
      state.designs = designs
    },
    SET_DELETED_DESIGNS(state, designs) {
      state.deletedDesigns = designs
    },
    ADD_DESIGN(state, design) {
      state.designs.unshift(design)
    },
    UPDATE_DESIGN(state, updatedDesign) {
      const idx = state.designs.findIndex(d => String(d.id) === String(updatedDesign.id))
      if (idx !== -1) {
        state.designs.splice(idx, 1, updatedDesign)
      }
    },
    DELETE_DESIGN(state, deletedDesignOrId) {
      const id = typeof deletedDesignOrId === 'object' && deletedDesignOrId ? deletedDesignOrId.id : deletedDesignOrId
      const target = state.designs.find(d => String(d.id) === String(id))
      state.designs = state.designs.filter(d => String(d.id) !== String(id))
      if (target || (typeof deletedDesignOrId === 'object' && deletedDesignOrId)) {
        const item = typeof deletedDesignOrId === 'object' && deletedDesignOrId
          ? deletedDesignOrId
          : { ...target, isDeleted: true, deletedAt: new Date().toISOString() }
        if (!state.deletedDesigns.some(d => String(d.id) === String(id))) {
          state.deletedDesigns.unshift(item)
        }
      }
    },
    RESTORE_DESIGN(state, restoredDesignOrId) {
      const id = typeof restoredDesignOrId === 'object' && restoredDesignOrId ? restoredDesignOrId.id : restoredDesignOrId
      const target = state.deletedDesigns.find(d => String(d.id) === String(id))
      state.deletedDesigns = state.deletedDesigns.filter(d => String(d.id) !== String(id))
      if (target || (typeof restoredDesignOrId === 'object' && restoredDesignOrId)) {
        const item = typeof restoredDesignOrId === 'object' && restoredDesignOrId
          ? restoredDesignOrId
          : { ...target, isDeleted: false, deletedAt: null }
        if (!state.designs.some(d => String(d.id) === String(id))) {
          state.designs.unshift(item)
        }
      }
    },
    PERMANENT_DELETE_DESIGN(state, id) {
      state.deletedDesigns = state.deletedDesigns.filter(d => String(d.id) !== String(id))
    },
    BULK_DELETE_DESIGNS(state, ids) {
      const strIds = ids.map(String)
      const moving = state.designs.filter(d => strIds.includes(String(d.id)))
      state.designs = state.designs.filter(d => !strIds.includes(String(d.id)))
      const marked = moving.map(d => ({ ...d, isDeleted: true, deletedAt: new Date().toISOString() }))
      state.deletedDesigns = [...marked, ...state.deletedDesigns.filter(d => !strIds.includes(String(d.id)))]
    },
    BULK_RESTORE_DESIGNS(state, ids) {
      const strIds = ids.map(String)
      const restoring = state.deletedDesigns.filter(d => strIds.includes(String(d.id)))
      state.deletedDesigns = state.deletedDesigns.filter(d => !strIds.includes(String(d.id)))
      const unMarked = restoring.map(d => ({ ...d, isDeleted: false, deletedAt: null }))
      state.designs = [...unMarked, ...state.designs.filter(d => !strIds.includes(String(d.id)))]
    },
    BULK_PERMANENT_DELETE_DESIGNS(state, ids) {
      const strIds = ids.map(String)
      state.deletedDesigns = state.deletedDesigns.filter(d => !strIds.includes(String(d.id)))
    }
  },
  actions: {
    async fetchDesigns({ commit }) {
      const designs = await designService.getDesigns()
      commit('SET_DESIGNS', designs)
      return designs
    },
    async fetchDeletedDesigns({ commit }) {
      const designs = await designService.getDeletedDesigns()
      commit('SET_DELETED_DESIGNS', designs)
      return designs
    },
    async addDesign({ commit }, designData) {
      const created = await designService.createDesign(designData)
      commit('ADD_DESIGN', created)
      return created
    },
    async updateDesign({ commit }, { id, data }) {
      const updated = await designService.updateDesign(id, data)
      commit('UPDATE_DESIGN', updated)
      return updated
    },
    async deleteDesign({ commit }, id) {
      const result = await designService.deleteDesign(id)
      commit('DELETE_DESIGN', result || id)
      return result
    },
    async restoreDesign({ commit }, id) {
      const result = await designService.restoreDesign(id)
      commit('RESTORE_DESIGN', result || id)
      return result
    },
    async permanentDeleteDesign({ commit }, id) {
      await designService.permanentDeleteDesign(id)
      commit('PERMANENT_DELETE_DESIGN', id)
      return id
    },
    async bulkDeleteDesigns({ commit }, ids) {
      await designService.bulkDeleteDesigns(ids)
      commit('BULK_DELETE_DESIGNS', ids)
      return ids
    },
    async bulkRestoreDesigns({ commit }, ids) {
      await designService.bulkRestoreDesigns(ids)
      commit('BULK_RESTORE_DESIGNS', ids)
      return ids
    },
    async bulkPermanentDeleteDesigns({ commit }, ids) {
      await designService.bulkPermanentDeleteDesigns(ids)
      commit('BULK_PERMANENT_DELETE_DESIGNS', ids)
      return ids
    }
  }
}
