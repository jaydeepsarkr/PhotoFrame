export const DESIGN_CATEGORIES = [
  'Romantic',
  'Wedding',
  'Birthday',
  'Anniversary',
  'Family',
  'Kids',
  'Festival',
  'Minimal',
  'Classic'
]

export const initialDesigns = [
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
