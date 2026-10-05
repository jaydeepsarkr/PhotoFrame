const Setting = require('../models/Setting')
const { DEFAULT_ADMIN_ID } = require('../middleware/tenant')

const DEFAULT_SETTINGS = {
  key: 'global_studio_settings',
  brandName: 'AtelierAdmin',
  brandSubtitle: 'Studio Console',
  logoUrl: '',
  allowThemeToggle: true,
  themeMode: 'system',
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
  adminNotificationEmail: process.env.ADMIN_EMAIL || 'jaydeepsarkr@gmail.com',
  notifyAdminOnNewOrder: true,
  orderIdPrefix: 'PF',
  footer: {
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
}

/**
 * GET /api/settings
 * Retrieves active studio settings for this tenant
 */
exports.getSettings = async (req, res, next) => {
  try {
    const mongoose = require('mongoose')
    const adminId = req.adminId || DEFAULT_ADMIN_ID

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: { ...DEFAULT_SETTINGS, adminId },
        fallback: true,
        note: 'Database disconnected, using defaults'
      })
    }

    let settings = await Setting.findOne({ adminId, key: 'global_studio_settings' })
    if (!settings) {
      settings = await Setting.create({ ...DEFAULT_SETTINGS, adminId })
    }
    res.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.warn('⚠️ [SETTINGS:GET] Error retrieving settings, returning defaults:', error.message)
    res.json({
      success: true,
      data: DEFAULT_SETTINGS,
      fallback: true
    })
  }
}

/**
 * PUT /api/settings
 * Updates studio settings for this tenant
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const adminId = req.adminId || DEFAULT_ADMIN_ID

    console.log(`\n======================================================`)
    console.log(`⚙️  [SETTINGS:UPDATE] Updating studio settings for: ${adminId}`)
    console.log(`======================================================\n`)

    // Prevent overwriting adminId via body
    const updateData = { ...req.body }
    delete updateData.adminId

    let settings = await Setting.findOneAndUpdate(
      { adminId, key: 'global_studio_settings' },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Studio settings successfully updated and synchronized.',
      data: settings
    })
  } catch (error) {
    console.error('💥 [SETTINGS:UPDATE] Error saving settings:', error.message)
    next(error)
  }
}

/**
 * GET /api/settings/public/:adminId
 * Public endpoint – returns minimal branding for a given storefront
 */
exports.getPublicSettings = async (req, res, next) => {
  try {
    const adminId = (req.params.adminId || '').toLowerCase().trim()
    if (!adminId) {
      return res.status(400).json({ success: false, message: 'adminId is required' })
    }

    const settings = await Setting.findOne({ adminId, key: 'global_studio_settings' })
    if (!settings) {
      return res.status(404).json({ success: false, message: `Studio '${adminId}' not found` })
    }

    res.json({
      success: true,
      data: {
        adminId,
        brandName: settings.brandName,
        brandSubtitle: settings.brandSubtitle,
        logoUrl: settings.logoUrl,
        currencySymbol: settings.currencySymbol,
        deliveryFee: settings.deliveryFee,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
        announcementBanner: settings.announcementBanner,
        enableDesignSection: settings.enableDesignSection,
        footer: settings.footer
      }
    })
  } catch (error) {
    next(error)
  }
}
