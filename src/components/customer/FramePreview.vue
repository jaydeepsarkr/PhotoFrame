<template>
  <div class="w-full">
    <div class="bg-gradient-to-b from-cream-100 to-cream-200/70 rounded-3xl p-5 sm:p-8 border border-cream-300/80 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
      <!-- Subtle Studio Wall Lighting Effect -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-48 bg-white/40 dark:bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Top Info Pills -->
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-5 z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-charcoal-900 border border-cream-300 shadow-sm">
          <Sparkles class="w-3.5 h-3.5 text-gold-600" />
          <span>Live Interactive Preview</span>
          <span
            v-if="resolvedPhotos.length > 1"
            class="ml-1 px-1.5 py-0.2 rounded-full bg-gold-600 text-white text-[10px] font-bold"
          >
            {{ resolvedPhotos.length }} Photos
          </span>
        </span>

        <div class="flex items-center gap-1.5">
          <!-- Layout Toggle when Multiple Photos exist -->
          <button
            v-if="resolvedPhotos.length > 1"
            type="button"
            class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-charcoal-900 border border-cream-300 hover:border-gold-500 transition-colors"
            @click="previewMode = previewMode === 'collage' ? 'single' : 'collage'"
          >
            {{ previewMode === 'collage' ? 'Collage Grid' : 'Main Photo Only' }}
          </button>

          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-charcoal-900 dark:bg-gold-600 text-cream-50">
            {{ formatSizeLabel(size) }} Inches
          </span>
        </div>
      </div>

      <!-- Outer Realistic Moulding Frame -->
      <div
        :class="[
          'relative transition-all duration-300 rounded-md p-4 sm:p-6 w-full max-w-[390px]',
          frameTextureClass
        ]"
        :style="outerFrameInlineStyle"
      >
        <!-- Inner Museum Mat Board (Always preserves authentic archival mat color) -->
        <div
          class="p-4 sm:p-6 transition-colors duration-300 relative frame-mat-bevel"
          :style="{
            backgroundColor: design?.matColor || '#FDFBF7',
            border: `1px solid ${design?.accentColor || '#D0A66B'}40`
          }"
        >
          <!-- Decorative Design Inner Border -->
          <div
            class="p-3 sm:p-4 relative transition-all duration-300"
            :style="{
              border: `1.5px solid ${design?.accentColor || '#B07B38'}55`
            }"
          >
            <!-- Design Category Corner Ornament -->
            <div
              class="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] mb-2.5 font-semibold"
              :style="{ color: design?.accentColor || '#B07B38' }"
            >
              <span>{{ design?.category || 'Custom' }} Edition</span>
              <span>{{ design?.badgeText || '✦' }}</span>
            </div>

            <!-- PHOTO APERTURE (Single or Multi-Photo Collage) -->
            <div class="relative aspect-square w-full overflow-hidden bg-[#EDE6D8] shadow-inner border border-black/10">
              <!-- Empty State -->
              <div
                v-if="resolvedPhotos.length === 0"
                class="w-full h-full flex flex-col items-center justify-center text-[#4A453E] p-6 text-center"
              >
                <Camera class="w-8 h-8 mb-2 text-gold-600" />
                <span class="text-xs font-medium">Upload 1 or more photos to preview inside your frame</span>
              </div>

              <!-- Single Photo Mode (or 1 photo uploaded) -->
              <img
                v-else-if="resolvedPhotos.length === 1 || previewMode === 'single'"
                :src="resolvedPhotos[0]"
                alt="Customer Preview"
                class="w-full h-full object-cover transition-all duration-300"
              />

              <!-- 2 Photos Collage (Side-by-Side Diptych) -->
              <div
                v-else-if="resolvedPhotos.length === 2"
                class="w-full h-full grid grid-cols-2 gap-1.5 p-1.5"
                :style="{ backgroundColor: design?.matColor || '#FDFBF7' }"
              >
                <div
                  v-for="(imgUrl, i) in resolvedPhotos"
                  :key="i"
                  class="w-full h-full overflow-hidden border border-black/10"
                >
                  <img :src="imgUrl" :alt="`Collage ${i + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>

              <!-- 3 Photos Collage (1 Large Top/Left + 2 Stacked) -->
              <div
                v-else-if="resolvedPhotos.length === 3"
                class="w-full h-full grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5"
                :style="{ backgroundColor: design?.matColor || '#FDFBF7' }"
              >
                <div class="row-span-2 overflow-hidden border border-black/10">
                  <img :src="resolvedPhotos[0]" alt="Collage 1" class="w-full h-full object-cover" />
                </div>
                <div class="overflow-hidden border border-black/10">
                  <img :src="resolvedPhotos[1]" alt="Collage 2" class="w-full h-full object-cover" />
                </div>
                <div class="overflow-hidden border border-black/10">
                  <img :src="resolvedPhotos[2]" alt="Collage 3" class="w-full h-full object-cover" />
                </div>
              </div>

              <!-- 4+ Photos Collage Grid -->
              <div
                v-else
                :class="[
                  'w-full h-full grid gap-1.5 p-1.5',
                  resolvedPhotos.length <= 4 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3 grid-rows-2'
                ]"
                :style="{ backgroundColor: design?.matColor || '#FDFBF7' }"
              >
                <div
                  v-for="(imgUrl, i) in resolvedPhotos.slice(0, 6)"
                  :key="i"
                  class="w-full h-full overflow-hidden border border-black/10"
                >
                  <img :src="imgUrl" :alt="`Collage ${i + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- Personalized Caption Plaque Below Photo (Always dark ink on physical cream mat) -->
            <div class="pt-4 pb-1 text-center space-y-1">
              <p
                class="font-serif italic text-sm sm:text-base font-medium leading-snug break-words"
                style="color: #191817"
              >
                {{ displayMessage }}
              </p>

              <p
                class="text-xs sm:text-sm font-serif font-semibold tracking-wide uppercase pt-0.5"
                :style="{ color: design?.accentColor || '#8F602D' }"
              >
                {{ displayName }}
              </p>

              <p
                v-if="displayDate"
                class="text-[11px] tracking-[0.15em] uppercase font-medium"
                style="color: #57524B"
              >
                {{ displayDate }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Caption Bar -->
      <div class="mt-5 w-full flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-800/75 px-1">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: frame?.borderColor || '#4A2E1B' }"></span>
          <span class="font-medium text-charcoal-900">{{ frame?.name || 'Classic Wooden Frame' }}</span>
        </div>
        <div>
          Design: <strong class="text-charcoal-900">{{ design?.name || 'Romantic Gold' }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Sparkles, Camera } from 'lucide-vue-next'
import { formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'FramePreview',
  components: {
    Sparkles,
    Camera
  },
  props: {
    frame: {
      type: Object,
      default: () => ({})
    },
    design: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: String,
      default: '8x10'
    },
    photo: {
      type: String,
      default: ''
    },
    photos: {
      type: Array,
      default: () => []
    },
    customText: {
      type: Object,
      default: () => ({
        name: 'Jay & Priya',
        date: '30 September 2026',
        customMessage: 'Forever & Always ❤️'
      })
    }
  },
  data() {
    return {
      previewMode: 'collage'
    }
  },
  computed: {
    resolvedPhotos() {
      if (Array.isArray(this.photos) && this.photos.length > 0) {
        return this.photos
          .map(p => (typeof p === 'string' ? p : p?.url))
          .filter(Boolean)
      }
      if (this.photo) {
        return [this.photo]
      }
      return []
    },
    frameTextureClass() {
      if (this.frame?.borderTexture) return this.frame.borderTexture
      const mat = String(this.frame?.material || '').toLowerCase()
      if (mat.includes('metal')) return 'frame-texture-gold'
      if (mat.includes('acrylic')) return 'frame-texture-white'
      if (mat.includes('composite')) return 'frame-texture-black'
      return 'frame-texture-wood'
    },
    outerFrameInlineStyle() {
      if (this.frame?.borderColor && !this.frame?.borderTexture) {
        return { backgroundColor: this.frame.borderColor }
      }
      return {}
    },
    displayMessage() {
      return this.customText?.customMessage?.trim() || 'Forever & Always ❤️'
    },
    displayName() {
      return this.customText?.name?.trim() || 'Jay & Priya'
    },
    displayDate() {
      return this.customText?.date?.trim() || ''
    }
  },
  methods: {
    formatSizeLabel
  }
}
</script>
