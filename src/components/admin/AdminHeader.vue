<template>
  <header class="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-cream-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="p-2.5 rounded-xl border border-cream-300 text-charcoal-900 hover:bg-cream-100 lg:hidden"
        aria-label="Open admin sidebar"
        @click="$emit('toggle-sidebar')"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div>
        <h1 class="text-lg sm:text-xl font-serif font-bold text-charcoal-900">
          {{ pageTitle }}
        </h1>
        <p class="text-xs text-charcoal-800/60 hidden sm:block">
          Manage bespoke photo frames, design templates, and customer orders
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <!-- Dark Mode Toggle (Hidden if disabled in studio settings) -->
      <button
        v-if="allowThemeToggle"
        type="button"
        class="p-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 transition-colors"
        :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        aria-label="Toggle dark mode"
        @click="handleThemeToggle"
      >
        <Sun v-if="darkMode" class="w-4 h-4 text-gold-400" />
        <Moon v-else class="w-4 h-4 text-charcoal-800" />
      </button>

      <router-link
        to="/admin/frames/add"
        class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 text-xs font-semibold transition-colors"
      >
        <Plus class="w-3.5 h-3.5 text-gold-600" />
        <span>New Frame</span>
      </router-link>

      <router-link
        to="/admin/designs/add"
        class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 text-xs font-semibold transition-colors"
      >
        <Plus class="w-3.5 h-3.5 text-gold-600" />
        <span>New Design</span>
      </router-link>

      <router-link
        to="/"
        class="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 text-xs font-semibold transition-colors"
      >
        <Store class="w-3.5 h-3.5" />
        <span>Storefront</span>
      </router-link>

      <!-- Admin Profile & Logout -->
      <div class="flex items-center gap-2 pl-2 border-l border-cream-300 dark:border-charcoal-700">
        <div class="hidden lg:flex flex-col text-right">
          <span class="text-xs font-semibold text-charcoal-900 dark:text-cream-100 leading-tight">
            {{ adminName || 'Admin' }}
          </span>
          <span class="text-[10px] text-charcoal-500 dark:text-cream-400 font-mono">
            {{ adminEmail || 'admin@ateliercadre.in' }}
          </span>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 text-xs font-semibold transition-colors"
          title="Sign out of Admin Console"
          @click="handleLogout"
        >
          <LogOut class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Menu, Plus, Store, Sun, Moon, LogOut } from 'lucide-vue-next'

export default {
  name: 'AdminHeader',
  components: {
    Menu,
    Plus,
    Store,
    Sun,
    Moon,
    LogOut
  },
  emits: ['toggle-sidebar'],
  computed: {
    ...mapGetters(['darkMode', 'adminName', 'adminEmail', 'allowThemeToggle']),
    pageTitle() {
      const path = this.$route.path
      if (path === '/admin') return 'Admin Dashboard'
      if (path.startsWith('/admin/sections')) return 'Storefront Sections & Modules'
      if (path.startsWith('/admin/footer')) return 'Storefront Footer & Navigation'
      if (path.startsWith('/admin/settings')) return 'Studio Settings & Configuration'
      if (path.includes('/admin/frames/add') || path.includes('/admin/frames/edit')) return 'Frame Editor'
      if (path.startsWith('/admin/frames')) return 'Frame Catalog Management'
      if (path.includes('/admin/designs/add') || path.includes('/admin/designs/edit')) return 'Design Template Editor'
      if (path.startsWith('/admin/designs')) return 'Design Library Management'
      if (path.startsWith('/admin/orders/')) return 'Order Details & Fulfillment'
      if (path.startsWith('/admin/orders')) {
        if (this.$route.query.tab === 'trash') return 'Recently Deleted (Trash Bin)'
        if (this.$route.query.tab === 'customers') return 'Customer Directory & Marketing'
        return 'Customer Orders & Fulfillment'
      }
      return 'Admin Studio'
    }
  },
  methods: {
    ...mapActions(['toggleDarkMode']),
    ...mapActions('auth', ['logout']),
    handleThemeToggle() {
      this.toggleDarkMode()
      const isDark = this.darkMode
      this.$toast?.info(
        isDark ? 'Switched to Admin Dark Mode' : 'Switched to Admin Light Mode',
        'Theme Mode',
        2200
      )
    },
    handleLogout() {
      this.logout()
      this.$toast?.success('Logged out successfully. Have a great day!', 'Signed Out')
      this.$router.push('/admin/login')
    }
  }
}
</script>
