<template>
  <div v-if="order" class="space-y-6">
    <!-- Top Header & Status Update Bar -->
    <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <router-link
            to="/admin/orders"
            class="text-xs font-semibold text-charcoal-800/70 hover:text-charcoal-900"
          >
            ← Back to Orders
          </router-link>
          <span class="text-charcoal-800/30">•</span>
          <span class="text-xs text-charcoal-800/60">Placed on {{ formatDate(order.date) }}</span>
        </div>
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-serif font-bold text-charcoal-900 font-mono">
            {{ order.id }}
          </h2>
          <StatusBadge :status="order.status" />
        </div>
      </div>

      <!-- Order Status Control -->
      <div class="flex flex-wrap items-center gap-3">
        <label class="text-xs font-semibold uppercase tracking-wider text-charcoal-800/70">
          Order Status:
        </label>
        <select
          v-model="selectedStatus"
          class="px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-gold-600"
        >
          <option v-for="st in statusList" :key="st" :value="st">
            {{ st }}
          </option>
        </select>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
          @click="saveStatus"
        >
          <Check class="w-4 h-4" />
          <span>Update Status</span>
        </button>
      </div>
    </div>

    <!-- Status Saved Banner -->
    <div
      v-if="statusSavedNotice"
      class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between"
    >
      <span>Order {{ order.id }} status updated to "{{ order.status }}".</span>
      <button type="button" class="underline" @click="statusSavedNotice = false">Dismiss</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left 7 Columns: Customer, Address, Product, Customization, Pricing -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Customer Information & Delivery Address -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600 border-b border-cream-200 pb-2.5">
              Customer Information
            </h3>
            <dl class="space-y-2 text-xs">
              <div>
                <dt class="text-charcoal-800/60">Name</dt>
                <dd class="font-semibold text-sm text-charcoal-900">{{ order.customer?.fullName }}</dd>
              </div>
              <div>
                <dt class="text-charcoal-800/60">Phone</dt>
                <dd class="font-semibold text-charcoal-900">{{ order.customer?.phone }}</dd>
              </div>
              <div>
                <dt class="text-charcoal-800/60">Email</dt>
                <dd class="font-semibold text-charcoal-900">{{ order.customer?.email }}</dd>
              </div>
            </dl>
          </div>

          <div class="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600 border-b border-cream-200 pb-2.5">
              Delivery Address
            </h3>
            <div class="text-xs text-charcoal-900 leading-relaxed space-y-1">
              <p class="font-semibold">{{ order.customer?.address?.house }}</p>
              <p>{{ order.customer?.address?.street }}</p>
              <p v-if="order.customer?.address?.landmark" class="text-charcoal-800/70">
                Landmark: {{ order.customer.address.landmark }}
              </p>
              <p>
                {{ order.customer?.address?.city }}, {{ order.customer?.address?.state }} –
                <strong>{{ order.customer?.address?.pinCode }}</strong>
              </p>
              <p>{{ order.customer?.address?.country || 'India' }}</p>
            </div>
          </div>
        </div>

        <!-- Product & Customization Details -->
        <div class="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-6">
          <div class="border-b border-cream-200 pb-3">
            <h3 class="text-sm font-serif font-bold text-charcoal-900">
              Product &amp; Customization Specifications
            </h3>
          </div>

          <!-- Product Info -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-cream-50 p-4 rounded-xl border border-cream-200 text-xs">
            <div>
              <span class="text-charcoal-800/60 block">Frame</span>
              <strong class="text-charcoal-900">{{ order.product?.frameName }}</strong>
            </div>
            <div>
              <span class="text-charcoal-800/60 block">Design</span>
              <strong class="text-charcoal-900">{{ order.product?.designName }}</strong>
            </div>
            <div>
              <span class="text-charcoal-800/60 block">Size</span>
              <strong class="text-charcoal-900">{{ formatSizeLabel(order.product?.size) }} Inches</strong>
            </div>
            <div>
              <span class="text-charcoal-800/60 block">Quantity</span>
              <strong class="text-charcoal-900">{{ order.product?.quantity }}</strong>
            </div>
          </div>

          <!-- Uploaded Photos Gallery -->
          <div class="space-y-2">
            <span class="text-xs font-semibold text-charcoal-800/70 block">
              Uploaded Customer Photos ({{ orderPhotos.length }})
            </span>
            <div class="flex flex-wrap items-center gap-3">
              <div
                v-for="(imgUrl, idx) in orderPhotos"
                :key="idx"
                class="w-24 h-24 rounded-xl overflow-hidden border border-cream-300 bg-cream-100 shrink-0"
              >
                <img
                  :src="imgUrl"
                  :alt="`Customer Photo ${idx + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Customization Details -->
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full">
            <div class="p-3 rounded-xl bg-cream-50 border border-cream-200">
              <dt class="text-charcoal-800/60">Custom Name</dt>
              <dd class="font-semibold text-charcoal-900 mt-0.5">{{ order.customization?.name || '—' }}</dd>
            </div>
            <div class="p-3 rounded-xl bg-cream-50 border border-cream-200">
              <dt class="text-charcoal-800/60">Special Date</dt>
              <dd class="font-semibold text-charcoal-900 mt-0.5">{{ order.customization?.date || '—' }}</dd>
            </div>
            <div class="sm:col-span-2 p-3 rounded-xl bg-cream-50 border border-cream-200">
              <dt class="text-charcoal-800/60">Custom Message</dt>
              <dd class="font-serif italic text-sm text-charcoal-900 mt-0.5">
                "{{ order.customization?.customMessage || '—' }}"
              </dd>
            </div>
            <div class="sm:col-span-2 p-3 rounded-xl bg-cream-50 border border-cream-200">
              <dt class="text-charcoal-800/60">Description / Framing Notes</dt>
              <dd class="text-charcoal-800 mt-0.5">
                {{ order.customization?.description || 'Standard archival studio finish.' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Payment / Pricing Breakdown -->
        <div class="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-gold-600 border-b border-cream-200 pb-2.5">
            Payment / Pricing
          </h3>
          <div class="flex justify-between text-sm text-charcoal-800">
            <span>Subtotal</span>
            <span class="font-semibold text-charcoal-900">{{ formatCurrency(order.pricing?.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm text-charcoal-800">
            <span>Delivery</span>
            <span class="font-semibold text-charcoal-900">
              {{ order.pricing?.delivery === 0 ? 'FREE' : formatCurrency(order.pricing?.delivery) }}
            </span>
          </div>
          <div class="pt-3 border-t border-cream-200 flex justify-between items-center">
            <span class="text-base font-serif font-bold text-charcoal-900">Total</span>
            <span class="text-xl font-bold text-charcoal-900">{{ formatCurrency(order.pricing?.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Right 5 Columns: Live Workshop Mockup Preview -->
      <div class="lg:col-span-5">
        <FramePreview
          :frame="resolvedFrame"
          :design="resolvedDesign"
          :size="order.product?.size || '12x18'"
          :photo="order.customization?.photo"
          :photos="orderPhotos"
          :custom-text="{
            name: order.customization?.name,
            date: order.customization?.date,
            customMessage: order.customization?.customMessage
          }"
        />
      </div>
    </div>
  </div>

  <div v-else class="py-12">
    <EmptyState
      title="Order Not Found"
      description="Could not locate the requested order ID."
      action-text="Back to All Orders"
      action-to="/admin/orders"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Check } from 'lucide-vue-next'
import StatusBadge from '@/components/common/StatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import FramePreview from '@/components/customer/FramePreview.vue'
import { ORDER_STATUSES } from '@/store/modules/orders'
import { formatCurrency, formatDate, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'AdminOrderDetailsView',
  components: {
    Check,
    StatusBadge,
    EmptyState,
    FramePreview
  },
  data() {
    return {
      selectedStatus: 'New',
      statusList: ORDER_STATUSES,
      statusSavedNotice: false
    }
  },
  computed: {
    ...mapGetters('orders', ['getOrderById']),
    ...mapGetters('frames', ['getFrameById']),
    ...mapGetters('designs', ['getDesignById']),
    order() {
      return this.getOrderById(this.$route.params.id)
    },
    orderPhotos() {
      if (Array.isArray(this.order?.customization?.photos) && this.order.customization.photos.length) {
        return this.order.customization.photos.map(p => (typeof p === 'string' ? p : p.url)).filter(Boolean)
      }
      return this.order?.customization?.photo ? [this.order.customization.photo] : []
    },
    resolvedFrame() {
      if (!this.order) return {}
      return this.getFrameById(this.order.product?.frameId) || {
        name: this.order.product?.frameName,
        material: this.order.product?.frameMaterial || 'Wood'
      }
    },
    resolvedDesign() {
      if (!this.order) return {}
      return this.getDesignById(this.order.product?.designId) || {
        name: this.order.product?.designName,
        category: this.order.product?.designCategory || 'Romantic'
      }
    }
  },
  watch: {
    order: {
      immediate: true,
      handler(val) {
        if (val?.status) {
          this.selectedStatus = val.status
        }
      }
    }
  },
  methods: {
    formatCurrency,
    formatDate,
    formatSizeLabel,
    async saveStatus() {
      if (!this.order) return
      try {
        await this.$store.dispatch('orders/updateOrderStatus', {
          id: this.order.id,
          status: this.selectedStatus
        })
        this.statusSavedNotice = true
        this.$toast?.success(`Order ${this.order.id} status updated to "${this.selectedStatus}".`, 'Order Updated')
      } catch (err) {
        this.$toast?.error(err.message || 'Failed to update order status.', 'Update Failed')
      }
    }
  }
}
</script>
