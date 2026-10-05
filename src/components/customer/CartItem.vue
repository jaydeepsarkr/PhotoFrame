<template>
  <div class="bg-white rounded-2xl border border-cream-200 p-4 sm:p-6 shadow-soft flex flex-col sm:flex-row items-start sm:items-center gap-5">
    <!-- Thumbnail Combination -->
    <div class="relative w-full sm:w-28 h-44 sm:h-28 rounded-xl overflow-hidden bg-cream-100 border border-cream-300 shrink-0">
      <img
        :src="item.photo || item.frame?.image"
        :alt="item.frame?.name"
        class="w-full h-full object-cover"
      />
      <span
        v-if="photoCount > 1"
        class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gold-600 text-white shadow-sm"
      >
        {{ photoCount }} Photos
      </span>
      <span class="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-charcoal-900/85 text-white">
        {{ formatSizeLabel(item.size) }}
      </span>
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0 space-y-1.5 w-full">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 class="text-base font-serif font-semibold text-charcoal-900">
            {{ item.frame?.name || 'Custom Frame' }}
          </h4>
          <p class="text-xs text-charcoal-800/70">
            Design: <strong class="text-charcoal-900">{{ item.design?.name || 'Romantic Gold' }}</strong>
            • Size: <strong class="text-charcoal-900">{{ formatSizeLabel(item.size) }}</strong>
            <span v-if="photoCount > 1"> • <strong class="text-gold-600">{{ photoCount }}-Photo Collage</strong></span>
          </p>
        </div>
        <div class="text-right">
          <span class="text-base font-bold text-charcoal-900">
            {{ formatCurrency(item.unitPrice * item.quantity) }}
          </span>
          <span v-if="item.quantity > 1" class="block text-[11px] text-charcoal-800/55">
            {{ formatCurrency(item.unitPrice) }} each
          </span>
        </div>
      </div>

      <!-- Multi-Photo Mini Strip -->
      <div v-if="photoCount > 1" class="flex items-center gap-1.5 py-0.5 overflow-x-auto">
        <img
          v-for="(p, idx) in item.photos"
          :key="idx"
          :src="typeof p === 'string' ? p : p.url"
          :alt="`Photo ${idx + 1}`"
          class="w-8 h-8 rounded-lg object-cover border border-cream-300 shrink-0"
        />
      </div>

      <!-- Custom Text Preview -->
      <div class="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs space-y-0.5">
        <p class="font-serif italic text-charcoal-900">
          "{{ item.customText?.customMessage || 'Forever & Always ❤️' }}"
        </p>
        <p class="text-charcoal-800/75">
          <strong class="text-charcoal-900">{{ item.customText?.name || 'Jay & Priya' }}</strong>
          <span v-if="item.customText?.date"> • {{ item.customText.date }}</span>
        </p>
      </div>

      <!-- Bottom Controls: Quantity, Edit, Remove -->
      <div class="pt-2 flex flex-wrap items-center justify-between gap-3">
        <!-- Quantity Stepper -->
        <div class="inline-flex items-center rounded-xl border border-cream-300 bg-cream-50 p-0.5">
          <button
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-800 hover:bg-white transition-colors disabled:opacity-40"
            :disabled="item.quantity <= 1"
            aria-label="Decrease quantity"
            @click="$emit('decrease', item)"
          >
            <Minus class="w-3.5 h-3.5" />
          </button>
          <span class="w-9 text-center text-xs font-bold text-charcoal-900">
            {{ item.quantity }}
          </span>
          <button
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-800 hover:bg-white transition-colors"
            aria-label="Increase quantity"
            @click="$emit('increase', item)"
          >
            <Plus class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Edit & Remove Buttons -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-charcoal-800 bg-cream-100 hover:bg-cream-200 transition-colors"
            @click="$emit('edit', item)"
          >
            <Pencil class="w-3.5 h-3.5 text-gold-600" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            @click="$emit('remove', item)"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Minus, Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { formatCurrency, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'CartItem',
  components: {
    Minus,
    Plus,
    Pencil,
    Trash2
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['increase', 'decrease', 'edit', 'remove'],
  computed: {
    photoCount() {
      return Array.isArray(this.item.photos) ? this.item.photos.length : this.item.photo ? 1 : 0
    }
  },
  methods: {
    formatCurrency,
    formatSizeLabel
  }
}
</script>
