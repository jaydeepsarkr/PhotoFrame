<template>
  <div class="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-charcoal-800/60 mb-8">
      <router-link to="/" class="hover:text-charcoal-900">Home</router-link>
      <span>/</span>
      <router-link to="/frames" class="hover:text-charcoal-900">Frames</router-link>
      <span>/</span>
      <span class="text-charcoal-900 font-semibold">{{ frame?.name }}</span>
    </nav>

    <div v-if="frame" class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      <!-- Left: Large Frame Image & Gallery Preview -->
      <div class="lg:col-span-6 space-y-4">
        <div class="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-cream-200 shadow-elevated">
          <img
            :src="frame.image"
            :alt="frame.name"
            class="w-full h-full object-cover"
            @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80'"
          />
          <div class="absolute top-4 left-4 flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-charcoal-900 shadow-sm">
              {{ frame.material }}
            </span>
            <span v-if="frame.style" class="px-3 py-1 rounded-full text-xs font-medium bg-charcoal-900/90 text-white">
              {{ frame.style }} Style
            </span>
          </div>
        </div>

        <!-- Feature Highlights Strip -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white rounded-2xl border border-cream-200 p-3.5 text-center">
            <ShieldCheck class="w-5 h-5 text-gold-600 mx-auto mb-1" />
            <span class="block text-xs font-semibold text-charcoal-900">Archival Grade</span>
            <span class="text-[11px] text-charcoal-800/60">Acid-free mat</span>
          </div>
          <div class="bg-white rounded-2xl border border-cream-200 p-3.5 text-center">
            <Sparkles class="w-5 h-5 text-gold-600 mx-auto mb-1" />
            <span class="block text-xs font-semibold text-charcoal-900">UV Glazing</span>
            <span class="text-[11px] text-charcoal-800/60">Crystal clear</span>
          </div>
          <div class="bg-white rounded-2xl border border-cream-200 p-3.5 text-center">
            <Truck class="w-5 h-5 text-gold-600 mx-auto mb-1" />
            <span class="block text-xs font-semibold text-charcoal-900">Ready to Hang</span>
            <span class="text-[11px] text-charcoal-800/60">Hardware included</span>
          </div>
        </div>
      </div>

      <!-- Right: Frame Info, Size Selector, Quantity, Customize CTA -->
      <div class="lg:col-span-6 bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
        <div>
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            {{ frame.material }} Collection
          </span>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            {{ frame.name }}
          </h1>
          <p class="text-sm text-charcoal-800/75 leading-relaxed mt-3">
            {{ frame.description }}
          </p>
        </div>

        <!-- Dynamic Price Display -->
        <div class="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex items-baseline justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider text-charcoal-800/60 font-semibold block">
              Frame Price ({{ formatSizeLabel(localSize) }})
            </span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-2xl sm:text-3xl font-bold text-charcoal-900">
                {{ formatCurrency(calculatedUnitPrice * localQuantity) }}
              </span>
              <span
                v-if="frame.discountPrice && frame.discountPrice < frame.price"
                class="text-sm text-charcoal-800/45 line-through"
              >
                {{ formatCurrency((frame.price + sizeExtra) * localQuantity) }}
              </span>
            </div>
          </div>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            In Stock • Ships in 48h
          </span>
        </div>

        <!-- Size Selector -->
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-charcoal-800/80">
              Select Frame Size (Inches)
            </label>
            <span class="text-xs text-gold-700 font-medium">Selected: {{ formatSizeLabel(localSize) }}</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              v-for="size in frame.sizes"
              :key="size"
              type="button"
              :class="[
                'py-3 px-3 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center gap-0.5',
                localSize === size
                  ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                  : 'bg-white text-charcoal-900 border-cream-300 hover:border-gold-500'
              ]"
              @click="selectSize(size)"
            >
              <span>{{ formatSizeLabel(size) }}</span>
              <span
                :class="[
                  'text-[10px]',
                  localSize === size ? 'text-gold-300' : 'text-charcoal-800/50'
                ]"
              >
                {{ getSizeAddonText(size) }}
              </span>
            </button>
          </div>
        </div>

        <!-- Quantity Selector -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-2">
            Quantity
          </label>
          <div class="inline-flex items-center rounded-xl border border-cream-300 bg-cream-50 p-1">
            <button
              type="button"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-charcoal-900 hover:bg-white transition-colors disabled:opacity-40"
              :disabled="localQuantity <= 1"
              @click="localQuantity = Math.max(1, localQuantity - 1)"
            >
              <Minus class="w-4 h-4" />
            </button>
            <span class="w-12 text-center text-sm font-bold text-charcoal-900">
              {{ localQuantity }}
            </span>
            <button
              type="button"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-charcoal-900 hover:bg-white transition-colors"
              @click="localQuantity += 1"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Primary Action Buttons -->
        <div class="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-charcoal-900 hover:bg-gold-600 text-white text-sm font-semibold transition-all shadow-elevated"
            @click="proceedToCustomize"
          >
            <Sparkles class="w-4 h-4 text-gold-300" />
            <span>Customize This Frame</span>
            <ArrowRight class="w-4 h-4" />
          </button>
          <router-link
            to="/frames"
            class="inline-flex items-center justify-center px-5 py-4 rounded-2xl border border-cream-300 text-charcoal-900 hover:bg-cream-100 text-sm font-semibold transition-colors"
          >
            Back to Frames
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ShieldCheck, Sparkles, Truck, Minus, Plus, ArrowRight } from 'lucide-vue-next'
import { formatCurrency, formatSizeLabel, getSizePriceMultiplier } from '@/utils/formatters'

export default {
  name: 'FrameDetailsView',
  components: {
    ShieldCheck,
    Sparkles,
    Truck,
    Minus,
    Plus,
    ArrowRight
  },
  data() {
    return {
      localSize: '8x10',
      localQuantity: 1
    }
  },
  computed: {
    ...mapGetters('frames', ['getFrameById']),
    frame() {
      return this.getFrameById(this.$route.params.id)
    },
    sizeExtra() {
      return getSizePriceMultiplier(this.localSize)
    },
    calculatedUnitPrice() {
      const base = Number(this.frame?.discountPrice || this.frame?.price || 799)
      return base + this.sizeExtra
    }
  },
  watch: {
    frame: {
      immediate: true,
      handler(newFrame) {
        if (newFrame && Array.isArray(newFrame.sizes) && newFrame.sizes.length) {
          this.localSize = newFrame.sizes[0]
        }
      }
    }
  },
  methods: {
    formatCurrency,
    formatSizeLabel,
    selectSize(size) {
      this.localSize = size
    },
    getSizeAddonText(size) {
      const extra = getSizePriceMultiplier(size)
      return extra === 0 ? 'Base Price' : `+₹${extra}`
    },
    proceedToCustomize() {
      if (!this.frame) return
      this.$store.dispatch('customization/setSelectedFrame', this.frame)
      this.$store.dispatch('customization/setSelectedSize', this.localSize)
      this.$store.dispatch('customization/setQuantity', this.localQuantity)
      this.$router.push(`/customize/${this.frame.id}`)
    }
  }
}
</script>
