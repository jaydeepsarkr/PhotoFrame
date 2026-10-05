<template>
  <div class="space-y-3">
    <!-- Bulk Action Ribbon (Shows when 1 or more items selected, fixed at bottom-right) -->
    <transition
      enter-active-class="transition-all duration-300 ease-out transform"
      enter-from-class="opacity-0 translate-y-10 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-250 ease-in transform"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-10 scale-95"
    >
      <div
        v-if="selectedIds.length > 0"
        class="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl bg-charcoal-900/95 dark:bg-charcoal-900/95 backdrop-blur-md text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-charcoal-700/80 flex items-center gap-3.5 max-w-[calc(100vw-3rem)]"
      >
        <div class="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
          <span class="w-6 h-6 rounded-lg bg-gold-600/30 text-gold-400 flex items-center justify-center text-xs font-mono font-bold">
            {{ selectedIds.length }}
          </span>
          <span class="text-cream-100 font-medium">{{ selectedIds.length === 1 ? 'order selected' : 'orders selected' }}</span>
        </div>

        <div class="h-4 w-px bg-charcoal-700 mx-0.5"></div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            @click="clearSelection"
          >
            Deselect
          </button>

          <!-- Trash Mode Actions -->
          <template v-if="isTrashMode">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              @click="handleBulkRestore"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Restore ({{ selectedIds.length }})</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              @click="handleBulkPermanentDelete"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </button>
          </template>

          <!-- Normal Mode Bulk Delete Action -->
          <template v-else>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              @click="handleBulkDelete"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Move to Trash ({{ selectedIds.length }})</span>
            </button>
          </template>
        </div>
      </div>
    </transition>

    <!-- Orders Table Container -->
    <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 shadow-soft overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-cream-200 dark:border-charcoal-700 bg-cream-50/80 dark:bg-charcoal-900 text-[11px] font-semibold uppercase tracking-wider text-charcoal-800/70 dark:text-cream-200/70">
              <!-- Select All Checkbox -->
              <th v-if="selectable" class="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate.prop="isPartiallySelected"
                  class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="py-3.5 px-4">Order ID</th>
              <th class="py-3.5 px-4">Customer</th>
              <th v-if="showPhone" class="py-3.5 px-4">Phone</th>
              <th class="py-3.5 px-4">Frame</th>
              <th class="py-3.5 px-4">Design</th>
              <th class="py-3.5 px-4">Amount</th>
              <th class="py-3.5 px-4">Date</th>
              <th v-if="!isTrashMode" class="py-3.5 px-4">Status</th>
              <th v-else class="py-3.5 px-4">Deleted At</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-cream-100 dark:divide-charcoal-700/50 text-sm">
            <tr
              v-for="order in orders"
              :key="order.id"
              :class="[
                'transition-colors',
                selectedIds.includes(order.id)
                  ? 'bg-gold-50/40 dark:bg-gold-950/20'
                  : 'hover:bg-cream-50/60 dark:hover:bg-charcoal-700/30'
              ]"
            >
              <!-- Checkbox -->
              <td v-if="selectable" class="py-3.5 px-4 text-center">
                <input
                  v-model="selectedIds"
                  type="checkbox"
                  :value="order.id"
                  class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                />
              </td>

              <!-- Order ID -->
              <td class="py-3.5 px-4 font-mono text-xs font-semibold text-charcoal-900 dark:text-white whitespace-nowrap">
                <router-link
                  v-if="!isTrashMode"
                  :to="`/admin/orders/${order.id}`"
                  class="hover:text-gold-700 underline decoration-gold-400/50"
                >
                  {{ order.id }}
                </router-link>
                <span v-else class="text-charcoal-700 dark:text-cream-300">
                  {{ order.id }}
                </span>
              </td>

              <!-- Customer Info -->
              <td class="py-3.5 px-4">
                <div class="font-medium text-charcoal-900 dark:text-white">{{ order.customer?.fullName }}</div>
                <div class="text-xs text-charcoal-800/60 dark:text-cream-200/60">{{ order.customer?.address?.city || order.customer?.email }}</div>
              </td>

              <!-- Phone -->
              <td v-if="showPhone" class="py-3.5 px-4 text-xs text-charcoal-800 dark:text-cream-200/80 whitespace-nowrap">
                {{ order.customer?.phone || '—' }}
              </td>

              <!-- Frame Details -->
              <td class="py-3.5 px-4">
                <div class="font-medium text-charcoal-900 dark:text-white line-clamp-1">
                  {{ order.product?.frameName || (order.items?.[0]?.product?.frameName) || 'Bespoke Frame' }}
                </div>
                <div class="text-xs text-charcoal-800/60 dark:text-cream-200/60">
                  Size: {{ formatSizeLabel(order.product?.size) }} × {{ order.product?.quantity || 1 }}
                </div>
              </td>

              <!-- Design Theme -->
              <td class="py-3.5 px-4">
                <span class="text-xs font-medium text-charcoal-900 dark:text-cream-200">
                  {{ order.product?.designName || 'Classic Studio' }}
                </span>
              </td>

              <!-- Amount -->
              <td class="py-3.5 px-4 font-semibold text-charcoal-900 dark:text-white whitespace-nowrap">
                {{ formatCurrency(order.pricing?.total) }}
              </td>

              <!-- Order Date -->
              <td class="py-3.5 px-4 text-xs text-charcoal-800/75 dark:text-cream-200/70 whitespace-nowrap">
                {{ formatDate(order.date || order.createdAt) }}
              </td>

              <!-- Status or Deleted At -->
              <td v-if="!isTrashMode" class="py-3.5 px-4 whitespace-nowrap">
                <StatusBadge :status="order.status" />
              </td>
              <td v-else class="py-3.5 px-4 text-xs text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
                {{ formatDate(order.deletedAt || order.updatedAt) }}
              </td>

              <!-- Action Buttons -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <!-- Trash Mode Row Actions -->
                <div v-if="isTrashMode" class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-colors"
                    title="Restore order"
                    @click="$emit('restore-order', order)"
                  >
                    <RotateCcw class="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    type="button"
                    class="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Permanently Delete"
                    @click="$emit('permanent-delete-order', order)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Normal Mode Row Actions -->
                <div v-else class="flex items-center justify-end gap-1.5">
                  <router-link
                    :to="`/admin/orders/${order.id}`"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-charcoal-900 text-charcoal-900 hover:text-white dark:bg-charcoal-700 dark:text-cream-100 dark:hover:bg-gold-600 text-xs font-semibold transition-colors"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>View</span>
                  </router-link>

                  <button
                    type="button"
                    class="p-1.5 rounded-xl text-charcoal-600 dark:text-cream-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Move to Trash"
                    @click="$emit('delete-order', order)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!orders.length">
              <td :colspan="showPhone ? 10 : 9" class="py-12 text-center text-sm text-charcoal-800/60 dark:text-cream-200/60">
                <div class="flex flex-col items-center justify-center">
                  <component :is="isTrashMode ? 'Trash2' : 'ShoppingBag'" class="w-8 h-8 text-charcoal-400 mb-2 opacity-50" />
                  <span>{{ isTrashMode ? 'Trash bin is empty. No deleted orders.' : 'No matching orders found.' }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Eye, Trash2, RotateCcw, ShoppingBag } from 'lucide-vue-next'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatCurrency, formatDate, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'OrderTable',
  components: {
    Eye,
    Trash2,
    RotateCcw,
    ShoppingBag,
    StatusBadge
  },
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    showPhone: {
      type: Boolean,
      default: false
    },
    isTrashMode: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    'delete-order',
    'bulk-delete',
    'restore-order',
    'bulk-restore',
    'permanent-delete-order',
    'bulk-permanent-delete'
  ],
  data() {
    return {
      selectedIds: []
    }
  },
  computed: {
    isAllSelected() {
      if (!this.orders.length) return false
      return this.orders.every(o => this.selectedIds.includes(o.id))
    },
    isPartiallySelected() {
      if (!this.orders.length) return false
      const count = this.orders.filter(o => this.selectedIds.includes(o.id)).length
      return count > 0 && count < this.orders.length
    }
  },
  watch: {
    orders() {
      // Filter out IDs that no longer exist in the orders array
      const existing = new Set(this.orders.map(o => o.id))
      this.selectedIds = this.selectedIds.filter(id => existing.has(id))
    }
  },
  methods: {
    formatCurrency,
    formatDate,
    formatSizeLabel,

    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedIds = []
      } else {
        this.selectedIds = this.orders.map(o => o.id)
      }
    },

    clearSelection() {
      this.selectedIds = []
    },

    handleBulkDelete() {
      if (confirm(`Move ${this.selectedIds.length} order(s) to Recently Deleted trash?`)) {
        this.$emit('bulk-delete', [...this.selectedIds])
        this.clearSelection()
      }
    },

    handleBulkRestore() {
      this.$emit('bulk-restore', [...this.selectedIds])
      this.clearSelection()
    },

    handleBulkPermanentDelete() {
      if (confirm(`Permanently delete ${this.selectedIds.length} order(s) forever? This action cannot be undone.`)) {
        this.$emit('bulk-permanent-delete', [...this.selectedIds])
        this.clearSelection()
      }
    }
  }
}
</script>
