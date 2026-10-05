<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide border transition-colors',
      badgeStyles
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', dotStyles]"></span>
    {{ label || status }}
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      default: 'active'
    },
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    normalized() {
      return String(this.status || '').toLowerCase()
    },
    badgeStyles() {
      switch (this.normalized) {
        case 'active':
        case 'delivered':
        case 'completed':
          return 'bg-emerald-50 text-emerald-800 border-emerald-200'
        case 'new':
        case 'order received':
          return 'bg-amber-50 text-amber-800 border-amber-200'
        case 'confirmed':
        case 'ready':
          return 'bg-blue-50 text-blue-800 border-blue-200'
        case 'processing':
          return 'bg-purple-50 text-purple-800 border-purple-200'
        case 'shipped':
          return 'bg-indigo-50 text-indigo-800 border-indigo-200'
        case 'inactive':
        case 'cancelled':
          return 'bg-rose-50 text-rose-800 border-rose-200'
        default:
          return 'bg-cream-200 text-charcoal-800 border-cream-300'
      }
    },
    dotStyles() {
      switch (this.normalized) {
        case 'active':
        case 'delivered':
        case 'completed':
          return 'bg-emerald-600'
        case 'new':
        case 'order received':
          return 'bg-amber-600'
        case 'confirmed':
        case 'ready':
          return 'bg-blue-600'
        case 'processing':
          return 'bg-purple-600'
        case 'shipped':
          return 'bg-indigo-600'
        case 'inactive':
        case 'cancelled':
          return 'bg-rose-600'
        default:
          return 'bg-charcoal-800'
      }
    }
  }
}
</script>
