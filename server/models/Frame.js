const mongoose = require('mongoose')

const frameSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      default: 'jaydeep',
      lowercase: true,
      trim: true,
      index: true
    },
    id: {
      type: Number,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Frame name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    material: {
      type: String,
      enum: ['Wood', 'Metal', 'Acrylic', 'Composite', 'Other'],
      default: 'Wood'
    },
    style: {
      type: String,
      enum: ['Classic', 'Luxury', 'Minimal', 'Modern', 'Vintage', 'Other'],
      default: 'Classic'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive']
    },
    discountPrice: {
      type: Number,
      default: null
    },
    sizes: {
      type: [String],
      default: ['8x10', '12x18', '16x20']
    },
    image: {
      type: String,
      default: ''
    },
    borderTexture: {
      type: String,
      default: 'frame-texture-wood'
    },
    borderColor: {
      type: String,
      default: '#4A2E1B'
    },
    popular: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Ensure id field is set if not provided
frameSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = Date.now()
  }
  next()
})

// Compound indexes for tenant isolation
frameSchema.index({ adminId: 1, id: 1 })
frameSchema.index({ adminId: 1, isDeleted: 1, status: 1 })

const Frame = mongoose.model('Frame', frameSchema)
module.exports = Frame
