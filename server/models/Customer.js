const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema(
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
      type: String,
      required: true,
      index: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: 'India'
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastOrderDate: {
      type: String,
      default: ''
    },
    lastOrderId: {
      type: String,
      default: ''
    },
    orders: {
      type: [String],
      default: []
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
    timestamps: true
  }
)

// Compound indexes for tenant isolation
customerSchema.index({ adminId: 1, email: 1 }, { unique: true })
customerSchema.index({ adminId: 1, id: 1 }, { unique: true })
customerSchema.index({ adminId: 1, isDeleted: 1 })

module.exports = mongoose.model('Customer', customerSchema)
