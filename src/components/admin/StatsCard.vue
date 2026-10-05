<template>
  <div class="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft hover:shadow-md transition-shadow flex items-start justify-between gap-4">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wider text-charcoal-800/60">
        {{ label }}
      </p>
      <p class="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1.5">
        {{ value }}
      </p>
      <p v-if="subtext" class="text-xs text-charcoal-800/60 mt-1">
        {{ subtext }}
      </p>
    </div>
    <div
      :class="[
        'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border',
        accentClass
      ]"
    >
      <slot name="icon">
        <TrendingUp class="w-5 h-5" />
      </slot>
    </div>
  </div>
</template>

<script>
import { TrendingUp } from 'lucide-vue-next'

export default {
  name: 'StatsCard',
  components: { TrendingUp },
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    subtext: {
      type: String,
      default: ''
    },
    tone: {
      type: String,
      default: 'gold'
    }
  },
  computed: {
    accentClass() {
      switch (this.tone) {
        case 'amber':
          return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'purple':
          return 'bg-purple-50 text-purple-700 border-purple-200'
        case 'emerald':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        case 'blue':
          return 'bg-blue-50 text-blue-700 border-blue-200'
        default:
          return 'bg-gold-50 text-gold-700 border-gold-200'
      }
    }
  }
}
</script>
