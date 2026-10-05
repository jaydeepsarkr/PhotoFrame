<template>
  <div class="space-y-8">
    <!-- SaaS Tenant Dedicated Storefront Banner -->
    <div class="rounded-2xl bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-charcoal-900 text-white p-5 sm:p-6 border border-gold-500/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="space-y-1.5 z-10">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30">
            SaaS Studio Storefront
          </span>
          <span class="text-xs text-cream-300/70 font-mono">Tenant ID: @{{ currentAdminId }}</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-serif font-bold text-cream-100">
          {{ currentStudioName }}
        </h2>
        <p class="text-xs sm:text-sm text-cream-200/80 flex items-center gap-2 font-mono">
          <Globe class="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span class="truncate">{{ fullStorefrontUrl }}</span>
        </p>
      </div>

      <div class="flex items-center gap-2.5 w-full sm:w-auto z-10 shrink-0">
        <button
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 border border-charcoal-700 hover:border-gold-500/50 text-xs font-semibold transition-all shadow-sm"
          @click="copyStoreUrl"
        >
          <Copy class="w-3.5 h-3.5 text-gold-400" />
          <span>Copy Storefront Link</span>
        </button>

        <a
          :href="storefrontPath"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-white text-xs font-semibold transition-all shadow-sm"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>Visit Store</span>
        </a>
      </div>
    </div>

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
  Settings,
  Globe,
  Copy,
  ExternalLink
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
    Globe,
    Copy,
    ExternalLink,
    StatsCard,
    OrderTable
  },
  computed: {
    ...mapGetters(['adminId', 'studioName', 'brandName']),
    ...mapGetters('orders', ['allOrders', 'orderStats']),
    ...mapGetters('frames', ['allFrames']),
    ...mapGetters('designs', ['allDesigns']),
    currentAdminId() {
      return this.adminId || 'jaydeep'
    },
    currentStudioName() {
      return this.brandName || this.studioName || 'Atelier Cadre'
    },
    storefrontPath() {
      return `/s/${this.currentAdminId}`
    },
    fullStorefrontUrl() {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://framevue.onrender.com'
      return `${origin}/s/${this.currentAdminId}`
    },
    recentOrders() {
      return this.allOrders.slice(0, 6)
    }
  },
  methods: {
    formatCurrency,
    copyStoreUrl() {
      const url = this.fullStorefrontUrl
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
        this.$toast?.success(`Copied store link: ${url}`, 'Storefront Link Copied')
      } else {
        this.$toast?.info(`Storefront URL: ${url}`, 'Storefront Link')
      }
    },
    resetDemoData() {
      localStorage.clear()
      window.location.reload()
    }
  }
}
</script>
