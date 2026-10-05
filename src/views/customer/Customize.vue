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
      <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
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

    <!-- Mobile Sticky Bottom Action Bar -->
    <div class="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-cream-300 p-3.5 px-4 flex items-center justify-between gap-4 lg:hidden shadow-elevated">
      <div>
        <span class="block text-[10px] uppercase tracking-wider text-charcoal-800/60 font-semibold">
          {{ formatSizeLabel(selectedSize) }} • Qty {{ quantity }}
        </span>
        <span class="text-lg font-bold text-charcoal-900">
          {{ formatCurrency(totalCustomizationPrice) }}
        </span>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold shadow-sm"
        @click="continueToDetails"
      >
        <span>Continue to Details</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ArrowRight, ShoppingBag, Minus, Plus } from 'lucide-vue-next'
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
      showFrameSwitcher: false
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
    }
  }
}
</script>
