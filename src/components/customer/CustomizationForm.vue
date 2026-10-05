<template>
  <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 shadow-soft space-y-5">
    <div class="flex items-center justify-between border-b border-cream-200 pb-3.5">
      <div>
        <h3 class="text-lg font-serif font-semibold text-charcoal-900">
          Personalize Your Frame
        </h3>
        <p class="text-xs text-charcoal-800/65 mt-0.5">
          Every keystroke updates your live frame preview automatically.
        </p>
      </div>
      <Type class="w-5 h-5 text-gold-600 shrink-0" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Name Field -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
          Name / Dedication
        </label>
        <input
          type="text"
          :value="customText.name"
          placeholder="e.g., Jay & Priya"
          maxlength="50"
          class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-600 transition-all"
          @input="updateField('name', $event.target.value)"
        />
      </div>

      <!-- Date Field -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
          Special Date
        </label>
        <input
          type="text"
          :value="customText.date"
          placeholder="e.g., 30 September 2026"
          maxlength="40"
          class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-600 transition-all"
          @input="updateField('date', $event.target.value)"
        />
      </div>
    </div>

    <!-- Custom Message Field -->
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80">
          Custom Message
        </label>
        <span class="text-[11px] text-charcoal-800/50">
          {{ (customText.customMessage || '').length }}/80
        </span>
      </div>
      <input
        type="text"
        :value="customText.customMessage"
        placeholder="e.g., Forever & Always ❤️"
        maxlength="80"
        class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-600 transition-all"
        @input="updateField('customMessage', $event.target.value)"
      />
      <!-- Quick Message Suggestions -->
      <div class="flex flex-wrap items-center gap-1.5 mt-2">
        <button
          v-for="preset in messagePresets"
          :key="preset"
          type="button"
          class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cream-100 hover:bg-gold-100 text-charcoal-800 border border-cream-300 transition-colors"
          @click="updateField('customMessage', preset)"
        >
          {{ preset }}
        </button>
      </div>
    </div>

    <!-- Description / Special Instructions -->
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
        Description / Framing Notes
      </label>
      <textarea
        rows="3"
        :value="description"
        placeholder="Add any special framing instructions, gift note requests, or mat finish preferences..."
        class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-600 transition-all resize-none"
        @input="$emit('update:description', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { Type } from 'lucide-vue-next'

export default {
  name: 'CustomizationForm',
  components: { Type },
  props: {
    customText: {
      type: Object,
      default: () => ({
        name: '',
        date: '',
        customMessage: ''
      })
    },
    description: {
      type: String,
      default: ''
    }
  },
  emits: ['update:customText', 'update:description'],
  data() {
    return {
      messagePresets: [
        'Forever & Always ❤️',
        'Two Souls, One Heart ✨',
        'Happy Anniversary 🥂',
        'Where Life Begins & Love Never Ends'
      ]
    }
  },
  methods: {
    updateField(key, value) {
      this.$emit('update:customText', {
        ...this.customText,
        [key]: value
      })
    }
  }
}
</script>
