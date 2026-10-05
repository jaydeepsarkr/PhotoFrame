<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <label class="block text-sm font-serif font-semibold text-charcoal-900">
        {{ label }}
      </label>
      <span class="text-xs text-charcoal-800/60">
        {{ multiple ? `Upload 1 to ${maxPhotos} photos (Single or Collage)` : 'JPG, PNG or WEBP • High Resolution' }}
      </span>
    </div>

    <!-- Dropzone / Upload Area -->
    <div
      :class="[
        'relative rounded-2xl border-2 border-dashed transition-all p-5 sm:p-6 text-center',
        isDragging
          ? 'border-gold-600 bg-gold-50/70'
          : 'border-cream-300 bg-cream-50/70 hover:border-gold-400'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <!-- Loading Overlay during Cloudinary Upload -->
      <div
        v-if="isUploading"
        class="absolute inset-0 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2 z-20 pointer-events-none"
      >
        <RefreshCw class="w-7 h-7 text-gold-600 animate-spin" />
        <span class="text-xs font-semibold text-charcoal-900 dark:text-cream-100">
          Uploading photo to Cloudinary...
        </span>
      </div>
      <!-- Hidden File Inputs -->
      <input
        ref="fileInputAdd"
        type="file"
        accept="image/*"
        :multiple="multiple"
        class="hidden"
        @change="onFileSelect($event, 'add')"
      />
      <input
        ref="fileInputReplace"
        type="file"
        accept="image/*"
        :multiple="multiple"
        class="hidden"
        @change="onFileSelect($event, 'replace')"
      />

      <!-- WHEN PHOTOS EXIST -->
      <div v-if="photoList.length > 0" class="space-y-4 text-left">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>
              {{ photoList.length }} {{ photoList.length === 1 ? 'Photo' : 'Photos' }} Selected
              {{ photoList.length > 1 ? '• Collage Layout Active' : '' }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="multiple && photoList.length < maxPhotos"
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
              @click="triggerAddPicker"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Add More Photos</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-cream-100 text-charcoal-900 border border-cream-300 text-xs font-semibold transition-colors"
              @click="triggerReplacePicker"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>{{ multiple && photoList.length > 1 ? 'Replace All' : 'Replace Photo' }}</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold transition-colors"
              @click="clearAllPhotos"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>{{ photoList.length > 1 ? 'Remove All' : 'Remove' }}</span>
            </button>
          </div>
        </div>

        <!-- Uploaded Photos Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="(item, idx) in photoList"
            :key="item.id || idx"
            :class="[
              'group relative aspect-square rounded-xl overflow-hidden border-2 bg-white shadow-sm transition-all',
              idx === 0 ? 'border-gold-600 ring-2 ring-gold-500/20' : 'border-cream-300'
            ]"
          >
            <img
              :src="item.url"
              :alt="item.name || `Photo ${idx + 1}`"
              class="w-full h-full object-cover"
            />

            <!-- Primary Badge or Make Primary Button -->
            <div class="absolute top-2 left-2">
              <span
                v-if="idx === 0"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gold-600 text-white shadow-sm"
              >
                <Star class="w-2.5 h-2.5 fill-current" />
                Main
              </span>
              <button
                v-else
                type="button"
                class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-charcoal-900/80 hover:bg-gold-600 text-white backdrop-blur-sm transition-colors"
                title="Set as main photo"
                @click="makePrimary(idx)"
              >
                Set Main
              </button>
            </div>

            <!-- Remove Single Photo Button -->
            <button
              type="button"
              class="absolute top-2 right-2 w-6 h-6 rounded-full bg-charcoal-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-sm"
              title="Remove this photo"
              @click="removeSinglePhoto(idx)"
            >
              <X class="w-3.5 h-3.5" />
            </button>

            <!-- Photo Index Footer -->
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 py-1 text-[10px] text-white font-medium truncate">
              #{{ idx + 1 }} {{ item.name || `Photo ${idx + 1}` }}
            </div>
          </div>

          <!-- Add More Tile inside Grid -->
          <button
            v-if="multiple && photoList.length < maxPhotos"
            type="button"
            class="aspect-square rounded-xl border-2 border-dashed border-cream-300 hover:border-gold-500 bg-white/50 hover:bg-gold-50/30 flex flex-col items-center justify-center gap-1.5 text-charcoal-800/70 hover:text-gold-600 transition-all"
            @click="triggerAddPicker"
          >
            <Plus class="w-6 h-6" />
            <span class="text-[11px] font-semibold">Add Photo</span>
            <span class="text-[10px] opacity-60">{{ photoList.length }}/{{ maxPhotos }}</span>
          </button>
        </div>
      </div>

      <!-- EMPTY UPLOAD PROMPT -->
      <div v-else class="py-4 space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-white border border-cream-300 shadow-sm flex items-center justify-center mx-auto text-gold-600">
          <Camera class="w-7 h-7" />
        </div>
        <div>
          <p class="text-sm font-semibold text-charcoal-900">
            {{ multiple ? 'Drag & Drop Single or Multiple Photos Here' : 'Drag & Drop Your Photo Here' }}
          </p>
          <p class="text-xs text-charcoal-800/60 mt-0.5">
            {{ multiple ? `Select 1 photo for a classic portrait or up to ${maxPhotos} photos for a custom collage frame` : 'or click below to select an image from your device' }}
          </p>
        </div>
        <div class="pt-1 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-colors shadow-sm"
            @click="triggerAddPicker"
          >
            <Upload class="w-4 h-4" />
            <span>{{ multiple ? 'Choose Photos (Single / Multiple)' : 'Choose Photo' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Notice -->
    <p v-if="errorMessage" class="text-xs text-rose-600 font-medium">
      {{ errorMessage }}
    </p>

    <!-- Sample Preset Photos for Quick Testing (Single or Multi-Photo Collage) -->
    <div class="pt-1">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p class="text-[11px] uppercase tracking-wider text-charcoal-800/60 font-semibold">
          {{ multiple ? 'Quick test: click samples to add/toggle multiple photos:' : 'Or try a sample image:' }}
        </p>
        <button
          v-if="multiple"
          type="button"
          class="text-[11px] font-semibold text-gold-600 hover:underline"
          @click="load4PhotoCollageSample"
        >
          + Load 4-Photo Collage Sample
        </button>
      </div>
      <div class="flex items-center gap-2.5 overflow-x-auto pb-1">
        <button
          v-for="(sample, idx) in samplePhotos"
          :key="idx"
          type="button"
          :class="[
            'relative w-13 h-13 rounded-xl overflow-hidden border-2 transition-all shrink-0',
            isSampleSelected(sample.url)
              ? 'border-gold-600 scale-105 shadow-sm'
              : 'border-transparent opacity-75 hover:opacity-100'
          ]"
          :title="multiple ? `Add/Toggle ${sample.label}` : sample.label"
          @click="selectSample(sample)"
        >
          <img :src="sample.url" :alt="sample.label" class="w-12 h-12 object-cover" />
          <span
            v-if="isSampleSelected(sample.url)"
            class="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-gold-600 text-white text-[9px] font-bold flex items-center justify-center"
          >
            ✓
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Plus,
  X,
  Star
} from 'lucide-vue-next'
import { uploadService } from '@/services/uploadService'

export default {
  name: 'ImageUploader',
  components: {
    Camera,
    Upload,
    RefreshCw,
    Trash2,
    CheckCircle2,
    Plus,
    X,
    Star
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    photos: {
      type: Array,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxPhotos: {
      type: Number,
      default: 6
    },
    label: {
      type: String,
      default: 'Upload Your Photos'
    }
  },
  emits: ['update:modelValue', 'update:photos', 'uploaded'],
  data() {
    return {
      isDragging: false,
      isUploading: false,
      errorMessage: '',
      samplePhotos: [
        {
          label: 'Couple Portrait',
          url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'
        },
        {
          label: 'Wedding Moment',
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
        },
        {
          label: 'Family Joy',
          url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80'
        },
        {
          label: 'Childhood Smile',
          url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80'
        },
        {
          label: 'Golden Hour',
          url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80'
        },
        {
          label: 'Celebration',
          url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=800&q=80'
        }
      ]
    }
  },
  computed: {
    photoList() {
      if (Array.isArray(this.photos)) {
        return this.photos.map((p, idx) =>
          typeof p === 'string'
            ? { id: `p-${idx}`, url: p, name: `photo-${idx + 1}.jpg` }
            : p
        )
      }
      if (this.modelValue) {
        return [{ id: 'single-1', url: this.modelValue, name: 'uploaded-photo.jpg' }]
      }
      return []
    }
  },
  methods: {
    triggerAddPicker() {
      this.$refs.fileInputAdd?.click()
    },
    triggerReplacePicker() {
      this.$refs.fileInputReplace?.click()
    },
    async onFileSelect(event, mode = 'add') {
      const files = event.target.files
      if (files && files.length) {
        await this.processFiles(files, mode)
      }
      event.target.value = ''
    },
    async onDrop(event) {
      this.isDragging = false
      const files = event.dataTransfer?.files
      if (files && files.length) {
        await this.processFiles(files, this.multiple ? 'add' : 'replace')
      }
    },
    async processFiles(fileList, mode = 'add') {
      this.errorMessage = ''
      this.isUploading = true
      try {
        console.log(`📸 [IMAGE_UPLOADER] Processing ${fileList.length} image(s) for frame customization...`)
        if (this.multiple) {
          const results = await uploadService.uploadMultipleFilesToCloudinary(fileList)
          const updatedList =
            mode === 'replace'
              ? results.slice(0, this.maxPhotos)
              : [...this.photoList, ...results].slice(0, this.maxPhotos)
          console.log(`🖼️ [IMAGE_UPLOADER] Multi-photo collage collection updated (Total: ${updatedList.length} photos)`)
          this.$toast?.success(`Uploaded ${results.length} photo(s) to Cloudinary successfully!`, 'Upload Success')
          this.emitUpdatedList(updatedList)
        } else {
          const single = await uploadService.uploadFileToCloudinary(fileList[0])
          console.log('🖼️ [IMAGE_UPLOADER] Single photo uploaded to Cloudinary asset:', single.url)
          this.$toast?.success('Photo uploaded to Cloudinary successfully!', 'Upload Success')
          this.emitUpdatedList([single])
        }
      } catch (err) {
        console.error('❌ [IMAGE_UPLOADER] Upload encountered an error:', err.message)
        this.errorMessage = err.message || 'Unable to load image files.'
        this.$toast?.error(this.errorMessage, 'Upload Failed')
      } finally {
        this.isUploading = false
      }
    },
    emitUpdatedList(list) {
      const primaryUrl = list[0]?.url || ''
      this.$emit('update:modelValue', primaryUrl)
      this.$emit('update:photos', list)
      this.$emit('uploaded', list)
    },
    removeSinglePhoto(idx) {
      const next = this.photoList.filter((_, i) => i !== idx)
      this.emitUpdatedList(next)
    },
    makePrimary(idx) {
      const next = [...this.photoList]
      const [chosen] = next.splice(idx, 1)
      next.unshift(chosen)
      this.emitUpdatedList(next)
    },
    clearAllPhotos() {
      this.emitUpdatedList([])
    },
    isSampleSelected(url) {
      return this.photoList.some(p => p.url === url)
    },
    selectSample(sample) {
      this.errorMessage = ''
      const sampleItem = {
        id: `sample-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        url: sample.url,
        name: `${sample.label}.jpg`
      }
      if (!this.multiple) {
        this.emitUpdatedList([sampleItem])
        return
      }
      const existsIdx = this.photoList.findIndex(p => p.url === sample.url)
      if (existsIdx !== -1) {
        if (this.photoList.length > 1) {
          this.removeSinglePhoto(existsIdx)
        }
      } else if (this.photoList.length < this.maxPhotos) {
        this.emitUpdatedList([...this.photoList, sampleItem])
      }
    },
    load4PhotoCollageSample() {
      const collage = this.samplePhotos.slice(0, 4).map((s, idx) => ({
        id: `collage-${idx}-${Date.now()}`,
        url: s.url,
        name: `${s.label}.jpg`
      }))
      this.emitUpdatedList(collage)
    }
  }
}
</script>
