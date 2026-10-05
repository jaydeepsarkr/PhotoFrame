import { initialFrames } from '@/data/frames'
import { initialDesigns } from '@/data/designs'
import { getSizePriceMultiplier } from '@/utils/formatters'

const CUSTOMIZATION_KEY = 'framevue_customization_v1'
const CUSTOMER_DETAILS_KEY = 'framevue_customer_details_v1'

const DEFAULT_PHOTO_URL =
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80'

const defaultCustomerDetails = {
  fullName: '',
  phone: '',
  email: '',
  house: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  landmark: '',
  country: 'India'
}

function normalizePhotosList(photos, fallbackUrl) {
  if (Array.isArray(photos) && photos.length > 0) {
    return photos
      .map((item, idx) => {
        if (typeof item === 'string') {
          return {
            id: `photo-${idx}-${Date.now()}`,
            url: item,
            name: `photo-${idx + 1}.jpg`
          }
        }
        if (item && typeof item === 'object' && item.url) {
          return {
            id: item.id || `photo-${idx}-${Date.now()}`,
            url: item.url,
            name: item.name || `photo-${idx + 1}.jpg`
          }
        }
        return null
      })
      .filter(Boolean)
  }
  if (fallbackUrl) {
    return [
      {
        id: 'photo-default-1',
        url: fallbackUrl,
        name: 'couple-portrait.jpg'
      }
    ]
  }
  return []
}

const defaultCustomizationState = () => ({
  selectedFrame: initialFrames[0],
  selectedDesign: initialDesigns[0],
  selectedSize: initialFrames[0]?.sizes?.[0] || '8x10',
  quantity: 1,
  uploadedPhoto: DEFAULT_PHOTO_URL,
  uploadedPhotoName: 'couple-portrait.jpg',
  uploadedPhotos: [
    {
      id: 'photo-default-1',
      url: DEFAULT_PHOTO_URL,
      name: 'couple-portrait.jpg'
    }
  ],
  customText: {
    name: 'Jay & Priya',
    date: '30 September 2026',
    customMessage: 'Forever & Always ❤️'
  },
  customDescription: 'Warm ivory archival mat board with gold foil finish.',
  editingCartItemId: null
})

function loadCustomizationFromStorage() {
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const base = defaultCustomizationState()
      const normalizedPhotos = normalizePhotosList(
        parsed.uploadedPhotos,
        parsed.uploadedPhoto !== undefined ? parsed.uploadedPhoto : base.uploadedPhoto
      )
      return {
        ...base,
        ...parsed,
        uploadedPhotos: normalizedPhotos,
        uploadedPhoto: normalizedPhotos[0]?.url || '',
        uploadedPhotoName: normalizedPhotos[0]?.name || '',
        customText: {
          ...base.customText,
          ...(parsed.customText || {})
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return defaultCustomizationState()
}

function saveCustomizationToStorage(state) {
  try {
    const payload = {
      selectedFrame: state.selectedFrame,
      selectedDesign: state.selectedDesign,
      selectedSize: state.selectedSize,
      quantity: state.quantity,
      uploadedPhoto: state.uploadedPhoto,
      uploadedPhotoName: state.uploadedPhotoName,
      uploadedPhotos: state.uploadedPhotos,
      customText: state.customText,
      customDescription: state.customDescription,
      editingCartItemId: state.editingCartItemId
    }
    localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('Could not save customization to localStorage:', e)
  }
}

function loadCustomerDetailsFromStorage() {
  try {
    const raw = localStorage.getItem(CUSTOMER_DETAILS_KEY)
    if (raw) {
      return { ...defaultCustomerDetails, ...JSON.parse(raw) }
    }
  } catch (e) {
    // ignore
  }
  return { ...defaultCustomerDetails }
}

export default {
  namespaced: true,
  state: () => ({
    ...loadCustomizationFromStorage(),
    customerDetails: loadCustomerDetailsFromStorage()
  }),
  getters: {
    selectedFrame: (state) => state.selectedFrame || initialFrames[0],
    selectedDesign: (state) => state.selectedDesign || initialDesigns[0],
    selectedSize: (state) => state.selectedSize || '8x10',
    quantity: (state) => state.quantity || 1,
    uploadedPhoto: (state) => state.uploadedPhotos?.[0]?.url || state.uploadedPhoto || '',
    uploadedPhotoName: (state) => state.uploadedPhotos?.[0]?.name || state.uploadedPhotoName || '',
    uploadedPhotos: (state) => state.uploadedPhotos || [],
    uploadedPhotoUrls: (state) => (state.uploadedPhotos || []).map(p => p.url).filter(Boolean),
    customText: (state) => state.customText,
    customDescription: (state) => state.customDescription,
    customerDetails: (state) => state.customerDetails,
    unitPrice: (state) => {
      const frame = state.selectedFrame || initialFrames[0]
      const base = Number(frame?.discountPrice || frame?.price || 799)
      const sizeAddon = getSizePriceMultiplier(state.selectedSize)
      return base + sizeAddon
    },
    totalCustomizationPrice: (state, getters) => {
      return getters.unitPrice * (Number(state.quantity) || 1)
    }
  },
  mutations: {
    SET_SELECTED_FRAME(state, frame) {
      if (!frame) return
      state.selectedFrame = frame
      if (Array.isArray(frame.sizes) && frame.sizes.length > 0) {
        if (!frame.sizes.includes(state.selectedSize)) {
          state.selectedSize = frame.sizes[0]
        }
      }
      saveCustomizationToStorage(state)
    },
    SET_SELECTED_DESIGN(state, design) {
      if (!design) return
      state.selectedDesign = design
      saveCustomizationToStorage(state)
    },
    SET_SELECTED_SIZE(state, size) {
      state.selectedSize = size
      saveCustomizationToStorage(state)
    },
    SET_QUANTITY(state, qty) {
      state.quantity = Math.max(1, Number(qty) || 1)
      saveCustomizationToStorage(state)
    },
    SET_UPLOADED_PHOTO(state, payload) {
      if (!payload || (typeof payload === 'object' && !payload.url && !Array.isArray(payload))) {
        state.uploadedPhotos = []
        state.uploadedPhoto = ''
        state.uploadedPhotoName = ''
      } else if (Array.isArray(payload)) {
        const list = normalizePhotosList(payload, '')
        state.uploadedPhotos = list
        state.uploadedPhoto = list[0]?.url || ''
        state.uploadedPhotoName = list[0]?.name || ''
      } else if (typeof payload === 'string') {
        const item = {
          id: `photo-${Date.now()}`,
          url: payload,
          name: 'custom-photo.jpg'
        }
        state.uploadedPhotos = [item]
        state.uploadedPhoto = item.url
        state.uploadedPhotoName = item.name
      } else if (payload && typeof payload === 'object' && payload.url) {
        const item = {
          id: payload.id || `photo-${Date.now()}`,
          url: payload.url,
          name: payload.name || 'custom-photo.jpg'
        }
        state.uploadedPhotos = [item]
        state.uploadedPhoto = item.url
        state.uploadedPhotoName = item.name
      }
      saveCustomizationToStorage(state)
    },
    SET_UPLOADED_PHOTOS(state, photosArray) {
      const list = normalizePhotosList(photosArray, '')
      state.uploadedPhotos = list
      state.uploadedPhoto = list[0]?.url || ''
      state.uploadedPhotoName = list[0]?.name || ''
      saveCustomizationToStorage(state)
    },
    ADD_UPLOADED_PHOTOS(state, newPhotos) {
      const incoming = normalizePhotosList(Array.isArray(newPhotos) ? newPhotos : [newPhotos], '')
      const combined = [...(state.uploadedPhotos || []), ...incoming].slice(0, 6)
      state.uploadedPhotos = combined
      state.uploadedPhoto = combined[0]?.url || ''
      state.uploadedPhotoName = combined[0]?.name || ''
      saveCustomizationToStorage(state)
    },
    REMOVE_UPLOADED_PHOTO(state, photoIdOrIndex) {
      const current = [...(state.uploadedPhotos || [])]
      const filtered =
        typeof photoIdOrIndex === 'number'
          ? current.filter((_, idx) => idx !== photoIdOrIndex)
          : current.filter(p => p.id !== photoIdOrIndex && p.url !== photoIdOrIndex)
      state.uploadedPhotos = filtered
      state.uploadedPhoto = filtered[0]?.url || ''
      state.uploadedPhotoName = filtered[0]?.name || ''
      saveCustomizationToStorage(state)
    },
    SET_PRIMARY_PHOTO(state, index) {
      const current = [...(state.uploadedPhotos || [])]
      if (index > 0 && index < current.length) {
        const [chosen] = current.splice(index, 1)
        current.unshift(chosen)
        state.uploadedPhotos = current
        state.uploadedPhoto = current[0]?.url || ''
        state.uploadedPhotoName = current[0]?.name || ''
        saveCustomizationToStorage(state)
      }
    },
    SET_CUSTOM_TEXT(state, textPatch) {
      state.customText = {
        ...state.customText,
        ...textPatch
      }
      saveCustomizationToStorage(state)
    },
    SET_CUSTOM_DESCRIPTION(state, description) {
      state.customDescription = description
      saveCustomizationToStorage(state)
    },
    SET_EDITING_CART_ITEM_ID(state, id) {
      state.editingCartItemId = id
      saveCustomizationToStorage(state)
    },
    SET_CUSTOMER_DETAILS(state, details) {
      state.customerDetails = {
        ...state.customerDetails,
        ...details
      }
      try {
        localStorage.setItem(CUSTOMER_DETAILS_KEY, JSON.stringify(state.customerDetails))
      } catch (e) {
        // ignore
      }
    },
    LOAD_CART_ITEM_FOR_EDIT(state, cartItem) {
      if (!cartItem) return
      state.selectedFrame = cartItem.frame
      state.selectedDesign = cartItem.design
      state.selectedSize = cartItem.size
      state.quantity = cartItem.quantity || 1
      const list = normalizePhotosList(cartItem.photos, cartItem.photo)
      state.uploadedPhotos = list
      state.uploadedPhoto = list[0]?.url || ''
      state.uploadedPhotoName = list[0]?.name || 'custom-photo.jpg'
      state.customText = {
        name: cartItem.customText?.name || '',
        date: cartItem.customText?.date || '',
        customMessage: cartItem.customText?.customMessage || ''
      }
      state.customDescription = cartItem.customDescription || ''
      state.editingCartItemId = cartItem.cartItemId
      saveCustomizationToStorage(state)
    }
  },
  actions: {
    setSelectedFrame({ commit }, frame) {
      commit('SET_SELECTED_FRAME', frame)
    },
    setSelectedDesign({ commit }, design) {
      commit('SET_SELECTED_DESIGN', design)
    },
    setSelectedSize({ commit }, size) {
      commit('SET_SELECTED_SIZE', size)
    },
    setQuantity({ commit }, qty) {
      commit('SET_QUANTITY', qty)
    },
    setUploadedPhoto({ commit }, photoPayload) {
      commit('SET_UPLOADED_PHOTO', photoPayload)
    },
    setUploadedPhotos({ commit }, photosArray) {
      commit('SET_UPLOADED_PHOTOS', photosArray)
    },
    addUploadedPhotos({ commit }, newPhotos) {
      commit('ADD_UPLOADED_PHOTOS', newPhotos)
    },
    removeUploadedPhoto({ commit }, photoIdOrIndex) {
      commit('REMOVE_UPLOADED_PHOTO', photoIdOrIndex)
    },
    setPrimaryPhoto({ commit }, index) {
      commit('SET_PRIMARY_PHOTO', index)
    },
    setCustomText({ commit }, textPatch) {
      commit('SET_CUSTOM_TEXT', textPatch)
    },
    setCustomDescription({ commit }, description) {
      commit('SET_CUSTOM_DESCRIPTION', description)
    },
    setCustomerDetails({ commit }, details) {
      commit('SET_CUSTOMER_DETAILS', details)
    },
    loadCartItemForEdit({ commit }, item) {
      commit('LOAD_CART_ITEM_FOR_EDIT', item)
    },
    clearEditingCartItem({ commit }) {
      commit('SET_EDITING_CART_ITEM_ID', null)
    }
  }
}
