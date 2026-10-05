const CART_STORAGE_KEY = 'framevue_cart_v1'

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    // ignore
  }
  return []
}

function saveCartToStorage(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (e) {
    console.warn('Failed to save cart to localStorage:', e)
  }
}

export default {
  namespaced: true,
  state: () => ({
    cart: loadCartFromStorage()
  }),
  getters: {
    cartItems: (state) => state.cart,
    cartCount: (state) => state.cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    subtotal: (state) => state.cart.reduce((sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1), 0),
    deliveryFee: (state, getters) => {
      if (getters.subtotal === 0) return 0
      return 100
    },
    total: (state, getters) => getters.subtotal + getters.deliveryFee
  },
  mutations: {
    ADD_TO_CART(state, payload) {
      const normalizedPhotos = Array.isArray(payload.photos) && payload.photos.length
        ? payload.photos
        : payload.photo
          ? [{ id: `photo-${Date.now()}`, url: payload.photo, name: payload.photoName || 'custom-photo.jpg' }]
          : []

      const primaryPhoto = normalizedPhotos[0]?.url || payload.photo || ''

      if (payload.editingCartItemId) {
        const existingIdx = state.cart.findIndex(i => i.cartItemId === payload.editingCartItemId)
        if (existingIdx !== -1) {
          const updated = {
            ...state.cart[existingIdx],
            ...payload,
            photo: primaryPhoto,
            photos: normalizedPhotos,
            cartItemId: payload.editingCartItemId
          }
          delete updated.editingCartItemId
          state.cart.splice(existingIdx, 1, updated)
          saveCartToStorage(state.cart)
          return
        }
      }

      const newItem = {
        cartItemId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        frame: payload.frame,
        design: payload.design,
        size: payload.size,
        photo: primaryPhoto,
        photos: normalizedPhotos,
        photoName: payload.photoName || 'custom-photo.jpg',
        customText: { ...(payload.customText || {}) },
        customDescription: payload.customDescription || '',
        quantity: Math.max(1, Number(payload.quantity) || 1),
        unitPrice: Number(payload.unitPrice) || Number(payload.frame?.price) || 799
      }
      state.cart.unshift(newItem)
      saveCartToStorage(state.cart)
    },
    REMOVE_FROM_CART(state, cartItemId) {
      state.cart = state.cart.filter(item => item.cartItemId !== cartItemId)
      saveCartToStorage(state.cart)
    },
    UPDATE_QUANTITY(state, { cartItemId, quantity }) {
      const item = state.cart.find(i => i.cartItemId === cartItemId)
      if (item) {
        item.quantity = Math.max(1, Number(quantity) || 1)
        saveCartToStorage(state.cart)
      }
    },
    CLEAR_CART(state) {
      state.cart = []
      saveCartToStorage(state.cart)
    }
  },
  actions: {
    addToCart({ commit }, itemPayload) {
      commit('ADD_TO_CART', itemPayload)
    },
    removeFromCart({ commit }, cartItemId) {
      commit('REMOVE_FROM_CART', cartItemId)
    },
    updateQuantity({ commit }, payload) {
      commit('UPDATE_QUANTITY', payload)
    },
    clearCart({ commit }) {
      commit('CLEAR_CART')
    }
  }
}
