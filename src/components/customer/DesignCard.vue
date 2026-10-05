<template>
  <div
    :class="[
      'group relative rounded-2xl overflow-hidden transition-all duration-200 flex flex-col bg-white cursor-pointer',
      selected
        ? 'ring-2 ring-gold-600 border-gold-600 shadow-elevated'
        : 'border border-cream-200 shadow-soft hover:border-gold-400 hover:shadow-md'
    ]"
    @click="$emit('select', design)"
  >
    <!-- Preview Thumbnail -->
    <div class="relative aspect-[4/3] overflow-hidden bg-cream-100">
      <img
        :src="design.image"
        :alt="design.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Category Pill -->
      <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/95 text-charcoal-900 backdrop-blur-sm shadow-sm">
        {{ design.category }}
      </span>

      <!-- Selected Check Indicator -->
      <div
        v-if="selected"
        class="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-gold-600 text-white flex items-center justify-center shadow-md"
      >
        <Check class="w-4 h-4 stroke-[2.5]" />
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-4 flex-1 flex flex-col justify-between gap-3">
      <div>
        <div class="flex items-center justify-between gap-2">
          <h4 class="text-sm font-serif font-semibold text-charcoal-900 line-clamp-1">
            {{ design.name }}
          </h4>
          <span
            class="text-xs font-serif"
            :style="{ color: design.accentColor || '#B07B38' }"
          >
            {{ design.badgeText || '✦' }}
          </span>
        </div>
        <p v-if="!compact" class="text-xs text-charcoal-800/70 mt-1 line-clamp-2">
          {{ design.description }}
        </p>
      </div>

      <button
        type="button"
        :class="[
          'w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5',
          selected
            ? 'bg-gold-600 text-white'
            : 'bg-cream-100 text-charcoal-900 hover:bg-charcoal-900 hover:text-white'
        ]"
        @click.stop="$emit('select', design)"
      >
        <Check v-if="selected" class="w-3.5 h-3.5" />
        <span>{{ selected ? 'Selected' : 'Select' }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { Check } from 'lucide-vue-next'

export default {
  name: 'DesignCard',
  components: { Check },
  props: {
    design: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select']
}
</script>
