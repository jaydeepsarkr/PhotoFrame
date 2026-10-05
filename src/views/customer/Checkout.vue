<template>
  <div class="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Top Stepper -->
    <div class="mb-8">
      <Stepper current-step="Details" @step-click="onStepClick" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      <!-- Left: Checkout Form -->
      <form
        class="lg:col-span-8 space-y-8"
        novalidate
        @submit.prevent="submitDetails"
      >
        <!-- Customer Information Section -->
        <div class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200 pb-4">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Contact Details
              </span>
              <h2 class="text-xl font-serif font-bold text-charcoal-900">
                Customer Information
              </h2>
            </div>

            <button
              type="button"
              class="text-xs font-semibold text-gold-700 hover:text-gold-800 bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-xl border border-gold-200 transition-colors"
              @click="fillDemoDetails"
            >
              Auto-Fill Demo Details
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Full Name -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                Full Name <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.fullName"
                type="text"
                placeholder="e.g., Jay Sharma"
                :class="inputClass('fullName')"
                @blur="validateField('fullName')"
              />
              <p v-if="errors.fullName" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.fullName }}
              </p>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                Phone Number <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.phone"
                type="tel"
                placeholder="e.g., +91 98201 44510"
                :class="inputClass('phone')"
                @blur="validateField('phone')"
              />
              <p v-if="errors.phone" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.phone }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                Email Address <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.email"
                type="email"
                placeholder="e.g., jay.sharma@example.com"
                :class="inputClass('email')"
                @blur="validateField('email')"
              />
              <p v-if="errors.email" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Delivery Address Section -->
        <div class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div class="border-b border-cream-200 pb-4">
            <span class="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Shipping Destination
            </span>
            <h2 class="text-xl font-serif font-bold text-charcoal-900">
              Delivery Address
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- House / Apartment -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                House / Apartment <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.house"
                type="text"
                placeholder="Flat / House No., Building, Apartment Name"
                :class="inputClass('house')"
                @blur="validateField('house')"
              />
              <p v-if="errors.house" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.house }}
              </p>
            </div>

            <!-- Street / Locality -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                Street / Locality <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.street"
                type="text"
                placeholder="Road Name, Area, Colony"
                :class="inputClass('street')"
                @blur="validateField('street')"
              />
              <p v-if="errors.street" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.street }}
              </p>
            </div>

            <!-- City -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                City <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.city"
                type="text"
                placeholder="e.g., Mumbai"
                :class="inputClass('city')"
                @blur="validateField('city')"
              />
              <p v-if="errors.city" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.city }}
              </p>
            </div>

            <!-- State -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                State <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.state"
                type="text"
                placeholder="e.g., Maharashtra"
                :class="inputClass('state')"
                @blur="validateField('state')"
              />
              <p v-if="errors.state" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.state }}
              </p>
            </div>

            <!-- PIN Code -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                PIN Code <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.pinCode"
                type="text"
                maxlength="6"
                placeholder="6-digit PIN Code"
                :class="inputClass('pinCode')"
                @blur="validateField('pinCode')"
              />
              <p v-if="errors.pinCode" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.pinCode }}
              </p>
            </div>

            <!-- Landmark -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                Landmark <span class="text-charcoal-800/45 font-normal">(Optional)</span>
              </label>
              <input
                v-model.trim="form.landmark"
                type="text"
                placeholder="e.g., Near Oberoi Mall"
                :class="inputClass('landmark')"
              />
            </div>

            <!-- Country -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
                Country <span class="text-rose-600">*</span>
              </label>
              <input
                v-model.trim="form.country"
                type="text"
                placeholder="India"
                :class="inputClass('country')"
                @blur="validateField('country')"
              />
              <p v-if="errors.country" class="mt-1.5 text-xs text-rose-600 font-medium">
                {{ errors.country }}
              </p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <router-link
              :to="`/customize/${activeItem.frame?.id || 1}`"
              class="w-full sm:w-auto text-center px-5 py-3.5 rounded-xl border border-cream-300 text-charcoal-900 hover:bg-cream-100 text-xs font-semibold transition-colors"
            >
              ← Back to Customization
            </router-link>

            <button
              type="submit"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-sm font-semibold transition-all shadow-elevated"
            >
              <span>Review Your Order</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      <!-- Right: Order Summary Sidebar -->
      <div class="lg:col-span-4 lg:sticky lg:top-24">
        <OrderSummary
          title="Your Custom Frame"
          :show-customization-details="true"
          :frame="activeItem.frame"
          :design="activeItem.design"
          :size="activeItem.size"
          :quantity="activeItem.quantity"
          :photo="activeItem.photo"
          :photos="activeItem.photos"
          :custom-text="activeItem.customText"
          :subtotal="effectiveSubtotal"
          :delivery="100"
          :total="effectiveSubtotal + 100"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ArrowRight } from 'lucide-vue-next'
import Stepper from '@/components/customer/Stepper.vue'
import OrderSummary from '@/components/customer/OrderSummary.vue'

export default {
  name: 'CheckoutView',
  components: {
    ArrowRight,
    Stepper,
    OrderSummary
  },
  data() {
    return {
      form: {
        fullName: '',
        phone: '',
        email: '',
        house: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        landmark: '',
        country: 'India'
      },
      errors: {}
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'subtotal']),
    ...mapGetters('customization', [
      'selectedFrame',
      'selectedDesign',
      'selectedSize',
      'quantity',
      'uploadedPhoto',
      'uploadedPhotos',
      'customText',
      'totalCustomizationPrice',
      'customerDetails'
    ]),
    activeItem() {
      if (this.cartItems.length > 0) {
        return this.cartItems[0]
      }
      return {
        frame: this.selectedFrame,
        design: this.selectedDesign,
        size: this.selectedSize,
        quantity: this.quantity,
        photo: this.uploadedPhoto,
        photos: this.uploadedPhotos,
        customText: this.customText
      }
    },
    effectiveSubtotal() {
      return this.cartItems.length > 0 ? this.subtotal : this.totalCustomizationPrice
    }
  },
  created() {
    if (this.customerDetails) {
      this.form = {
        ...this.form,
        ...this.customerDetails,
        country: this.customerDetails.country || 'India'
      }
    }
  },
  methods: {
    inputClass(field) {
      return [
        'w-full px-3.5 py-2.5 rounded-xl border text-sm text-charcoal-900 focus:outline-none focus:ring-2 transition-all',
        this.errors[field]
          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-600'
          : 'border-cream-300 bg-cream-50/50 focus:ring-gold-500/30 focus:border-gold-600'
      ]
    },
    validateField(field) {
      const val = String(this.form[field] || '').trim()
      const nextErrors = { ...this.errors }
      delete nextErrors[field]

      if (field === 'fullName') {
        if (!val || val.length < 2) {
          nextErrors.fullName = 'Please enter your full name (minimum 2 characters).'
        }
      } else if (field === 'phone') {
        const digits = val.replace(/\D/g, '')
        if (!val || digits.length < 10) {
          nextErrors.phone = 'Please enter a valid 10-digit phone number.'
        }
      } else if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!val || !emailRegex.test(val)) {
          nextErrors.email = 'Please enter a valid email address.'
        }
      } else if (field === 'house') {
        if (!val) {
          nextErrors.house = 'House / Apartment number is required.'
        }
      } else if (field === 'street') {
        if (!val) {
          nextErrors.street = 'Street / Locality is required.'
        }
      } else if (field === 'city') {
        if (!val) {
          nextErrors.city = 'City name is required.'
        }
      } else if (field === 'state') {
        if (!val) {
          nextErrors.state = 'State is required.'
        }
      } else if (field === 'pinCode') {
        if (!/^\d{6}$/.test(val)) {
          nextErrors.pinCode = 'Please enter a valid 6-digit PIN code.'
        }
      } else if (field === 'country') {
        if (!val) {
          nextErrors.country = 'Country is required.'
        }
      }

      this.errors = nextErrors
      return !nextErrors[field]
    },
    validateAll() {
      const requiredFields = [
        'fullName',
        'phone',
        'email',
        'house',
        'street',
        'city',
        'state',
        'pinCode',
        'country'
      ]
      let valid = true
      requiredFields.forEach(field => {
        if (!this.validateField(field)) {
          valid = false
        }
      })
      return valid
    },
    fillDemoDetails() {
      this.form = {
        fullName: 'Jay & Priya Sharma',
        phone: '+91 98201 44510',
        email: 'jay.sharma@example.com',
        house: 'Flat 1402, Oberoi Woods Tower B',
        street: 'Mohan Gokhale Road, Goregaon East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400063',
        landmark: 'Near Oberoi Mall',
        country: 'India'
      }
      this.errors = {}
      this.$toast?.info('Demo patron address details populated.', 'Demo Autofill')
    },
    onStepClick(step) {
      if (['Frame', 'Design', 'Customize'].includes(step.key)) {
        this.$router.push(`/customize/${this.activeItem.frame?.id || 1}`)
      } else if (step.key === 'Review') {
        this.submitDetails()
      }
    },
    submitDetails() {
      if (!this.validateAll()) {
        this.$toast?.warning('Please fill in all required delivery fields.', 'Incomplete Details')
        return
      }
      this.$store.dispatch('customization/setCustomerDetails', { ...this.form })
      this.$toast?.success('Shipping details confirmed. Reviewing your order...', 'Details Saved')
      this.$router.push('/order-review')
    }
  }
}
</script>
