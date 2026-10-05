<template>
  <div class="bg-white rounded-2xl border border-cream-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-soft">
    <div class="w-16 h-16 rounded-2xl bg-cream-100 border border-cream-300 flex items-center justify-center mx-auto mb-5 text-gold-600">
      <slot name="icon">
        <Frame class="w-8 h-8" />
      </slot>
    </div>
    <h3 class="text-xl font-serif font-semibold text-charcoal-900 mb-2">
      {{ title }}
    </h3>
    <p class="text-sm text-charcoal-800/75 leading-relaxed mb-6">
      {{ description }}
    </p>
    <div v-if="actionText || $slots.action">
      <slot name="action">
        <router-link
          :to="actionTo"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-charcoal-900 text-white text-sm font-medium hover:bg-gold-600 transition-colors"
        >
          {{ actionText }}
        </router-link>
      </slot>
    </div>
  </div>
</template>

<script>
import { Frame } from 'lucide-vue-next'

export default {
  name: 'EmptyState',
  components: { Frame },
  props: {
    title: {
      type: String,
      default: 'No items found'
    },
    description: {
      type: String,
      default: 'Try adjusting your filters or explore our handcrafted collections.'
    },
    actionText: {
      type: String,
      default: ''
    },
    actionTo: {
      type: String,
      default: '/frames'
    }
  }
}
</script>
