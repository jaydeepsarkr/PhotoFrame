<template>
  <div class="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-cream-200">
      <div>
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          Your Framing Bag
        </span>
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900 mt-1">
          Shopping Cart
        </h1>
      </div>
      <router-link
        to="/frames"
        class="text-xs font-semibold text-charcoal-800 hover:text-gold-600 transition-colors"
      >
        ← Continue Browsing Frames
      </router-link>
    </div>

    <!-- Cart Content -->
    <div v-if="cartItems.length > 0" class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left: Cart Items List -->
      <div class="lg:col-span-8 space-y-4">
        <CartItem
          v-for="item in cartItems"
          :key="item.cartItemId"
          :item="item"
          @increase="onIncrease"
          @decrease="onDecrease"
          @edit="onEdit"
          @remove="onRemove"
        />
      </div>

      <!-- Right: Order Summary -->
      <div class="lg:col-span-4 lg:sticky lg:top-24">
        <OrderSummary
          title="Cart Summary"
          :subtotal="subtotal"
          :delivery="deliveryFee"
          :total="total"
        >
          <router-link
            to="/checkout"
            class="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-sm font-semibold transition-all shadow-elevated"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </OrderSummary>
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-else class="mt-12">
      <EmptyState
        title="Your framing bag is currently empty"
        description="Select a handcrafted frame, choose an occasion design, and upload your favorite photo to create a bespoke keepsake."
        action-text="Start Customizing a Frame"
        :action-to="`/customize/${selectedFrame?.id || 1}`"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ArrowRight } from 'lucide-vue-next'
import CartItem from '@/components/customer/CartItem.vue'
import OrderSummary from '@/components/customer/OrderSummary.vue'
import EmptyState from '@/components/common/EmptyState.vue'

export default {
  name: 'CartView',
  components: {
    ArrowRight,
    CartItem,
    OrderSummary,
    EmptyState
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'subtotal', 'deliveryFee', 'total']),
    ...mapGetters('customization', ['selectedFrame'])
  },
  methods: {
    onIncrease(item) {
      this.$store.dispatch('cart/updateQuantity', {
        cartItemId: item.cartItemId,
        quantity: item.quantity + 1
      })
      this.$toast?.info(`Updated quantity to ${item.quantity + 1}`, 'Cart Updated', 1500)
    },
    onDecrease(item) {
      if (item.quantity > 1) {
        this.$store.dispatch('cart/updateQuantity', {
          cartItemId: item.cartItemId,
          quantity: item.quantity - 1
        })
        this.$toast?.info(`Updated quantity to ${item.quantity - 1}`, 'Cart Updated', 1500)
      }
    },
    onEdit(item) {
      this.$store.dispatch('customization/loadCartItemForEdit', item)
      const frameId = item.frame?.id || 1
      this.$router.push(`/customize/${frameId}`)
    },
    onRemove(item) {
      const name = item.frame?.name || 'Custom frame'
      this.$store.dispatch('cart/removeFromCart', item.cartItemId)
      this.$toast?.info(`Removed "${name}" from your cart.`, 'Cart Updated')
    }
  }
}
</script>
