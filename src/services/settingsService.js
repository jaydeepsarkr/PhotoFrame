import { apiRequest, getActiveAdminId } from './apiClient'

const SETTINGS_STORAGE_KEY_BASE = 'framevue_studio_settings'
const LEGACY_STORAGE_KEY = 'framevue_studio_settings_v2'

function getStorageKey() {
  try {
    const adminId = getActiveAdminId()
    return `${SETTINGS_STORAGE_KEY_BASE}_${adminId || 'default'}`
  } catch (e) {
    return LEGACY_STORAGE_KEY
  }
}

export const defaultFooterSettings = {
  enabled: true,
  brand: {
    enabled: true,
    title: 'AtelierCadre',
    tagline: 'Heirloom Photo Framing',
    description: 'Handcrafted wooden, metallic, and museum gallery frames tailored to preserve your most meaningful stories.',
    badgeText: '100% Archival Grade',
    showBadge: true
  },
  collectionsColumn: {
    enabled: true,
    heading: 'Collections',
    links: [
      { id: 'col-1', label: 'All Photo Frames', url: '/frames', enabled: true },
      { id: 'col-2', label: 'Custom Frame Studio', url: '/customize/1', enabled: true },
      { id: 'col-3', label: 'Solid Wood Frames', url: '/frames?material=Wood', enabled: true },
      { id: 'col-4', label: 'Brushed Gold & Metal', url: '/frames?material=Metal', enabled: true },
      { id: 'col-5', label: 'Your Shopping Bag', url: '/cart', enabled: true }
    ]
  },
  designsColumn: {
    enabled: true,
    heading: 'Design Themes',
    links: [
      { id: 'des-1', label: 'Wedding & Vows', url: '/customize/1?category=Wedding', enabled: true },
      { id: 'des-2', label: 'Romantic Keepsakes', url: '/customize/1?category=Romantic', enabled: true },
      { id: 'des-3', label: 'Milestone Anniversaries', url: '/customize/1?category=Anniversary', enabled: true },
      { id: 'des-4', label: 'Family Portraits', url: '/customize/1?category=Family', enabled: true },
      { id: 'des-5', label: 'Admin Management Portal', url: '/admin', enabled: true }
    ]
  },
  contactColumn: {
    enabled: true,
    heading: 'Concierge & Studio',
    address: '14 Artisans Lane, Kala Ghoda, Fort, Mumbai 400001',
    showAddress: true,
    phone: '+91 (022) 2649-8820',
    showPhone: true,
    email: 'concierge@ateliercadre.in',
    showEmail: true,
    whatsapp: '+918638803228',
    showWhatsapp: true,
    instagram: 'https://instagram.com/ateliercadre',
    showInstagram: true
  },
  bottomBar: {
    enabled: true,
    copyrightText: 'Atelier Cadre Custom Framing Studio. Crafted with care in India.',
    guarantees: ['Museum-Grade Glass', 'Pan-India Insured Delivery', '100% Custom Made'],
    showGuarantees: true
  }
}

export const defaultSettings = {
  brandName: 'AtelierAdmin',
  brandSubtitle: 'Studio Console',
  logoUrl: '',
  allowThemeToggle: true,
  themeMode: 'system', // 'system' | 'light' | 'dark'
  enableDesignSection: true,
  enableMultiPhotoUpload: true,
  enableCustomText: true,
  enableReviews: true,
  currencySymbol: '₹',
  deliveryFee: 100,
  freeDeliveryThreshold: 2000,
  announcementBanner: {
    enabled: false,
    text: '✨ Limited Time: Handcrafted Italian Walnut finishes now available in all studio sizes!'
  },
  adminNotificationEmail: 'jaydeepsarkr@gmail.com',
  notifyAdminOnNewOrder: true,
  orderIdPrefix: 'PF',
  footer: { ...defaultFooterSettings }
}

export const settingsService = {
  loadLocalSettings() {
    try {
      const key = getStorageKey()
      const raw = localStorage.getItem(key) || localStorage.getItem(LEGACY_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        return { ...defaultSettings, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to parse settings from storage:', e)
    }
    return { ...defaultSettings }
  },

  saveLocalSettings(settings) {
    try {
      const key = getStorageKey()
      localStorage.setItem(key, JSON.stringify(settings))
      // Also sync to legacy fallback key for seamless backward compatibility
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.warn('Failed to save settings to storage:', e)
    }
  },

  async fetchSettings() {
    try {
      const res = await apiRequest('/settings')
      if (res && res.success && res.data) {
        const local = this.loadLocalSettings()

        // Preserve custom logo if local storage already has one and server returned empty
        const serverLogo = (res.data.logoUrl && typeof res.data.logoUrl === 'string' && res.data.logoUrl.trim()) || ''
        const localLogo = (local.logoUrl && typeof local.logoUrl === 'string' && local.logoUrl.trim()) || ''
        const finalLogo = serverLogo || localLogo

        // Preserve custom brand if server returned default 'AtelierAdmin' but local has custom
        const serverBrand = (res.data.brandName && res.data.brandName !== 'AtelierAdmin') ? res.data.brandName : ''
        const localBrand = (local.brandName && local.brandName !== 'AtelierAdmin') ? local.brandName : ''
        const finalBrand = serverBrand || localBrand || res.data.brandName || defaultSettings.brandName

        const merged = {
          ...defaultSettings,
          ...local,
          ...res.data,
          logoUrl: finalLogo,
          brandName: finalBrand
        }
        this.saveLocalSettings(merged)
        return merged
      }
    } catch (err) {
      console.warn('API /settings unreachable, using local storage settings:', err.message)
    }
    return this.loadLocalSettings()
  },

  async updateSettings(newSettings) {
    // 1. Clean payload - strip immutable & internal fields
    const payload = { ...newSettings }
    delete payload._id
    delete payload.id
    delete payload.__v
    delete payload.createdAt
    delete payload.updatedAt
    delete payload.adminId
    delete payload.key

    // 2. Immediately update localStorage for instant reactivity
    const current = this.loadLocalSettings()
    const merged = { ...current, ...payload }
    this.saveLocalSettings(merged)

    // 3. Sync with backend API
    try {
      const res = await apiRequest('/settings', {
        method: 'PUT',
        body: payload
      })
      if (res && res.success && res.data) {
        const finalSettings = { ...merged, ...res.data }
        this.saveLocalSettings(finalSettings)
        return finalSettings
      }
    } catch (err) {
      console.error('💥 [SETTINGS:SERVICE] Failed to sync settings with server:', err.message)
      throw err
    }
    return merged
  }
}
