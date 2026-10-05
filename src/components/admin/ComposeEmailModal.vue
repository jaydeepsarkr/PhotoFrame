<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-charcoal-900 rounded-3xl border border-cream-300 dark:border-charcoal-700 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Modal Header -->
      <div class="px-6 py-5 border-b border-cream-200 dark:border-charcoal-800 flex items-center justify-between bg-cream-50/60 dark:bg-charcoal-800/40">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 text-gold-600 dark:text-gold-400 flex items-center justify-center">
            <Mail class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-serif font-bold text-charcoal-900 dark:text-white">
                {{ form.target === 'all' ? 'Broadcast Campaign Email' : 'Send Customer Offer Email' }}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="[
                  form.target === 'all'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-gold-50 text-gold-800 dark:bg-gold-950/50 dark:text-gold-300 border border-gold-200 dark:border-gold-800'
                ]"
              >
                {{ form.target === 'all' ? 'All Customers' : 'Single Patron' }}
              </span>
            </div>
            <p class="text-xs text-charcoal-800/60 dark:text-cream-200/60 mt-0.5">
              Dispatched with MailerSend luxury email templates with live coupon codes &amp; tracking.
            </p>
          </div>
        </div>

        <button
          type="button"
          class="p-2 rounded-xl text-charcoal-500 hover:text-charcoal-900 dark:text-cream-300 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-colors"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Mode Switcher & Presets -->
      <div class="px-6 py-4 border-b border-cream-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 space-y-3.5">
        <!-- Target Toggle Tabs -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="inline-flex p-1 rounded-2xl bg-cream-100 dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700">
            <button
              type="button"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
                form.target === 'single'
                  ? 'bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white shadow-sm'
                  : 'text-charcoal-800/70 dark:text-cream-200/70 hover:text-charcoal-900'
              ]"
              @click="setTarget('single')"
            >
              <User class="w-3.5 h-3.5" />
              <span>Single Customer</span>
            </button>
            <button
              type="button"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
                form.target === 'all'
                  ? 'bg-charcoal-900 dark:bg-gold-600 text-white shadow-sm'
                  : 'text-charcoal-800/70 dark:text-cream-200/70 hover:text-charcoal-900'
              ]"
              @click="setTarget('all')"
            >
              <Users class="w-3.5 h-3.5" />
              <span>Broadcast to All ({{ allCustomers.length }})</span>
            </button>
          </div>

          <!-- Tab View (Edit vs Live Preview) -->
          <div class="inline-flex p-1 rounded-xl bg-cream-100 dark:bg-charcoal-800 text-xs font-medium">
            <button
              type="button"
              :class="[
                'px-3 py-1.5 rounded-lg transition-colors',
                activeTab === 'compose'
                  ? 'bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white font-semibold shadow-xs'
                  : 'text-charcoal-800/70 dark:text-cream-200/70'
              ]"
              @click="activeTab = 'compose'"
            >
              Compose
            </button>
            <button
              type="button"
              :class="[
                'px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5',
                activeTab === 'preview'
                  ? 'bg-white dark:bg-charcoal-900 text-gold-600 dark:text-gold-400 font-semibold shadow-xs'
                  : 'text-charcoal-800/70 dark:text-cream-200/70'
              ]"
              @click="activeTab = 'preview'"
            >
              <Eye class="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>

        <!-- Preset Template Buttons -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal-800/50 dark:text-cream-200/50 shrink-0">
            Quick Presets:
          </span>
          <button
            type="button"
            class="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap transition-colors flex items-center gap-1.5"
            @click="applyPreset('discount15')"
          >
            <span>🏷️ 15% Off Offer</span>
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 whitespace-nowrap transition-colors flex items-center gap-1.5"
            @click="applyPreset('saleLive')"
          >
            <span>🔥 Sale Is Live</span>
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 whitespace-nowrap transition-colors flex items-center gap-1.5"
            @click="applyPreset('newArrivals')"
          >
            <span>✨ New Collection</span>
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 whitespace-nowrap transition-colors"
            @click="applyPreset('custom')"
          >
            <span>✍️ Custom</span>
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5">
        <!-- Error / Success Alert -->
        <div
          v-if="statusMessage"
          class="p-4 rounded-2xl flex items-center justify-between text-xs font-semibold border"
          :class="[
            statusType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
          ]"
        >
          <div class="flex items-center gap-2">
            <CheckCircle2 v-if="statusType === 'success'" class="w-4 h-4 shrink-0" />
            <AlertCircle v-else class="w-4 h-4 shrink-0" />
            <span>{{ statusMessage }}</span>
          </div>
          <button type="button" @click="statusMessage = ''">✕</button>
        </div>

        <!-- 1. COMPOSE TAB -->
        <div v-show="activeTab === 'compose'" class="space-y-4">
          <!-- Recipient Field -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
              Recipient
            </label>
            <div v-if="form.target === 'single'" class="space-y-2">
              <div class="flex flex-col sm:flex-row gap-3">
                <input
                  v-model.trim="form.recipientName"
                  type="text"
                  placeholder="Customer Full Name (e.g. Jaydeep Sarkar)"
                  class="flex-1 px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs font-medium focus:outline-none focus:border-gold-500"
                />
                <input
                  v-model.trim="form.recipientEmail"
                  type="email"
                  required
                  placeholder="customer@email.com"
                  class="flex-1 px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
            <div v-else class="p-3.5 rounded-xl bg-cream-100 dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <Users class="w-4 h-4 text-gold-600" />
                <span class="text-xs font-semibold text-charcoal-900 dark:text-white">
                  All Active Patrons ({{ allCustomers.length }} registered customers)
                </span>
              </div>
              <span class="text-[11px] text-charcoal-800/60 dark:text-cream-200/60">
                Personalized name per recipient
              </span>
            </div>
          </div>

          <!-- Subject Line -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
              Email Subject Line <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.trim="form.subject"
              type="text"
              required
              placeholder="e.g. 🎁 You got an exclusive 15% discount on your next bespoke frame!"
              class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs font-medium focus:outline-none focus:border-gold-500"
            />
          </div>

          <!-- Offer Badge & Discount Promo Code Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
                Campaign Badge / Tag
              </label>
              <input
                v-model.trim="form.offerBadge"
                type="text"
                placeholder="e.g. Exclusive 15% Offer, Sale Is Live"
                class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
                Promo Code (Optional)
              </label>
              <input
                v-model.trim="form.discountCode"
                type="text"
                placeholder="e.g. FRAME15, SALELIVE2026"
                class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <!-- Headline -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
              Email Headline / Title
            </label>
            <input
              v-model.trim="form.headline"
              type="text"
              placeholder="e.g. A Special 15% Appreciation Gift Just For You"
              class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs font-medium focus:outline-none focus:border-gold-500"
            />
          </div>

          <!-- Message Body -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
              Message Body (Paragraphs supported) <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model.trim="form.messageBody"
              rows="5"
              required
              placeholder="Write your personalized letter or campaign announcement here..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-gold-500"
            ></textarea>
          </div>

          <!-- CTA Button Settings -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
                Call-to-Action Button Label
              </label>
              <input
                v-model.trim="form.buttonText"
                type="text"
                placeholder="e.g. Shop Bespoke Frames Now"
                class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-1.5">
                Destination Link (Storefront URL)
              </label>
              <input
                v-model.trim="form.buttonLink"
                type="text"
                placeholder="e.g. http://localhost:8080/frames"
                class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white text-xs font-mono focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        <!-- 2. LIVE PREVIEW TAB -->
        <div v-show="activeTab === 'preview'" class="space-y-4">
          <div class="text-xs text-charcoal-800/60 dark:text-cream-200/60 text-center mb-2">
            Rendering preview of the {{ brandName || 'Atelier Cadre' }} luxury customer email:
          </div>

          <div class="max-w-lg mx-auto bg-white rounded-2xl border border-cream-200 p-7 shadow-soft space-y-5 text-charcoal-900">
            <!-- Brand Header -->
            <div class="text-center pb-4 border-b border-cream-200">
              <div v-if="logoUrl" class="flex flex-col items-center justify-center gap-1.5 mb-1">
                <img :src="logoUrl" :alt="brandName" class="max-h-12 max-w-[180px] object-contain" />
                <span class="text-sm font-serif font-bold text-charcoal-900">{{ brandName }}</span>
              </div>
              <div v-else class="text-xl font-serif font-bold text-charcoal-900">
                {{ previewBrandFormatted.primary }}<span class="text-gold-600">{{ previewBrandFormatted.accent }}</span>
              </div>
              <span class="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-50 text-gold-700 border border-gold-200">
                {{ form.offerBadge || 'Special Offer' }}
              </span>
            </div>

            <!-- Headline -->
            <h3 class="text-center font-serif text-lg font-bold text-charcoal-900">
              {{ form.headline || 'An Exclusive Offer For You' }}
            </h3>

            <!-- Greeting -->
            <div class="text-xs font-semibold text-charcoal-900">
              Dear {{ form.recipientName || 'Valued Patron' }},
            </div>

            <!-- Body Text -->
            <div class="text-xs text-charcoal-800/80 leading-relaxed whitespace-pre-line">
              {{ form.messageBody || 'Your custom message will appear here in elegant gallery typography.' }}
            </div>

            <!-- Coupon Box (if promo code) -->
            <div
              v-if="form.discountCode"
              class="p-4 rounded-xl border-2 border-dashed border-gold-500 bg-cream-50 text-center space-y-1"
            >
              <span class="block text-[10px] uppercase tracking-widest text-gold-700 font-bold">
                Use Promo Code At Checkout
              </span>
              <div class="font-mono text-xl font-bold tracking-widest text-charcoal-900">
                {{ form.discountCode }}
              </div>
              <span class="block text-[10px] text-charcoal-800/60">
                Apply this promo code in your bag to redeem this offer.
              </span>
            </div>

            <!-- CTA Button -->
            <div class="text-center pt-2">
              <span class="inline-block px-6 py-3 rounded-xl bg-charcoal-900 text-white text-xs font-semibold shadow-md">
                {{ form.buttonText || 'Shop Bespoke Frames Now' }} &rarr;
              </span>
            </div>

            <!-- Studio Guarantee -->
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-cream-200 text-center text-[10px] text-charcoal-800/70">
              <div>
                <strong>Solid Hardwood</strong>
                <span class="block text-charcoal-800/50">Kiln-dried</span>
              </div>
              <div>
                <strong>Archival Mats</strong>
                <span class="block text-charcoal-800/50">Acid-free</span>
              </div>
              <div>
                <strong>Insured Delivery</strong>
                <span class="block text-charcoal-800/50">Pan-India</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="text-center text-[10px] text-charcoal-800/50 pt-2 border-t border-cream-100">
              © {{ new Date().getFullYear() }} {{ brandName || 'Atelier Cadre' }} Custom Framing Studio.
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer Action Bar -->
      <div class="px-6 py-4 border-t border-cream-200 dark:border-charcoal-800 bg-cream-50/60 dark:bg-charcoal-800/40 flex items-center justify-between gap-3">
        <button
          type="button"
          :disabled="sending"
          class="px-4 py-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:bg-cream-100 text-charcoal-900 dark:text-cream-100 text-xs font-semibold transition-colors disabled:opacity-50"
          @click="handleClose"
        >
          Cancel
        </button>

        <button
          type="button"
          :disabled="sending || !form.subject || !form.messageBody"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 dark:hover:bg-gold-500 text-white text-xs font-semibold transition-all shadow-md disabled:opacity-50"
          @click="handleSubmit"
        >
          <RefreshCw v-if="sending" class="w-3.5 h-3.5 animate-spin" />
          <Send v-else class="w-3.5 h-3.5 text-gold-300" />
          <span>
            {{
              sending
                ? 'Dispatching via MailerSend...'
                : form.target === 'all'
                  ? `Send Broadcast to All (${allCustomers.length})`
                  : `Send Offer to ${form.recipientName || 'Customer'}`
            }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  Mail,
  User,
  Users,
  Eye,
  X,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next'

export default {
  name: 'ComposeEmailModal',
  components: {
    Mail,
    User,
    Users,
    Eye,
    X,
    Send,
    RefreshCw,
    CheckCircle2,
    AlertCircle
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    initialTarget: {
      type: String,
      default: 'single' // 'single' | 'all'
    },
    initialCustomer: {
      type: Object,
      default: () => null
    }
  },
  emits: ['close', 'sent'],
  data() {
    return {
      activeTab: 'compose', // 'compose' | 'preview'
      sending: false,
      statusMessage: '',
      statusType: 'success',
      form: {
        target: 'single',
        recipientEmail: '',
        recipientName: '',
        subject: '',
        headline: '',
        offerBadge: 'Special Offer',
        discountCode: '',
        messageBody: '',
        buttonText: 'Shop Bespoke Frames Now',
        buttonLink: ''
      }
    }
  },
  computed: {
    ...mapGetters('customers', ['allCustomers']),
    ...mapGetters('settings', ['brandName', 'brandSubtitle', 'logoUrl']),
    previewBrandFormatted() {
      const name = this.brandName || 'Atelier Cadre'
      const words = name.split(' ')
      if (words.length > 1) {
        return {
          primary: words.slice(0, -1).join(' ') + ' ',
          accent: words[words.length - 1]
        }
      }
      if (name.length > 6) {
        const mid = Math.floor(name.length / 2)
        return {
          primary: name.slice(0, mid),
          accent: name.slice(mid)
        }
      }
      return {
        primary: name,
        accent: ''
      }
    }
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initForm()
        }
      }
    },
    initialCustomer: {
      immediate: true,
      handler(cust) {
        if (cust && this.isOpen) {
          this.initForm()
        }
      }
    }
  },
  methods: {
    ...mapActions('customers', ['sendCustomerEmail']),

    initForm() {
      this.statusMessage = ''
      this.activeTab = 'compose'
      const target = this.initialTarget || 'single'
      this.form.target = target

      if (this.initialCustomer && target === 'single') {
        this.form.recipientEmail = this.initialCustomer.email || ''
        this.form.recipientName = this.initialCustomer.fullName || ''
        // Default to a 15% exclusive discount preset for this specific customer
        this.applyPreset('discount15')
      } else if (target === 'all') {
        this.applyPreset('saleLive')
      } else {
        this.applyPreset('discount15')
      }
    },

    setTarget(target) {
      this.form.target = target
      if (target === 'all') {
        this.applyPreset('saleLive')
      } else if (this.initialCustomer) {
        this.form.recipientEmail = this.initialCustomer.email
        this.form.recipientName = this.initialCustomer.fullName
        this.applyPreset('discount15')
      }
    },

    applyPreset(presetKey) {
      if (presetKey === 'discount15') {
        this.form.offerBadge = 'Exclusive 15% Discount'
        this.form.subject = '🎁 An Exclusive 15% Off Your Next Handcrafted Frame!'
        this.form.discountCode = 'FRAME15'
        this.form.headline = 'A Special 15% Appreciation Gift Just For You'
        this.form.messageBody =
          'We loved crafting your previous custom frame! As one of our most cherished patrons, we are delighted to offer you an exclusive 15% discount on your next order.\n\nWhether it’s an anniversary milestone, a wedding portrait, or minimal gallery wall art, our artisans are ready to craft your next masterpiece.'
        this.form.buttonText = 'Claim 15% Off In Studio'
        this.form.buttonLink = `${window.location.origin}/frames`
      } else if (presetKey === 'saleLive') {
        const bName = this.brandName || 'Atelier Cadre'
        this.form.offerBadge = 'Studio Sale Live'
        this.form.subject = `✨ Grand ${bName} Festive Sale Is Officially Live!`
        this.form.discountCode = 'SALELIVE2026'
        this.form.headline = `Our Signature ${bName} Studio Sale Has Begun`
        this.form.messageBody =
          `Our grand seasonal studio sale is now officially live at ${bName}! Enjoy complimentary archival matting and up to 25% off across our entire solid Italian walnut, brushed champagne gold, and natural oak collections.\n\nDon’t let your favorite memories stay trapped on your phone—frame them into timeless museum-grade art today.`
        this.form.buttonText = 'Explore The Sale Now'
        this.form.buttonLink = `${window.location.origin}/frames`
      } else if (presetKey === 'newArrivals') {
        this.form.offerBadge = 'New Arrivals'
        this.form.subject = 'Introducing Our New Minimalist Italian Gallery Mouldings'
        this.form.discountCode = 'STUDIO10'
        this.form.headline = 'New Bespoke Mouldings & Archival Mat Designs'
        this.form.messageBody =
          'We have just added new handcrafted Italian walnut profiles and 16+ fresh occasion mat templates to our studio catalog. Tailored specifically for modern interiors and milestone gifting.'
        this.form.buttonText = 'Discover New Mouldings'
        this.form.buttonLink = `${window.location.origin}/frames`
      } else if (presetKey === 'custom') {
        this.form.offerBadge = 'Special Announcement'
        this.form.subject = ''
        this.form.discountCode = ''
        this.form.headline = ''
        this.form.messageBody = ''
        this.form.buttonText = 'Visit Studio Store'
        this.form.buttonLink = `${window.location.origin}/`
      }
    },

    handleClose() {
      if (!this.sending) {
        this.$emit('close')
      }
    },

    async handleSubmit() {
      if (!this.form.subject || !this.form.messageBody) {
        this.statusType = 'error'
        this.statusMessage = 'Subject and Message Body are required.'
        this.$toast?.warning(this.statusMessage, 'Incomplete Email')
        return
      }

      if (this.form.target === 'single' && !this.form.recipientEmail) {
        this.statusType = 'error'
        this.statusMessage = 'Please enter a valid recipient email address.'
        this.$toast?.warning(this.statusMessage, 'Recipient Required')
        return
      }

      this.sending = true
      this.statusMessage = ''

      try {
        const payload = {
          target: this.form.target,
          recipientEmail: this.form.recipientEmail,
          recipientName: this.form.recipientName,
          subject: this.form.subject,
          headline: this.form.headline,
          offerBadge: this.form.offerBadge,
          discountCode: this.form.discountCode,
          messageBody: this.form.messageBody,
          buttonText: this.form.buttonText,
          buttonLink: this.form.buttonLink
        }

        const res = await this.sendCustomerEmail(payload)
        this.statusType = 'success'
        this.statusMessage =
          res.message ||
          (this.form.target === 'all'
            ? `Broadcast sent to ${res.count || this.allCustomers.length} customers successfully!`
            : `Email sent to ${this.form.recipientEmail} successfully!`)

        this.$toast?.success(this.statusMessage, 'Email Dispatched')
        this.$emit('sent', res)

        setTimeout(() => {
          this.handleClose()
        }, 1800)
      } catch (err) {
        this.statusType = 'error'
        this.statusMessage = err.message || 'Failed to dispatch email. Please check network/server.'
        this.$toast?.error(this.statusMessage, 'Dispatch Failed')
      } finally {
        this.sending = false
      }
    }
  }
}
</script>
