const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
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
      unique: true,
      index: true
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    status: {
      type: String,
      enum: ['New', 'Confirmed', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'New'
    },
    displayStatus: {
      type: String,
      default: 'Order Received'
    },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: {
        house: { type: String, default: '' },
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pinCode: { type: String, default: '' },
        landmark: { type: String, default: '' },
        country: { type: String, default: 'India' }
      }
    },
    product: {
      frameId: { type: mongoose.Schema.Types.Mixed },
      frameName: { type: String, default: '' },
      frameMaterial: { type: String, default: 'Wood' },
      frameImage: { type: String, default: '' },
      designId: { type: mongoose.Schema.Types.Mixed },
      designName: { type: String, default: '' },
      designCategory: { type: String, default: '' },
      size: { type: String, default: '8x10' },
      quantity: { type: Number, default: 1 }
    },
    items: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    customization: {
      photo: { type: String, default: '' },
      photos: { type: [mongoose.Schema.Types.Mixed], default: [] },
      name: { type: String, default: '' },
      date: { type: String, default: '' },
      customMessage: { type: String, default: '' },
      description: { type: String, default: '' }
    },
    pricing: {
      subtotal: { type: Number, default: 0 },
      delivery: { type: Number, default: 100 },
      total: { type: Number, default: 100 }
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

// Compound indexes for tenant isolation
orderSchema.index({ adminId: 1, createdAt: -1 })
orderSchema.index({ adminId: 1, isDeleted: 1, status: 1 })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
