<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-serif font-bold text-charcoal-900">
          {{ isEditing ? 'Edit Design Template' : 'Add New Design Template' }}
        </h2>
        <p class="text-xs text-charcoal-800/65 mt-0.5">
          Create or update occasion mat designs and preview before saving.
        </p>
      </div>
      <router-link
        to="/admin/designs"
        class="px-4 py-2 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-xs font-semibold text-charcoal-900 transition-colors"
      >
        ← Back to Designs
      </router-link>
    </div>

    <form
      class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6"
      @submit.prevent="saveDesign"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Design Name -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Design Name <span class="text-rose-600">*</span>
          </label>
          <input
            v-model.trim="form.name"
            type="text"
            required
            placeholder="e.g., Romantic Gold"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Category <span class="text-rose-600">*</span>
          </label>
          <select
            v-model="form.category"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
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
            placeholder="Describe the design theme, typography, and border accents..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600 resize-none"
          ></textarea>
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Optional Image URL -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-1.5">
            Or Paste Design Image URL
          </label>
          <input
            v-model.trim="form.image"
            type="url"
            placeholder="https://images.unsplash.com/..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
        </div>

        <!-- Design Image Upload & Preview -->
        <div class="sm:col-span-2">
          <ImageUploader
            v-model="form.image"
            label="Design Image Upload & Preview"
          />
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
        <router-link
          to="/admin/designs"
          class="px-5 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-charcoal-800 hover:bg-cream-100"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Save class="w-4 h-4" />
          <span>Save Design</span>
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
  name: 'AdminAddDesignView',
  components: {
    Save,
    ImageUploader
  },
  data() {
    return {
      form: {
        name: '',
        category: 'Wedding',
        description: '',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
        status: 'active'
      }
    }
  },
  computed: {
    ...mapGetters('designs', ['categories', 'getDesignById']),
    editId() {
      return this.$route.query.edit || this.$route.params.id || null
    },
    isEditing() {
      return Boolean(this.editId)
    }
  },
  created() {
    if (this.editId) {
      const existing = this.getDesignById(this.editId)
      if (existing) {
        this.form = {
          name: existing.name,
          category: existing.category || 'Wedding',
          description: existing.description || '',
          image: existing.image || '',
          status: existing.status || 'active'
        }
      }
    }
  },
  methods: {
    async saveDesign() {
      try {
        if (this.isEditing) {
          await this.$store.dispatch('designs/updateDesign', {
            id: this.editId,
            data: { ...this.form }
          })
          this.$toast?.success(`Design "${this.form.name}" updated successfully!`, 'Design Updated')
        } else {
          await this.$store.dispatch('designs/addDesign', { ...this.form })
          this.$toast?.success(`Design "${this.form.name}" created successfully!`, 'Design Created')
        }
        this.$router.push('/admin/designs')
      } catch (err) {
        this.$toast?.error(err.message || 'Failed to save design template. Please try again.', 'Save Failed')
      }
    }
  }
}
</script>
