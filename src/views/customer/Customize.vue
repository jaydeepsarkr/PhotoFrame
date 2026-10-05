<template>
  <div class="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 lg:pb-14">
    <!-- Top Stepper: Frame -> Design -> Customize -> Details -> Review -->
    <div class="mb-8">
      <Stepper
        :current-step="activeStepName"
        @step-click="onStepClick"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      <!-- LEFT STICKY COLUMN: LIVE FRAME PREVIEW & SUMMARY (Desktop Sticky) -->
      <div id="main-frame-preview" ref="topPreviewRef" class="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
        <FramePreview
          :frame="selectedFrame"
          :design="selectedDesign"
          :size="selectedSize"
          :photo="uploadedPhoto"
          :photos="uploadedPhotos"
          :custom-text="customText"
        />

        <!-- Customization Summary Card (Desktop) -->
        <div class="hidden lg:block">
          <OrderSummary
            title="Customization Summary"
            :show-customization-details="true"
            :frame="selectedFrame"
            :design="selectedDesign"
            :size="selectedSize"
            :quantity="quantity"
            :photo="uploadedPhoto"
            :photos="uploadedPhotos"
            :custom-text="customText"
            :subtotal="totalCustomizationPrice"
            :delivery="100"
            :total="totalCustomizationPrice + 100"
          >
            <div class="space-y-2.5">
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-sm font-semibold transition-all shadow-sm"
                @click="continueToDetails"
              >
                <span>Continue to Details</span>
                <ArrowRight class="w-4 h-4" />
              </button>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 text-xs font-semibold transition-colors"
                @click="saveToCartAndGo('/cart')"
              >
                <ShoppingBag class="w-4 h-4 text-gold-600" />
                <span>Add to Cart &amp; View Bag</span>
              </button>
            </div>
          </OrderSummary>
        </div>
      </div>

      <!-- RIGHT COLUMN: STEP-BY-STEP CUSTOMIZATION CONTROLS -->
      <div class="lg:col-span-7 space-y-8">
        <!-- 1. SELECT FRAME & SIZE -->
        <section id="step-frame" class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 shadow-soft space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200 pb-4">
            <div>
              <span class="text-[11px] font-semibold uppercase tracking-wider text-gold-600">Step 1</span>
              <h2 class="text-lg font-serif font-semibold text-charcoal-900">
                Selected Frame &amp; Size
              </h2>
            </div>
            <button
              type="button"
              class="text-xs font-semibold text-gold-600 hover:text-gold-500 underline"
              @click="showFrameSwitcher = !showFrameSwitcher"
            >
              {{ showFrameSwitcher ? 'Hide Frame Switcher' : 'Change Frame Style' }}
            </button>
          </div>

          <!-- Current Selected Frame Card -->
          <div v-if="selectedFrame" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-cream-50 p-4 rounded-2xl border border-cream-200">
            <img
              :src="selectedFrame.image"
              :alt="selectedFrame.name"
              class="w-20 h-20 rounded-xl object-cover border border-cream-300 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-serif font-semibold text-charcoal-900 text-base">
                  {{ selectedFrame.name }}
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-cream-300 text-charcoal-800">
                  {{ selectedFrame.material }}
                </span>
              </div>
              <p class="text-xs text-charcoal-800/70 mt-1 line-clamp-2">
                {{ selectedFrame.description }}
              </p>
            </div>
            <div class="text-left sm:text-right shrink-0">
              <span class="text-xs text-charcoal-800/55 block">Unit Price</span>
              <span class="text-lg font-bold text-charcoal-900">{{ formatCurrency(unitPrice) }}</span>
            </div>
          </div>

          <!-- Optional Inline Frame Switcher -->
          <div v-if="showFrameSwitcher" class="pt-2">
            <p class="text-xs font-semibold text-charcoal-800/70 mb-2.5">Choose another frame moulding:</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
              <button
                v-for="frameItem in activeFrames"
                :key="frameItem.id"
                type="button"
                :class="[
                  'flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all',
                  selectedFrame?.id === frameItem.id
                    ? 'border-gold-600 bg-gold-50/60 ring-1 ring-gold-600'
                    : 'border-cream-200 hover:border-gold-400 bg-white'
                ]"
                @click="selectFrame(frameItem)"
              >
                <img :src="frameItem.image" :alt="frameItem.name" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div class="min-w-0">
                  <p class="text-xs font-semibold text-charcoal-900 truncate">{{ frameItem.name }}</p>
                  <p class="text-[11px] text-charcoal-800/60">{{ formatCurrency(frameItem.discountPrice || frameItem.price) }}</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Size & Quantity Controls -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-2">
                Select Size (Inches)
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="size in availableSizes"
                  :key="size"
                  type="button"
                  :class="[
                    'py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all',
                    selectedSize === size
                      ? 'bg-charcoal-900 dark:bg-gold-600 text-white border-charcoal-900 dark:border-gold-600 shadow-sm'
                      : 'bg-cream-50 text-charcoal-900 border-cream-300 hover:border-gold-500'
                  ]"
                  @click="setSelectedSize(size)"
                >
                  {{ formatSizeLabel(size) }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-800/80 mb-2">
                Quantity
              </label>
              <div class="inline-flex items-center rounded-xl border border-cream-300 bg-cream-50 p-1 w-full justify-between">
                <button
                  type="button"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-900 hover:bg-white disabled:opacity-40"
                  :disabled="quantity <= 1"
                  @click="setQuantity(quantity - 1)"
                >
                  <Minus class="w-3.5 h-3.5" />
                </button>
                <span class="text-sm font-bold text-charcoal-900">{{ quantity }}</span>
                <button
                  type="button"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-900 hover:bg-white"
                  @click="setQuantity(quantity + 1)"
                >
                  <Plus class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. SELECT DESIGN (Hidden if turned off in Studio Settings) -->
        <section v-if="enableDesignSection" id="step-design" class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 shadow-soft space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200 pb-4">
            <div>
              <span class="text-[11px] font-semibold uppercase tracking-wider text-gold-600">Step 2</span>
              <h2 class="text-lg font-serif font-semibold text-charcoal-900">
                Select Design Template
              </h2>
            </div>
            <span class="text-xs text-charcoal-800/65">
              Selected: <strong class="text-charcoal-900">{{ selectedDesign?.name }}</strong>
            </span>
          </div>

          <!-- Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              v-for="cat in ['All', ...categories]"
              :key="cat"
              type="button"
              :class="[
                'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                activeCategory === cat
                  ? 'bg-charcoal-900 dark:bg-gold-600 text-white shadow-sm'
                  : 'bg-cream-100 text-charcoal-800 hover:bg-cream-200'
              ]"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Designs Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1">
            <DesignCard
              v-for="design in filteredDesigns"
              :key="design.id"
              :design="design"
              :compact="true"
              :selected="selectedDesign?.id === design.id"
              @select="setSelectedDesign"
            />
          </div>
        </section>

        <!-- 3. UPLOAD SINGLE OR MULTIPLE PHOTOS -->
        <section id="step-customize" class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 shadow-soft">
          <div class="mb-4 border-b border-cream-200 pb-3.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
              Step {{ enableDesignSection ? 3 : 2 }}
            </span>
            <h2 class="text-lg font-serif font-semibold text-charcoal-900">
              {{ enableMultiPhotoUpload ? 'Upload Your Photos (Single or Multi-Photo Collage)' : 'Upload Your Photo' }}
            </h2>
          </div>
          <ImageUploader
            :model-value="uploadedPhoto"
            :photos="uploadedPhotos"
            :multiple="enableMultiPhotoUpload"
            :max-photos="enableMultiPhotoUpload ? 6 : 1"
            :label="enableMultiPhotoUpload ? 'Select 1 or Multiple Photos' : 'Select High Resolution Photo'"
            @uploaded="onPhotosUploaded"
          />
        </section>

        <!-- 4. CUSTOM DESCRIPTION / TEXT (Optional if enabled in Studio Settings) -->
        <section v-if="enableCustomText" class="space-y-2">
          <div class="px-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
              Step {{ enableDesignSection ? 4 : 3 }}
            </span>
          </div>
          <CustomizationForm
            :custom-text="customText"
            :description="customDescription"
            @update:custom-text="setCustomText"
            @update:description="setCustomDescription"
          />
        </section>

        <!-- Mobile / Tablet Summary Section -->
        <div class="lg:hidden">
          <OrderSummary
            title="Customization Summary"
            :show-customization-details="true"
            :frame="selectedFrame"
            :design="selectedDesign"
            :size="selectedSize"
            :quantity="quantity"
            :photo="uploadedPhoto"
            :photos="uploadedPhotos"
            :custom-text="customText"
            :subtotal="totalCustomizationPrice"
            :delivery="100"
            :total="totalCustomizationPrice + 100"
          >
            <div class="space-y-2.5">
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-sm font-semibold transition-all"
                @click="continueToDetails"
              >
                <span>Continue to Details</span>
                <ArrowRight class="w-4 h-4" />
              </button>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 border border-cream-300 text-xs font-semibold transition-colors"
                @click="saveToCartAndGo('/cart')"
              >
                <ShoppingBag class="w-4 h-4 text-gold-600" />
                <span>Add to Cart &amp; View Bag</span>
              </button>
            </div>
          </OrderSummary>
        </div>
      </div>
    </div>

    <!-- Floating Live Frame Preview Pill (Mobile Only - appears when top preview is scrolled off screen) -->
    <transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="opacity-0 translate-y-6 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-6 scale-90"
    >
      <div
        v-if="!isTopPreviewVisible && !showMobilePreviewModal"
        class="fixed bottom-20 right-3.5 z-30 lg:hidden cursor-pointer group"
        @click="showMobilePreviewModal = true"
      >
        <div class="bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md rounded-2xl border-2 border-gold-500/70 p-2 shadow-elevated flex items-center gap-2.5 hover:border-gold-500 transition-all hover:scale-[1.02] active:scale-95">
          <!-- Mini Live Frame Thumbnail with Real Moulding & Mat -->
          <div
            class="w-12 h-12 rounded-lg p-1 relative flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
            :style="miniMouldingStyle"
          >
            <div
              class="w-full h-full p-0.5 flex items-center justify-center relative overflow-hidden"
              :style="{ backgroundColor: selectedDesign?.matColor || '#FDFBF7' }"
            >
              <img
                v-if="primaryPhoto"
                :src="primaryPhoto"
                alt="Frame Thumbnail"
                class="w-full h-full object-cover rounded-xs"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-cream-200 text-charcoal-400">
                <Camera class="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <!-- Live Label & Frame Info -->
          <div class="text-left pr-1.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[9px] font-bold uppercase tracking-wider text-charcoal-900 dark:text-cream-100">Live Frame</span>
              <span class="text-[9px] font-semibold text-gold-600 bg-gold-50 dark:bg-gold-950/60 px-1.5 py-0.2 rounded-full">Updated</span>
            </div>
            <span class="text-xs font-bold text-charcoal-900 dark:text-cream-100 block leading-tight truncate max-w-[125px]">
              {{ selectedFrame?.name }}
            </span>
            <span class="text-[10px] text-gold-600 dark:text-gold-400 font-semibold flex items-center gap-1">
              <Eye class="w-3 h-3 inline" />
              Tap to see frame ↗
            </span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Sticky Bottom Action Bar -->
    <div class="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-t border-cream-300 dark:border-charcoal-800 p-3 px-4 flex items-center justify-between gap-2.5 lg:hidden shadow-elevated">
      <div class="min-w-0">
        <span class="block text-[10px] uppercase tracking-wider text-charcoal-800/60 dark:text-cream-300/60 font-semibold truncate">
          {{ formatSizeLabel(selectedSize) }} • Qty {{ quantity }}
        </span>
        <span class="text-base sm:text-lg font-bold text-charcoal-900 dark:text-cream-100">
          {{ formatCurrency(totalCustomizationPrice) }}
        </span>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Live Preview Quick Button -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gold-50 dark:bg-gold-950/60 hover:bg-gold-100 dark:hover:bg-gold-900/60 text-gold-900 dark:text-gold-200 border border-gold-300 dark:border-gold-700 text-xs font-semibold transition-colors"
          @click="showMobilePreviewModal = true"
        >
          <Eye class="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0" />
          <span>View Frame</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 dark:hover:bg-gold-500 text-white text-xs font-semibold shadow-sm transition-all"
          @click="continueToDetails"
        >
          <span>Continue</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Mobile Interactive Live Preview Modal / Drawer -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showMobilePreviewModal"
        class="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/70 backdrop-blur-xs"
        @click.self="showMobilePreviewModal = false"
      >
        <transition
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div
            v-if="showMobilePreviewModal"
            class="bg-cream-50 dark:bg-charcoal-900 rounded-t-3xl border-t border-gold-500/40 p-4 sm:p-6 shadow-2xl max-h-[88vh] overflow-y-auto space-y-4"
          >
            <!-- Handle & Header -->
            <div class="flex items-center justify-between pb-2 border-b border-cream-200 dark:border-charcoal-800">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <h3 class="text-sm font-serif font-bold text-charcoal-900 dark:text-cream-100 leading-tight">
                    Live Frame Preview
                  </h3>
                  <p class="text-[11px] text-charcoal-500 dark:text-cream-400">
                    {{ selectedFrame?.name }} • {{ formatSizeLabel(selectedSize) }} • {{ selectedDesign?.name }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="text-xs text-gold-600 dark:text-gold-400 hover:text-gold-500 font-medium px-2.5 py-1.5 rounded-lg bg-gold-50 dark:bg-gold-950/40 border border-gold-200 dark:border-gold-800"
                  @click="scrollToTopAndClose"
                >
                  <ChevronUp class="w-3.5 h-3.5 inline mr-0.5" />
                  Scroll to Top
                </button>
                <button
                  type="button"
                  class="p-2 rounded-xl bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-cream-200 border border-cream-200 dark:border-charcoal-700 hover:bg-cream-100"
                  aria-label="Close preview"
                  @click="showMobilePreviewModal = false"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- The Live Frame Preview inside Modal -->
            <div class="py-1">
              <FramePreview
                :frame="selectedFrame"
                :design="selectedDesign"
                :size="selectedSize"
                :photo="uploadedPhoto"
                :photos="uploadedPhotos"
                :custom-text="customText"
              />
            </div>

            <!-- Customization Summary Badges inside Modal -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div class="p-2.5 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700">
                <span class="block text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold">Frame Moulding</span>
                <span class="font-bold text-charcoal-900 dark:text-cream-100 truncate block">{{ selectedFrame?.name }}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700">
                <span class="block text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold">Selected Size</span>
                <span class="font-bold text-charcoal-900 dark:text-cream-100 block">{{ formatSizeLabel(selectedSize) }} Inches</span>
              </div>
              <div class="p-2.5 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700">
                <span class="block text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold">Design Mat</span>
                <span class="font-bold text-charcoal-900 dark:text-cream-100 truncate block">{{ selectedDesign?.name }}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700">
                <span class="block text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold">Total Price</span>
                <span class="font-bold text-gold-600 block">{{ formatCurrency(totalCustomizationPrice) }}</span>
              </div>
            </div>

            <!-- Modal Action Footer -->
            <div class="pt-2">
              <button
                type="button"
                class="w-full py-3 px-4 rounded-xl bg-charcoal-900 dark:bg-gold-600 text-white text-xs font-semibold shadow-sm hover:bg-gold-600 dark:hover:bg-gold-500 transition-colors flex items-center justify-center gap-2"
                @click="showMobilePreviewModal = false"
              >
                <span>Continue Customizing (Back to Options)</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ArrowRight, ShoppingBag, Minus, Plus, Eye, X, ChevronUp, Camera, Sparkles } from 'lucide-vue-next'
import Stepper from '@/components/customer/Stepper.vue'
import FramePreview from '@/components/customer/FramePreview.vue'
import DesignCard from '@/components/customer/DesignCard.vue'
import ImageUploader from '@/components/customer/ImageUploader.vue'
import CustomizationForm from '@/components/customer/CustomizationForm.vue'
import OrderSummary from '@/components/customer/OrderSummary.vue'
import { formatCurrency, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'CustomizeView',
  components: {
    ArrowRight,
    ShoppingBag,
    Minus,
    Plus,
    Eye,
    X,
    ChevronUp,
    Camera,
    Sparkles,
    Stepper,
    FramePreview,
    DesignCard,
    ImageUploader,
    CustomizationForm,
    OrderSummary
  },
  data() {
    return {
      activeCategory: 'All',
      activeStepName: 'Customize',
      showFrameSwitcher: false,
      isTopPreviewVisible: true,
      showMobilePreviewModal: false,
      observer: null,
      scrollListener: null
    }
  },
  computed: {
    ...mapGetters([
      'enableDesignSection',
      'enableMultiPhotoUpload',
      'enableCustomText'
    ]),
    ...mapGetters('frames', ['activeFrames', 'getFrameById']),
    ...mapGetters('designs', ['categories', 'getDesignsByCategory']),
    ...mapGetters('customization', [
      'selectedFrame',
      'selectedDesign',
      'selectedSize',
      'quantity',
      'uploadedPhoto',
      'uploadedPhotoName',
      'uploadedPhotos',
      'customText',
      'customDescription',
      'unitPrice',
      'totalCustomizationPrice'
    ]),
    availableSizes() {
      return this.selectedFrame?.sizes?.length
        ? this.selectedFrame.sizes
        : ['8x10', '12x18', '16x20', '20x24']
    },
    filteredDesigns() {
      return this.getDesignsByCategory(this.activeCategory)
    },
    miniMouldingStyle() {
      const color = this.selectedFrame?.borderColor || '#4A2E1B'
      return {
        backgroundColor: color,
        border: `3px solid ${color}`
      }
    },
    primaryPhoto() {
      if (this.uploadedPhoto) return this.uploadedPhoto
      if (this.uploadedPhotos?.length > 0) return this.uploadedPhotos[0]
      return null
    }
  },
  mounted() {
    this.setupPreviewObserver()
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener)
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(id) {
        if (id) {
          const found = this.getFrameById(id)
          if (found) {
            this.setSelectedFrame(found)
          }
        }
      }
    },
    '$route.query.category': {
      immediate: true,
      handler(cat) {
        if (cat && this.categories.includes(cat)) {
          this.activeCategory = cat
        }
      }
    }
  },
  methods: {
    formatCurrency,
    formatSizeLabel,
    ...mapActions('customization', [
      'setSelectedFrame',
      'setSelectedDesign',
      'setSelectedSize',
      'setQuantity',
      'setUploadedPhoto',
      'setUploadedPhotos',
      'setCustomText',
      'setCustomDescription',
      'clearEditingCartItem'
    ]),
    selectFrame(frame) {
      this.setSelectedFrame(frame)
      if (String(this.$route.params.id) !== String(frame.id)) {
        this.$router.replace(`/customize/${frame.id}`)
      }
    },
    onPhotosUploaded(photosArray) {
      this.setUploadedPhotos(photosArray)
    },
    onStepClick(step) {
      if (step.key === 'Frame') {
        document.getElementById('step-frame')?.scrollIntoView({ behavior: 'smooth' })
        this.activeStepName = 'Frame'
      } else if (step.key === 'Design') {
        document.getElementById('step-design')?.scrollIntoView({ behavior: 'smooth' })
        this.activeStepName = 'Design'
      } else if (step.key === 'Customize') {
        document.getElementById('step-customize')?.scrollIntoView({ behavior: 'smooth' })
        this.activeStepName = 'Customize'
      } else if (step.key === 'Details') {
        this.continueToDetails()
      } else if (step.key === 'Review') {
        this.continueToDetails()
      }
    },
    saveToCartAndGo(targetPath) {
      const editingCartItemId = this.$store.state.customization.editingCartItemId
      const frameName = this.selectedFrame?.name || 'Custom Bespoke Frame'
      this.$store.dispatch('cart/addToCart', {
        editingCartItemId,
        frame: this.selectedFrame,
        design: this.selectedDesign,
        size: this.selectedSize,
        photo: this.uploadedPhoto,
        photos: this.uploadedPhotos,
        photoName: this.uploadedPhotoName,
        customText: { ...this.customText },
        customDescription: this.customDescription,
        quantity: this.quantity,
        unitPrice: this.unitPrice
      })
      this.clearEditingCartItem()
      this.$toast?.success(`"${frameName}" added to your shopping cart!`, 'Cart Updated')
      this.$router.push(targetPath)
    },
    continueToDetails() {
      this.saveToCartAndGo('/checkout')
    },
    setupPreviewObserver() {
      if (typeof window === 'undefined') return

      const target = this.$refs.topPreviewRef
      if (target && 'IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0]
            this.isTopPreviewVisible = entry ? entry.isIntersecting : true
          },
          { threshold: 0.1 }
        )
        this.observer.observe(target)
      } else {
        this.scrollListener = () => {
          this.isTopPreviewVisible = window.scrollY < 300
        }
        window.addEventListener('scroll', this.scrollListener, { passive: true })
      }
    },
    scrollToTopAndClose() {
      this.showMobilePreviewModal = false
      this.$nextTick(() => {
        const el = document.getElementById('main-frame-preview') || document.getElementById('step-frame')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      })
    }
  }
}
</script>
