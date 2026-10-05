<template>
  <div>
    <!-- HERO SECTION -->
    <section class="relative overflow-hidden bg-gradient-to-b from-cream-100/80 via-cream-50 to-cream-50 pt-10 pb-20 lg:py-24 border-b border-cream-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <!-- Left Hero Copy -->
          <div class="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-100/80 border border-gold-300/60 text-gold-800 text-xs font-semibold tracking-wide">
              <Sparkles class="w-3.5 h-3.5 text-gold-600" />
              <span>Handcrafted Bespoke Photo Framing</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-charcoal-900 leading-[1.12] tracking-tight">
              Create a Frame That Tells Your Story
            </h1>

            <p class="text-base sm:text-lg text-charcoal-800/75 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Choose your favorite frame, select a beautiful design, add your personal message and create a personalized photo frame.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <router-link
                :to="`/customize/${defaultFrameId}`"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-charcoal-900 hover:bg-gold-600 text-white text-sm font-semibold transition-all shadow-elevated"
              >
                <Sparkles class="w-4 h-4 text-gold-300" />
                <span>Create Your Frame</span>
                <ArrowRight class="w-4 h-4" />
              </router-link>

              <router-link
                to="/frames"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-cream-100 text-charcoal-900 border border-cream-300 text-sm font-semibold transition-all shadow-soft"
              >
                <span>Explore Frames</span>
              </router-link>
            </div>

            <!-- Highlights Row -->
            <div class="pt-4 grid grid-cols-3 gap-4 border-t border-cream-200 max-w-lg mx-auto lg:mx-0">
              <div>
                <p class="text-xl font-serif font-bold text-charcoal-900">12+</p>
                <p class="text-xs text-charcoal-800/65">Artisan Frames</p>
              </div>
              <div>
                <p class="text-xl font-serif font-bold text-charcoal-900">16+</p>
                <p class="text-xs text-charcoal-800/65">Curated Designs</p>
              </div>
              <div>
                <p class="text-xl font-serif font-bold text-charcoal-900">4.9 ★</p>
                <p class="text-xs text-charcoal-800/65">Customer Rating</p>
              </div>
            </div>
          </div>

          <!-- Right Visual of Customized Photo Frames -->
          <div class="lg:col-span-6">
            <div class="relative mx-auto max-w-lg">
              <FramePreview
                :frame="heroFrame"
                :design="heroDesign"
                size="12x18"
                photo="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80"
                :custom-text="{
                  name: 'Jay & Priya',
                  date: '30 September 2026',
                  customMessage: 'Forever & Always ❤️'
                }"
              />

              <!-- Floating Frame Style Switcher Pill -->
              <div class="mt-4 bg-white rounded-2xl border border-cream-200 p-3 shadow-soft flex items-center justify-between gap-3">
                <span class="text-xs font-medium text-charcoal-800/75 pl-2">
                  Try frame finish:
                </span>
                <div class="flex items-center gap-2">
                  <button
                    v-for="frame in featuredFrames.slice(0, 4)"
                    :key="frame.id"
                    type="button"
                    :class="[
                      'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                      heroFrame?.id === frame.id
                        ? 'bg-charcoal-900 text-white'
                        : 'bg-cream-100 text-charcoal-800 hover:bg-cream-200'
                    ]"
                    @click="heroFrame = frame"
                  >
                    {{ frame.material }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED FRAMES SECTION -->
    <section class="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Handcrafted Mouldings
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900 mt-1">
            Featured Frames
          </h2>
        </div>
        <router-link
          to="/frames"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal-900 hover:text-gold-600 transition-colors"
        >
          <span>View All {{ activeFrames.length }} Frames</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <FrameCard
          v-for="frame in featuredFrames"
          :key="frame.id"
          :frame="frame"
        />
      </div>
    </section>

    <!-- POPULAR DESIGNS SECTION (Hidden if turned off in Studio Settings) -->
    <section v-if="enableDesignSection" class="py-16 sm:py-20 bg-cream-100/70 dark:bg-charcoal-800/40 border-y border-cream-200 dark:border-charcoal-700/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Signature Templates
            </span>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900 dark:text-white mt-1">
              Popular Designs
            </h2>
          </div>
          <router-link
            :to="`/customize/${defaultFrameId}`"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal-900 dark:text-cream-100 hover:text-gold-600 transition-colors"
          >
            <span>Explore All {{ popularDesigns.length }}+ Designs in Studio</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DesignCard
            v-for="design in popularDesigns"
            :key="design.id"
            :design="design"
            :selected="selectedDesign?.id === design.id"
            @select="onSelectDesignFromHome"
          />
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section id="how-it-works" class="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          {{ enableDesignSection ? 'Simple 4-Step Process' : 'Simple 3-Step Process' }}
        </span>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900 dark:text-white mt-1">
          How It Works
        </h2>
        <p class="text-sm sm:text-base text-charcoal-800/70 dark:text-cream-200/70 mt-2">
          From selecting your artisanal moulding to previewing your personalized caption live.
        </p>
      </div>

      <div :class="['grid grid-cols-1 sm:grid-cols-2 gap-6', enableDesignSection ? 'lg:grid-cols-4' : 'lg:grid-cols-3']">
        <div
          v-for="step in displayedSteps"
          :key="step.number"
          class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-6 shadow-soft relative group hover:border-gold-400 transition-all"
        >
          <div class="flex items-center justify-between mb-5">
            <span class="text-3xl font-serif font-bold text-gold-500">
              {{ step.number }}
            </span>
            <div class="w-11 h-11 rounded-xl bg-cream-100 dark:bg-charcoal-700 text-charcoal-900 dark:text-cream-100 group-hover:bg-charcoal-900 group-hover:text-gold-400 flex items-center justify-center transition-colors">
              <component :is="step.icon" class="w-5 h-5" />
            </div>
          </div>
          <h3 class="text-lg font-serif font-semibold text-charcoal-900 dark:text-white mb-2">
            {{ step.title }}
          </h3>
          <p class="text-xs text-charcoal-800/70 dark:text-cream-200/70 leading-relaxed">
            {{ step.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS / CUSTOMER REVIEWS (Controlled by Studio Settings) -->
    <section v-if="enableReviews" class="py-16 sm:py-20 bg-cream-50/60 dark:bg-charcoal-900 border-t border-cream-200 dark:border-charcoal-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Real Stories, Cherished Moments
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900 dark:text-white mt-1">
            Loved by 10,000+ Customers
          </h2>
          <p class="text-sm sm:text-base text-charcoal-800/70 dark:text-cream-200/70 mt-2">
            See how our studio handcrafted frames turn special photographs into everlasting wall art.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div
            v-for="review in customerReviews"
            :key="review.author"
            class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-6 flex flex-col justify-between shadow-soft hover:shadow-md transition-shadow"
          >
            <div>
              <div class="flex items-center gap-1 text-gold-500 mb-3">
                <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-current" />
              </div>
              <p class="text-xs sm:text-sm text-charcoal-800/90 dark:text-cream-100/90 italic leading-relaxed mb-4">
                "{{ review.comment }}"
              </p>
            </div>
            <div class="flex items-center justify-between border-t border-cream-200/60 dark:border-charcoal-700/60 pt-4">
              <div>
                <h4 class="text-xs font-bold text-charcoal-900 dark:text-white">{{ review.author }}</h4>
                <span class="text-[11px] text-charcoal-800/60 dark:text-cream-200/60">{{ review.location }}</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Verified Order
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US SECTION -->
    <section class="py-16 sm:py-20 bg-charcoal-900 text-cream-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            The Atelier Standard
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            Why Choose Us
          </h2>
          <p class="text-sm text-cream-200/70 mt-2">
            Every custom frame is individually crafted, inspected, and packaged in our studio.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div
            v-for="feature in whyChooseUs"
            :key="feature.title"
            class="bg-charcoal-800/90 rounded-2xl border border-white/10 p-6 hover:border-gold-500/50 transition-colors"
          >
            <div class="w-11 h-11 rounded-xl bg-gold-500/15 text-gold-400 flex items-center justify-center mb-4">
              <component :is="feature.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-serif font-semibold text-white mb-1.5">
              {{ feature.title }}
            </h3>
            <p class="text-xs text-cream-200/70 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>

        <!-- Bottom CTA Banner -->
        <div class="mt-14 bg-gradient-to-r from-gold-700/30 via-charcoal-800 to-gold-700/30 rounded-3xl border border-gold-500/30 p-8 sm:p-10 text-center">
          <h3 class="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
            Ready to Frame Your Favorite Memory?
          </h3>
          <p class="text-sm text-cream-200/80 max-w-xl mx-auto mb-6">
            Upload your photo, preview it live across 12+ frames and 16+ curated occasion templates, and order in minutes.
          </p>
          <router-link
            :to="`/customize/${defaultFrameId}`"
            class="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 text-sm font-bold transition-colors"
          >
            <Sparkles class="w-4 h-4" />
            <span>Start Customizing Now</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Sparkles,
  ArrowRight,
  Frame,
  Palette,
  Camera,
  ShoppingBag,
  Award,
  HeartHandshake,
  Sliders,
  ShieldCheck,
  Truck,
  Star
} from 'lucide-vue-next'
import FrameCard from '@/components/customer/FrameCard.vue'
import DesignCard from '@/components/customer/DesignCard.vue'
import FramePreview from '@/components/customer/FramePreview.vue'

export default {
  name: 'HomeView',
  components: {
    Sparkles,
    ArrowRight,
    Frame,
    Palette,
    Camera,
    ShoppingBag,
    Award,
    HeartHandshake,
    Sliders,
    ShieldCheck,
    Truck,
    Star,
    FrameCard,
    DesignCard,
    FramePreview
  },
  data() {
    return {
      heroFrame: null,
      howItWorksSteps: [
        {
          number: '01',
          title: 'Choose a Frame',
          description: 'Select from solid walnut, brushed champagne gold, natural oak, or matte gallery profiles in 4 standard sizes.',
          icon: 'Frame'
        },
        {
          number: '02',
          title: 'Choose a Design',
          description: 'Pick an archival mat design tailored for weddings, anniversaries, birthdays, family portraits, or minimal interiors.',
          icon: 'Palette'
        },
        {
          number: '03',
          title: 'Customize Your Photo',
          description: 'Upload your favorite photo, add names, special dates, and a heartfelt message with real-time live preview.',
          icon: 'Camera'
        },
        {
          number: '04',
          title: 'Place Your Order',
          description: 'Enter your delivery address, review every customization detail, and receive museum-grade framed art at your doorstep.',
          icon: 'ShoppingBag'
        }
      ],
      whyChooseUs: [
        {
          title: 'Premium Quality',
          description: 'Kiln-dried hardwood mouldings, acid-free archival mats, and crystal-clear glazing.',
          icon: 'Award'
        },
        {
          title: 'Personalized Designs',
          description: 'Curated typography and border templates for every milestone occasion.',
          icon: 'HeartHandshake'
        },
        {
          title: 'Easy Customization',
          description: 'Interactive live preview updates immediately as you change frames, designs, and text.',
          icon: 'Sliders'
        },
        {
          title: 'Secure Ordering',
          description: 'Transparent pricing and complete order review before confirmation.',
          icon: 'ShieldCheck'
        },
        {
          title: 'Fast Delivery',
          description: 'Shock-resistant protective studio packaging with insured doorstep delivery.',
          icon: 'Truck'
        }
      ],
      customerReviews: [
        {
          author: 'Priya & Siddharth Sharma',
          location: 'Bengaluru, KA',
          comment: 'The walnut gallery frame with our wedding photo exceeded every expectation! The mat border and inscribed names make it look straight out of a fine art gallery.'
        },
        {
          author: 'Ananya Deshmukh',
          location: 'Mumbai, MH',
          comment: 'Ordered an anniversary frame for my parents. The live preview was 100% accurate to the real product, and the packaging protected it flawlessly.'
        },
        {
          author: 'Rohan Mehra',
          location: 'New Delhi, DL',
          comment: 'The champagne gold finish is spectacular. Multi-photo collage upload was effortless on mobile. FrameVue is our go-to gifting service now.'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'enableDesignSection',
      'enableReviews'
    ]),
    ...mapGetters('frames', ['activeFrames', 'featuredFrames']),
    ...mapGetters('designs', ['popularDesigns']),
    ...mapGetters('customization', ['selectedFrame', 'selectedDesign']),
    defaultFrameId() {
      return this.selectedFrame?.id || this.activeFrames[0]?.id || 1
    },
    heroDesign() {
      return this.selectedDesign || this.popularDesigns[0]
    },
    displayedSteps() {
      if (!this.enableDesignSection) {
        return [
          {
            number: '01',
            title: 'Choose a Frame',
            description: 'Select from solid walnut, brushed champagne gold, natural oak, or matte gallery profiles in 4 standard sizes.',
            icon: 'Frame'
          },
          {
            number: '02',
            title: 'Customize Your Photo',
            description: 'Upload your favorite photo, add names, special dates, and a heartfelt message with real-time live preview.',
            icon: 'Camera'
          },
          {
            number: '03',
            title: 'Place Your Order',
            description: 'Enter your delivery address, review every customization detail, and receive museum-grade framed art at your doorstep.',
            icon: 'ShoppingBag'
          }
        ]
      }
      return this.howItWorksSteps
    }
  },
  created() {
    this.heroFrame = this.featuredFrames[0] || this.activeFrames[0]
  },
  methods: {
    onSelectDesignFromHome(design) {
      this.$store.dispatch('customization/setSelectedDesign', design)
      this.$router.push(`/customize/${this.defaultFrameId}`)
    }
  }
}
</script>
