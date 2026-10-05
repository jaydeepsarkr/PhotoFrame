<template>
  <div class="space-y-8">
    <!-- KPI Statistics Grid (6 Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatsCard
        label="Total Orders"
        :value="orderStats.total"
        subtext="All-time studio orders"
        tone="gold"
      >
        <template #icon>
          <ShoppingBag class="w-5 h-5" />
        </template>
      </StatsCard>

      <StatsCard
        label="Pending Orders"
        :value="orderStats.pending"
        subtext="New & Confirmed"
        tone="amber"
      >
        <template #icon>
          <Clock class="w-5 h-5" />
        </template>
      </StatsCard>

      <StatsCard
        label="Processing"
        :value="orderStats.processing"
        subtext="In Workshop / Shipped"
        tone="purple"
      >
        <template #icon>
          <Hammer class="w-5 h-5" />
        </template>
      </StatsCard>

      <StatsCard
        label="Completed"
        :value="orderStats.completed"
        subtext="Successfully delivered"
        tone="emerald"
      >
        <template #icon>
          <CheckCircle2 class="w-5 h-5" />
        </template>
      </StatsCard>

      <StatsCard
        label="Total Frames"
        :value="allFrames.length"
        subtext="Active mouldings"
        tone="blue"
      >
        <template #icon>
          <Frame class="w-5 h-5" />
        </template>
      </StatsCard>

      <StatsCard
        label="Total Designs"
        :value="allDesigns.length"
        subtext="9 Occasion categories"
        tone="gold"
      >
        <template #icon>
          <Palette class="w-5 h-5" />
        </template>
      </StatsCard>
    </div>

    <!-- Quick Management Cards (4 Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <Frame class="w-4 h-4 text-gold-600" />
            <h3 class="font-serif font-semibold text-charcoal-900 dark:text-white">Frame Mouldings</h3>
          </div>
          <p class="text-xs text-charcoal-800/65 dark:text-cream-200/65">Add, edit, or update pricing &amp; sizes</p>
        </div>
        <div class="mt-4">
          <router-link
            to="/admin/frames/add"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-colors"
          >
            <span>+ Add Frame</span>
          </router-link>
        </div>
      </div>

      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <Palette class="w-4 h-4 text-gold-600" />
            <h3 class="font-serif font-semibold text-charcoal-900 dark:text-white">Design Templates</h3>
          </div>
          <p class="text-xs text-charcoal-800/65 dark:text-cream-200/65">Manage occasion borders &amp; themes</p>
        </div>
        <div class="mt-4">
          <router-link
            to="/admin/designs/add"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-colors"
          >
            <span>+ Add Design</span>
          </router-link>
        </div>
      </div>

      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <Settings class="w-4 h-4 text-gold-600" />
            <h3 class="font-serif font-semibold text-charcoal-900 dark:text-white">Studio Settings</h3>
          </div>
          <p class="text-xs text-charcoal-800/65 dark:text-cream-200/65">Theme mode, toggles, rates &amp; alerts</p>
        </div>
        <div class="mt-4">
          <router-link
            to="/admin/settings"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream-100 dark:bg-charcoal-700 hover:bg-gold-600 hover:text-white text-charcoal-900 dark:text-cream-100 text-xs font-semibold transition-colors"
          >
            <span>Configure Settings &rarr;</span>
          </router-link>
        </div>
      </div>

      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <ShoppingBag class="w-4 h-4 text-gold-600" />
            <h3 class="font-serif font-semibold text-charcoal-900 dark:text-white">Studio Revenue</h3>
          </div>
          <p class="text-xs text-charcoal-800/65 dark:text-cream-200/65">Active non-cancelled orders</p>
        </div>
        <div class="mt-4">
          <span class="text-xl font-serif font-bold text-gold-700 dark:text-gold-400">
            {{ formatCurrency(orderStats.revenue) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recent Orders Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-serif font-bold text-charcoal-900">
            Recent Orders
          </h2>
          <p class="text-xs text-charcoal-800/65">
            Latest custom framing orders placed by customers
          </p>
        </div>
        <router-link
          to="/admin/orders"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-900 hover:text-gold-600"
        >
          <span>View All Orders</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <OrderTable :orders="recentOrders" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ShoppingBag,
  Clock,
  Hammer,
  CheckCircle2,
  Frame,
  Palette,
  ArrowRight,
  Settings
} from 'lucide-vue-next'
import StatsCard from '@/components/admin/StatsCard.vue'
import OrderTable from '@/components/admin/OrderTable.vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'AdminDashboardView',
  components: {
    ShoppingBag,
    Clock,
    Hammer,
    CheckCircle2,
    Frame,
    Palette,
    ArrowRight,
    Settings,
    StatsCard,
    OrderTable
  },
  computed: {
    ...mapGetters('orders', ['allOrders', 'orderStats']),
    ...mapGetters('frames', ['allFrames']),
    ...mapGetters('designs', ['allDesigns']),
    recentOrders() {
      return this.allOrders.slice(0, 6)
    }
  },
  methods: {
    formatCurrency,
    resetDemoData() {
      localStorage.clear()
      window.location.reload()
    }
  }
}
</script>
