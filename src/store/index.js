import { createStore } from 'vuex'
import frames from './modules/frames'
import designs from './modules/designs'
import cart from './modules/cart'
import customization from './modules/customization'
import orders from './modules/orders'
import auth from './modules/auth'
import settings from './modules/settings'
import customers from './modules/customers'
import toast from './modules/toast'

const THEME_STORAGE_KEY = 'framevue_dark_mode_v1'

function loadInitialDarkMode() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw !== null) {
      return JSON.parse(raw) === true
    }
  } catch (e) {
    // ignore
  }
  return false
}

function applyDarkModeToDOM(isDark) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', Boolean(isDark))
  }
}

const initialDark = loadInitialDarkMode()
applyDarkModeToDOM(initialDark)

export default createStore({
  state: {
    darkMode: initialDark,
    activeAdminId: (typeof localStorage !== 'undefined' && localStorage.getItem('framevue_active_admin_id')) || 'jaydeep'
  },
  mutations: {
    SET_DARK_MODE(state, isDark) {
      state.darkMode = Boolean(isDark)
      applyDarkModeToDOM(state.darkMode)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state.darkMode))
      } catch (e) {
        // ignore
      }
    },
    SET_ACTIVE_ADMIN_ID(state, adminId) {
      state.activeAdminId = (adminId || 'jaydeep').toLowerCase().trim()
      try {
        localStorage.setItem('framevue_active_admin_id', state.activeAdminId)
      } catch (e) {
        // ignore
      }
    }
  },
  modules: {
    frames,
    designs,
    cart,
    customization,
    orders,
    auth,
    settings,
    customers,
    toast
  },
  getters: {
    darkMode: (state) => state.darkMode,
    activeAdminId: (state) => state.activeAdminId,
    allCustomers: (state) => state.customers.customers,
    customerStats: (state, getters) => getters['customers/customerStats'],
    deletedOrdersCount: (state) => state.orders.deletedOrders.length,
    deletedCustomersCount: (state) => state.customers.deletedCustomers.length,
    deletedFramesCount: (state) => state.frames.deletedFrames?.length || 0,
    deletedDesignsCount: (state) => state.designs.deletedDesigns?.length || 0,
    brandName: (state, getters) => getters['settings/brandName'],
    brandSubtitle: (state, getters) => getters['settings/brandSubtitle'],
    logoUrl: (state, getters) => getters['settings/logoUrl'],
    allowThemeToggle: (state) => state.settings.allowThemeToggle,
    themeMode: (state) => state.settings.themeMode,
    enableDesignSection: (state) => state.settings.enableDesignSection,
    enableMultiPhotoUpload: (state) => state.settings.enableMultiPhotoUpload,
    enableCustomText: (state) => state.settings.enableCustomText,
    enableReviews: (state) => state.settings.enableReviews,
    currencySymbol: (state) => state.settings.currencySymbol,
    deliveryFee: (state) => state.settings.deliveryFee,
    freeDeliveryThreshold: (state) => state.settings.freeDeliveryThreshold,
    announcementBanner: (state) => state.settings.announcementBanner,
    footerSettings: (state, getters) => getters['settings/footerSettings'],
    isAuthenticated: (state, getters) => getters['auth/isAuthenticated'],
    currentAdmin: (state, getters) => getters['auth/currentAdmin'],
    adminRole: (state, getters) => getters['auth/adminRole'],
    adminEmail: (state, getters) => getters['auth/adminEmail'],
    adminName: (state, getters) => getters['auth/adminName'],
    adminId: (state, getters) => getters['auth/adminId'],
    studioName: (state, getters) => getters['auth/studioName'],
    frames: (state) => state.frames.frames,
    designs: (state) => state.designs.designs,
    cart: (state) => state.cart.cart,
    orders: (state) => state.orders.orders,
    selectedFrame: (state, getters) => getters['customization/selectedFrame'],
    selectedDesign: (state, getters) => getters['customization/selectedDesign'],
    selectedSize: (state, getters) => getters['customization/selectedSize'],
    uploadedPhoto: (state, getters) => getters['customization/uploadedPhoto'],
    uploadedPhotos: (state, getters) => getters['customization/uploadedPhotos'],
    customText: (state, getters) => getters['customization/customText'],
    customDescription: (state, getters) => getters['customization/customDescription'],
    customerDetails: (state, getters) => getters['customization/customerDetails']
  },
  actions: {
    toggleDarkMode({ state, commit }) {
      commit('SET_DARK_MODE', !state.darkMode)
    },
    setDarkMode({ commit }, isDark) {
      commit('SET_DARK_MODE', isDark)
    },
    setSelectedFrame({ dispatch }, payload) {
      return dispatch('customization/setSelectedFrame', payload)
    },
    setSelectedDesign({ dispatch }, payload) {
      return dispatch('customization/setSelectedDesign', payload)
    },
    setSelectedSize({ dispatch }, payload) {
      return dispatch('customization/setSelectedSize', payload)
    },
    setUploadedPhoto({ dispatch }, payload) {
      return dispatch('customization/setUploadedPhoto', payload)
    },
    setUploadedPhotos({ dispatch }, payload) {
      return dispatch('customization/setUploadedPhotos', payload)
    },
    addUploadedPhotos({ dispatch }, payload) {
      return dispatch('customization/addUploadedPhotos', payload)
    },
    removeUploadedPhoto({ dispatch }, payload) {
      return dispatch('customization/removeUploadedPhoto', payload)
    },
    setCustomText({ dispatch }, payload) {
      return dispatch('customization/setCustomText', payload)
    },
    setCustomerDetails({ dispatch }, payload) {
      return dispatch('customization/setCustomerDetails', payload)
    },
    addToCart({ dispatch }, payload) {
      return dispatch('cart/addToCart', payload)
    },
    removeFromCart({ dispatch }, payload) {
      return dispatch('cart/removeFromCart', payload)
    },
    updateQuantity({ dispatch }, payload) {
      return dispatch('cart/updateQuantity', payload)
    },
    addFrame({ dispatch }, payload) {
      return dispatch('frames/addFrame', payload)
    },
    updateFrame({ dispatch }, payload) {
      return dispatch('frames/updateFrame', payload)
    },
    deleteFrame({ dispatch }, payload) {
      return dispatch('frames/deleteFrame', payload)
    },
    addDesign({ dispatch }, payload) {
      return dispatch('designs/addDesign', payload)
    },
    updateDesign({ dispatch }, payload) {
      return dispatch('designs/updateDesign', payload)
    },
    deleteDesign({ dispatch }, payload) {
      return dispatch('designs/deleteDesign', payload)
    },
    createOrder({ dispatch }, payload) {
      return dispatch('orders/createOrder', payload)
    },
    updateOrderStatus({ dispatch }, payload) {
      return dispatch('orders/updateOrderStatus', payload)
    }
  }
})
