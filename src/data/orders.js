export const initialOrders = [
  {
    id: 'PF-20260930-001',
    date: '2026-09-30',
    status: 'New',
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
  },
  {
    id: 'PF-20260928-003',
    date: '2026-09-28',
    status: 'Confirmed',
    customer: {
      fullName: 'Vikramaditya Nair',
      phone: '+91 99450 11298',
      email: 'vikram.nair@example.com',
      address: {
        house: 'Villa 18, Palm Meadows',
        street: 'Whitefield Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560066',
        landmark: 'Near Forum Value Mall',
        country: 'India'
      }
    },
    product: {
      frameId: 3,
      frameName: 'Nordic Natural Oak Frame',
      frameMaterial: 'Wood',
      frameImage: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=900&q=80',
      designId: 5,
      designName: 'Warm Hearth Portrait',
      designCategory: 'Family',
      size: '12x18',
      quantity: 2
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
      name: 'The Nair Family',
      date: 'Summer 2026',
      customMessage: 'Where Life Begins & Love Never Ends',
      description: 'Both frames identical for parent gifts.'
    },
    pricing: {
      subtotal: 2298,
      delivery: 0,
      total: 2298
    }
  },
  {
    id: 'PF-20260927-004',
    date: '2026-09-27',
    status: 'Ready',
    customer: {
      fullName: 'Meera Deshmukh',
      phone: '+91 97654 33219',
      email: 'meera.d@example.com',
      address: {
        house: '301, Prabhat Residency',
        street: 'Lane 6, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411001',
        landmark: 'Next to German Bakery',
        country: 'India'
      }
    },
    product: {
      frameId: 4,
      frameName: 'Atelier Matte Black Gallery',
      frameMaterial: 'Metal',
      frameImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
      designId: 8,
      designName: 'Pure Swiss Minimal',
      designCategory: 'Minimal',
      size: '8x10',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      name: 'Aarav & Meera',
      date: '27 September 2026',
      customMessage: 'Paris, Autumn Light',
      description: 'Keep typography minimal and understated.'
    },
    pricing: {
      subtotal: 949,
      delivery: 100,
      total: 1049
    }
  },
  {
    id: 'PF-20260925-005',
    date: '2026-09-25',
    status: 'Shipped',
    customer: {
      fullName: 'Siddharth Malhotra',
      phone: '+91 98332 67450',
      email: 'siddharth.m@example.com',
      address: {
        house: 'Penthouse 9A, Sea Green South',
        street: 'Worli Sea Face',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400030',
        landmark: 'Opposite Worli Promenade',
        country: 'India'
      }
    },
    product: {
      frameId: 6,
      frameName: 'Heritage Carved Teak Frame',
      frameMaterial: 'Wood',
      frameImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80',
      designId: 3,
      designName: 'Golden Jubilee Celebration',
      designCategory: 'Anniversary',
      size: '20x24',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=800&q=80',
      name: 'Rajesh & Sunita Malhotra',
      date: '25 Years of Grace',
      customMessage: 'Celebrating Our Silver Anniversary ❤️',
      description: 'Include protective corner bumpers for courier.'
    },
    pricing: {
      subtotal: 2249,
      delivery: 0,
      total: 2249
    }
  },
  {
    id: 'PF-20260924-006',
    date: '2026-09-24',
    status: 'Delivered',
    customer: {
      fullName: 'Kavya Krishnan',
      phone: '+91 94441 88902',
      email: 'kavya.krishnan@example.com',
      address: {
        house: 'No. 12, First Main Road',
        street: 'Besant Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pinCode: '600090',
        landmark: 'Near Elliotts Beach',
        country: 'India'
      }
    },
    product: {
      frameId: 5,
      frameName: 'Ivory Museum Gallery Frame',
      frameMaterial: 'Wood',
      frameImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80',
      designId: 6,
      designName: 'Little Starry Wonder',
      designCategory: 'Kids',
      size: '8x10',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
      name: 'Baby Diya',
      date: 'First Birthday • 2026',
      customMessage: 'Our Little Sunshine ☀️',
      description: 'Soft cream mat board.'
    },
    pricing: {
      subtotal: 849,
      delivery: 100,
      total: 949
    }
  },
  {
    id: 'PF-20260922-007',
    date: '2026-09-22',
    status: 'Delivered',
    customer: {
      fullName: 'Arjun Kapoor',
      phone: '+91 98765 12094',
      email: 'arjun.kapoor@example.com',
      address: {
        house: 'Plot 84, Jubilee Hills',
        street: 'Road No. 36',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500033',
        landmark: 'Near Peddamma Temple',
        country: 'India'
      }
    },
    product: {
      frameId: 10,
      frameName: 'Champagne Slimline Metal Frame',
      frameMaterial: 'Metal',
      frameImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
      designId: 4,
      designName: 'Radiant Confetti Wish',
      designCategory: 'Birthday',
      size: '12x18',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80',
      name: 'Nisha Kapoor',
      date: '22 September 2026',
      customMessage: 'Cheers to 30 Glorious Years! 🥂',
      description: 'Fast delivery requested.'
    },
    pricing: {
      subtotal: 1249,
      delivery: 100,
      total: 1349
    }
  },
  {
    id: 'PF-20260920-008',
    date: '2026-09-20',
    status: 'Delivered',
    customer: {
      fullName: 'Devika Sengupta',
      phone: '+91 98300 55412',
      email: 'devika.s@example.com',
      address: {
        house: '16/2 Ballygunge Circular Road',
        street: 'Ballygunge',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700019',
        landmark: 'Near Quest Mall',
        country: 'India'
      }
    },
    product: {
      frameId: 8,
      frameName: 'Royal Baroque Antique Brass',
      frameMaterial: 'Metal',
      frameImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
      designId: 7,
      designName: 'Festive Mandala Glow',
      designCategory: 'Festival',
      size: '16x20',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
      name: 'Sengupta Parivar',
      date: 'Shubho Bijoya 2026',
      customMessage: 'Light, Prosperity & Togetherness 🪔',
      description: 'Traditional gold corner embossing.'
    },
    pricing: {
      subtotal: 2099,
      delivery: 0,
      total: 2099
    }
  },
  {
    id: 'PF-20260918-009',
    date: '2026-09-18',
    status: 'Cancelled',
    customer: {
      fullName: 'Rishabh Patel',
      phone: '+91 98250 77812',
      email: 'rishabh.patel@example.com',
      address: {
        house: '402, Shivalik Highstreet',
        street: 'SG Highway, Bodakdev',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pinCode: '380054',
        landmark: 'Near Rajpath Club',
        country: 'India'
      }
    },
    product: {
      frameId: 9,
      frameName: 'Smoked Espresso Studio Frame',
      frameMaterial: 'Wood',
      frameImage: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=900&q=80',
      designId: 9,
      designName: 'Sovereign Heritage Seal',
      designCategory: 'Classic',
      size: '8x10',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
      name: 'Rishabh & Pooja',
      date: '18 September 2026',
      customMessage: 'Always Better Together',
      description: 'Customer requested size change so re-ordered separately.'
    },
    pricing: {
      subtotal: 749,
      delivery: 100,
      total: 849
    }
  },
  {
    id: 'PF-20260915-010',
    date: '2026-09-15',
    status: 'New',
    customer: {
      fullName: 'Nandini Rajawat',
      phone: '+91 94140 66231',
      email: 'nandini.rajawat@example.com',
      address: {
        house: 'C-19, Prithviraj Road',
        street: 'C-Scheme',
        city: 'Jaipur',
        state: 'Rajasthan',
        pinCode: '302001',
        landmark: 'Near Central Park Gate 2',
        country: 'India'
      }
    },
    product: {
      frameId: 7,
      frameName: 'Crystal Acrylic Floating Frame',
      frameMaterial: 'Acrylic',
      frameImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80',
      designId: 11,
      designName: 'Royal Mandap Heritage',
      designCategory: 'Wedding',
      size: '12x18',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      name: 'Harshvardhan & Nandini',
      date: '12 December 2026',
      customMessage: 'Bound by Love, Blessed by Grace ✨',
      description: 'High gloss finish on photo print.'
    },
    pricing: {
      subtotal: 1749,
      delivery: 0,
      total: 1749
    }
  },
  {
    id: 'PF-20260912-011',
    date: '2026-09-12',
    status: 'Processing',
    customer: {
      fullName: 'Karanveer Gill',
      phone: '+91 98151 90432',
      email: 'karan.gill@example.com',
      address: {
        house: 'House No. 214, Sector 9-C',
        street: 'Madhya Marg',
        city: 'Chandigarh',
        state: 'Chandigarh',
        pinCode: '160009',
        landmark: 'Near Rose Garden',
        country: 'India'
      }
    },
    product: {
      frameId: 12,
      frameName: 'Obsidian Luxe Shadowbox Frame',
      frameMaterial: 'Composite',
      frameImage: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80',
      designId: 15,
      designName: 'Monochrome Noir Gallery',
      designCategory: 'Minimal',
      size: '16x20',
      quantity: 1
    },
    customization: {
      photo: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80',
      name: 'Gill Residence',
      date: 'Autumn 2026',
      customMessage: 'Every Moment Matters',
      description: 'Matte archival cotton rag paper.'
    },
    pricing: {
      subtotal: 1799,
      delivery: 0,
      total: 1799
    }
  }
]
