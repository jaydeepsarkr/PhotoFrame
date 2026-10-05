<template>
  <div class="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-elevated text-center space-y-6">
      <!-- Celebratory Icon -->
      <div class="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-800">
          Thank You for Your Order
        </span>
        <h1 class="text-2xl sm:text-4xl font-serif font-bold text-charcoal-900">
          Order Placed Successfully 🎉
        </h1>
        <p class="text-sm text-charcoal-800/70 max-w-md mx-auto">
          Our master framers have received your custom artwork specifications and begun preparing your frame.
        </p>
      </div>

      <!-- Order Summary Card -->
      <div class="bg-cream-50 rounded-2xl border border-cream-200 p-5 sm:p-6 text-left space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-cream-200">
          <div>
            <span class="text-[11px] uppercase tracking-wider text-charcoal-800/55 font-semibold block">
              Order ID
            </span>
            <span class="font-mono text-base font-bold text-charcoal-900">
              {{ orderData.id }}
            </span>
          </div>
          <StatusBadge status="Order Received" label="Order Received" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-xs text-charcoal-800/60 block">Customer Name</span>
            <span class="font-semibold text-charcoal-900">{{ orderData.customer?.fullName }}</span>
          </div>
          <div>
            <span class="text-xs text-charcoal-800/60 block">Product</span>
            <span class="font-semibold text-charcoal-900">
              {{ orderData.product?.frameName }} ({{ formatSizeLabel(orderData.product?.size) }})
            </span>
          </div>
          <div>
            <span class="text-xs text-charcoal-800/60 block">Design</span>
            <span class="font-semibold text-charcoal-900">
              {{ orderData.product?.designName }} ({{ orderData.product?.designCategory }})
            </span>
          </div>
          <div>
            <span class="text-xs text-charcoal-800/60 block">Total Amount</span>
            <span class="text-base font-bold text-charcoal-900">
              {{ formatCurrency(orderData.pricing?.total) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        <router-link
          to="/frames"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <ShoppingBag class="w-4 h-4" />
          <span>Continue Shopping</span>
        </router-link>

        <button
          type="button"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 text-sm font-semibold transition-colors"
          @click="showOrderModal = true"
        >
          <FileText class="w-4 h-4 text-gold-600" />
          <span>View Order</span>
        </button>
      </div>
    </div>

    <!-- Detailed Order Modal when clicking "View Order" -->
    <Modal
      v-model="showOrderModal"
      :title="`Order Receipt • ${orderData.id}`"
      max-width="lg"
    >
      <div class="space-y-5 text-sm">
        <div class="flex items-center gap-4 bg-cream-50 p-4 rounded-2xl border border-cream-200">
          <img
            v-if="orderData.customization?.photo || orderData.product?.frameImage"
            :src="orderData.customization?.photo || orderData.product?.frameImage"
            alt="Framed photo"
            class="w-20 h-20 rounded-xl object-cover border border-cream-300 shrink-0"
          />
          <div class="space-y-1">
            <h4 class="font-serif font-bold text-base text-charcoal-900">
              {{ orderData.product?.frameName }}
            </h4>
            <p class="text-xs text-charcoal-800/75">
              Design: <strong>{{ orderData.product?.designName }}</strong> • Size: <strong>{{ formatSizeLabel(orderData.product?.size) }}</strong> • Qty: <strong>{{ orderData.product?.quantity }}</strong>
            </p>
            <p class="text-xs font-serif italic text-gold-800">
              "{{ orderData.customization?.customMessage }}" — {{ orderData.customization?.name }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-cream-200">
            <h5 class="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1.5">
              Customer Details
            </h5>
            <p class="font-semibold text-charcoal-900">{{ orderData.customer?.fullName }}</p>
            <p class="text-xs text-charcoal-800/75">{{ orderData.customer?.phone }}</p>
            <p class="text-xs text-charcoal-800/75">{{ orderData.customer?.email }}</p>
          </div>

          <div class="p-4 rounded-xl border border-cream-200">
            <h5 class="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1.5">
              Delivery Address
            </h5>
            <p class="text-xs text-charcoal-800 leading-relaxed">
              {{ orderData.customer?.address?.house }}, {{ orderData.customer?.address?.street }}<br />
              {{ orderData.customer?.address?.city }}, {{ orderData.customer?.address?.state }} - {{ orderData.customer?.address?.pinCode }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <router-link
          :to="`/admin/orders/${orderData.id}`"
          class="px-4 py-2 rounded-xl text-xs font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300"
        >
          Manage in Admin Panel
        </router-link>
        <button
          type="button"
          class="px-5 py-2 rounded-xl text-xs font-semibold bg-charcoal-900 text-white hover:bg-gold-600"
          @click="showOrderModal = false"
        >
          Close
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CheckCircle2, ShoppingBag, FileText } from 'lucide-vue-next'
import StatusBadge from '@/components/common/StatusBadge.vue'
import Modal from '@/components/common/Modal.vue'
import { formatCurrency, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'OrderSuccessView',
  components: {
    CheckCircle2,
    ShoppingBag,
    FileText,
    StatusBadge,
    Modal
  },
  data() {
    return {
      showOrderModal: false
    }
  },
  computed: {
    ...mapGetters('orders', ['getOrderById', 'lastPlacedOrder', 'allOrders']),
    orderData() {
      const routeId = this.$route.params.id
      const found = this.getOrderById(routeId)
      if (found) return found
      if (this.lastPlacedOrder) return this.lastPlacedOrder
      return this.allOrders[0] || {
        id: routeId || 'PF-20260930-001',
        status: 'Order Received',
        customer: { fullName: 'Jay & Priya Sharma' },
        product: {
          frameName: 'Classic Wooden Frame',
          designName: 'Romantic Gold',
          designCategory: 'Romantic',
          size: '12x18',
          quantity: 1
        },
        pricing: {
          subtotal: 799,
          delivery: 100,
          total: 899
        }
      }
    }
  },
  methods: {
    formatCurrency,
    formatSizeLabel
  }
}
</script>
