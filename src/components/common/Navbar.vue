<template>
  <div class="sticky top-0 z-40">
    <!-- Announcement Banner Ribbon -->
    <div
      v-if="announcementBanner && announcementBanner.enabled && announcementBanner.text"
      class="bg-charcoal-950 text-gold-300 text-xs py-2 px-4 text-center border-b border-gold-800/40 font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm"
    >
      <span>{{ announcementBanner.text }}</span>
    </div>

    <header class="bg-cream-50/95 backdrop-blur-md border-b border-cream-200/80 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Dynamic Brand Logo / Studio Identity -->
          <router-link
            :to="storeUrl('/')"
            class="flex items-center gap-3 group focus:outline-none"
          >
            <div v-if="logoUrl" class="h-10 max-w-[150px] flex items-center justify-center">
              <img :src="logoUrl" :alt="brandName" class="max-h-10 max-w-[150px] object-contain" />
            </div>
            <div v-else class="w-10 h-10 rounded-xl bg-charcoal-900 dark:bg-gold-600 text-gold-400 dark:text-white flex items-center justify-center shadow-sm group-hover:bg-gold-600 group-hover:text-white transition-colors">
              <Frame class="w-5 h-5" />
            </div>
            <div>
              <span class="block text-xl font-serif font-bold tracking-tight text-charcoal-900">
                {{ brandName || 'Atelier Cadre' }}
              </span>
              <span class="block text-[10px] uppercase tracking-[0.22em] text-charcoal-800/60 font-medium">
                {{ brandSubtitle || 'Custom Framing Studio' }}
              </span>
            </div>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-7">
            <router-link
              :to="storeUrl('/')"
              class="text-sm font-medium transition-colors"
              :class="isExactActive('/') ? 'text-gold-600 font-semibold' : 'text-charcoal-800/80 hover:text-charcoal-900'"
            >
              Home
            </router-link>
            <router-link
              :to="storeUrl('/frames')"
              class="text-sm font-medium transition-colors"
              :class="isPathActive('/frames') ? 'text-gold-600 font-semibold' : 'text-charcoal-800/80 hover:text-charcoal-900'"
            >
              Frames
            </router-link>
            <!-- Designs link (hidden if disabled in studio settings) -->
            <router-link
              v-if="enableDesignSection"
              :to="storeUrl('/customize/' + defaultFrameId)"
              class="text-sm font-medium transition-colors"
              :class="isPathActive('/customize') ? 'text-gold-600 font-semibold' : 'text-charcoal-800/80 hover:text-charcoal-900'"
            >
              Designs
            </router-link>
            <a
              href="#how-it-works"
              class="text-sm font-medium text-charcoal-800/80 hover:text-charcoal-900 transition-colors"
              @click.prevent="navigateSection('how-it-works')"
            >
              How It Works
            </a>
            <a
              href="#contact"
              class="text-sm font-medium text-charcoal-800/80 hover:text-charcoal-900 transition-colors"
              @click.prevent="navigateSection('contact')"
            >
              Contact
            </a>
          </nav>

          <!-- Right Actions -->
          <div class="hidden md:flex items-center gap-2.5">
            <!-- Dark Mode Toggle (Hidden if disabled in studio settings) -->
            <button
              v-if="allowThemeToggle"
              type="button"
              class="p-2.5 rounded-xl bg-white hover:bg-cream-100 text-charcoal-900 border border-cream-300 transition-colors shadow-sm"
              :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              aria-label="Toggle dark mode"
              @click="handleThemeToggle"
            >
              <Sun v-if="darkMode" class="w-4 h-4 text-gold-400" />
              <Moon v-else class="w-4 h-4 text-charcoal-800" />
            </button>

            <router-link
              to="/admin"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-charcoal-800/80 hover:text-charcoal-900 bg-cream-100 hover:bg-cream-200 border border-cream-300/70 transition-colors"
              title="Switch to Admin Panel"
            >
              <ShieldCheck class="w-4 h-4 text-gold-600" />
              <span>Admin</span>
            </router-link>

            <router-link
              :to="storeUrl('/cart')"
              class="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-cream-100 text-charcoal-900 border border-cream-300 text-sm font-medium transition-all shadow-sm"
            >
              <ShoppingBag class="w-4 h-4 text-gold-600" />
              <span>Cart</span>
              <span
                v-if="cartCount > 0"
                class="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gold-600 text-white text-xs font-semibold"
              >
                {{ cartCount }}
              </span>
            </router-link>

            <router-link
              :to="storeUrl('/customize/' + defaultFrameId)"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 dark:hover:bg-gold-500 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Sparkles class="w-4 h-4" />
              <span>Create Frame</span>
            </router-link>
          </div>

          <!-- Mobile Menu, Dark Mode & Cart Trigger -->
          <div class="flex items-center gap-2 md:hidden">
            <!-- Mobile Dark Mode Button (Hidden if disabled in studio settings) -->
            <button
              v-if="allowThemeToggle"
              type="button"
              class="p-2.5 rounded-xl bg-white border border-cream-300 text-charcoal-900"
              aria-label="Toggle dark mode"
              @click="handleThemeToggle"
            >
              <Sun v-if="darkMode" class="w-5 h-5 text-gold-400" />
              <Moon v-else class="w-5 h-5 text-charcoal-800" />
            </button>

            <router-link
              :to="storeUrl('/cart')"
              class="relative p-2.5 rounded-xl bg-white border border-cream-300 text-charcoal-900"
              aria-label="Shopping Cart"
            >
              <ShoppingBag class="w-5 h-5 text-gold-600" />
              <span
                v-if="cartCount > 0"
                class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold-600 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {{ cartCount }}
              </span>
            </router-link>

            <button
              type="button"
              class="p-2.5 rounded-xl bg-white border border-cream-300 text-charcoal-900 hover:bg-cream-100 transition-colors"
              @click="mobileMenuOpen = !mobileMenuOpen"
              aria-label="Toggle navigation menu"
            >
              <X v-if="mobileMenuOpen" class="w-5 h-5" />
              <Menu v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden bg-white border-b border-cream-200 px-4 pt-3 pb-6 space-y-2 shadow-elevated"
        >
          <router-link
            :to="storeUrl('/')"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal-900 hover:bg-cream-100"
            @click="mobileMenuOpen = false"
          >
            <span>Home</span>
            <ChevronRight class="w-4 h-4 text-charcoal-800/40" />
          </router-link>
          <router-link
            :to="storeUrl('/frames')"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal-900 hover:bg-cream-100"
            @click="mobileMenuOpen = false"
          >
            <span>Browse Frames</span>
            <ChevronRight class="w-4 h-4 text-charcoal-800/40" />
          </router-link>
          <!-- Mobile Designs link (hidden if disabled) -->
          <router-link
            v-if="enableDesignSection"
            :to="storeUrl('/customize/' + defaultFrameId)"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal-900 hover:bg-cream-100"
            @click="mobileMenuOpen = false"
          >
            <span>Designs &amp; Customize</span>
            <ChevronRight class="w-4 h-4 text-charcoal-800/40" />
          </router-link>
          <a
            href="#how-it-works"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal-900 hover:bg-cream-100"
            @click.prevent="navigateSection('how-it-works')"
          >
            <span>How It Works</span>
            <ChevronRight class="w-4 h-4 text-charcoal-800/40" />
          </a>
          <a
            href="#contact"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal-900 hover:bg-cream-100"
            @click.prevent="navigateSection('contact')"
          >
            <span>Contact</span>
            <ChevronRight class="w-4 h-4 text-charcoal-800/40" />
          </a>
          <router-link
            to="/admin"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gold-600 bg-cream-100"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">
              <ShieldCheck class="w-4 h-4" />
              Admin Dashboard
            </span>
            <ChevronRight class="w-4 h-4" />
          </router-link>

          <div class="pt-2">
            <router-link
              :to="storeUrl('/customize/' + defaultFrameId)"
              class="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 text-white text-sm font-semibold shadow-sm"
              @click="mobileMenuOpen = false"
            >
              <Sparkles class="w-4 h-4 text-gold-300" />
              <span>Create Your Custom Frame</span>
            </router-link>
          </div>
        </div>
      </transition>
    </header>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  Frame,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-vue-next'

export default {
  name: 'CustomerNavbar',
  components: {
    Frame,
    ShoppingBag,
    Sparkles,
    Menu,
    X,
    ChevronRight,
    ShieldCheck,
    Sun,
    Moon
  },
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  computed: {
    ...mapGetters(['darkMode', 'allowThemeToggle', 'enableDesignSection', 'announcementBanner', 'brandName', 'brandSubtitle', 'logoUrl', 'activeAdminId']),
    ...mapGetters('cart', ['cartCount']),
    ...mapGetters('customization', ['selectedFrame']),
    defaultFrameId() {
      return this.selectedFrame?.id || 1
    },
    currentAdminId() {
      return this.$route.params.adminId || this.activeAdminId || null
    }
  },
  methods: {
    ...mapActions(['toggleDarkMode']),
    handleThemeToggle() {
      this.toggleDarkMode()
      const isDark = this.darkMode
      this.$toast?.info(
        isDark ? 'Switched to Dark Theme' : 'Switched to Light Theme',
        'Theme Updated',
        2200
      )
    },
    storeUrl(path) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`
      if (this.currentAdminId && (this.$route.path.startsWith('/s/') || this.$route.params.adminId)) {
        return `/s/${this.currentAdminId}${cleanPath === '/' ? '' : cleanPath}`
      }
      return cleanPath
    },
    isExactActive(path) {
      const target = this.storeUrl(path)
      return this.$route.path === target
    },
    isPathActive(prefix) {
      const target = this.storeUrl(prefix)
      return this.$route.path.startsWith(target)
    },
    async navigateSection(sectionId) {
      this.mobileMenuOpen = false
      const targetRoot = this.storeUrl('/')
      if (this.$route.path !== targetRoot) {
        await this.$router.push(targetRoot)
      }
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }
}
</script>
