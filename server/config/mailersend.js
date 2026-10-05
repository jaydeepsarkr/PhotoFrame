const nodemailer = require('nodemailer')
const https = require('https')
const Setting = require('../models/Setting')

/**
 * Configure MailerSend SMTP Transporter
 */
const createMailerSendTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.MAILERSEND_USER,
      pass: process.env.MAILERSEND_PASS
    }
  })
}

/**
 * Send Email via MailerSend REST API
 */
const sendViaMailerSendApi = async ({ fromEmail, fromName, toEmail, adminName, subject, text, html }) => {
  const apiKey = process.env.MAILERSEND_API_KEY
  if (!apiKey) {
    throw new Error('MAILERSEND_API_KEY not configured in .env')
  }

  const payload = JSON.stringify({
    from: {
      email: fromEmail,
      name: fromName
    },
    to: [
      {
        email: toEmail,
        name: adminName
      }
    ],
    subject,
    text,
    html
  })

  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://api.mailersend.com/v1/email',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = ''
        res.on('data', chunk => { body += chunk })
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, statusCode: res.statusCode, body })
          } else {
            let errorMsg = `HTTP ${res.statusCode}`
            try {
              const parsed = JSON.parse(body)
              errorMsg = parsed.message || (parsed.errors ? JSON.stringify(parsed.errors) : JSON.stringify(parsed))
            } catch (e) {
              errorMsg = body || errorMsg
            }
            reject(new Error(errorMsg))
          }
        })
      }
    )

    req.on('error', (err) => reject(err))
    req.write(payload)
    req.end()
  })
}

/**
 * Fetch dynamic Studio Branding & Settings from MongoDB
 */
const getActiveBranding = async () => {
  try {
    const settings = await Setting.findOne({ key: 'global_studio_settings' })
    const brandName = (settings && settings.brandName && settings.brandName.trim()) || 'Atelier Cadre'
    const brandSubtitle = (settings && settings.brandSubtitle && settings.brandSubtitle.trim()) || 'Studio Console'
    const logoUrl = (settings && settings.logoUrl && settings.logoUrl.trim()) || ''
    const adminNotificationEmail = (settings && settings.adminNotificationEmail && settings.adminNotificationEmail.trim()) || process.env.ADMIN_EMAIL || 'jaydeepsarkr@gmail.com'
    const notifyAdminOnNewOrder = settings ? settings.notifyAdminOnNewOrder !== false : true

    return {
      brandName,
      brandSubtitle,
      logoUrl,
      adminNotificationEmail,
      notifyAdminOnNewOrder
    }
  } catch (err) {
    console.warn('⚠️ [MAILERSEND] Unable to fetch active studio branding from DB, using defaults:', err.message)
    return {
      brandName: 'Atelier Cadre',
      brandSubtitle: 'Studio Console',
      logoUrl: '',
      adminNotificationEmail: process.env.ADMIN_EMAIL || 'jaydeepsarkr@gmail.com',
      notifyAdminOnNewOrder: true
    }
  }
}

/**
 * Format dynamic brand header HTML with uploaded logo image or styled typography
 */
const renderEmailLogoHeader = (branding) => {
  const brandName = branding.brandName || 'Atelier Cadre'
  if (branding.logoUrl) {
    return `
      <div style="text-align: center; margin-bottom: 18px;">
        <img src="${branding.logoUrl}" alt="${brandName}" style="max-height: 52px; max-width: 200px; height: auto; object-fit: contain; display: inline-block; vertical-align: middle; border: 0;" />
        <div style="font-size: 15px; font-weight: 700; color: #191817; margin-top: 6px; letter-spacing: 0.5px;">${brandName}</div>
      </div>
    `
  }

  // Text representation with gold accent on last word if multiple words
  const words = brandName.split(' ')
  let textHtml = brandName
  if (words.length > 1) {
    const first = words.slice(0, -1).join(' ')
    const last = words[words.length - 1]
    textHtml = `${first}&nbsp;<span style="color: #B07B38;">${last}</span>`
  } else if (brandName.toLowerCase().startsWith('atelier') && brandName.length > 7) {
    textHtml = `Atelier<span style="color: #B07B38;">${brandName.slice(7)}</span>`
  }

  return `
    <div class="logo" style="font-size: 24px; font-weight: bold; color: #191817; text-align: center; margin-bottom: 18px; letter-spacing: 0.5px;">
      ${textHtml}
    </div>
  `
}

/**
 * Send 6-Digit OTP Email via MailerSend (REST API + SMTP Fallback)
 */
const sendOtpEmail = async ({ toEmail, otpCode, adminName = 'Administrator' }) => {
  const branding = await getActiveBranding()
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL || 'security@educanium.com'
  const fromName = `${branding.brandName} Security`
  const subject = `Your ${branding.brandName} Verification Code: ${otpCode}`
  const text = `Hello ${adminName}, your ${branding.brandName} Admin verification code is: ${otpCode}. It expires in 10 minutes.`

  console.log(`\n======================================================`)
  console.log(`📧 [MAILERSEND] Dispatching 2FA Login OTP Email`)
  console.log(`   To: ${toEmail} (${adminName})`)
  console.log(`   From: ${fromEmail} (${fromName})`)
  console.log(`   Subject: ${subject}`)
  console.log(`   🔑 Verification OTP: [ ${otpCode} ] (Valid for 10 minutes)`)
  console.log(`======================================================`)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Admin Login Verification</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6EE; margin: 0; padding: 20px; color: #191817; }
        .container { max-width: 520px; margin: 30px auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8DEC8; padding: 36px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .logo { font-size: 22px; font-weight: bold; color: #191817; text-align: center; margin-bottom: 24px; }
        .logo span { color: #B07B38; }
        .badge { display: inline-block; background-color: #F5EFE0; color: #8F602D; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 50px; margin-bottom: 16px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #191817; }
        .subtitle { font-size: 14px; color: #57524B; line-height: 1.5; margin-bottom: 28px; }
        .otp-box { background: #191817; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #D0A66B; margin: 0; }
        .note { font-size: 12px; color: #8C8476; text-align: center; margin-top: 14px; }
        .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #F3ECE0; font-size: 11px; color: #A8A196; }
      </style>
    </head>
    <body>
      <div class="container">
        ${renderEmailLogoHeader(branding)}
        <div style="text-align: center;">
          <span class="badge">Security Verification</span>
          <div class="title">Admin Login OTP Code</div>
          <div class="subtitle">Hello ${adminName}, use the verification code below to securely log into the ${branding.brandName} Admin Dashboard.</div>
        </div>

        <div class="otp-box">
          <div class="otp-code">${otpCode}</div>
        </div>

        <p class="note">This one-time passcode will expire in <strong>10 minutes</strong>. If you did not request this login attempt, please secure your account immediately.</p>

        <div class="footer">
          © ${new Date().getFullYear()} ${branding.brandName} Custom Framing Studio. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `

  // 1. Try MailerSend REST API
  if (process.env.MAILERSEND_API_KEY) {
    try {
      const apiResult = await sendViaMailerSendApi({
        fromEmail,
        fromName,
        toEmail,
        adminName,
        subject,
        text,
        html: htmlContent
      })
      console.log(`✅ [MAILERSEND] 2FA Login OTP Email sent successfully to ${toEmail} (HTTP ${apiResult.statusCode})`)
      return { success: true, method: 'rest-api', result: apiResult }
    } catch (apiError) {
      console.warn(`⚠️ [MAILERSEND] REST API note: ${apiError.message}`)
      if (apiError.message.includes('sandbox account unique recipients limit')) {
        return {
          success: false,
          error: 'MailerSend sandbox recipient limit reached (#MS42225).',
          code: 'SANDBOX_LIMIT'
        }
      }
    }
  }

  // 2. Fallback to MailerSend SMTP
  try {
    const transporter = createMailerSendTransporter()
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html: htmlContent
    })

    console.log(`✅ [MAILERSEND] SMTP Email sent to ${toEmail}: messageId=${info.messageId}`)
    return { success: true, method: 'smtp', messageId: info.messageId }
  } catch (smtpError) {
    console.warn(`❌ [MAILERSEND] SMTP send error: ${smtpError.message}`)
    return { success: false, error: smtpError.message }
  }
}

/**
 * Send Signup / Activation OTP Email via MailerSend
 */
const sendSignupOtpEmail = async ({ toEmail, otpCode, adminName = 'Administrator' }) => {
  const branding = await getActiveBranding()
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL || 'security@educanium.com'
  const fromName = `${branding.brandName} Security`
  const subject = `Welcome to ${branding.brandName} - Activate Your Admin Account (${otpCode})`
  const text = `Welcome ${adminName}! Your ${branding.brandName} Admin activation code is: ${otpCode}. Enter this code to verify your email and activate your account.`

  console.log(`\n======================================================`)
  console.log(`📧 [MAILERSEND] Dispatching Account Activation Email`)
  console.log(`   To: ${toEmail} (${adminName})`)
  console.log(`   From: ${fromEmail} (${fromName})`)
  console.log(`   Subject: ${subject}`)
  console.log(`   🔑 Activation Code: [ ${otpCode} ] (Valid for 10 minutes)`)
  console.log(`======================================================`)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to ${branding.brandName} - Admin Activation</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6EE; margin: 0; padding: 20px; color: #191817; }
        .container { max-width: 520px; margin: 30px auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8DEC8; padding: 36px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .logo { font-size: 22px; font-weight: bold; color: #191817; text-align: center; margin-bottom: 24px; }
        .logo span { color: #B07B38; }
        .badge { display: inline-block; background-color: #E8F5E9; color: #2E7D32; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 50px; margin-bottom: 16px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #191817; }
        .subtitle { font-size: 14px; color: #57524B; line-height: 1.5; margin-bottom: 28px; }
        .otp-box { background: #191817; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #D0A66B; margin: 0; }
        .note { font-size: 12px; color: #8C8476; text-align: center; margin-top: 14px; }
        .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #F3ECE0; font-size: 11px; color: #A8A196; }
      </style>
    </head>
    <body>
      <div class="container">
        ${renderEmailLogoHeader(branding)}
        <div style="text-align: center;">
          <span class="badge">Admin Onboarding</span>
          <div class="title">Welcome, ${adminName}!</div>
          <div class="subtitle">You have registered for an administrator console account at ${branding.brandName}. Verify your email with the activation code below to start managing the studio:</div>
        </div>

        <div class="otp-box">
          <div class="otp-code">${otpCode}</div>
        </div>

        <p class="note">This activation passcode will expire in <strong>10 minutes</strong>. If you did not request this registration, you can safely disregard this email.</p>

        <div class="footer">
          © ${new Date().getFullYear()} ${branding.brandName} Custom Framing Studio. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `

  if (process.env.MAILERSEND_API_KEY) {
    try {
      const apiResult = await sendViaMailerSendApi({
        fromEmail,
        fromName,
        toEmail,
        adminName,
        subject,
        text,
        html: htmlContent
      })
      console.log(`✅ [MAILERSEND] Signup Activation Email sent successfully to ${toEmail} (HTTP ${apiResult.statusCode})`)
      return { success: true, method: 'rest-api', result: apiResult }
    } catch (apiError) {
      console.warn(`⚠️ [MAILERSEND] REST API signup note: ${apiError.message}`)
      if (apiError.message.includes('sandbox account unique recipients limit')) {
        return {
          success: false,
          error: 'MailerSend sandbox recipient limit reached (#MS42225).',
          code: 'SANDBOX_LIMIT'
        }
      }
    }
  }

  try {
    const transporter = createMailerSendTransporter()
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html: htmlContent
    })
    console.log(`✅ [MAILERSEND] SMTP Signup Email sent to ${toEmail}: messageId=${info.messageId}`)
    return { success: true, method: 'smtp', messageId: info.messageId }
  } catch (smtpError) {
    console.warn(`❌ [MAILERSEND] SMTP signup send error: ${smtpError.message}`)
    return { success: false, error: smtpError.message }
  }
}

/**
 * Send New Order Notification Email to Admin Gmail
 */
const sendNewOrderNotificationEmail = async ({ order, toEmail, adminName = 'Studio Administrator' }) => {
  const branding = await getActiveBranding()

  // Respect admin preference if notifications are turned off in settings
  if (branding.notifyAdminOnNewOrder === false && !toEmail) {
    console.log(`ℹ️ [ORDER:EMAIL] Admin order notification is disabled in studio settings. Skipping dispatch.`)
    return { success: true, skipped: true, message: 'Notification disabled in studio settings' }
  }

  const recipientEmail = toEmail || branding.adminNotificationEmail || process.env.ADMIN_EMAIL || 'jaydeepsarkr@gmail.com'
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL || 'security@educanium.com'
  const fromName = `${branding.brandName} Studio`
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080'

  const orderId = order.id || 'N/A'
  const totalAmount = (order.pricing?.total || 0).toLocaleString('en-IN')
  const subtotalAmount = (order.pricing?.subtotal || 0).toLocaleString('en-IN')
  const deliveryAmount = (order.pricing?.delivery || 0).toLocaleString('en-IN')
  const customerName = order.customer?.fullName || 'Valued Customer'
  const customerEmail = order.customer?.email || 'N/A'
  const customerPhone = order.customer?.phone || 'N/A'
  const orderDate = order.date || new Date().toISOString().split('T')[0]

  const addr = order.customer?.address || {}
  const addressParts = [
    addr.house,
    addr.street,
    addr.landmark ? `(Landmark: ${addr.landmark})` : '',
    addr.city,
    addr.state,
    addr.pinCode ? `PIN: ${addr.pinCode}` : '',
    addr.country
  ].filter(Boolean).join(', ')

  const frameName = order.product?.frameName || 'Custom Frame'
  const frameMaterial = order.product?.frameMaterial || 'Wood'
  const frameSize = order.product?.size || '8x10'
  const designName = order.product?.designName || 'Standard'
  const designCategory = order.product?.designCategory || 'Classic'
  const quantity = order.product?.quantity || 1

  const custom = order.customization || {}
  const customItems = []
  if (custom.name) customItems.push(`Inscribed Name: ${custom.name}`)
  if (custom.date) customItems.push(`Important Date: ${custom.date}`)
  if (custom.customMessage) customItems.push(`Custom Message: "${custom.customMessage}"`)
  if (custom.description) customItems.push(`Special Notes: ${custom.description}`)

  const photosList = Array.isArray(custom.photos) && custom.photos.length > 0
    ? custom.photos
    : (custom.photo ? [custom.photo] : [])
  const photosCount = photosList.length

  const validPhotoUrls = photosList
    .map(p => (typeof p === 'string' ? p : p.url))
    .filter(u => typeof u === 'string' && u.startsWith('http'))

  const subject = `🛍️ New Order Received: ${orderId} (₹${totalAmount}) - ${customerName}`

  const text = `
========================================
NEW ORDER RECEIVED: ${orderId}
========================================
Total Amount: ₹${totalAmount}
Order Date: ${orderDate}
Status: ${order.displayStatus || 'Order Received'}

CUSTOMER DETAILS:
Name: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}
Shipping Address: ${addressParts || 'N/A'}

ORDERED PRODUCT:
Frame: ${frameName} (${frameMaterial})
Design Style: ${designName} (${designCategory})
Size: ${frameSize} inches
Quantity: ${quantity}

CUSTOMIZATION & PHOTOS:
${customItems.length > 0 ? customItems.join('\n') : 'No custom text added.'}
Photos Uploaded: ${photosCount} photo(s)
${validPhotoUrls.length > 0 ? 'Photo URLs:\n' + validPhotoUrls.join('\n') : ''}

FINANCIAL BREAKDOWN:
Subtotal: ₹${subtotalAmount}
Delivery: ₹${deliveryAmount}
Total: ₹${totalAmount}

View order in admin console: ${frontendUrl}/admin/orders/${orderId}
========================================
`

  let photosHtml = ''
  if (validPhotoUrls.length > 0) {
    photosHtml = `
      <div style="margin-top: 10px;">
        <div style="font-size: 12px; color: #57524B; margin-bottom: 6px; font-weight: 600;">Uploaded Customer Photo(s):</div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${validPhotoUrls.map((u, i) => `
            <div style="display: inline-block; margin-right: 10px; margin-bottom: 10px; text-align: center;">
              <a href="${u}" target="_blank" style="text-decoration: none;">
                <img src="${u}" alt="Photo ${i + 1}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #D5C8B4;" />
                <div style="font-size: 11px; color: #B07B38; margin-top: 3px; font-weight: 600;">View Photo #${i + 1} ↗</div>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `
  } else if (photosCount > 0) {
    photosHtml = `
      <div style="margin-top: 10px; display: inline-block; background-color: #F5EFE0; color: #8F602D; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 6px; border: 1px solid #E8DEC8;">
        📷 ${photosCount} customer photo${photosCount > 1 ? 's' : ''} uploaded (accessible in Admin Dashboard)
      </div>
    `
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Alert: ${orderId}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6EE; margin: 0; padding: 24px; color: #191817; line-height: 1.5; }
        .container { max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8DEC8; padding: 36px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #F0E8DC; }
        .logo { font-size: 24px; font-weight: bold; color: #191817; letter-spacing: 0.5px; }
        .logo span { color: #B07B38; }
        .badge { display: inline-block; background-color: #E8F5E9; color: #1B5E20; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 14px; border-radius: 50px; margin-top: 12px; }
        .hero { text-align: center; margin: 24px 0 28px; background: #FAF6EE; border-radius: 12px; padding: 20px; border: 1px solid #EDE4D3; }
        .order-title { font-size: 18px; font-weight: 700; color: #191817; margin-bottom: 4px; }
        .order-price { font-size: 32px; font-weight: 800; color: #B07B38; margin: 8px 0; }
        .order-date { font-size: 12px; color: #787168; }
        .section { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #F5EFE0; }
        .section:last-of-type { border-bottom: none; }
        .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #8F602D; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
        .grid { width: 100%; border-collapse: collapse; }
        .grid td { padding: 6px 0; font-size: 13px; vertical-align: top; }
        .label { color: #6E685E; width: 34%; font-weight: 500; }
        .val { color: #191817; font-weight: 600; width: 66%; }
        .msg-box { background: #FFFFFF; border: 1px dashed #D5C8B4; border-radius: 8px; padding: 12px 14px; margin-top: 10px; font-style: italic; color: #3E3B36; font-size: 13px; }
        .price-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .price-table td { padding: 8px 0; font-size: 13px; }
        .price-table tr.total-row td { border-top: 2px solid #E8DEC8; font-size: 16px; font-weight: 800; color: #191817; padding-top: 12px; }
        .btn-container { text-align: center; margin: 32px 0 16px; }
        .btn { display: inline-block; background: #191817; color: #FFFFFF !important; font-weight: 600; font-size: 14px; padding: 14px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); letter-spacing: 0.5px; }
        .footer { text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #F3ECE0; font-size: 11px; color: #A8A196; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Brand Header -->
        <div class="header">
          ${renderEmailLogoHeader(branding)}
          <span class="badge">✨ New Customer Order Placed</span>
        </div>

        <!-- Hero Amount & Order Id -->
        <div class="hero">
          <div class="order-title">Order #${orderId}</div>
          <div class="order-price">₹${totalAmount}</div>
          <div class="order-date">Placed on ${orderDate} &bull; Status: <strong>${order.displayStatus || 'Order Received'}</strong></div>
        </div>

        <!-- Customer & Shipping Information -->
        <div class="section">
          <div class="section-title">👤 Customer & Shipping Details</div>
          <table class="grid">
            <tr>
              <td class="label">Full Name:</td>
              <td class="val">${customerName}</td>
            </tr>
            <tr>
              <td class="label">Phone:</td>
              <td class="val"><a href="tel:${customerPhone}" style="color: #191817; text-decoration: none;">${customerPhone}</a></td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td class="val"><a href="mailto:${customerEmail}" style="color: #B07B38; text-decoration: none;">${customerEmail}</a></td>
            </tr>
            <tr>
              <td class="label">Shipping Address:</td>
              <td class="val">${addressParts || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <!-- Frame & Customization Details -->
        <div class="section">
          <div class="section-title">🖼️ Ordered Frame & Style</div>
          <table class="grid">
            <tr>
              <td class="label">Frame Profile:</td>
              <td class="val">${frameName} (${frameMaterial})</td>
            </tr>
            <tr>
              <td class="label">Design Collection:</td>
              <td class="val">${designName} &bull; <span style="color: #736B5E; font-weight: normal;">${designCategory}</span></td>
            </tr>
            <tr>
              <td class="label">Dimensions:</td>
              <td class="val">${frameSize} inches</td>
            </tr>
            <tr>
              <td class="label">Quantity:</td>
              <td class="val">${quantity} pc${quantity > 1 ? 's' : ''}</td>
            </tr>
          </table>

          ${customItems.length > 0 ? `
            <div style="margin-top: 14px;">
              <div style="font-size: 12px; color: #57524B; font-weight: 600; margin-bottom: 4px;">Custom Engraving / Inscription:</div>
              <div class="msg-box">
                ${custom.name ? `<div><strong>Inscribed Name:</strong> ${custom.name}</div>` : ''}
                ${custom.date ? `<div><strong>Inscribed Date:</strong> ${custom.date}</div>` : ''}
                ${custom.customMessage ? `<div><strong>Message:</strong> "${custom.customMessage}"</div>` : ''}
                ${custom.description ? `<div><strong>Notes:</strong> ${custom.description}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${photosHtml}
        </div>

        <!-- Financial Summary -->
        <div class="section">
          <div class="section-title">💳 Financial Breakdown</div>
          <table class="price-table">
            <tr>
              <td style="color: #6E685E;">Subtotal:</td>
              <td style="text-align: right; font-weight: 600; color: #191817;">₹${subtotalAmount}</td>
            </tr>
            <tr>
              <td style="color: #6E685E;">Standard Delivery:</td>
              <td style="text-align: right; font-weight: 600; color: #191817;">₹${deliveryAmount}</td>
            </tr>
            <tr class="total-row">
              <td>Total Amount:</td>
              <td style="text-align: right; color: #B07B38;">₹${totalAmount}</td>
            </tr>
          </table>
        </div>

        <!-- CTA Button -->
        <div class="btn-container">
          <a href="${frontendUrl}/admin/orders/${orderId}" target="_blank" class="btn">
            Open Order in Admin Console ➔
          </a>
        </div>

        <!-- Footer -->
        <div class="footer">
          ${branding.brandName} Bespoke Framing Studio Management &bull; Automated Sales Dispatch &bull; © ${new Date().getFullYear()}
        </div>
      </div>
    </body>
    </html>
  `

  console.log(`\n======================================================`)
  console.log(`🛍️  [ORDER:EMAIL] Dispatching New Order Notification Email`)
  console.log(`   Order ID: ${orderId}`)
  console.log(`   Customer: ${customerName} (${customerPhone}, ${customerEmail})`)
  console.log(`   Frame: ${frameName} (${frameSize})`)
  console.log(`   Total: ₹${totalAmount}`)
  console.log(`   Recipient Admin: ${recipientEmail} (${adminName})`)
  console.log(`   From: ${fromEmail} (${fromName})`)
  console.log(`======================================================`)

  if (process.env.MAILERSEND_API_KEY) {
    try {
      const apiResult = await sendViaMailerSendApi({
        fromEmail,
        fromName,
        toEmail: recipientEmail,
        adminName,
        subject,
        text,
        html
      })
      console.log(`✅ [ORDER:EMAIL] Order notification email sent successfully to ${recipientEmail} (HTTP ${apiResult.statusCode})`)
      return { success: true, method: 'rest-api', result: apiResult }
    } catch (apiError) {
      console.warn(`⚠️ [ORDER:EMAIL] REST API notification note: ${apiError.message}`)
      if (apiError.message.includes('sandbox account unique recipients limit')) {
        return {
          success: false,
          error: 'MailerSend sandbox recipient limit reached (#MS42225).',
          code: 'SANDBOX_LIMIT'
        }
      }
    }
  }

  try {
    const transporter = createMailerSendTransporter()
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: recipientEmail,
      subject,
      text,
      html
    })
    console.log(`✅ [ORDER:EMAIL] SMTP Order notification sent to ${recipientEmail}: messageId=${info.messageId}`)
    return { success: true, method: 'smtp', messageId: info.messageId }
  } catch (smtpError) {
    console.warn(`❌ [ORDER:EMAIL] SMTP order send error: ${smtpError.message}`)
    return { success: false, error: smtpError.message }
  }
}

/**
 * Send Promotional / Marketing / Offer Email to Customer
 */
const sendMarketingEmail = async ({
  toEmail,
  customerName = 'Valued Customer',
  subject,
  headline,
  offerBadge = 'Special Offer',
  discountCode = '',
  messageBody = '',
  buttonText = 'Shop Bespoke Frames',
  buttonLink = ''
}) => {
  const branding = await getActiveBranding()
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL || 'security@educanium.com'
  const fromName = `${branding.brandName} Studio`
  const storefrontUrl = buttonLink || process.env.FRONTEND_URL || 'http://localhost:8080'

  const finalSubject = subject || `A Special Offer from ${branding.brandName}`
  const finalHeadline = headline || `An Exclusive Offer For You from ${branding.brandName}`
  const text = `
========================================
${branding.brandName.toUpperCase()} - ${offerBadge.toUpperCase()}
========================================
Hello ${customerName},

${finalHeadline}

${messageBody}

${discountCode ? `Use Promo Code: ${discountCode}` : ''}

Visit Studio: ${storefrontUrl}

Warm regards,
${branding.brandName} Custom Framing Studio
========================================
`

  const formattedParagraphs = messageBody
    .split('\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="margin: 0 0 16px 0; font-size: 14px; color: #4A463F; line-height: 1.7;">${p}</p>`)
    .join('')

  const couponHtml = discountCode ? `
    <div style="background: linear-gradient(135deg, #FAF6EE 0%, #F5EFE0 100%); border: 2px dashed #B07B38; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #8F602D; margin-bottom: 6px;">
        Use Promo Code at Checkout
      </span>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: 800; letter-spacing: 4px; color: #191817; margin: 4px 0 8px;">
        ${discountCode}
      </div>
      <div style="font-size: 11px; color: #7A7265;">
        Enter this code in your shopping bag or checkout to apply your discount.
      </div>
    </div>
  ` : ''

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${finalSubject}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6EE; margin: 0; padding: 24px; color: #191817; line-height: 1.5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8DEC8; padding: 40px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #F0E8DC; }
        .logo { font-size: 26px; font-weight: bold; color: #191817; letter-spacing: 0.5px; }
        .logo span { color: #B07B38; }
        .badge { display: inline-block; background-color: #FDF4E7; color: #B07B38; border: 1px solid #E5D3B8; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 16px; border-radius: 50px; margin-top: 14px; }
        .hero-title { font-family: 'Georgia', serif; font-size: 24px; font-weight: bold; color: #191817; text-align: center; margin: 26px 0 12px; line-height: 1.3; }
        .greeting { font-size: 15px; font-weight: 600; color: #191817; margin: 20px 0 14px; }
        .body-text { margin-bottom: 24px; }
        .cta-container { text-align: center; margin: 32px 0 24px; }
        .cta-btn { display: inline-block; background: #191817; color: #FFFFFF !important; font-weight: 700; font-size: 14px; padding: 15px 36px; border-radius: 12px; text-decoration: none; box-shadow: 0 6px 18px rgba(0,0,0,0.18); letter-spacing: 0.5px; }
        .footer { text-align: center; margin-top: 36px; padding-top: 24px; border-top: 1px solid #F3ECE0; font-size: 11px; color: #9E9689; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Logo Header -->
        <div class="header">
          ${renderEmailLogoHeader(branding)}
          <span class="badge">${offerBadge}</span>
        </div>

        <!-- Headline -->
        <h1 class="hero-title">${finalHeadline}</h1>

        <div class="greeting">Dear ${customerName},</div>

        <!-- Dynamic Body Text -->
        <div class="body-text">
          ${formattedParagraphs}
        </div>

        <!-- Coupon Card (if provided) -->
        ${couponHtml}

        <!-- CTA Button -->
        <div class="cta-container">
          <a href="${storefrontUrl}" class="cta-btn" target="_blank">
            ${buttonText || 'Shop Bespoke Frames Now'} &rarr;
          </a>
        </div>

        <!-- Studio Guarantees -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #FAF6EE; border-radius: 12px; border: 1px solid #EDE4D3; margin-top: 28px;">
          <tr>
            <td width="33%" style="padding: 14px 10px; text-align: center; border-right: 1px solid #EDE4D3;">
              <strong style="display: block; font-size: 12px; color: #191817; margin-bottom: 2px;">Solid Hardwood</strong>
              <span style="font-size: 11px; color: #6E685E;">Kiln-dried mouldings</span>
            </td>
            <td width="33%" style="padding: 14px 10px; text-align: center; border-right: 1px solid #EDE4D3;">
              <strong style="display: block; font-size: 12px; color: #191817; margin-bottom: 2px;">Archival Mats</strong>
              <span style="font-size: 11px; color: #6E685E;">Acid-free protection</span>
            </td>
            <td width="33%" style="padding: 14px 10px; text-align: center;">
              <strong style="display: block; font-size: 12px; color: #191817; margin-bottom: 2px;">Insured Delivery</strong>
              <span style="font-size: 11px; color: #6E685E;">Doorstep across India</span>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0 0 6px 0;">This email was sent to ${toEmail} by ${branding.brandName} Custom Framing Studio.</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} ${branding.brandName}. Handcrafted with passion.</p>
        </div>
      </div>
    </body>
    </html>
  `

  console.log(`\n======================================================`)
  console.log(`📢 [MARKETING:EMAIL] Dispatching Customer Campaign Email`)
  console.log(`   To: ${toEmail} (${customerName})`)
  console.log(`   Badge: [ ${offerBadge} ]`)
  console.log(`   Subject: ${finalSubject}`)
  if (discountCode) console.log(`   Promo Code: ${discountCode}`)
  console.log(`======================================================`)

  if (process.env.MAILERSEND_API_KEY) {
    try {
      const apiResult = await sendViaMailerSendApi({
        fromEmail,
        fromName,
        toEmail,
        adminName: customerName,
        subject: finalSubject,
        text,
        html
      })
      console.log(`✅ [MARKETING:EMAIL] Mail sent via REST API to ${toEmail} (HTTP ${apiResult.statusCode})`)
      return { success: true, method: 'rest-api', result: apiResult }
    } catch (apiError) {
      console.warn(`⚠️ [MARKETING:EMAIL] REST API notice: ${apiError.message}`)
      if (apiError.message.includes('sandbox account unique recipients limit')) {
        console.warn(`ℹ️ [MARKETING:EMAIL] Sandbox recipient limit reached, proceeding with fallback.`)
      }
    }
  }

  try {
    const transporter = createMailerSendTransporter()
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: finalSubject,
      text,
      html
    })
    console.log(`✅ [MARKETING:EMAIL] Mail sent via SMTP to ${toEmail}: messageId=${info.messageId}`)
    return { success: true, method: 'smtp', messageId: info.messageId }
  } catch (smtpError) {
    console.warn(`❌ [MARKETING:EMAIL] SMTP send error to ${toEmail}: ${smtpError.message}`)
    return {
      success: false,
      error: smtpError.message,
      simulated: true,
      note: 'Logged to console in development mode.'
    }
  }
}

module.exports = {
  createMailerSendTransporter,
  sendViaMailerSendApi,
  sendOtpEmail,
  sendSignupOtpEmail,
  sendNewOrderNotificationEmail,
  sendMarketingEmail
}

