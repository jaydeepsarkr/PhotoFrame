<template>
  <div
    class="fixed top-5 right-5 z-[99999] pointer-events-none flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0"
    aria-live="polite"
    aria-atomic="true"
  >
    <transition-group
      enter-active-class="transition-all duration-300 ease-out transform"
      enter-from-class="opacity-0 translate-x-12 translate-y-[-8px] scale-90"
      enter-to-class="opacity-100 translate-x-0 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in transform absolute right-0 w-full"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-12 scale-90"
      move-class="transition-transform duration-300 ease-out"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="relative overflow-hidden pointer-events-auto w-full rounded-2xl p-3.5 sm:p-4 shadow-elevated border flex items-start gap-3 backdrop-blur-md transition-all hover:scale-[1.01]"
        :class="getCardClasses(toast.type)"
        role="alert"
      >
        <!-- Icon -->
        <div
          class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          :class="getIconWrapperClasses(toast.type)"
        >
          <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-500" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-rose-500" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4 h-4 text-amber-500" />
          <Info v-else class="w-4 h-4 text-gold-500" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pr-1">
          <div class="flex items-center justify-between gap-2 mb-0.5">
            <h4 class="text-xs font-bold font-sans tracking-wide capitalize" :class="getTitleClasses(toast.type)">
              {{ toast.title || getDefaultTitle(toast.type) }}
            </h4>
          </div>
          <p class="text-xs text-charcoal-700 dark:text-cream-200/90 leading-relaxed font-normal break-words">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          type="button"
          class="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:text-cream-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
          title="Dismiss notification"
          @click="dismiss(toast.id)"
        >
          <X class="w-3.5 h-3.5" />
        </button>

        <!-- Auto-Dismiss Progress Bar -->
        <div
          v-if="toast.duration > 0"
          class="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden bg-black/5 dark:bg-white/5"
        >
          <div
            class="h-full"
            :class="getProgressBarClasses(toast.type)"
            :style="{
              animation: `toastCountdown ${toast.duration}ms linear forwards`
            }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

export default {
  name: 'ToastContainer',
  components: {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    X
  },
  computed: {
    ...mapGetters('toast', ['allToasts']),
    toasts() {
      return this.allToasts
    }
  },
  methods: {
    dismiss(id) {
      this.$store.dispatch('toast/remove', id)
    },
    getDefaultTitle(type) {
      switch (type) {
        case 'success':
          return 'Success'
        case 'error':
          return 'Failed'
        case 'warning':
          return 'Attention'
        default:
          return 'Notification'
      }
    },
    getCardClasses(type) {
      switch (type) {
        case 'success':
          return 'bg-white/95 dark:bg-charcoal-900/95 border-emerald-500/30 border-l-4 border-l-emerald-500 text-charcoal-900 dark:text-cream-100 shadow-[0_12px_32px_rgba(16,185,129,0.15)]'
        case 'error':
          return 'bg-white/95 dark:bg-charcoal-900/95 border-rose-500/30 border-l-4 border-l-rose-500 text-charcoal-900 dark:text-cream-100 shadow-[0_12px_32px_rgba(244,63,94,0.16)]'
        case 'warning':
          return 'bg-white/95 dark:bg-charcoal-900/95 border-amber-500/30 border-l-4 border-l-amber-500 text-charcoal-900 dark:text-cream-100 shadow-[0_12px_32px_rgba(245,158,11,0.15)]'
        default:
          return 'bg-white/95 dark:bg-charcoal-900/95 border-gold-500/30 border-l-4 border-l-gold-500 text-charcoal-900 dark:text-cream-100 shadow-[0_12px_32px_rgba(217,119,6,0.15)]'
      }
    },
    getIconWrapperClasses(type) {
      switch (type) {
        case 'success':
          return 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40'
        case 'error':
          return 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/40'
        case 'warning':
          return 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/40'
        default:
          return 'bg-gold-50 dark:bg-gold-950/60 border border-gold-200/60 dark:border-gold-800/40'
      }
    },
    getTitleClasses(type) {
      switch (type) {
        case 'success':
          return 'text-emerald-700 dark:text-emerald-400'
        case 'error':
          return 'text-rose-700 dark:text-rose-400'
        case 'warning':
          return 'text-amber-700 dark:text-amber-400'
        default:
          return 'text-gold-700 dark:text-gold-400'
      }
    },
    getProgressBarClasses(type) {
      switch (type) {
        case 'success':
          return 'bg-emerald-500'
        case 'error':
          return 'bg-rose-500'
        case 'warning':
          return 'bg-amber-500'
        default:
          return 'bg-gold-500'
      }
    }
  }
}
</script>

<style scoped>
@keyframes toastCountdown {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
