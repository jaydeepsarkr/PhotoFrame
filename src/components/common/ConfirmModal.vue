<template>
  <Modal
    :model-value="modelValue"
    :title="title"
    max-width="sm"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex items-start gap-4">
      <div class="w-11 h-11 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
        <AlertTriangle class="w-5 h-5" />
      </div>
      <div>
        <p class="text-sm text-charcoal-800 leading-relaxed">
          {{ message }}
        </p>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="px-4 py-2 rounded-xl text-sm font-medium border border-cream-300 text-charcoal-800 hover:bg-cream-100 transition-colors"
        @click="$emit('update:modelValue', false)"
      >
        {{ cancelText }}
      </button>
      <button
        type="button"
        class="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
        @click="onConfirm"
      >
        {{ confirmText }}
      </button>
    </template>
  </Modal>
</template>

<script>
import { AlertTriangle } from 'lucide-vue-next'
import Modal from './Modal.vue'

export default {
  name: 'ConfirmModal',
  components: {
    Modal,
    AlertTriangle
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed with this action?'
    },
    confirmText: {
      type: String,
      default: 'Delete'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },
  emits: ['update:modelValue', 'confirm'],
  methods: {
    onConfirm() {
      this.$emit('confirm')
      this.$emit('update:modelValue', false)
    }
  }
}
</script>
