<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-serif font-bold text-charcoal-900">
          {{ isEditing ? 'Edit Photo Frame' : 'Add New Photo Frame' }}
        </h2>
        <p class="text-xs text-charcoal-800/65 mt-0.5">
          Configure frame moulding details, available sizes, and studio pricing.
        </p>
      </div>
      <router-link
        to="/admin/frames"
        class="px-4 py-2 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-xs font-semibold text-charcoal-900 transition-colors"
      >
        ← Back to Frames
      </router-link>
    </div>

    <form
      class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6"
      @submit.prevent="saveFrame"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Frame Name -->
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Frame Name <span class="text-rose-600">*</span>
          </label>
          <input
            v-model.trim="form.name"
            type="text"
            required
            placeholder="e.g., Classic Wooden Frame"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
        </div>

        <!-- Description -->
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Description <span class="text-rose-600">*</span>
          </label>
          <textarea
            v-model.trim="form.description"
            rows="3"
            required
            placeholder="Describe the frame finish, wood grain, and archival qualities..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600 resize-none"
          ></textarea>
        </div>

        <!-- Material -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Material
          </label>
          <select
            v-model="form.material"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option value="Wood">Wood</option>
            <option value="Metal">Metal</option>
            <option value="Acrylic">Acrylic</option>
            <option value="Composite">Composite</option>
          </select>
        </div>

        <!-- Style -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Style
          </label>
          <select
            v-model="form.style"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option value="Classic">Classic</option>
            <option value="Luxury">Luxury</option>
            <option value="Minimal">Minimal</option>
            <option value="Modern">Modern</option>
            <option value="Vintage">Vintage</option>
          </select>
        </div>

        <!-- Price -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Price (₹) <span class="text-rose-600">*</span>
          </label>
          <input
            v-model.number="form.price"
            type="number"
            min="100"
            required
            placeholder="799"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
        </div>

        <!-- Discount Price -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Discount Price (₹) <span class="text-charcoal-800/45 font-normal">(Optional)</span>
          </label>
          <input
            v-model.number="form.discountPrice"
            type="number"
            min="0"
            placeholder="699"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
        </div>

        <!-- Available Sizes Checkboxes -->
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-2">
            Available Sizes
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label
              v-for="sizeOpt in sizeOptions"
              :key="sizeOpt.value"
              :class="[
                'flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all',
                form.sizes.includes(sizeOpt.value)
                  ? 'border-gold-600 bg-gold-50/70 text-charcoal-900'
                  : 'border-cream-300 bg-cream-50/40 text-charcoal-800'
              ]"
            >
              <input
                v-model="form.sizes"
                type="checkbox"
                :value="sizeOpt.value"
                class="w-4 h-4 accent-gold-600 rounded-sm"
              />
              <span>{{ sizeOpt.label }}</span>
            </label>
          </div>
          <p v-if="sizeError" class="text-xs text-rose-600 mt-1.5">
            {{ sizeError }}
          </p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Status
          </label>
          <select
            v-model="form.status"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option value="active">Active (Visible in Store)</option>
            <option value="inactive">Inactive (Hidden)</option>
          </select>
        </div>

        <!-- Frame Image URL or Upload -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Or Paste Image URL
          </label>
          <input
            v-model.trim="form.image"
            type="url"
            placeholder="https://images.unsplash.com/..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
        </div>

        <!-- Immediate Image Upload & Preview -->
        <div class="sm:col-span-2">
          <ImageUploader
            v-model="form.image"
            label="Frame Image Upload & Immediate Preview"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
        <router-link
          to="/admin/frames"
          class="px-5 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-charcoal-800 hover:bg-cream-100"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Save class="w-4 h-4" />
          <span>Save Frame</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Save } from 'lucide-vue-next'
import ImageUploader from '@/components/customer/ImageUploader.vue'

export default {
  name: 'AdminAddFrameView',
  components: {
    Save,
    ImageUploader
  },
  data() {
    return {
      sizeError: '',
      sizeOptions: [
        { value: '8x10', label: '8 × 10' },
        { value: '12x18', label: '12 × 18' },
        { value: '16x20', label: '16 × 20' },
        { value: '20x24', label: '20 × 24' }
      ],
      form: {
        name: '',
        description: '',
        material: 'Wood',
        style: 'Classic',
        price: 799,
        discountPrice: null,
        sizes: ['8x10', '12x18', '16x20'],
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
        status: 'active'
      }
    }
  },
  computed: {
    ...mapGetters('frames', ['getFrameById']),
    editId() {
      return this.$route.query.edit || this.$route.params.id || null
    },
    isEditing() {
      return Boolean(this.editId)
    }
  },
  created() {
    if (this.editId) {
      const existing = this.getFrameById(this.editId)
      if (existing) {
        this.form = {
          name: existing.name,
          description: existing.description,
          material: existing.material || 'Wood',
          style: existing.style || 'Classic',
          price: existing.price,
          discountPrice: existing.discountPrice,
          sizes: [...(existing.sizes || ['8x10', '12x18'])],
          image: existing.image,
          status: existing.status || 'active'
        }
      }
    }
  },
  methods: {
    async saveFrame() {
      this.sizeError = ''
      if (!this.form.sizes.length) {
        this.sizeError = 'Please select at least one frame size.'
        this.$toast?.warning(this.sizeError, 'Frame Sizes Required')
        return
      }

      try {
        if (this.isEditing) {
          await this.$store.dispatch('frames/updateFrame', {
            id: this.editId,
            data: { ...this.form }
          })
          this.$toast?.success(`Frame "${this.form.name}" updated successfully!`, 'Frame Updated')
        } else {
          await this.$store.dispatch('frames/addFrame', { ...this.form })
          this.$toast?.success(`Frame "${this.form.name}" created successfully!`, 'Frame Created')
        }
        this.$router.push('/admin/frames')
      } catch (err) {
        this.$toast?.error(err.message || 'Failed to save frame. Please check your entries.', 'Save Failed')
      }
    }
  }
}
</script>
