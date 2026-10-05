<template>
  <div class="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-cream-200">
      <div>
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          Artisanal Collection
        </span>
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900 mt-1">
          Explore Photo Frames
        </h1>
        <p class="text-sm text-charcoal-800/70 mt-1">
          Handcrafted wooden, metallic, and contemporary gallery frames in multiple archival sizes.
        </p>
      </div>

      <!-- Sort Dropdown -->
      <div class="flex items-center gap-3 self-start md:self-auto">
        <label for="sort-select" class="text-xs font-semibold uppercase tracking-wider text-charcoal-800/70 whitespace-nowrap">
          Sort By:
        </label>
        <select
          id="sort-select"
          v-model="sortBy"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-gold-600"
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
        </select>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="mt-6 bg-white rounded-2xl border border-cream-200 p-4 sm:p-5 shadow-soft">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <!-- Material Filter -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-800/70 mb-1.5">
            Material
          </label>
          <select
            v-model="filters.material"
            class="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option value="All">All Materials</option>
            <option v-for="mat in materialOptions" :key="mat" :value="mat">{{ mat }}</option>
          </select>
        </div>

        <!-- Size Filter -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-800/70 mb-1.5">
            Size
          </label>
          <select
            v-model="filters.size"
            class="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option value="All">All Sizes</option>
            <option value="8x10">8 × 10 Inches</option>
            <option value="12x18">12 × 18 Inches</option>
            <option value="16x20">16 × 20 Inches</option>
            <option value="20x24">20 × 24 Inches</option>
          </select>
        </div>

        <!-- Price Filter -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-800/70 mb-1.5">
            Price Range
          </label>
          <select
            v-model="filters.price"
            class="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option value="All">Any Price</option>
            <option value="under-800">Under ₹800</option>
            <option value="800-1200">₹800 – ₹1,200</option>
            <option value="above-1200">Above ₹1,200</option>
          </select>
        </div>

        <!-- Style Filter -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-800/70 mb-1.5">
            Style
          </label>
          <select
            v-model="filters.style"
            class="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-gold-600"
          >
            <option value="All">All Styles</option>
            <option v-for="st in styleOptions" :key="st" :value="st">{{ st }}</option>
          </select>
        </div>

        <!-- Reset Button -->
        <div class="flex items-center justify-between lg:justify-end gap-2">
          <span class="text-xs text-charcoal-800/65 font-medium">
            Showing {{ filteredFrames.length }} frames
          </span>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 text-xs font-semibold transition-colors"
            @click="resetFilters"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Frames Grid -->
    <div v-if="filteredFrames.length" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <FrameCard
        v-for="frame in filteredFrames"
        :key="frame.id"
        :frame="frame"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="mt-12">
      <EmptyState
        title="No frames match your selected filters"
        description="Try clearing one or more filters to browse our complete collection of handcrafted frames."
      >
        <template #action>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-charcoal-900 text-white text-sm font-semibold hover:bg-gold-600 transition-colors"
            @click="resetFilters"
          >
            Reset All Filters
          </button>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { RotateCcw } from 'lucide-vue-next'
import FrameCard from '@/components/customer/FrameCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

export default {
  name: 'FramesCatalogView',
  components: {
    RotateCcw,
    FrameCard,
    EmptyState
  },
  data() {
    return {
      sortBy: 'popular',
      filters: {
        material: 'All',
        size: 'All',
        price: 'All',
        style: 'All'
      }
    }
  },
  computed: {
    ...mapGetters('frames', ['activeFrames']),
    materialOptions() {
      const set = new Set(this.activeFrames.map(f => f.material).filter(Boolean))
      return Array.from(set)
    },
    styleOptions() {
      const set = new Set(this.activeFrames.map(f => f.style).filter(Boolean))
      return Array.from(set)
    },
    hasActiveFilters() {
      return (
        this.filters.material !== 'All' ||
        this.filters.size !== 'All' ||
        this.filters.price !== 'All' ||
        this.filters.style !== 'All'
      )
    },
    filteredFrames() {
      let list = [...this.activeFrames]

      if (this.filters.material !== 'All') {
        list = list.filter(f => f.material === this.filters.material)
      }

      if (this.filters.size !== 'All') {
        list = list.filter(f => Array.isArray(f.sizes) && f.sizes.includes(this.filters.size))
      }

      if (this.filters.style !== 'All') {
        list = list.filter(f => f.style === this.filters.style)
      }

      if (this.filters.price !== 'All') {
        list = list.filter(f => {
          const effectivePrice = Number(f.discountPrice || f.price || 0)
          if (this.filters.price === 'under-800') return effectivePrice < 800
          if (this.filters.price === '800-1200') return effectivePrice >= 800 && effectivePrice <= 1200
          if (this.filters.price === 'above-1200') return effectivePrice > 1200
          return true
        })
      }

      if (this.sortBy === 'popular') {
        list.sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)))
      } else if (this.sortBy === 'newest') {
        list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || b.id - a.id)
      } else if (this.sortBy === 'price-asc') {
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
      } else if (this.sortBy === 'price-desc') {
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
      }

      return list
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(query) {
        if (query.material) {
          this.filters.material = query.material
        }
      }
    }
  },
  methods: {
    resetFilters() {
      this.filters = {
        material: 'All',
        size: 'All',
        price: 'All',
        style: 'All'
      }
      this.sortBy = 'popular'
    }
  }
}
</script>
