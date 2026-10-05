const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Super Admin',
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin'
    },
    adminId: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true
    },
    studioName: {
      type: String,
      trim: true,
      default: 'Atelier Cadre'
    },
    plan: {
      type: String,
      enum: ['starter', 'pro', 'enterprise'],
      default: 'pro'
    },
    otp: {
      type: String,
      default: null
    },
    otpExpires: {
      type: Date,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Hash password before saving if modified
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare entered password with hashed password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Generate a random 6-digit OTP code with 10-minute expiry
adminSchema.methods.generateOTP = function () {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  this.otp = otpCode
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  return otpCode
}

// Validate entered OTP code
adminSchema.methods.verifyOTP = function (enteredOtp) {
  if (!this.otp || !this.otpExpires) {
    return false
  }
  const isExpired = new Date() > this.otpExpires
  if (isExpired) {
    return false
  }
  return this.otp.trim() === enteredOtp.toString().trim()
}

module.exports = mongoose.model('Admin', adminSchema)
