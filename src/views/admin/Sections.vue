<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-12">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-50 text-gold-800 border border-gold-200">
            Storefront Modules
          </span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs text-emerald-700 font-medium">Live Synchronized</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
          Storefront &amp; Studio Sections
        </h1>
        <p class="text-xs sm:text-sm text-charcoal-800/70 mt-1">
          Turn customer-facing catalog sections, customizer steps, and interactive gallery modules ON or OFF.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          type="button"
          :disabled="saving"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all disabled:opacity-50"
          @click="confirmReset"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="button"
          :disabled="saving"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-all shadow-md disabled:opacity-50"
          @click="handleSave"
        >
          <RefreshCw v-if="saving" class="w-3.5 h-3.5 animate-spin" />
          <Save v-else class="w-3.5 h-3.5 text-gold-300" />
          <span>{{ saving ? 'Saving Changes...' : 'Save Section States' }}</span>
        </button>
      </div>
    </div>

    <!-- Feedback Banner Toast -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="statusMessage"
        class="p-4 rounded-xl flex items-center justify-between border"
        :class="[
          statusType === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        ]"
      >
        <div class="flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 v-if="statusType === 'success'" class="w-4 h-4 text-emerald-600 shrink-0" />
          <AlertCircle v-else class="w-4 h-4 text-rose-600 shrink-0" />
          <span>{{ statusMessage }}</span>
        </div>
        <button type="button" class="text-xs hover:opacity-75" @click="statusMessage = ''">✕</button>
      </div>
    </transition>

    <!-- Quick Navigation Hub Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      <router-link
        to="/admin/sections"
        class="px-4 py-2 rounded-full text-xs font-bold bg-gold-600 text-white shadow-sm flex items-center gap-2 shrink-0"
      >
        <LayoutGrid class="w-3.5 h-3.5" />
        <span>Store Sections</span>
      </router-link>

      <router-link
        to="/admin/footer"
        class="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-cream-200 text-charcoal-800 hover:border-gold-400 hover:text-gold-600 transition-colors shrink-0 shadow-xs flex items-center gap-2"
      >
        <span>⚓ Footer Setup</span>
      </router-link>

      <router-link
        to="/admin/settings"
        class="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-cream-200 text-charcoal-800 hover:border-gold-400 hover:text-gold-600 transition-colors shrink-0 shadow-xs flex items-center gap-2"
      >
        <span>⚙️ Studio Settings</span>
      </router-link>

      <router-link
        to="/"
        target="_blank"
        class="ml-auto px-3.5 py-1.5 rounded-full text-xs font-medium text-gold-700 bg-gold-50 border border-gold-200 hover:bg-gold-100 transition-colors shrink-0 flex items-center gap-1.5"
      >
        <ExternalLink class="w-3.5 h-3.5" />
        <span>View Live Store</span>
      </router-link>
    </div>

    <!-- STOREFRONT SECTIONS CARDS -->
    <div class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-7 shadow-soft space-y-6">
      <div class="flex items-center justify-between border-b border-cream-200 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center">
            <LayoutGrid class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-serif font-bold text-charcoal-900">
              Interactive Catalog &amp; Studio Modules
            </h2>
            <p class="text-xs text-charcoal-800/65">
              Control the customer customizer workflow steps, signature design highlights, and public reviews.
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Feature 1: Turn off / on Design Section -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cream-50/70 border border-cream-200 transition-all hover:border-cream-300">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-gold-600/10 text-gold-700 flex items-center justify-center shrink-0 mt-0.5">
              <Palette class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <label class="text-sm font-semibold text-charcoal-900">
                  Signature "Design Templates" Section
                </label>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="form.enableDesignSection ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                >
                  {{ form.enableDesignSection ? 'Active on Storefront' : 'Turned Off / Hidden' }}
                </span>
              </div>
              <p class="text-xs text-charcoal-800/65 mt-1 max-w-2xl leading-relaxed">
                When turned <strong>OFF</strong>, the curated design templates section is removed from the Homepage showcase, omitted from the header navigation bar, and bypassed in the Customizer stepper (customers jump directly from Frame choice to Photo upload).
              </p>
            </div>
          </div>

          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center',
              form.enableDesignSection ? 'bg-gold-600' : 'bg-charcoal-300'
            ]"
            @click="form.enableDesignSection = !form.enableDesignSection"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.enableDesignSection ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <!-- Feature 2: Multi-Photo Collage Upload -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cream-50/70 border border-cream-200 transition-all hover:border-cream-300">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-gold-600/10 text-gold-700 flex items-center justify-center shrink-0 mt-0.5">
              <Images class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <label class="text-sm font-semibold text-charcoal-900">
                  Multi-Photo Collage Upload (Up to 6 Photos)
                </label>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="form.enableMultiPhotoUpload ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                >
                  {{ form.enableMultiPhotoUpload ? 'Enabled (Multi-Collage)' : 'Single Photo Only' }}
                </span>
              </div>
              <p class="text-xs text-charcoal-800/65 mt-1 max-w-2xl leading-relaxed">
                Allow patrons to upload multiple photographs to create custom collage layouts inside their frames. When disabled, the customizer restricts uploads to exactly 1 primary portrait.
              </p>
            </div>
          </div>

          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center',
              form.enableMultiPhotoUpload ? 'bg-gold-600' : 'bg-charcoal-300'
            ]"
            @click="form.enableMultiPhotoUpload = !form.enableMultiPhotoUpload"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.enableMultiPhotoUpload ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <!-- Feature 3: Custom Matboard Text Personalization -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cream-50/70 border border-cream-200 transition-all hover:border-cream-300">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-gold-600/10 text-gold-700 flex items-center justify-center shrink-0 mt-0.5">
              <Type class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <label class="text-sm font-semibold text-charcoal-900">
                  Matboard Typography &amp; Custom Text Engraving
                </label>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="form.enableCustomText ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                >
                  {{ form.enableCustomText ? 'Personalization Allowed' : 'Turned Off' }}
                </span>
              </div>
              <p class="text-xs text-charcoal-800/65 mt-1 max-w-2xl leading-relaxed">
                Allow customers to add celebratory titles, custom dates, or vows directly engraved into the matboard. When disabled, the custom text step is bypassed.
              </p>
            </div>
          </div>

          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center',
              form.enableCustomText ? 'bg-gold-600' : 'bg-charcoal-300'
            ]"
            @click="form.enableCustomText = !form.enableCustomText"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.enableCustomText ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <!-- Feature 4: Customer Testimonials / Reviews -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cream-50/70 border border-cream-200 transition-all hover:border-cream-300">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-gold-600/10 text-gold-700 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquareQuote class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <label class="text-sm font-semibold text-charcoal-900">
                  Customer Reviews &amp; Collector Testimonials
                </label>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="form.enableReviews ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                >
                  {{ form.enableReviews ? 'Visible on Homepage' : 'Hidden' }}
                </span>
              </div>
              <p class="text-xs text-charcoal-800/65 mt-1 max-w-2xl leading-relaxed">
                Showcase verified collector reviews, gallery ratings, and archival customer testimonials on the storefront homepage.
              </p>
            </div>
          </div>

          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center',
              form.enableReviews ? 'bg-gold-600' : 'bg-charcoal-300'
            ]"
            @click="form.enableReviews = !form.enableReviews"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.enableReviews ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Save Bar -->
    <div class="sticky bottom-4 z-30 p-4 rounded-2xl bg-charcoal-900 text-white shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-xs text-cream-200">
        <Sparkles class="w-4 h-4 text-gold-400 shrink-0" />
        <span>Section visibility changes reflect in real-time on the storefront.</span>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          :disabled="saving"
          class="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 text-xs font-semibold transition-colors"
          @click="loadSettingsIntoForm"
        >
          Discard
        </button>

        <button
          type="button"
          :disabled="saving"
          class="px-6 py-2 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
          @click="handleSave"
        >
          <RefreshCw v-if="saving" class="w-3.5 h-3.5 animate-spin" />
          <Save v-else class="w-3.5 h-3.5" />
          <span>{{ saving ? 'Saving Changes...' : 'Save Section States' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  LayoutGrid,
  Palette,
  Images,
  Type,
  MessageSquareQuote,
  RotateCcw,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-vue-next'

export default {
  name: 'AdminSections',
  components: {
    LayoutGrid,
    Palette,
    Images,
    Type,
    MessageSquareQuote,
    RotateCcw,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    ExternalLink
  },
  data() {
    return {
      saving: false,
      statusMessage: '',
      statusType: 'success',
      form: {
        enableDesignSection: true,
        enableMultiPhotoUpload: true,
        enableCustomText: true,
        enableReviews: true
      }
    }
  },
  computed: {
    ...mapGetters('settings', ['allSettings'])
  },
  mounted() {
    this.loadSettingsIntoForm()
  },
  methods: {
    ...mapActions('settings', ['updateSettings', 'resetSettings']),

    loadSettingsIntoForm() {
      const current = this.allSettings || {}
      this.form = {
        enableDesignSection: current.enableDesignSection !== false,
        enableMultiPhotoUpload: current.enableMultiPhotoUpload !== false,
        enableCustomText: current.enableCustomText !== false,
        enableReviews: current.enableReviews !== false
      }
    },

    async handleSave() {
      this.saving = true
      this.statusMessage = ''
      try {
        await this.updateSettings(this.form)
        this.statusType = 'success'
        this.statusMessage = 'Storefront sections updated! Changes are active on the website.'
        this.$toast?.success('Storefront sections updated successfully!', 'Sections Saved')
      } catch (err) {
        this.statusType = 'error'
        this.statusMessage = err.message || 'Failed to update sections. Please try again.'
        this.$toast?.error(this.statusMessage, 'Update Failed')
      } finally {
        this.saving = false
      }
    },

    async confirmReset() {
      if (confirm('Reset storefront sections to default settings?')) {
        this.form = {
          enableDesignSection: true,
          enableMultiPhotoUpload: true,
          enableCustomText: true,
          enableReviews: true
        }
        this.$toast?.info('Restoring default storefront sections...', 'Resetting')
        await this.handleSave()
      }
    }
  }
}
</script>
