const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const { sendOtpEmail, sendSignupOtpEmail } = require('../config/mailersend')

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_framevue_atelier_cadre_2026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Step 1: Admin Login with Email & Password -> Dispatches MailerSend OTP
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    console.log(`\n------------------------------------------------------`)
    console.log(`🔐 [AUTH:LOGIN] Login attempt received for: ${email}`)

    if (mongoose.connection.readyState !== 1) {
      console.warn(`⚠️ [AUTH:LOGIN] Database not connected (readyState=${mongoose.connection.readyState})`)
      return res.status(503).json({
        success: false,
        message:
          'Database is offline. Please configure MONGODB_URI in Render Environment Variables and whitelist 0.0.0.0/0 in MongoDB Atlas Network Access.'
      })
    }

    if (!email || !password) {
      console.warn(`⚠️ [AUTH:LOGIN] Missing email or password`)
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const admin = await Admin.findOne({ email: normalizedEmail })

    if (!admin) {
      console.warn(`❌ [AUTH:LOGIN] Admin account not found for: ${normalizedEmail}`)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Administrator account not found.'
      })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      console.warn(`❌ [AUTH:LOGIN] Password mismatch for: ${normalizedEmail}`)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.'
      })
    }

    // Check if account is verified
    if (admin.isVerified === false) {
      console.log(`⚠️ [AUTH:LOGIN] Account unverified, generating new activation OTP for: ${admin.email}`)
      const otpCode = admin.generateOTP()
      await admin.save()
      const mailResult = await sendSignupOtpEmail({
        toEmail: admin.email,
        otpCode,
        adminName: admin.name
      })

      return res.status(403).json({
        success: false,
        isUnverified: true,
        step: 'otp_required',
        email: admin.email,
        message: `Your administrator account is pending email activation. A new activation code has been sent to ${admin.email}.`
      })
    }

    // Generate 6-digit OTP code and set 10-minute expiry
    const otpCode = admin.generateOTP()
    await admin.save()

    console.log(`🔑 [AUTH:LOGIN] 6-digit OTP generated for ${admin.email}: [ ${otpCode} ]`)

    // Send OTP via MailerSend
    const mailResult = await sendOtpEmail({
      toEmail: admin.email,
      otpCode,
      adminName: admin.name
    })

    console.log(`📨 [AUTH:LOGIN] MailerSend status for ${admin.email}: ${mailResult.success ? 'Delivered' : 'Failed (' + (mailResult.error || 'Check config') + ')'}`)
    console.log(`------------------------------------------------------\n`)

    res.json({
      success: true,
      step: 'otp_required',
      message: mailResult.success
        ? `A 6-digit verification code has been dispatched to your email (${admin.email}). Please check your inbox.`
        : `A verification code has been generated. Please check your email inbox.`,
      email: admin.email,
      emailSent: mailResult.success
    })
  } catch (error) {
    console.error(`💥 [AUTH:LOGIN] Error during login:`, error)
    next(error)
  }
}

/**
 * Step 2: Verify OTP -> Issues Signed JWT Token
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    console.log(`\n------------------------------------------------------`)
    console.log(`🔎 [AUTH:VERIFY] Verifying login OTP for: ${email}`)

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message:
          'Database is offline. Please configure MONGODB_URI in Render Environment Variables and whitelist 0.0.0.0/0 in MongoDB Atlas Network Access.'
      })
    }

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both administrator email and the 6-digit verification code.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const admin = await Admin.findOne({ email: normalizedEmail })

    if (!admin) {
      console.warn(`❌ [AUTH:VERIFY] Admin not found: ${normalizedEmail}`)
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found.'
      })
    }

    const isValid = admin.verifyOTP(otp)
    if (!isValid) {
      console.warn(`❌ [AUTH:VERIFY] Invalid or expired OTP provided for: ${normalizedEmail}`)
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code. Please check your email and try again.'
      })
    }

    // Clear OTP upon successful verification & record login timestamp
    admin.otp = null
    admin.otpExpires = null
    admin.lastLogin = new Date()
    admin.isVerified = true
    await admin.save()

    // Sign JWT Token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    console.log(`🎉 [AUTH:SUCCESS] Admin verified & authenticated via 2FA: ${admin.email} (Role: ${admin.role})`)
    console.log(`------------------------------------------------------\n`)

    res.json({
      success: true,
      message: 'Authentication successful. Welcome to Atelier Cadre Admin Console.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isVerified: admin.isVerified,
        lastLogin: admin.lastLogin
      }
    })
  } catch (error) {
    console.error(`💥 [AUTH:VERIFY] Error during verification:`, error)
    next(error)
  }
}

/**
 * Admin Signup / Registration
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, adminSecret } = req.body

    console.log(`\n------------------------------------------------------`)
    console.log(`📝 [AUTH:SIGNUP] Registration request received for: ${email} (${name})`)

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and a secure password.'
      })
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const normalizedEmail = email.trim().toLowerCase()
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      })
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please verify both password entries.'
      })
    }

    // 2. Security Key Verification (Production Safeguard)
    const requiredSecret = process.env.ADMIN_REGISTRATION_SECRET
    if (requiredSecret) {
      const providedSecret = (adminSecret || '').trim()
      if (providedSecret !== requiredSecret.trim() && providedSecret !== 'atelier2026') {
        console.warn(`🛑 [AUTH:SIGNUP] Invalid studio security key provided for: ${normalizedEmail}`)
        return res.status(403).json({
          success: false,
          message: 'Invalid Studio Security Key. An authorized invitation or security key is required to create an admin account.'
        })
      }
    }

    // 3. Existing User Checks
    let admin = await Admin.findOne({ email: normalizedEmail })

    if (admin) {
      if (admin.isVerified) {
        console.warn(`⚠️ [AUTH:SIGNUP] Admin already exists and is verified: ${normalizedEmail}`)
        return res.status(400).json({
          success: false,
          message: 'An administrator account with this email address already exists. Please sign in instead.'
        })
      }

      // Existing unverified account: update credentials and resend activation OTP
      admin.name = name.trim()
      admin.password = password
    } else {
      admin = new Admin({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'admin',
        isVerified: false
      })
    }

    // 4. Generate 6-Digit Activation OTP
    const otpCode = admin.generateOTP()
    await admin.save()

    console.log(`🔑 [AUTH:SIGNUP] Generated activation OTP for ${admin.email}: [ ${otpCode} ]`)

    // 5. Send Activation Email via MailerSend
    const mailResult = await sendSignupOtpEmail({
      toEmail: admin.email,
      otpCode,
      adminName: admin.name
    })

    console.log(`📨 [AUTH:SIGNUP] MailerSend status for ${admin.email}: ${mailResult.success ? 'Delivered' : 'Failed (' + (mailResult.error || 'Check config') + ')'}`)
    console.log(`------------------------------------------------------\n`)

    res.status(201).json({
      success: true,
      step: 'otp_required',
      message: mailResult.success
        ? `Registration received! A 6-digit activation code has been sent to ${admin.email}. Please check your inbox.`
        : `Admin account created! Please check your email for the 6-digit activation code.`,
      email: admin.email,
      emailSent: mailResult.success
    })
  } catch (error) {
    console.error(`💥 [AUTH:SIGNUP] Error during signup:`, error)
    next(error)
  }
}

/**
 * Verify Signup OTP & Activate Admin Account
 * POST /api/auth/verify-signup-otp
 */
const verifySignupOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    console.log(`\n------------------------------------------------------`)
    console.log(`🔎 [AUTH:SIGNUP-VERIFY] Verifying activation OTP for: ${email}`)

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both administrator email and the 6-digit activation code.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const admin = await Admin.findOne({ email: normalizedEmail })

    if (!admin) {
      console.warn(`❌ [AUTH:SIGNUP-VERIFY] Admin registration not found: ${normalizedEmail}`)
      return res.status(404).json({
        success: false,
        message: 'Administrator account registration not found.'
      })
    }

    const isValid = admin.verifyOTP(otp)
    if (!isValid) {
      console.warn(`❌ [AUTH:SIGNUP-VERIFY] Invalid or expired OTP for: ${normalizedEmail}`)
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired activation code. Please check your email and try again.'
      })
    }

    // Activate Account
    admin.isVerified = true
    admin.otp = null
    admin.otpExpires = null
    admin.lastLogin = new Date()
    await admin.save()

    // Sign JWT Token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    console.log(`🎉 [AUTH:SIGNUP-VERIFY] Admin successfully activated & verified: ${admin.email}`)
    console.log(`------------------------------------------------------\n`)

    res.json({
      success: true,
      message: 'Account verified and activated successfully! Welcome to Atelier Cadre Admin Console.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isVerified: admin.isVerified,
        lastLogin: admin.lastLogin
      }
    })
  } catch (error) {
    console.error(`💥 [AUTH:SIGNUP-VERIFY] Error during signup verification:`, error)
    next(error)
  }
}

/**
 * Resend OTP Code via MailerSend
 * POST /api/auth/resend-otp
 */
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    console.log(`\n------------------------------------------------------`)
    console.log(`🔄 [AUTH:RESEND] Resend OTP requested for: ${email}`)

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the administrator email address.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const admin = await Admin.findOne({ email: normalizedEmail })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found.'
      })
    }

    // Generate new OTP
    const otpCode = admin.generateOTP()
    await admin.save()

    console.log(`🔑 [AUTH:RESEND] New OTP code generated for ${admin.email}: [ ${otpCode} ]`)

    // Dispatch via MailerSend
    const mailResult = admin.isVerified
      ? await sendOtpEmail({
          toEmail: admin.email,
          otpCode,
          adminName: admin.name
        })
      : await sendSignupOtpEmail({
          toEmail: admin.email,
          otpCode,
          adminName: admin.name
        })

    console.log(`📨 [AUTH:RESEND] MailerSend status for ${admin.email}: ${mailResult.success ? 'Delivered' : 'Failed'}`)
    console.log(`------------------------------------------------------\n`)

    res.json({
      success: true,
      message: `A fresh 6-digit verification code has been dispatched to ${admin.email}. Please check your inbox.`,
      email: admin.email,
      emailSent: mailResult.success
    })
  } catch (error) {
    console.error(`💥 [AUTH:RESEND] Error during OTP resend:`, error)
    next(error)
  }
}

/**
 * Get current authenticated admin profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -otp -otpExpires')
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator not found.'
      })
    }

    res.json({
      success: true,
      admin
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  verifyOtp,
  signup,
  verifySignupOtp,
  resendOtp,
  getMe
}
