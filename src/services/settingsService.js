import { apiRequest } from './apiClient'

const SETTINGS_STORAGE_KEY = 'framevue_studio_settings_v2'

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
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
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
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.warn('Failed to save settings to storage:', e)
    }
  },

  async fetchSettings() {
    try {
      const res = await apiRequest('/settings')
      if (res && res.success && res.data) {
        const merged = { ...defaultSettings, ...res.data }
        this.saveLocalSettings(merged)
        return merged
      }
    } catch (err) {
      console.warn('API /settings unreachable, using local storage settings:', err.message)
    }
    return this.loadLocalSettings()
  },

  async updateSettings(newSettings) {
    // 1. Immediately update localStorage for instant reactivity
    const current = this.loadLocalSettings()
    const merged = { ...current, ...newSettings }
    this.saveLocalSettings(merged)

    // 2. Sync with backend API
    try {
      const res = await apiRequest('/settings', {
        method: 'PUT',
        body: merged
      })
      if (res && res.success && res.data) {
        this.saveLocalSettings(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('Failed to sync settings with server, saved locally:', err.message)
    }
    return merged
  }
}
