<template>
  <footer
    v-if="footerSettings && footerSettings.enabled !== false"
    id="contact"
    class="bg-charcoal-900 text-cream-100 border-t border-charcoal-800 transition-colors"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- 1. Brand Column (Controlled by Studio Settings) -->
        <div v-if="brandConfig.enabled !== false" class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gold-600 text-white flex items-center justify-center shadow-sm">
              <Frame class="w-5 h-5" />
            </div>
            <div>
              <span class="block text-xl font-serif font-bold text-white">
                {{ brandConfig.title || 'AtelierCadre' }}
              </span>
              <span
                v-if="brandConfig.tagline"
                class="block text-[10px] uppercase tracking-[0.2em] text-cream-200/60"
              >
                {{ brandConfig.tagline }}
              </span>
            </div>
          </div>

          <p
            v-if="brandConfig.description"
            class="text-sm text-cream-200/70 leading-relaxed"
          >
            {{ brandConfig.description }}
          </p>

          <div v-if="brandConfig.showBadge !== false && brandConfig.badgeText" class="flex items-center gap-3 pt-1">
            <span class="inline-flex items-center gap-1.5 text-xs text-gold-300 bg-charcoal-800 px-3 py-1.5 rounded-full border border-gold-500/20">
              <Award class="w-3.5 h-3.5" />
              <span>{{ brandConfig.badgeText }}</span>
            </span>
          </div>
        </div>

        <!-- 2. Collections Links Column (Controlled by Studio Settings) -->
        <div v-if="collectionsConfig.enabled !== false">
          <h4 class="text-sm font-serif font-semibold uppercase tracking-wider text-gold-400 mb-4">
            {{ collectionsConfig.heading || 'Collections' }}
          </h4>
          <ul class="space-y-2.5 text-sm text-cream-200/75">
            <li v-for="link in activeCollectionsLinks" :key="link.id || link.label">
              <router-link
                v-if="isInternalLink(link.url)"
                :to="storeUrl(link.url)"
                class="hover:text-white transition-colors"
              >
                {{ link.label }}
              </router-link>
              <a
                v-else
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white transition-colors"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 3. Design Themes Column (Controlled by Studio Settings) -->
        <div v-if="designsConfig.enabled !== false">
          <h4 class="text-sm font-serif font-semibold uppercase tracking-wider text-gold-400 mb-4">
            {{ designsConfig.heading || 'Design Themes' }}
          </h4>
          <ul class="space-y-2.5 text-sm text-cream-200/75">
            <li v-for="link in activeDesignsLinks" :key="link.id || link.label">
              <router-link
                v-if="isInternalLink(link.url)"
                :to="storeUrl(link.url)"
                class="hover:text-white transition-colors"
              >
                {{ link.label }}
              </router-link>
              <a
                v-else
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white transition-colors"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 4. Concierge & Studio Contact Details (Controlled by Studio Settings) -->
        <div v-if="contactConfig.enabled !== false">
          <h4 class="text-sm font-serif font-semibold uppercase tracking-wider text-gold-400 mb-4">
            {{ contactConfig.heading || 'Concierge & Studio' }}
          </h4>
          <ul class="space-y-3 text-sm text-cream-200/75">
            <!-- Address -->
            <li
              v-if="contactConfig.showAddress !== false && contactConfig.address"
              class="flex items-start gap-2.5"
            >
              <MapPin class="w-4 h-4 text-gold-400 shrink-0 mt-1" />
              <span>{{ contactConfig.address }}</span>
            </li>

            <!-- Phone -->
            <li
              v-if="contactConfig.showPhone !== false && contactConfig.phone"
              class="flex items-center gap-2.5"
            >
              <Phone class="w-4 h-4 text-gold-400 shrink-0" />
              <a
                :href="`tel:${cleanPhone(contactConfig.phone)}`"
                class="hover:text-white transition-colors"
              >
                {{ contactConfig.phone }}
              </a>
            </li>

            <!-- Email -->
            <li
              v-if="contactConfig.showEmail !== false && contactConfig.email"
              class="flex items-center gap-2.5"
            >
              <Mail class="w-4 h-4 text-gold-400 shrink-0" />
              <a
                :href="`mailto:${contactConfig.email}`"
                class="hover:text-white transition-colors"
              >
                {{ contactConfig.email }}
              </a>
            </li>

            <!-- WhatsApp Concierge Link -->
            <li
              v-if="contactConfig.showWhatsapp !== false && contactConfig.whatsapp"
              class="flex items-center gap-2.5"
            >
              <MessageCircle class="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                :href="`https://wa.me/${cleanPhone(contactConfig.whatsapp)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                WhatsApp Concierge
              </a>
            </li>

            <!-- Instagram Social Link -->
            <li
              v-if="contactConfig.showInstagram !== false && contactConfig.instagram"
              class="flex items-center gap-2.5"
            >
              <Instagram class="w-4 h-4 text-rose-400 shrink-0" />
              <a
                :href="contactConfig.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Instagram Studio Gallery
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Legal & Guarantees Bar (Controlled by Studio Settings) -->
      <div
        v-if="bottomBarConfig.enabled !== false"
        class="mt-12 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-200/50"
      >
        <p>
          © {{ currentYear }} {{ bottomBarConfig.copyrightText || 'Atelier Cadre Custom Framing Studio. Crafted with care in India.' }}
        </p>

        <!-- Studio Guarantees -->
        <div
          v-if="bottomBarConfig.showGuarantees !== false && guaranteesList.length > 0"
          class="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <template v-for="(item, idx) in guaranteesList" :key="idx">
            <span>{{ item }}</span>
            <span v-if="idx < guaranteesList.length - 1" class="text-charcoal-700">•</span>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Frame,
  Award,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram
} from 'lucide-vue-next'
import { defaultFooterSettings } from '@/services/settingsService'

export default {
  name: 'CustomerFooter',
  components: {
    Frame,
    Award,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    Instagram
  },
  computed: {
    ...mapGetters(['footerSettings']),

    currentYear() {
      return new Date().getFullYear()
    },

    resolvedFooter() {
      return this.footerSettings || defaultFooterSettings
    },

    brandConfig() {
      return this.resolvedFooter.brand || defaultFooterSettings.brand
    },

    collectionsConfig() {
      return this.resolvedFooter.collectionsColumn || defaultFooterSettings.collectionsColumn
    },

    activeCollectionsLinks() {
      const links = this.collectionsConfig.links || []
      return links.filter(l => l.enabled !== false)
    },

    designsConfig() {
      return this.resolvedFooter.designsColumn || defaultFooterSettings.designsColumn
    },

    activeDesignsLinks() {
      const links = this.designsConfig.links || []
      return links.filter(l => l.enabled !== false)
    },

    contactConfig() {
      return this.resolvedFooter.contactColumn || defaultFooterSettings.contactColumn
    },

    bottomBarConfig() {
      return this.resolvedFooter.bottomBar || defaultFooterSettings.bottomBar
    },

    guaranteesList() {
      return this.bottomBarConfig.guarantees || [
        'Museum-Grade Glass',
        'Pan-India Insured Delivery',
        '100% Custom Made'
      ]
    },

    currentAdminId() {
      return this.$route.params.adminId || this.$store.state.activeAdminId || null
    }
  },
  methods: {
    isInternalLink(url) {
      return url && typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
    },

    storeUrl(path) {
      if (!this.isInternalLink(path)) return path
      if (this.currentAdminId && (this.$route.path.startsWith('/s/') || this.$route.params.adminId)) {
        return `/s/${this.currentAdminId}${path === '/' ? '' : path}`
      }
      return path
    },

    cleanPhone(num) {
      if (!num) return ''
      return String(num).replace(/[^0-9+]/g, '')
    }
  }
}
</script>
