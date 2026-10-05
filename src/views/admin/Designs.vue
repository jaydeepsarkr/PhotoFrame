<template>
  <div class="space-y-6">
    <!-- Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
      <div>
        <h2 class="text-xl font-serif font-bold text-charcoal-900">
          Design Templates ({{ filteredDesigns.length }})
        </h2>
        <p class="text-xs text-charcoal-800/65">
          Manage occasion designs across Wedding, Romantic, Birthday, Anniversary, Family, Kids, Festival, Minimal &amp; Classic
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <select
          v-model="selectedCategory"
          class="px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-gold-600"
        >
          <option value="All">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <router-link
          to="/admin/orders?tab=trash"
          class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
          title="View Deleted Designs in Trash Bin"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Trash ({{ deletedDesignsCount }})</span>
        </router-link>

        <router-link
          to="/admin/designs/add"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus class="w-4 h-4" />
          <span>Add New Design</span>
        </router-link>
      </div>
    </div>

    <!-- Notification Toast Banner -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="statusMessage"
        class="p-4 rounded-xl flex items-center justify-between border"
        :class="[
          statusType === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
        ]"
      >
        <div class="flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 v-if="statusType === 'success'" class="w-4 h-4 text-emerald-600 shrink-0" />
          <AlertCircle v-else class="w-4 h-4 text-rose-600 shrink-0" />
          <span>{{ statusMessage }}</span>
        </div>
        <button type="button" class="text-xs hover:opacity-75" @click="statusMessage = ''">✕</button>
      </div>
    </transition>

    <!-- Floating Bottom-Right Bulk Action Toolbar -->
    <transition
      enter-active-class="transition-all duration-300 ease-out transform"
      enter-from-class="opacity-0 translate-y-10 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-250 ease-in transform"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-10 scale-95"
    >
      <div
        v-if="selectedDesignIds.length > 0"
        class="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl bg-charcoal-900/95 dark:bg-charcoal-900/95 backdrop-blur-md text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-charcoal-700/80 flex items-center gap-3.5 max-w-[calc(100vw-3rem)]"
      >
        <div class="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
          <span class="w-6 h-6 rounded-lg bg-gold-600/30 text-gold-400 flex items-center justify-center text-xs font-mono font-bold">
            {{ selectedDesignIds.length }}
          </span>
          <span class="text-cream-100 font-medium">{{ selectedDesignIds.length === 1 ? 'design template selected' : 'design templates selected' }}</span>
        </div>

        <div class="h-4 w-px bg-charcoal-700 mx-0.5"></div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            @click="selectedDesignIds = []"
          >
            Deselect
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            @click="promptBulkDelete"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Move to Trash ({{ selectedDesignIds.length }})</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Designs Table -->
    <div class="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-cream-200 bg-cream-50/80 text-[11px] font-semibold uppercase tracking-wider text-charcoal-800/70">
              <th class="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="py-3.5 px-4">Preview</th>
              <th class="py-3.5 px-4">Name</th>
              <th class="py-3.5 px-4">Category</th>
              <th class="py-3.5 px-4">Description</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-cream-200 text-sm">
            <tr
              v-for="design in filteredDesigns"
              :key="design.id"
              :class="[
                'transition-colors',
                selectedDesignIds.includes(design.id)
                  ? 'bg-gold-50/40'
                  : 'hover:bg-cream-50/60'
              ]"
            >
              <!-- Checkbox -->
              <td class="py-3.5 px-4 text-center">
                <input
                  v-model="selectedDesignIds"
                  type="checkbox"
                  :value="design.id"
                  class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                />
              </td>

              <!-- Preview -->
              <td class="py-3.5 px-4">
                <img
                  :src="design.image"
                  :alt="design.name"
                  class="w-14 h-14 rounded-xl object-cover border border-cream-300"
                />
              </td>

              <!-- Name -->
              <td class="py-3.5 px-4 font-serif font-semibold text-charcoal-900 whitespace-nowrap">
                {{ design.name }}
              </td>

              <!-- Category -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gold-50 text-gold-800 border border-gold-200">
                  {{ design.category }}
                </span>
              </td>

              <!-- Description -->
              <td class="py-3.5 px-4 text-xs text-charcoal-800/75 max-w-md">
                {{ design.description }}
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <StatusBadge :status="design.status || 'active'" />
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-1.5">
                  <router-link
                    :to="`/admin/designs/add?edit=${design.id}`"
                    class="p-2 rounded-xl bg-cream-100 hover:bg-gold-100 text-charcoal-800 hover:text-gold-800 transition-colors"
                    title="Edit Design"
                  >
                    <Pencil class="w-4 h-4" />
                  </router-link>
                  <button
                    type="button"
                    class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Move to Trash"
                    @click="promptDelete(design)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredDesigns.length === 0">
              <td colspan="7" class="py-12 text-center text-charcoal-800/60">
                <p class="font-medium text-sm">No design templates found matching your criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirm Single Delete Modal -->
    <ConfirmModal
      v-model="confirmDeleteOpen"
      title="Move Design to Trash"
      :message="`Are you sure you want to move '${designToDelete?.name}' to the Recently Deleted trash? You can restore it anytime.`"
      confirm-text="Move to Trash"
      @confirm="confirmDelete"
    />

    <!-- Confirm Bulk Delete Modal -->
    <ConfirmModal
      v-model="confirmBulkDeleteOpen"
      title="Move Selected Designs to Trash"
      :message="`Are you sure you want to move ${selectedDesignIds.length} design template(s) to Recently Deleted trash? You can restore them anytime.`"
      confirm-text="Move to Trash"
      @confirm="confirmBulkDelete"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Plus, Pencil, Trash2, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

export default {
  name: 'AdminDesignsView',
  components: {
    Plus,
    Pencil,
    Trash2,
    CheckCircle2,
    AlertCircle,
    StatusBadge,
    ConfirmModal
  },
  data() {
    return {
      selectedCategory: 'All',
      confirmDeleteOpen: false,
      designToDelete: null,
      selectedDesignIds: [],
      confirmBulkDeleteOpen: false,
      statusMessage: '',
      statusType: 'success'
    }
  },
  computed: {
    ...mapGetters('designs', ['allDesigns', 'categories', 'deletedDesignsCount']),
    filteredDesigns() {
      if (this.selectedCategory === 'All') return this.allDesigns
      return this.allDesigns.filter(d => d.category === this.selectedCategory)
    },
    isAllSelected() {
      if (!this.filteredDesigns.length) return false
      return this.filteredDesigns.every(d => this.selectedDesignIds.includes(d.id))
    }
  },
  mounted() {
    this.$store.dispatch('designs/fetchDesigns').catch(() => {})
    this.$store.dispatch('designs/fetchDeletedDesigns').catch(() => {})
  },
  methods: {
    showToast(message, type = 'success') {
      this.statusType = type
      this.statusMessage = message
      if (type === 'success') {
        this.$toast?.success(message, 'Designs')
      } else if (type === 'error') {
        this.$toast?.error(message, 'Designs Error')
      } else {
        this.$toast?.info(message, 'Notice')
      }
      setTimeout(() => {
        if (this.statusMessage === message) {
          this.statusMessage = ''
        }
      }, 5000)
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedDesignIds = []
      } else {
        this.selectedDesignIds = this.filteredDesigns.map(d => d.id)
      }
    },
    promptDelete(design) {
      this.designToDelete = design
      this.confirmDeleteOpen = true
    },
    async confirmDelete() {
      if (this.designToDelete) {
        try {
          const name = this.designToDelete.name
          const id = this.designToDelete.id
          await this.$store.dispatch('designs/deleteDesign', id)
          this.selectedDesignIds = this.selectedDesignIds.filter(x => x !== id)
          this.showToast(`Design "${name}" moved to Recently Deleted trash. You can restore it anytime.`, 'success')
        } catch (err) {
          this.showToast('Failed to delete design: ' + err.message, 'error')
        } finally {
          this.designToDelete = null
        }
      }
    },
    promptBulkDelete() {
      if (this.selectedDesignIds.length === 0) return
      this.confirmBulkDeleteOpen = true
    },
    async confirmBulkDelete() {
      const count = this.selectedDesignIds.length
      try {
        await this.$store.dispatch('designs/bulkDeleteDesigns', [...this.selectedDesignIds])
        this.selectedDesignIds = []
        this.showToast(`Successfully moved ${count} design template(s) to Recently Deleted trash.`, 'success')
      } catch (err) {
        this.showToast('Failed to bulk delete designs: ' + err.message, 'error')
      }
    }
  }
}
</script>
