<template>
  <article
    class="group bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
  >
    <!-- Image Container -->
    <router-link :to="`/frames/${frame.id}`" class="relative aspect-[4/3] overflow-hidden bg-cream-100 block">
      <img
        :src="frame.image"
        :alt="frame.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
        <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/95 text-charcoal-900 backdrop-blur-sm shadow-sm">
          {{ frame.material }}
        </span>
        <span
          v-if="frame.style"
          class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-charcoal-900/85 text-cream-50 backdrop-blur-sm"
        >
          {{ frame.style }}
        </span>
      </div>
      <div
        v-if="frame.isNew"
        class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold-600 text-white shadow-sm"
      >
        New
      </div>
    </router-link>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <router-link
            :to="`/frames/${frame.id}`"
            class="text-lg font-serif font-semibold text-charcoal-900 group-hover:text-gold-700 transition-colors line-clamp-1"
          >
            {{ frame.name }}
          </router-link>
        </div>

        <p class="text-xs text-charcoal-800/70 line-clamp-2 leading-relaxed mb-3.5">
          {{ frame.description }}
        </p>

        <!-- Available Sizes -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span
            v-for="size in frame.sizes"
            :key="size"
            class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cream-100 text-charcoal-800 border border-cream-300/70"
          >
            {{ formatSizeLabel(size) }}
          </span>
        </div>
      </div>

      <!-- Price & Actions -->
      <div class="pt-3.5 border-t border-cream-200 flex items-center justify-between gap-3">
        <div>
          <span class="block text-[10px] uppercase tracking-wider text-charcoal-800/50 font-medium">
            Starting at
          </span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-lg font-bold text-charcoal-900">
              {{ formatCurrency(frame.discountPrice || frame.price) }}
            </span>
            <span
              v-if="frame.discountPrice && frame.discountPrice < frame.price"
              class="text-xs text-charcoal-800/45 line-through"
            >
              {{ formatCurrency(frame.price) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <router-link
            :to="`/frames/${frame.id}`"
            class="p-2.5 rounded-xl border border-cream-300 text-charcoal-800 hover:bg-cream-100 transition-colors"
            title="View Frame Details"
          >
            <Eye class="w-4 h-4" />
          </router-link>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
            @click="onCustomize"
          >
            <span>Customize Now</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { Eye, ArrowRight } from 'lucide-vue-next'
import { formatCurrency, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'FrameCard',
  components: {
    Eye,
    ArrowRight
  },
  props: {
    frame: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatCurrency,
    formatSizeLabel,
    onCustomize() {
      this.$store.dispatch('customization/setSelectedFrame', this.frame)
      this.$router.push(`/customize/${this.frame.id}`)
    }
  }
}
</script>
