<template>
  <div>
    <!-- Mobile Backdrop -->
    <transition
      enter-active-class="transition-opacity ease-linear duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-charcoal-950/60 backdrop-blur-sm lg:hidden"
        @click="$emit('close')"
      ></div>
    </transition>

    <!-- Sidebar Drawer: Fixed permanently to one position -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-charcoal-900 text-cream-100 flex flex-col border-r border-charcoal-800 transition-transform duration-300 ease-in-out lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Brand Header -->
      <div class="h-20 px-6 flex items-center justify-between border-b border-charcoal-800">
        <router-link to="/admin" class="flex items-center gap-3 min-w-0" @click="$emit('close')">
          <!-- Custom Uploaded Logo or Default Frame Icon -->
          <div
            v-if="logoUrl"
            class="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
          >
            <img :src="logoUrl" :alt="brandName" class="w-full h-full object-contain p-1" />
          </div>
          <div
            v-else
            class="w-9 h-9 rounded-xl bg-gold-600 text-white flex items-center justify-center shadow-sm shrink-0"
          >
            <Frame class="w-5 h-5" />
          </div>

          <div class="min-w-0">
            <span class="block text-lg font-serif font-bold text-white leading-none truncate">
              {{ brandNameDisplay.primary }}<span class="text-gold-400">{{ brandNameDisplay.accent }}</span>
            </span>
            <span class="block text-[10px] uppercase tracking-[0.2em] text-cream-200/50 mt-1 truncate">
              {{ brandSubtitle || 'Studio Console' }}
            </span>
          </div>
        </router-link>

        <button
          type="button"
          class="p-1.5 rounded-lg text-cream-200/60 hover:text-white lg:hidden"
          @click="$emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          :class="[
            'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all',
            isActive(item)
              ? 'bg-gold-600 text-white shadow-sm'
              : 'text-cream-200/75 hover:bg-charcoal-800 hover:text-white'
          ]"
          @click="$emit('close')"
        >
          <div class="flex items-center gap-3">
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span>{{ item.label }}</span>
          </div>
          <span
            v-if="item.badge !== undefined"
            :class="[
              'px-2 py-0.5 rounded-full text-[11px] font-semibold',
              isActive(item) ? 'bg-white/20 text-white' : 'bg-charcoal-800 text-gold-300'
            ]"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Bottom Storefront & Admin Profile Section -->
      <div class="p-4 border-t border-charcoal-800 space-y-3">
        <!-- Admin Profile Pill -->
        <div class="p-2.5 rounded-xl bg-charcoal-800/80 border border-charcoal-700/60 flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-7 h-7 rounded-lg bg-gold-600/20 text-gold-400 border border-gold-500/30 flex items-center justify-center text-xs font-bold shrink-0">
              AD
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-medium text-cream-100 truncate">
                {{ adminName || 'Administrator' }}
              </span>
              <span class="block text-[10px] text-cream-300/60 truncate font-mono">
                {{ adminEmail || 'admin@ateliercadre.in' }}
              </span>
            </div>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-lg text-cream-300/70 hover:text-red-400 hover:bg-charcoal-700 transition-colors"
            title="Sign out"
            @click="handleLogout"
          >
            <LogOut class="w-3.5 h-3.5" />
          </button>
        </div>

        <router-link
          to="/"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-gold-600 text-cream-100 hover:text-white text-xs font-semibold transition-colors"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>Back to Customer Store</span>
        </router-link>
      </div>
    </aside>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  Frame,
  LayoutDashboard,
  Palette,
  ShoppingBag,
  Users,
  Settings,
  LayoutTemplate,
  LayoutGrid,
  Trash2,
  ExternalLink,
  X,
  LogOut
} from 'lucide-vue-next'

export default {
  name: 'AdminSidebar',
  components: {
    Frame,
    LayoutDashboard,
    Palette,
    ShoppingBag,
    Users,
    Settings,
    LayoutTemplate,
    LayoutGrid,
    Trash2,
    ExternalLink,
    X,
    LogOut
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  computed: {
    ...mapGetters([
      'adminName',
      'adminEmail',
      'deletedOrdersCount',
      'deletedCustomersCount',
      'deletedFramesCount',
      'deletedDesignsCount',
      'brandName',
      'brandSubtitle',
      'logoUrl'
    ]),
    ...mapGetters('frames', ['allFrames']),
    ...mapGetters('designs', ['allDesigns']),
    ...mapGetters('orders', ['allOrders']),
    ...mapGetters('customers', ['allCustomers']),

    brandNameDisplay() {
      const raw = this.brandName || 'AtelierAdmin'
      if (raw.toLowerCase().includes('admin')) {
        const idx = raw.toLowerCase().indexOf('admin')
        return {
          primary: raw.slice(0, idx),
          accent: raw.slice(idx)
        }
      }
      const words = raw.trim().split(' ')
      if (words.length > 1) {
        return {
          primary: words.slice(0, -1).join(' ') + ' ',
          accent: words[words.length - 1]
        }
      }
      return {
        primary: raw,
        accent: ''
      }
    },

    totalDeletedCount() {
      return (
        (this.deletedOrdersCount || 0) +
        (this.deletedCustomersCount || 0) +
        (this.deletedFramesCount || 0) +
        (this.deletedDesignsCount || 0)
      )
    },

    navItems() {
      return [
        {
          label: 'Dashboard',
          to: '/admin',
          exact: true,
          icon: 'LayoutDashboard'
        },
        {
          label: 'Frames',
          to: '/admin/frames',
          exact: false,
          icon: 'Frame',
          badge: this.allFrames.length
        },
        {
          label: 'Designs',
          to: '/admin/designs',
          exact: false,
          icon: 'Palette',
          badge: this.allDesigns.length
        },
        {
          label: 'Orders',
          to: '/admin/orders',
          exact: false,
          icon: 'ShoppingBag',
          badge: this.allOrders.length
        },
        {
          label: 'Customers',
          to: '/admin/orders?tab=customers',
          exact: true,
          icon: 'Users',
          badge: this.allCustomers.length
        },
        {
          label: 'Trash Bin',
          to: '/admin/orders?tab=trash',
          exact: true,
          icon: 'Trash2',
          badge: this.totalDeletedCount > 0 ? this.totalDeletedCount : undefined
        },
        {
          label: 'Store Sections',
          to: '/admin/sections',
          exact: true,
          icon: 'LayoutGrid'
        },
        {
          label: 'Footer Setup',
          to: '/admin/footer',
          exact: true,
          icon: 'LayoutTemplate'
        },
        {
          label: 'Settings',
          to: '/admin/settings',
          exact: true,
          icon: 'Settings'
        }
      ]
    }
  },
  mounted() {
    this.$store.dispatch('orders/fetchDeletedOrders').catch(() => {})
    this.$store.dispatch('customers/fetchDeletedCustomers').catch(() => {})
    this.$store.dispatch('frames/fetchDeletedFrames').catch(() => {})
    this.$store.dispatch('designs/fetchDeletedDesigns').catch(() => {})
  },
  methods: {
    ...mapActions('auth', ['logout']),
    handleLogout() {
      this.$emit('close')
      this.logout()
      this.$toast?.success('Logged out successfully. Have a great day!', 'Signed Out')
      this.$router.push('/admin/login')
    },
    isActive(item) {
      if (item.to.includes('?')) {
        return this.$route.fullPath === item.to
      }
      if (item.exact) {
        return this.$route.path === item.to && !this.$route.fullPath.includes('?')
      }
      return this.$route.path.startsWith(item.to) && !this.$route.fullPath.includes('?')
    }
  }
}
</script>
