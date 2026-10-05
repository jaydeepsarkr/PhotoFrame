<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm overflow-y-auto"
        role="dialog"
        aria-modal="true"
        @click.self="close"
      >
        <div
          :class="[
            'relative w-full bg-white rounded-2xl shadow-elevated border border-cream-200 overflow-hidden my-8',
            maxWidthClass
          ]"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-cream-50">
            <h3 class="text-lg font-serif font-semibold text-charcoal-900">
              {{ title }}
            </h3>
            <button
              type="button"
              class="p-2 rounded-full text-charcoal-800/70 hover:text-charcoal-900 hover:bg-cream-200 transition-colors"
              @click="close"
              aria-label="Close modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 max-h-[80vh] overflow-y-auto">
            <slot />
          </div>

          <div
            v-if="$slots.footer"
            class="px-6 py-4 bg-cream-50 border-t border-cream-200 flex items-center justify-end gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { X } from 'lucide-vue-next'

export default {
  name: 'ModalDialog',
  components: { X },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Details'
    },
    maxWidth: {
      type: String,
      default: 'lg'
    }
  },
  emits: ['update:modelValue', 'close'],
  computed: {
    maxWidthClass() {
      const map = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
      }
      return map[this.maxWidth] || 'max-w-2xl'
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false)
      this.$emit('close')
    }
  }
}
</script>
