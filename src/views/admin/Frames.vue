<template>
  <div class="space-y-6">
    <!-- Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
      <div>
        <h2 class="text-xl font-serif font-bold text-charcoal-900">
          All Photo Frames ({{ filteredFrames.length }})
        </h2>
        <p class="text-xs text-charcoal-800/65">
          Manage frame mouldings, materials, sizes, and pricing
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model.trim="searchQuery"
          type="text"
          placeholder="Search frame name or material..."
          class="px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-charcoal-900 focus:outline-none focus:border-gold-600"
        />

        <router-link
          to="/admin/orders?tab=trash"
          class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
          title="View Deleted Frames in Trash Bin"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Trash ({{ deletedFramesCount }})</span>
        </router-link>

        <router-link
          to="/admin/frames/add"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus class="w-4 h-4" />
          <span>Add Frame</span>
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
        v-if="selectedFrameIds.length > 0"
        class="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl bg-charcoal-900/95 dark:bg-charcoal-900/95 backdrop-blur-md text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-charcoal-700/80 flex items-center gap-3.5 max-w-[calc(100vw-3rem)]"
      >
        <div class="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
          <span class="w-6 h-6 rounded-lg bg-gold-600/30 text-gold-400 flex items-center justify-center text-xs font-mono font-bold">
            {{ selectedFrameIds.length }}
          </span>
          <span class="text-cream-100 font-medium">{{ selectedFrameIds.length === 1 ? 'frame selected' : 'frames selected' }}</span>
        </div>

        <div class="h-4 w-px bg-charcoal-700 mx-0.5"></div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            @click="selectedFrameIds = []"
          >
            Deselect
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            @click="promptBulkDelete"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Move to Trash ({{ selectedFrameIds.length }})</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Frames Table -->
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
              <th class="py-3.5 px-4">Image</th>
              <th class="py-3.5 px-4">Name</th>
              <th class="py-3.5 px-4">Material</th>
              <th class="py-3.5 px-4">Sizes</th>
              <th class="py-3.5 px-4">Price</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-cream-200 text-sm">
            <tr
              v-for="frame in filteredFrames"
              :key="frame.id"
              :class="[
                'transition-colors',
                selectedFrameIds.includes(frame.id)
                  ? 'bg-gold-50/40'
                  : 'hover:bg-cream-50/60'
              ]"
            >
              <!-- Checkbox -->
              <td class="py-3.5 px-4 text-center">
                <input
                  v-model="selectedFrameIds"
                  type="checkbox"
                  :value="frame.id"
                  class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                />
              </td>

              <!-- Image -->
              <td class="py-3.5 px-4">
                <img
                  :src="frame.image"
                  :alt="frame.name"
                  class="w-14 h-14 rounded-xl object-cover border border-cream-300"
                />
              </td>

              <!-- Name & Details -->
              <td class="py-3.5 px-4">
                <div class="font-serif font-semibold text-charcoal-900">
                  {{ frame.name }}
                </div>
                <div class="text-xs text-charcoal-800/60 line-clamp-1 max-w-xs">
                  {{ frame.description }}
                </div>
              </td>

              <!-- Material -->
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-cream-100 text-charcoal-800 border border-cream-300">
                  {{ frame.material }}
                </span>
              </td>

              <!-- Sizes -->
              <td class="py-3.5 px-4">
                <div class="flex flex-wrap gap-1 max-w-xs">
                  <span
                    v-for="size in frame.sizes"
                    :key="size"
                    class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cream-50 border border-cream-300 text-charcoal-800"
                  >
                    {{ formatSizeLabel(size) }}
                  </span>
                </div>
              </td>

              <!-- Price -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span class="font-bold text-charcoal-900">
                  {{ formatCurrency(frame.discountPrice || frame.price) }}
                </span>
                <span
                  v-if="frame.discountPrice && frame.discountPrice < frame.price"
                  class="block text-[11px] text-charcoal-800/45 line-through"
                >
                  {{ formatCurrency(frame.price) }}
                </span>
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <StatusBadge :status="frame.status || 'active'" />
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    class="p-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 transition-colors"
                    title="View Frame"
                    @click="openViewModal(frame)"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <router-link
                    :to="`/admin/frames/add?edit=${frame.id}`"
                    class="p-2 rounded-xl bg-cream-100 hover:bg-gold-100 text-charcoal-800 hover:text-gold-800 transition-colors"
                    title="Edit Frame"
                  >
                    <Pencil class="w-4 h-4" />
                  </router-link>
                  <button
                    type="button"
                    class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Move to Trash"
                    @click="promptDelete(frame)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredFrames.length === 0">
              <td colspan="8" class="py-12 text-center text-charcoal-800/60">
                <p class="font-medium text-sm">No photo frames found matching your query.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick View Frame Modal -->
    <Modal
      v-model="viewModalOpen"
      :title="viewingFrame?.name || 'Frame Details'"
      max-width="md"
    >
      <div v-if="viewingFrame" class="space-y-4">
        <img
          :src="viewingFrame.image"
          :alt="viewingFrame.name"
          class="w-full h-56 object-cover rounded-2xl border border-cream-200"
        />
        <p class="text-sm text-charcoal-800/80 leading-relaxed">
          {{ viewingFrame.description }}
        </p>
        <div class="grid grid-cols-2 gap-3 text-xs bg-cream-50 p-4 rounded-xl border border-cream-200">
          <div>
            <span class="text-charcoal-800/60 block">Material</span>
            <strong class="text-charcoal-900">{{ viewingFrame.material }}</strong>
          </div>
          <div>
            <span class="text-charcoal-800/60 block">Price</span>
            <strong class="text-charcoal-900">{{ formatCurrency(viewingFrame.discountPrice || viewingFrame.price) }}</strong>
          </div>
          <div class="col-span-2">
            <span class="text-charcoal-800/60 block mb-1">Available Sizes</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="s in viewingFrame.sizes"
                :key="s"
                class="px-2 py-0.5 rounded-md bg-white border border-cream-300 font-semibold"
              >
                {{ formatSizeLabel(s) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Confirm Single Delete Modal -->
    <ConfirmModal
      v-model="confirmDeleteOpen"
      title="Move Frame to Trash"
      :message="`Are you sure you want to move '${frameToDelete?.name}' to the Recently Deleted trash? You can restore it anytime.`"
      confirm-text="Move to Trash"
      @confirm="confirmDelete"
    />

    <!-- Confirm Bulk Delete Modal -->
    <ConfirmModal
      v-model="confirmBulkDeleteOpen"
      title="Move Selected Frames to Trash"
      :message="`Are you sure you want to move ${selectedFrameIds.length} frame(s) to Recently Deleted trash? You can restore them anytime.`"
      confirm-text="Move to Trash"
      @confirm="confirmBulkDelete"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Plus, Eye, Pencil, Trash2, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import StatusBadge from '@/components/common/StatusBadge.vue'
import Modal from '@/components/common/Modal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { formatCurrency, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'AdminFramesView',
  components: {
    Plus,
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    AlertCircle,
    StatusBadge,
    Modal,
    ConfirmModal
  },
  data() {
    return {
      searchQuery: '',
      viewModalOpen: false,
      viewingFrame: null,
      confirmDeleteOpen: false,
      frameToDelete: null,
      selectedFrameIds: [],
      confirmBulkDeleteOpen: false,
      statusMessage: '',
      statusType: 'success'
    }
  },
  computed: {
    ...mapGetters('frames', ['allFrames', 'deletedFramesCount']),
    filteredFrames() {
      const q = this.searchQuery.toLowerCase()
      if (!q) return this.allFrames
      return this.allFrames.filter(
        f =>
          f.name.toLowerCase().includes(q) ||
          String(f.material || '').toLowerCase().includes(q)
      )
    },
    isAllSelected() {
      if (!this.filteredFrames.length) return false
      return this.filteredFrames.every(f => this.selectedFrameIds.includes(f.id))
    }
  },
  mounted() {
    this.$store.dispatch('frames/fetchFrames').catch(() => {})
    this.$store.dispatch('frames/fetchDeletedFrames').catch(() => {})
  },
  methods: {
    formatCurrency,
    formatSizeLabel,
    showToast(message, type = 'success') {
      this.statusType = type
      this.statusMessage = message
      if (type === 'success') {
        this.$toast?.success(message, 'Frames')
      } else if (type === 'error') {
        this.$toast?.error(message, 'Frames Error')
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
        this.selectedFrameIds = []
      } else {
        this.selectedFrameIds = this.filteredFrames.map(f => f.id)
      }
    },
    openViewModal(frame) {
      this.viewingFrame = frame
      this.viewModalOpen = true
    },
    promptDelete(frame) {
      this.frameToDelete = frame
      this.confirmDeleteOpen = true
    },
    async confirmDelete() {
      if (this.frameToDelete) {
        try {
          const name = this.frameToDelete.name
          const id = this.frameToDelete.id
          await this.$store.dispatch('frames/deleteFrame', id)
          this.selectedFrameIds = this.selectedFrameIds.filter(x => x !== id)
          this.showToast(`Frame "${name}" moved to Recently Deleted trash. You can restore it anytime.`, 'success')
        } catch (err) {
          this.showToast('Failed to delete frame: ' + err.message, 'error')
        } finally {
          this.frameToDelete = null
        }
      }
    },
    promptBulkDelete() {
      if (this.selectedFrameIds.length === 0) return
      this.confirmBulkDeleteOpen = true
    },
    async confirmBulkDelete() {
      const count = this.selectedFrameIds.length
      try {
        await this.$store.dispatch('frames/bulkDeleteFrames', [...this.selectedFrameIds])
        this.selectedFrameIds = []
        this.showToast(`Successfully moved ${count} frame(s) to Recently Deleted trash.`, 'success')
      } catch (err) {
        this.showToast('Failed to bulk delete frames: ' + err.message, 'error')
      }
    }
  }
}
</script>
