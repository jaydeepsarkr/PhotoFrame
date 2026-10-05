require('dotenv').config()
const mongoose = require('mongoose')
const Frame = require('../models/Frame')
const Design = require('../models/Design')
const Order = require('../models/Order')
const Admin = require('../models/Admin')
const Setting = require('../models/Setting')
const Customer = require('../models/Customer')

// 12 Initial Frames
const initialFrames = [
  {
    id: 1,
    name: 'Classic Wooden Frame',
    description: 'Hand-finished solid walnut wood frame with a warm satin grain and museum-grade archival matboard.',
    material: 'Wood',
    style: 'Classic',
    price: 799,
    discountPrice: 699,
    sizes: ['8x10', '12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-wood',
    borderColor: '#4A2E1B',
    popular: true,
    isNew: false,
    status: 'active'
  },
  {
    id: 2,
    name: 'Sovereign Brushed Gold Frame',
    description: 'Champagne leaf metallic finish with subtle beveled edges, crafted for weddings and milestone portraits.',
    material: 'Metal',
    style: 'Luxury',
    price: 1199,
    discountPrice: 999,
    sizes: ['8x10', '12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-gold',
    borderColor: '#C5934C',
    popular: true,
    isNew: true,
    status: 'active'
  },
  {
    id: 3,
    name: 'Nordic Natural Oak Frame',
    description: 'Minimalist Scandinavian white oak profile that brings airy warmth to family and travel memories.',
    material: 'Wood',
    style: 'Minimal',
    price: 899,
    discountPrice: null,
    sizes: ['8x10', '12x18', '16x20'],
    image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-oak',
    borderColor: '#B88B54',
    popular: true,
    isNew: false,
    status: 'active'
  },
  {
    id: 4,
    name: 'Atelier Matte Black Gallery',
    description: 'Deep anodized matte black aluminum profile with crisp architectural lines and anti-reflective glazing.',
    material: 'Metal',
    style: 'Modern',
    price: 949,
    discountPrice: 849,
    sizes: ['8x10', '12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-black',
    borderColor: '#191817',
    popular: true,
    isNew: false,
    status: 'active'
  },
  {
    id: 5,
    name: 'Ivory Museum Gallery Frame',
    description: 'Warm alabaster lacquer finish with double-layered cream core mount for serene contemporary interiors.',
    material: 'Wood',
    style: 'Minimal',
    price: 849,
    discountPrice: null,
    sizes: ['8x10', '12x18', '16x20'],
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-white',
    borderColor: '#EAE4D8',
    popular: false,
    isNew: true,
    status: 'active'
  },
  {
    id: 6,
    name: 'Heritage Carved Teak Frame',
    description: 'Artisanal Indian teakwood frame with delicate inner beading and rich heirloom oil finish.',
    material: 'Wood',
    style: 'Vintage',
    price: 1399,
    discountPrice: 1249,
    sizes: ['12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-wood',
    borderColor: '#3B2212',
    popular: true,
    isNew: false,
    status: 'active'
  },
  {
    id: 7,
    name: 'Crystal Acrylic Floating Frame',
    description: 'Frameless diamond-polished optical acrylic block with brushed brass corner standoffs.',
    material: 'Acrylic',
    style: 'Modern',
    price: 1499,
    discountPrice: 1299,
    sizes: ['8x10', '12x18', '16x20'],
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-white',
    borderColor: '#D6CFC2',
    popular: false,
    isNew: true,
    status: 'active'
  },
  {
    id: 8,
    name: 'Royal Baroque Antique Brass',
    description: 'Ornate filigree corner detailing in burnished antique gold, ideal for traditional and festive portraits.',
    material: 'Metal',
    style: 'Luxury',
    price: 1599,
    discountPrice: null,
    sizes: ['12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-gold',
    borderColor: '#A67A32',
    popular: false,
    isNew: false,
    status: 'active'
  },
  {
    id: 9,
    name: 'Smoked Espresso Studio Frame',
    description: 'Deep coffee-stained ash wood with subtle open-pore texture that complements warm skin tones.',
    material: 'Wood',
    style: 'Classic',
    price: 749,
    discountPrice: 649,
    sizes: ['8x10', '12x18'],
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-wood',
    borderColor: '#2E1E14',
    popular: false,
    isNew: false,
    status: 'active'
  },
  {
    id: 10,
    name: 'Champagne Slimline Metal Frame',
    description: 'Ultra-slender 12mm brushed champagne aluminum moulding for contemporary studio photography.',
    material: 'Metal',
    style: 'Minimal',
    price: 999,
    discountPrice: 899,
    sizes: ['8x10', '12x18', '16x20'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-gold',
    borderColor: '#D5B886',
    popular: true,
    isNew: true,
    status: 'active'
  },
  {
    id: 11,
    name: 'Rustic Driftwood Barn Frame',
    description: 'Reclaimed coastal pine texture with warm weathered undertones for soulful storytelling.',
    material: 'Wood',
    style: 'Vintage',
    price: 1099,
    discountPrice: null,
    sizes: ['8x10', '12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-oak',
    borderColor: '#8C6D4F',
    popular: false,
    isNew: false,
    status: 'active'
  },
  {
    id: 12,
    name: 'Obsidian Luxe Shadowbox Frame',
    description: 'Deep-set architectural shadowbox profile that gives your personalized print striking gallery depth.',
    material: 'Composite',
    style: 'Modern',
    price: 1299,
    discountPrice: 1149,
    sizes: ['8x10', '12x18', '16x20', '20x24'],
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80',
    borderTexture: 'frame-texture-black',
    borderColor: '#1E1D1C',
    popular: false,
    isNew: true,
    status: 'active'
  }
]

// 16 Initial Designs across 9 categories
const initialDesigns = [
  {
    id: 1,
    name: 'Romantic Gold',
    category: 'Romantic',
    description: 'Elegant romantic design with warm gold foil border and script typography.',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
    matColor: '#FDFBF7',
    accentColor: '#B07B38',
    badgeText: '♥',
    status: 'active'
  },
  {
    id: 2,
    name: 'Eternal Vows Ivory',
    category: 'Wedding',
    description: 'Timeless wedding crest layout with delicate botanical gold linework.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    matColor: '#FAF6EE',
    accentColor: '#8F602D',
    badgeText: '✦',
    status: 'active'
  },
  {
    id: 3,
    name: 'Golden Jubilee Celebration',
    category: 'Anniversary',
    description: 'Commemorative double-ruled mat design crafted for cherished anniversaries.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80',
    matColor: '#FBF8F1',
    accentColor: '#C5934C',
    badgeText: '∞',
    status: 'active'
  },
  {
    id: 4,
    name: 'Radiant Confetti Wish',
    category: 'Birthday',
    description: 'Joyful celebratory typography with subtle metallic star accents.',
    image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=700&q=80',
    matColor: '#FFFDF9',
    accentColor: '#B07B38',
    badgeText: '★',
    status: 'active'
  },
  {
    id: 5,
    name: 'Warm Hearth Portrait',
    category: 'Family',
    description: 'Classic editorial caption layout celebrating family bonds and togetherness.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=80',
    matColor: '#F7F2E7',
    accentColor: '#5C4430',
    badgeText: '❖',
    status: 'active'
  },
  {
    id: 6,
    name: 'Little Starry Wonder',
    category: 'Kids',
    description: 'Playful pastel-toned keepsake mat for baby milestones and childhood adventures.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=80',
    matColor: '#F9F7F2',
    accentColor: '#A17C50',
    badgeText: '☀',
    status: 'active'
  },
  {
    id: 7,
    name: 'Festive Mandala Glow',
    category: 'Festival',
    description: 'Auspicious heritage motifs with warm marigold and gold leaf accents.',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=700&q=80',
    matColor: '#FCF6E8',
    accentColor: '#B8732A',
    badgeText: '❈',
    status: 'active'
  },
  {
    id: 8,
    name: 'Pure Swiss Minimal',
    category: 'Minimal',
    description: 'Ultra-clean museum mat with refined micro-serif caption alignment.',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=80',
    matColor: '#FFFFFF',
    accentColor: '#262523',
    badgeText: '—',
    status: 'active'
  },
  {
    id: 9,
    name: 'Sovereign Heritage Seal',
    category: 'Classic',
    description: 'Traditional gallery border with fine charcoal and gold double pin-striping.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80',
    matColor: '#F8F4EC',
    accentColor: '#191817',
    badgeText: '§',
    status: 'active'
  },
  {
    id: 10,
    name: 'Velvet Rose Symphony',
    category: 'Romantic',
    description: 'Soft blush-cream mat board with romantic calligraphy dedication.',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=80',
    matColor: '#FDF8F6',
    accentColor: '#9E584D',
    badgeText: '♥',
    status: 'active'
  },
  {
    id: 11,
    name: 'Royal Mandap Heritage',
    category: 'Wedding',
    description: 'Regal Indian wedding border inspired by royal palaces and gold zardozi.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80',
    matColor: '#FBF5E8',
    accentColor: '#9E6B24',
    badgeText: '♛',
    status: 'active'
  },
  {
    id: 12,
    name: 'Milestone Twenty-Five',
    category: 'Birthday',
    description: 'Contemporary magazine-style portrait mat for landmark birthday gifts.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80',
    matColor: '#FAF7F0',
    accentColor: '#262523',
    badgeText: '✦',
    status: 'active'
  },
  {
    id: 13,
    name: 'Silver & Gold Together',
    category: 'Anniversary',
    description: 'Harmonious dual-tone border honoring years of love and companionship.',
    image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=700&q=80',
    matColor: '#F9F6EE',
    accentColor: '#8F602D',
    badgeText: '♡',
    status: 'active'
  },
  {
    id: 14,
    name: 'Generations Tree Crest',
    category: 'Family',
    description: 'Heirloom archival layout designed for multi-generational family portraits.',
    image: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=700&q=80',
    matColor: '#F5EFE2',
    accentColor: '#4A3B2C',
    badgeText: '♣',
    status: 'active'
  },
  {
    id: 15,
    name: 'Monochrome Noir Gallery',
    category: 'Minimal',
    description: 'High-contrast alabaster mat with obsidian hairline border.',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=700&q=80',
    matColor: '#FCFBF9',
    accentColor: '#11100F',
    badgeText: '▪',
    status: 'active'
  },
  {
    id: 16,
    name: 'Oxford Archival Plate',
    category: 'Classic',
    description: 'Distinguished literary plate style with classic serif date engraving.',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=700&q=80',
    matColor: '#F7F3E8',
    accentColor: '#604124',
    badgeText: '❖',
    status: 'active'
  }
]

// Initial Orders
const initialOrders = [
  {
    id: 'PF-20260930-001',
    date: '2026-09-30',
    status: 'New',
    displayStatus: 'Order Received',
    customer: {
      fullName: 'Jay & Priya Sharma',
      phone: '+91 98201 44510',
      email: 'jay.sharma@example.com',
      address: {
        house: 'Flat 1402, Oberoi Woods Tower B',
        street: 'Goregaon East, Mohan Gokhale Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400063',
        landmark: 'Near Oberoi Mall',
        country: 'India'
      }
    },
    product: {
      frameId: 1,
      frameName: 'Classic Wooden Frame',
      frameMaterial: 'Wood',
      frameImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      designId: 1,
      designName: 'Romantic Gold',
      designCategory: 'Romantic',
      size: '12x18',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      photos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'],
      name: 'Jay & Priya',
      date: '30 September 2026',
      customMessage: 'Forever & Always ❤️',
      description: 'Please use warm ivory mat board and gift-wrap the frame with a gold ribbon.'
    },
    pricing: {
      subtotal: 1049,
      delivery: 100,
      total: 1149
    }
  },
  {
    id: 'PF-20260929-002',
    date: '2026-09-29',
    status: 'Processing',
    displayStatus: 'In Production',
    customer: {
      fullName: 'Ananya Verma',
      phone: '+91 98114 78230',
      email: 'ananya.verma@example.com',
      address: {
        house: 'B-42, Defence Colony',
        street: 'Ring Road South',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110024',
        landmark: 'Opposite Defence Colony Club',
        country: 'India'
      }
    },
    product: {
      frameId: 2,
      frameName: 'Sovereign Brushed Gold Frame',
      frameMaterial: 'Metal',
      frameImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
      designId: 2,
      designName: 'Eternal Vows Ivory',
      designCategory: 'Wedding',
      size: '16x20',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      photos: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'],
      name: 'Rohan & Ananya',
      date: '14 February 2026',
      customMessage: 'Two Souls, One Story ✨',
      description: 'Center align the wedding date in gold serif font.'
    },
    pricing: {
      subtotal: 1699,
      delivery: 100,
      total: 1799
    }
  }
]

/**
 * Seed or provision starter catalog & settings for a new admin/studio
 */
const seedStoreForAdmin = async (adminId, studioName = 'Atelier Cadre') => {
  const normAdminId = (adminId || 'jaydeep').toLowerCase().trim()

  // 1. Settings
  let setting = await Setting.findOne({ adminId: normAdminId })
  if (!setting) {
    await Setting.create({
      adminId: normAdminId,
      key: 'global_studio_settings',
      brandName: studioName,
      brandSubtitle: 'Custom Framing Studio',
      logoUrl: '',
      adminNotificationEmail: process.env.ADMIN_EMAIL || 'jaydeepsarkr@gmail.com'
    })
    console.log(` Created default settings for adminId: ${normAdminId}`)
  }

  // 2. Starter Frames (if this tenant has 0 frames)
  const frameCount = await Frame.countDocuments({ adminId: normAdminId })
  if (frameCount === 0) {
    const framesToInsert = initialFrames.map((f) => ({
      ...f,
      adminId: normAdminId
    }))
    await Frame.insertMany(framesToInsert)
    console.log(` Seeded ${framesToInsert.length} Frames for studio [${normAdminId}]`)
  }

  // 3. Starter Designs (if this tenant has 0 designs)
  const designCount = await Design.countDocuments({ adminId: normAdminId })
  if (designCount === 0) {
    const designsToInsert = initialDesigns.map((d) => ({
      ...d,
      adminId: normAdminId
    }))
    await Design.insertMany(designsToInsert)
    console.log(` Seeded ${designsToInsert.length} Designs for studio [${normAdminId}]`)
  }
}

const seedDatabase = async () => {
  try {
    const defaultEmail = (process.env.ADMIN_EMAIL || 'jaydeepsarkr@gmail.com').toLowerCase().trim()
    const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@12345'
    const defaultAdminId = 'jaydeep'

    // 1. Ensure default Admin exists with adminId: 'jaydeep'
    let defaultAdmin = await Admin.findOne({ email: defaultEmail })
    if (!defaultAdmin) {
      defaultAdmin = new Admin({
        name: 'Master Framing Curator',
        email: defaultEmail,
        password: defaultPassword,
        role: 'superadmin',
        adminId: defaultAdminId,
        studioName: 'Atelier Cadre',
        isVerified: true
      })
      await defaultAdmin.save()
      console.log(` Seeded default Super Admin account (${defaultEmail}, adminId: ${defaultAdminId})`)
    } else {
      defaultAdmin.isVerified = true
      if (!defaultAdmin.adminId) {
        defaultAdmin.adminId = defaultAdminId
        defaultAdmin.studioName = defaultAdmin.studioName || 'Atelier Cadre'
      }
      await defaultAdmin.save()
    }

    // 2. Multi-tenant database migration for existing records missing adminId
    await Admin.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: defaultAdminId, studioName: 'Atelier Cadre' } }
    )
    await Frame.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: defaultAdminId } }
    )
    await Design.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: defaultAdminId } }
    )
    await Order.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: defaultAdminId } }
    )
    await Customer.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: defaultAdminId } }
    )
    await Setting.updateMany(
      { adminId: { $exists: false } },
      { $set: { adminId: defaultAdminId } }
    )

    // 3. Ensure default catalog & settings are seeded for 'jaydeep'
    await seedStoreForAdmin(defaultAdminId, 'Atelier Cadre')

    // 4. Initial orders if empty
    const orderCount = await Order.countDocuments({ adminId: defaultAdminId })
    if (orderCount === 0) {
      const ordersToInsert = initialOrders.map((o) => ({ ...o, adminId: defaultAdminId }))
      await Order.insertMany(ordersToInsert)
      console.log(` Seeded ${ordersToInsert.length} Orders into MongoDB`)
    }

    return true
  } catch (error) {
    console.warn(`⚠️ Seeding note: ${error.message}`)
    return false
  }
}

// Standalone execution if run via CLI: node seed/seedData.js
if (require.main === module) {
  const connectDB = require('../config/db')
  connectDB().then(async (connected) => {
    if (connected) {
      await seedDatabase()
      console.log(' Seeding completed!')
      process.exit(0)
    } else {
      console.log('❌ Could not connect to MongoDB to seed.')
      process.exit(1)
    }
  })
}

module.exports = {
  seedDatabase,
  seedStoreForAdmin,
  initialFrames,
  initialDesigns,
  initialOrders
}
