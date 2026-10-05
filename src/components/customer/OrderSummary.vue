<template>
  <div class="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-5">
    <div class="flex items-center justify-between border-b border-cream-200 pb-4">
      <h3 class="text-lg font-serif font-semibold text-charcoal-900">
        {{ title }}
      </h3>
      <ShieldCheck class="w-5 h-5 text-gold-600" />
    </div>

    <!-- Optional Customization Summary Details -->
    <div v-if="showCustomizationDetails && frame" class="space-y-3 text-sm border-b border-cream-200 pb-4">
      <div class="flex items-center gap-3 pb-2">
        <img
          v-if="primaryPhoto || frame.image"
          :src="primaryPhoto || frame.image"
          :alt="frame.name"
          class="w-14 h-14 rounded-xl object-cover border border-cream-300 shrink-0"
        />
        <div class="min-w-0">
          <p class="font-serif font-semibold text-charcoal-900 truncate">
            {{ frame.name }}
          </p>
          <p class="text-xs text-charcoal-800/65">
            Design: <strong class="text-charcoal-900">{{ design?.name || 'Romantic Gold' }}</strong>
          </p>
        </div>
      </div>

      <!-- Multi-Photo Thumbnails Strip -->
      <div v-if="resolvedPhotos.length > 1" class="flex items-center gap-1.5 overflow-x-auto pb-1">
        <img
          v-for="(imgUrl, i) in resolvedPhotos"
          :key="i"
          :src="imgUrl"
          :alt="`Photo ${i + 1}`"
          class="w-9 h-9 rounded-lg object-cover border border-cream-300 shrink-0"
        />
      </div>

      <div class="flex justify-between text-xs">
        <span class="text-charcoal-800/70">Selected Frame</span>
        <span class="font-semibold text-charcoal-900">{{ frame.name }} ({{ frame.material }})</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-charcoal-800/70">Selected Design</span>
        <span class="font-semibold text-charcoal-900">{{ design?.name }} ({{ design?.category }})</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-charcoal-800/70">Selected Size</span>
        <span class="font-semibold text-charcoal-900">{{ formatSizeLabel(size) }} Inches</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-charcoal-800/70">Quantity</span>
        <span class="font-semibold text-charcoal-900">{{ quantity }}</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-charcoal-800/70">Photos</span>
        <span class="font-semibold text-emerald-600">
          {{ resolvedPhotos.length > 0 ? `${resolvedPhotos.length} Uploaded ✓` : 'Not selected' }}
        </span>
      </div>
      <div v-if="customText?.name || customText?.customMessage" class="pt-2 border-t border-cream-100 space-y-1 text-xs">
        <span class="block text-charcoal-800/60">Custom Engraving / Caption:</span>
        <p class="font-serif italic text-charcoal-900">
          "{{ customText.customMessage || 'Forever & Always' }}" — {{ customText.name }}
          <span v-if="customText.date">({{ customText.date }})</span>
        </p>
      </div>
    </div>

    <!-- Pricing Breakdown -->
    <div class="space-y-2.5 text-sm">
      <div class="flex items-center justify-between text-charcoal-800/80">
        <span>Subtotal</span>
        <span class="font-semibold text-charcoal-900">{{ formatCurrency(subtotal) }}</span>
      </div>
      <div class="flex items-center justify-between text-charcoal-800/80">
        <span>Insured Studio Delivery</span>
        <span class="font-semibold text-charcoal-900">
          {{ delivery === 0 ? 'FREE' : formatCurrency(delivery) }}
        </span>
      </div>
      <div class="pt-3 border-t border-cream-200 flex items-center justify-between">
        <span class="text-base font-serif font-semibold text-charcoal-900">Total</span>
        <span class="text-xl font-bold text-charcoal-900">{{ formatCurrency(total) }}</span>
      </div>
    </div>

    <!-- Primary CTA Slot -->
    <div v-if="$slots.default" class="pt-1">
      <slot />
    </div>

    <!-- Trust Badges -->
    <div class="pt-2 border-t border-cream-100 grid grid-cols-2 gap-2 text-[11px] text-charcoal-800/65">
      <div class="flex items-center gap-1.5">
        <Sparkles class="w-3.5 h-3.5 text-gold-600 shrink-0" />
        <span>Museum Archival Print</span>
      </div>
      <div class="flex items-center gap-1.5">
        <Truck class="w-3.5 h-3.5 text-gold-600 shrink-0" />
        <span>Damage-Free Packaging</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ShieldCheck, Sparkles, Truck } from 'lucide-vue-next'
import { formatCurrency, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'OrderSummary',
  components: {
    ShieldCheck,
    Sparkles,
    Truck
  },
  props: {
    title: {
      type: String,
      default: 'Order Summary'
    },
    subtotal: {
      type: Number,
      default: 799
    },
    delivery: {
      type: Number,
      default: 100
    },
    total: {
      type: Number,
      default: 899
    },
    showCustomizationDetails: {
      type: Boolean,
      default: false
    },
    frame: {
      type: Object,
      default: null
    },
    design: {
      type: Object,
      default: null
    },
    size: {
      type: String,
      default: '8x10'
    },
    quantity: {
      type: Number,
      default: 1
    },
    photo: {
      type: String,
      default: ''
    },
    photos: {
      type: Array,
      default: () => []
    },
    customText: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    resolvedPhotos() {
      if (Array.isArray(this.photos) && this.photos.length > 0) {
        return this.photos.map(p => (typeof p === 'string' ? p : p?.url)).filter(Boolean)
      }
      if (this.photo) return [this.photo]
      return []
    },
    primaryPhoto() {
      return this.resolvedPhotos[0] || this.photo || ''
    }
  },
  methods: {
    formatCurrency,
    formatSizeLabel
  }
}
</script>
