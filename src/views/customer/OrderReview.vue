<template>
  <div class="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Top Stepper -->
    <div class="mb-8">
      <Stepper current-step="Review" @step-click="onStepClick" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      <!-- Left: Complete Review Cards -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div class="flex items-center justify-between border-b border-cream-200 pb-4">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Final Verification
              </span>
              <h1 class="text-2xl font-serif font-bold text-charcoal-900">
                Review Your Order
              </h1>
            </div>
            <router-link
              :to="`/customize/${orderItem.frame?.id || 1}`"
              class="text-xs font-semibold text-gold-600 hover:underline"
            >
              Edit Frame / Design
            </router-link>
          </div>

          <!-- 1. Product Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream-50 rounded-2xl p-5 border border-cream-200">
            <div>
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-3">
                Product
              </h3>
              <dl class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <dt class="text-charcoal-800/65">Frame:</dt>
                  <dd class="font-semibold text-charcoal-900">{{ orderItem.frame?.name }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-charcoal-800/65">Design:</dt>
                  <dd class="font-semibold text-charcoal-900">{{ orderItem.design?.name }} ({{ orderItem.design?.category }})</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-charcoal-800/65">Size:</dt>
                  <dd class="font-semibold text-charcoal-900">{{ formatSizeLabel(orderItem.size) }} Inches</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-charcoal-800/65">Quantity:</dt>
                  <dd class="font-semibold text-charcoal-900">{{ orderItem.quantity }}</dd>
                </div>
              </dl>
            </div>

            <!-- 2. Customization Section -->
            <div>
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-3">
                Customization ({{ itemPhotos.length }} {{ itemPhotos.length === 1 ? 'Photo' : 'Photos' }})
              </h3>
              <div class="space-y-2.5">
                <div class="flex items-center gap-2 overflow-x-auto pb-1">
                  <img
                    v-for="(imgUrl, idx) in itemPhotos"
                    :key="idx"
                    :src="imgUrl"
                    :alt="`Customer photo ${idx + 1}`"
                    class="w-12 h-12 rounded-xl object-cover border border-cream-300 shrink-0"
                  />
                </div>
                <dl class="space-y-1 text-xs min-w-0">
                  <div>
                    <dt class="text-charcoal-800/60 inline">Name: </dt>
                    <dd class="font-semibold text-charcoal-900 inline">{{ orderItem.customText?.name || 'Jay & Priya' }}</dd>
                  </div>
                  <div>
                    <dt class="text-charcoal-800/60 inline">Date: </dt>
                    <dd class="font-semibold text-charcoal-900 inline">{{ orderItem.customText?.date || '30 September 2026' }}</dd>
                  </div>
                  <div>
                    <dt class="text-charcoal-800/60 inline">Custom message: </dt>
                    <dd class="font-serif italic text-charcoal-900 inline">"{{ orderItem.customText?.customMessage || 'Forever & Always ❤️' }}"</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- 3. Customer & 4. Delivery Address -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div class="p-5 rounded-2xl border border-cream-200 bg-white space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Customer
                </h3>
                <router-link to="/checkout" class="text-[11px] font-semibold text-gold-600 hover:underline">
                  Edit
                </router-link>
              </div>
              <p class="text-sm font-semibold text-charcoal-900">{{ effectiveCustomer.fullName }}</p>
              <p class="text-xs text-charcoal-800/75">{{ effectiveCustomer.phone }}</p>
              <p class="text-xs text-charcoal-800/75">{{ effectiveCustomer.email }}</p>
            </div>

            <div class="p-5 rounded-2xl border border-cream-200 bg-white space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Delivery Address
                </h3>
                <router-link to="/checkout" class="text-[11px] font-semibold text-gold-600 hover:underline">
                  Edit
                </router-link>
              </div>
              <p class="text-xs text-charcoal-900 leading-relaxed">
                {{ effectiveCustomer.house }}, {{ effectiveCustomer.street }}<br />
                <span v-if="effectiveCustomer.landmark">Landmark: {{ effectiveCustomer.landmark }}<br /></span>
                {{ effectiveCustomer.city }}, {{ effectiveCustomer.state }} – <strong>{{ effectiveCustomer.pinCode }}</strong><br />
                {{ effectiveCustomer.country }}
              </p>
            </div>
          </div>

          <!-- 5. Pricing Breakdown & Place Order Button -->
          <div class="p-5 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Pricing
            </h3>
            <div class="flex justify-between text-sm text-charcoal-800">
              <span>Product Price</span>
              <span class="font-semibold text-charcoal-900">{{ formatCurrency(productPrice) }}</span>
            </div>
            <div class="flex justify-between text-sm text-charcoal-800">
              <span>Delivery</span>
              <span class="font-semibold text-charcoal-900">{{ formatCurrency(deliveryCost) }}</span>
            </div>
            <div class="pt-3 border-t border-cream-200 flex justify-between items-center">
              <span class="text-base font-serif font-bold text-charcoal-900">Total</span>
              <span class="text-2xl font-bold text-charcoal-900">{{ formatCurrency(finalTotal) }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <router-link
              to="/checkout"
              class="w-full sm:w-auto text-center px-5 py-3.5 rounded-xl border border-cream-300 text-charcoal-900 hover:bg-cream-100 text-xs font-semibold transition-colors"
            >
              ← Back to Address Details
            </router-link>

            <button
              type="button"
              :disabled="placingOrder"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-sm font-semibold transition-all shadow-elevated disabled:opacity-50"
              @click="handlePlaceOrder"
            >
              <CheckCircle2 class="w-4 h-4 text-gold-300" />
              <span>{{ placingOrder ? 'Placing Order...' : 'Place Order' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Live Frame Preview -->
      <div class="lg:col-span-5 lg:sticky lg:top-24">
        <FramePreview
          :frame="orderItem.frame"
          :design="orderItem.design"
          :size="orderItem.size"
          :photo="orderItem.photo"
          :photos="orderItem.photos"
          :custom-text="orderItem.customText"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CheckCircle2 } from 'lucide-vue-next'
import Stepper from '@/components/customer/Stepper.vue'
import FramePreview from '@/components/customer/FramePreview.vue'
import { formatCurrency, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'OrderReviewView',
  components: {
    CheckCircle2,
    Stepper,
    FramePreview
  },
  data() {
    return {
      placingOrder: false
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
      'customDescription',
      'totalCustomizationPrice',
      'customerDetails'
    ]),
    orderItem() {
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
        customText: this.customText,
        customDescription: this.customDescription
      }
    },
    itemPhotos() {
      if (Array.isArray(this.orderItem.photos) && this.orderItem.photos.length) {
        return this.orderItem.photos.map(p => (typeof p === 'string' ? p : p.url)).filter(Boolean)
      }
      return this.orderItem.photo ? [this.orderItem.photo] : []
    },
    effectiveCustomer() {
      if (this.customerDetails?.fullName) {
        return this.customerDetails
      }
      return {
        fullName: 'Jay & Priya Sharma',
        phone: '+91 98201 44510',
        email: 'jay.sharma@example.com',
        house: 'Flat 1402, Oberoi Woods Tower B',
        street: 'Goregaon East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400063',
        landmark: 'Near Oberoi Mall',
        country: 'India'
      }
    },
    productPrice() {
      return this.cartItems.length > 0 ? this.subtotal : this.totalCustomizationPrice
    },
    deliveryCost() {
      return 100
    },
    finalTotal() {
      return this.productPrice + this.deliveryCost
    }
  },
  methods: {
    formatCurrency,
    formatSizeLabel,
    onStepClick(step) {
      if (['Frame', 'Design', 'Customize'].includes(step.key)) {
        this.$router.push(`/customize/${this.orderItem.frame?.id || 1}`)
      } else if (step.key === 'Details') {
        this.$router.push('/checkout')
      }
    },
    async handlePlaceOrder() {
      this.placingOrder = true
      try {
        const item = this.orderItem
        const cust = this.effectiveCustomer
        const payload = {
          customer: {
            fullName: cust.fullName,
            phone: cust.phone,
            email: cust.email,
            address: {
              house: cust.house,
              street: cust.street,
              city: cust.city,
              state: cust.state,
              pinCode: cust.pinCode,
              landmark: cust.landmark || '',
              country: cust.country || 'India'
            }
          },
          product: {
            frameId: item.frame?.id || 1,
            frameName: item.frame?.name || 'Classic Wooden Frame',
            frameMaterial: item.frame?.material || 'Wood',
            frameImage: item.frame?.image || '',
            designId: item.design?.id || 1,
            designName: item.design?.name || 'Romantic Gold',
            designCategory: item.design?.category || 'Romantic',
            size: item.size || '8x10',
            quantity: item.quantity || 1
          },
          customization: {
            photo: this.itemPhotos[0] || '',
            photos: this.itemPhotos,
            name: item.customText?.name || 'Jay & Priya',
            date: item.customText?.date || '30 September 2026',
            customMessage: item.customText?.customMessage || 'Forever & Always ❤️',
            description: item.customDescription || this.customDescription || ''
          },
          pricing: {
            subtotal: this.productPrice,
            delivery: this.deliveryCost,
            total: this.finalTotal
          }
        }

        const createdOrder = await this.$store.dispatch('orders/createOrder', payload)
        this.$toast?.success(`Order #${createdOrder.id} confirmed! Dispatched confirmation email.`, 'Order Placed')
        await this.$store.dispatch('cart/clearCart')
        this.$router.push(`/order-success/${createdOrder.id}`)
      } catch (err) {
        this.$toast?.error(err.message || 'Failed to place order. Please verify your connection.', 'Order Failed')
      } finally {
        this.placingOrder = false
      }
    }
  }
}
</script>
