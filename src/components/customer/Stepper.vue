<template>
  <nav aria-label="Customization Progress" class="w-full">
    <div class="bg-white rounded-2xl border border-cream-200 px-4 py-3.5 sm:px-6 sm:py-4 shadow-soft">
      <ol class="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        <li
          v-for="(step, idx) in effectiveSteps"
          :key="step.key"
          class="flex items-center gap-1.5 sm:gap-3 shrink-0"
        >
          <button
            type="button"
            :class="[
              'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
              idx === currentIndex
                ? 'bg-charcoal-900 text-white shadow-sm font-semibold'
                : idx < currentIndex
                  ? 'bg-gold-50 text-gold-800 hover:bg-gold-100'
                  : 'text-charcoal-800/55 hover:text-charcoal-900'
            ]"
            @click="$emit('step-click', step, idx)"
          >
            <span
              :class="[
                'w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0',
                idx === currentIndex
                  ? 'bg-gold-500 text-charcoal-950'
                  : idx < currentIndex
                    ? 'bg-gold-600 text-white'
                    : 'bg-cream-200 text-charcoal-800/70'
              ]"
            >
              <Check v-if="idx < currentIndex" class="w-3 h-3 stroke-[3]" />
              <span v-else>{{ idx + 1 }}</span>
            </span>
            <span>{{ step.label }}</span>
          </button>

          <ChevronRight
            v-if="idx < effectiveSteps.length - 1"
            class="w-4 h-4 text-charcoal-800/30 shrink-0"
          />
        </li>
      </ol>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import { Check, ChevronRight } from 'lucide-vue-next'

export default {
  name: 'CustomerStepper',
  components: {
    Check,
    ChevronRight
  },
  props: {
    currentStep: {
      type: String,
      default: 'Customize'
    },
    steps: {
      type: Array,
      default: () => [
        { key: 'Frame', label: 'Frame' },
        { key: 'Design', label: 'Design' },
        { key: 'Customize', label: 'Customize' },
        { key: 'Details', label: 'Details' },
        { key: 'Review', label: 'Review' }
      ]
    }
  },
  emits: ['step-click'],
  computed: {
    ...mapGetters(['enableDesignSection']),
    effectiveSteps() {
      const baseSteps = this.steps || []
      if (!this.enableDesignSection) {
        return baseSteps.filter(s => s.key.toLowerCase() !== 'design')
      }
      return baseSteps
    },
    currentIndex() {
      const found = this.effectiveSteps.findIndex(
        s => s.key.toLowerCase() === String(this.currentStep).toLowerCase()
      )
      return found === -1 ? 0 : found
    }
  }
}
</script>
