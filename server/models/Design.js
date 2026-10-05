const mongoose = require('mongoose')

const designSchema = new mongoose.Schema(
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
      required: [true, 'Design name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Romantic',
        'Wedding',
        'Birthday',
        'Anniversary',
        'Family',
        'Kids',
        'Festival',
        'Minimal',
        'Classic',
        'Other'
      ],
      default: 'Romantic'
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    matColor: {
      type: String,
      default: '#FDFBF7'
    },
    accentColor: {
      type: String,
      default: '#B07B38'
    },
    badgeText: {
      type: String,
      default: '✦'
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

designSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = Date.now()
  }
  next()
})

// Compound indexes for tenant isolation
designSchema.index({ adminId: 1, id: 1 })
designSchema.index({ adminId: 1, isDeleted: 1, status: 1 })

const Design = mongoose.model('Design', designSchema)
module.exports = Design
