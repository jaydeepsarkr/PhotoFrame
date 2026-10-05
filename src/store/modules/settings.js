import { settingsService, defaultSettings, defaultFooterSettings } from '@/services/settingsService'

export default {
  namespaced: true,
  state: () => settingsService.loadLocalSettings(),
  getters: {
    allSettings: (state) => state,
    brandName: (state) => state.brandName || 'AtelierAdmin',
    brandSubtitle: (state) => state.brandSubtitle || 'Studio Console',
    logoUrl: (state) => state.logoUrl || '',
    allowThemeToggle: (state) => state.allowThemeToggle !== false,
    themeMode: (state) => state.themeMode || 'system',
    enableDesignSection: (state) => state.enableDesignSection !== false,
    enableMultiPhotoUpload: (state) => state.enableMultiPhotoUpload !== false,
    enableCustomText: (state) => state.enableCustomText !== false,
    enableReviews: (state) => state.enableReviews !== false,
    deliveryFee: (state) => Number(state.deliveryFee) || 100,
    freeDeliveryThreshold: (state) => Number(state.freeDeliveryThreshold) || 2000,
    currencySymbol: (state) => state.currencySymbol || '₹',
    announcementBanner: (state) => state.announcementBanner || { enabled: false, text: '' },
    adminNotificationEmail: (state) => state.adminNotificationEmail || 'jaydeepsarkr@gmail.com',
    notifyAdminOnNewOrder: (state) => state.notifyAdminOnNewOrder !== false,
    footerSettings: (state) => state.footer || defaultFooterSettings
  },
  mutations: {
    SET_SETTINGS(state, newSettings) {
      Object.assign(state, newSettings)
    },
    UPDATE_SETTING(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    async fetchSettings({ commit, dispatch }) {
      const data = await settingsService.fetchSettings()
      commit('SET_SETTINGS', data)
      dispatch('applyTheme')
      return data
    },

    async updateSettings({ commit, state, dispatch }, newSettings) {
      const updated = await settingsService.updateSettings({ ...state, ...newSettings })
      commit('SET_SETTINGS', updated)
      dispatch('applyTheme')
      return updated
    },

    async resetSettings({ commit, dispatch }) {
      const res = await settingsService.updateSettings(defaultSettings)
      commit('SET_SETTINGS', res)
      dispatch('applyTheme')
      return res
    },

    applyTheme({ state, dispatch, rootGetters }) {
      if (state.themeMode === 'light') {
        dispatch('setDarkMode', false, { root: true })
      } else if (state.themeMode === 'dark') {
        dispatch('setDarkMode', true, { root: true })
      } else if (state.themeMode === 'system') {
        // If theme toggling is turned off and mode is system, default to light
        if (!state.allowThemeToggle) {
          dispatch('setDarkMode', false, { root: true })
        }
      }
    }
  }
}
