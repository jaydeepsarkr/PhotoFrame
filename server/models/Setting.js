const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global_studio_settings',
      unique: true,
      index: true
    },
    // Studio Branding & Logo Identity
    brandName: {
      type: String,
      default: 'AtelierAdmin'
    },
    brandSubtitle: {
      type: String,
      default: 'Studio Console'
    },
    logoUrl: {
      type: String,
      default: ''
    },
    // Theme & Appearance
    allowThemeToggle: {
      type: Boolean,
      default: true
    },
    themeMode: {
      type: String,
      enum: ['system', 'light', 'dark'],
      default: 'system'
    },
    // Catalog & Customizer Section Controls
    enableDesignSection: {
      type: Boolean,
      default: true
    },
    enableMultiPhotoUpload: {
      type: Boolean,
      default: true
    },
    enableCustomText: {
      type: Boolean,
      default: true
    },
    enableReviews: {
      type: Boolean,
      default: true
    },
    // Pricing & Logistics
    currencySymbol: {
      type: String,
      default: '₹'
    },
    deliveryFee: {
      type: Number,
      default: 100
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 2000
    },
    // Announcement Banner
    announcementBanner: {
      enabled: { type: Boolean, default: false },
      text: {
        type: String,
        default: '✨ Limited Time: Handcrafted Italian Walnut finishes now available in all studio sizes!'
      }
    },
    // Notifications & Admin
    adminNotificationEmail: {
      type: String,
      default: process.env.ADMIN_EMAIL || 'jaydeepsarkr@gmail.com'
    },
    notifyAdminOnNewOrder: {
      type: Boolean,
      default: true
    },
    orderIdPrefix: {
      type: String,
      default: 'PF'
    },
    // Storefront Footer Configuration & Dynamic Links
    footer: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
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
      })
    }
  },
  {
    timestamps: true
  }
)

const Setting = mongoose.model('Setting', settingSchema)
module.exports = Setting
