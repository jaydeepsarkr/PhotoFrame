<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-12">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-50 text-gold-800 border border-gold-200">
            Footer Management
          </span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs text-emerald-700 font-medium">Real-Time Sync</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
          Storefront Footer &amp; Navigation Links
        </h1>
        <p class="text-xs sm:text-sm text-charcoal-800/70 mt-1">
          Customize brand story, links, concierge contact details, and toggle individual items on or off.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          type="button"
          :disabled="saving"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all disabled:opacity-50"
          @click="confirmReset"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="button"
          :disabled="saving"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-all shadow-md disabled:opacity-50"
          @click="handleSave"
        >
          <RefreshCw v-if="saving" class="w-3.5 h-3.5 animate-spin" />
          <Save v-else class="w-3.5 h-3.5 text-gold-300" />
          <span>{{ saving ? 'Saving Changes...' : 'Save Footer Setup' }}</span>
        </button>
      </div>
    </div>

    <!-- Feedback Banner Toast -->
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
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
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

    <!-- Quick Navigation Hub Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      <router-link
        to="/admin/footer"
        class="px-4 py-2 rounded-full text-xs font-bold bg-gold-600 text-white shadow-sm flex items-center gap-2 shrink-0"
      >
        <LayoutTemplate class="w-3.5 h-3.5" />
        <span>⚓ Footer Setup</span>
      </router-link>

      <router-link
        to="/admin/sections"
        class="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-cream-200 text-charcoal-800 hover:border-gold-400 hover:text-gold-600 transition-colors shrink-0 shadow-xs flex items-center gap-2"
      >
        <LayoutGrid class="w-3.5 h-3.5" />
        <span>Store Sections</span>
      </router-link>

      <router-link
        to="/admin/settings"
        class="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-cream-200 text-charcoal-800 hover:border-gold-400 hover:text-gold-600 transition-colors shrink-0 shadow-xs flex items-center gap-2"
      >
        <span>⚙️ Studio Settings</span>
      </router-link>

      <router-link
        to="/"
        target="_blank"
        class="ml-auto px-3.5 py-1.5 rounded-full text-xs font-medium text-gold-700 bg-gold-50 border border-gold-200 hover:bg-gold-100 transition-colors shrink-0 flex items-center gap-1.5"
      >
        <ExternalLink class="w-3.5 h-3.5" />
        <span>View Live Footer</span>
      </router-link>
    </div>

    <!-- MAIN FOOTER CONFIGURATION CONTAINER -->
    <div class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-7 shadow-soft space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center">
            <LayoutTemplate class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-serif font-bold text-charcoal-900">
                Storefront Footer Structure &amp; Toggle Options
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="footer.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-charcoal-100 text-charcoal-600'"
              >
                {{ footer.enabled ? 'Footer Enabled' : 'Footer Disabled' }}
              </span>
            </div>
            <p class="text-xs text-charcoal-800/65">
              Customize brand story, links, concierge contact details, and toggle individual items on or off.
            </p>
          </div>
        </div>

        <!-- Master Footer Toggle Switch -->
        <div class="flex items-center gap-3 bg-cream-50 p-2.5 px-3.5 rounded-xl border border-cream-200 shrink-0">
          <span class="text-xs font-semibold text-charcoal-900">Show Footer on Website</span>
          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              footer.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
            ]"
            @click="footer.enabled = !footer.enabled"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                footer.enabled ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
      </div>

      <div v-if="!footer.enabled" class="p-8 text-center bg-cream-50 rounded-2xl border border-dashed border-cream-300 text-xs text-charcoal-800/60 space-y-1">
        <p class="font-semibold text-charcoal-800 text-sm">Storefront Footer is Turned OFF</p>
        <p>No footer navigation or concierge columns will be rendered on the customer-facing website.</p>
      </div>

      <div v-else class="space-y-6">
        <!-- SUB-CARD A: BRAND COLUMN -->
        <div class="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-4">
          <div class="flex items-center justify-between border-b border-cream-200/80 pb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gold-700">Column 1: Brand &amp; Atelier Story</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-charcoal-800/70">{{ footer.brand.enabled ? 'Column Active' : 'Column Hidden' }}</span>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  footer.brand.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
                ]"
                @click="footer.brand.enabled = !footer.brand.enabled"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    footer.brand.enabled ? 'translate-x-4' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
          </div>

          <div v-if="footer.brand.enabled" class="space-y-3.5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">Brand Name</label>
                <input
                  v-model="footer.brand.title"
                  type="text"
                  class="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">Tagline</label>
                <input
                  v-model="footer.brand.tagline"
                  type="text"
                  class="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">Studio Story / Description</label>
              <textarea
                v-model="footer.brand.description"
                rows="2"
                class="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs leading-relaxed focus:outline-none focus:border-gold-500"
              ></textarea>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-cream-200">
              <div class="flex items-center gap-2">
                <Award class="w-4 h-4 text-gold-600" />
                <div>
                  <span class="text-xs font-semibold text-charcoal-900">Archival Guarantee Badge</span>
                  <p class="text-[10px] text-charcoal-800/60">Renders gold pill badge below brand story</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model="footer.brand.badgeText"
                  type="text"
                  class="px-2.5 py-1.5 rounded-lg border border-cream-300 bg-cream-50 text-xs text-charcoal-900 w-44 focus:outline-none focus:border-gold-500"
                  :disabled="!footer.brand.showBadge"
                />
                <button
                  type="button"
                  :class="[
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    footer.brand.showBadge ? 'bg-gold-600' : 'bg-charcoal-300'
                  ]"
                  @click="footer.brand.showBadge = !footer.brand.showBadge"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      footer.brand.showBadge ? 'translate-x-4' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SUB-CARD B: COLLECTIONS COLUMN -->
        <div class="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-4">
          <div class="flex items-center justify-between border-b border-cream-200/80 pb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gold-700">Column 2: Collections Links</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-charcoal-800/70">{{ footer.collectionsColumn.enabled ? 'Column Active' : 'Column Hidden' }}</span>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  footer.collectionsColumn.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
                ]"
                @click="footer.collectionsColumn.enabled = !footer.collectionsColumn.enabled"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    footer.collectionsColumn.enabled ? 'translate-x-4' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
          </div>

          <div v-if="footer.collectionsColumn.enabled" class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">Column Heading</label>
              <input
                v-model="footer.collectionsColumn.heading"
                type="text"
                class="w-full sm:w-72 px-3 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <!-- Dynamic Links Table -->
            <div class="space-y-2">
              <div
                v-for="(link, idx) in footer.collectionsColumn.links"
                :key="link.id || idx"
                class="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-cream-200"
              >
                <!-- On/Off Switch -->
                <button
                  type="button"
                  :title="link.enabled ? 'Link is Visible (Click to turn off)' : 'Link is Hidden (Click to turn on)'"
                  :class="[
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    link.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
                  ]"
                  @click="link.enabled = !link.enabled"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      link.enabled ? 'translate-x-4' : 'translate-x-0'
                    ]"
                  />
                </button>

                <!-- Label -->
                <input
                  v-model="link.label"
                  type="text"
                  placeholder="Link Label"
                  class="flex-1 px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                />

                <!-- URL -->
                <input
                  v-model="link.url"
                  type="text"
                  placeholder="Target URL (/frames, etc.)"
                  class="flex-1 px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 font-mono bg-cream-50 focus:outline-none focus:border-gold-500"
                />

                <!-- Delete Link -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove Link"
                  @click="removeCollectionLink(idx)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-500 pt-1"
                @click="addCollectionLink"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>+ Add Collection Link</span>
              </button>
            </div>
          </div>
        </div>

        <!-- SUB-CARD C: DESIGN THEMES COLUMN -->
        <div class="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-4">
          <div class="flex items-center justify-between border-b border-cream-200/80 pb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gold-700">Column 3: Design Themes Links</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-charcoal-800/70">{{ footer.designsColumn.enabled ? 'Column Active' : 'Column Hidden' }}</span>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  footer.designsColumn.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
                ]"
                @click="footer.designsColumn.enabled = !footer.designsColumn.enabled"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    footer.designsColumn.enabled ? 'translate-x-4' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
          </div>

          <div v-if="footer.designsColumn.enabled" class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">Column Heading</label>
              <input
                v-model="footer.designsColumn.heading"
                type="text"
                class="w-full sm:w-72 px-3 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <!-- Dynamic Links Table -->
            <div class="space-y-2">
              <div
                v-for="(link, idx) in footer.designsColumn.links"
                :key="link.id || idx"
                class="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-cream-200"
              >
                <!-- On/Off Switch -->
                <button
                  type="button"
                  :title="link.enabled ? 'Link is Visible (Click to turn off)' : 'Link is Hidden (Click to turn on)'"
                  :class="[
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    link.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
                  ]"
                  @click="link.enabled = !link.enabled"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      link.enabled ? 'translate-x-4' : 'translate-x-0'
                    ]"
                  />
                </button>

                <!-- Label -->
                <input
                  v-model="link.label"
                  type="text"
                  placeholder="Link Label"
                  class="flex-1 px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                />

                <!-- URL -->
                <input
                  v-model="link.url"
                  type="text"
                  placeholder="Target URL (/customize/1?category=Wedding, etc.)"
                  class="flex-1 px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 font-mono bg-cream-50 focus:outline-none focus:border-gold-500"
                />

                <!-- Delete Link -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove Link"
                  @click="removeDesignLink(idx)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-500 pt-1"
                @click="addDesignLink"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>+ Add Design Theme Link</span>
              </button>
            </div>
          </div>
        </div>

        <!-- SUB-CARD D: CONCIERGE, STUDIO CONTACT & SOCIALS -->
        <div class="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-4">
          <div class="flex items-center justify-between border-b border-cream-200/80 pb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gold-700">Column 4: Concierge &amp; Studio Contact</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-charcoal-800/70">{{ footer.contactColumn.enabled ? 'Column Active' : 'Column Hidden' }}</span>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  footer.contactColumn.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
                ]"
                @click="footer.contactColumn.enabled = !footer.contactColumn.enabled"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    footer.contactColumn.enabled ? 'translate-x-4' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
          </div>

          <div v-if="footer.contactColumn.enabled" class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">Column Heading</label>
              <input
                v-model="footer.contactColumn.heading"
                type="text"
                class="w-full sm:w-72 px-3 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <!-- Physical Address -->
              <div class="p-3.5 rounded-xl bg-white border border-cream-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-charcoal-900 flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-gold-600" />
                    <span>Physical Address</span>
                  </span>
                  <button
                    type="button"
                    :class="[
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      footer.contactColumn.showAddress ? 'bg-gold-600' : 'bg-charcoal-300'
                    ]"
                    @click="footer.contactColumn.showAddress = !footer.contactColumn.showAddress"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        footer.contactColumn.showAddress ? 'translate-x-4' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
                <input
                  v-model="footer.contactColumn.address"
                  type="text"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                  :disabled="!footer.contactColumn.showAddress"
                />
              </div>

              <!-- Phone -->
              <div class="p-3.5 rounded-xl bg-white border border-cream-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-charcoal-900 flex items-center gap-1.5">
                    <Phone class="w-3.5 h-3.5 text-gold-600" />
                    <span>Customer Care Phone</span>
                  </span>
                  <button
                    type="button"
                    :class="[
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      footer.contactColumn.showPhone ? 'bg-gold-600' : 'bg-charcoal-300'
                    ]"
                    @click="footer.contactColumn.showPhone = !footer.contactColumn.showPhone"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        footer.contactColumn.showPhone ? 'translate-x-4' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
                <input
                  v-model="footer.contactColumn.phone"
                  type="text"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                  :disabled="!footer.contactColumn.showPhone"
                />
              </div>

              <!-- Support Email -->
              <div class="p-3.5 rounded-xl bg-white border border-cream-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-charcoal-900 flex items-center gap-1.5">
                    <Mail class="w-3.5 h-3.5 text-gold-600" />
                    <span>Concierge Email</span>
                  </span>
                  <button
                    type="button"
                    :class="[
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      footer.contactColumn.showEmail ? 'bg-gold-600' : 'bg-charcoal-300'
                    ]"
                    @click="footer.contactColumn.showEmail = !footer.contactColumn.showEmail"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        footer.contactColumn.showEmail ? 'translate-x-4' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
                <input
                  v-model="footer.contactColumn.email"
                  type="email"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                  :disabled="!footer.contactColumn.showEmail"
                />
              </div>

              <!-- WhatsApp Concierge -->
              <div class="p-3.5 rounded-xl bg-white border border-cream-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-charcoal-900 flex items-center gap-1.5">
                    <MessageCircle class="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Concierge</span>
                  </span>
                  <button
                    type="button"
                    :class="[
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      footer.contactColumn.showWhatsapp ? 'bg-gold-600' : 'bg-charcoal-300'
                    ]"
                    @click="footer.contactColumn.showWhatsapp = !footer.contactColumn.showWhatsapp"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        footer.contactColumn.showWhatsapp ? 'translate-x-4' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
                <input
                  v-model="footer.contactColumn.whatsapp"
                  type="text"
                  placeholder="+918638803228"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                  :disabled="!footer.contactColumn.showWhatsapp"
                />
              </div>

              <!-- Instagram Gallery -->
              <div class="p-3.5 rounded-xl bg-white border border-cream-200 space-y-2 sm:col-span-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-charcoal-900 flex items-center gap-1.5">
                    <Instagram class="w-3.5 h-3.5 text-rose-600" />
                    <span>Instagram Profile Link</span>
                  </span>
                  <button
                    type="button"
                    :class="[
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      footer.contactColumn.showInstagram ? 'bg-gold-600' : 'bg-charcoal-300'
                    ]"
                    @click="footer.contactColumn.showInstagram = !footer.contactColumn.showInstagram"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        footer.contactColumn.showInstagram ? 'translate-x-4' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
                <input
                  v-model="footer.contactColumn.instagram"
                  type="text"
                  placeholder="https://instagram.com/ateliercadre"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                  :disabled="!footer.contactColumn.showInstagram"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- SUB-CARD E: BOTTOM LEGAL BAR & GUARANTEES -->
        <div class="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-4">
          <div class="flex items-center justify-between border-b border-cream-200/80 pb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gold-700">Bottom Bar: Copyright &amp; Pillars</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-charcoal-800/70">{{ footer.bottomBar.enabled ? 'Bar Active' : 'Bar Hidden' }}</span>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  footer.bottomBar.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
                ]"
                @click="footer.bottomBar.enabled = !footer.bottomBar.enabled"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    footer.bottomBar.enabled ? 'translate-x-4' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
          </div>

          <div v-if="footer.bottomBar.enabled" class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">Copyright Notice Text</label>
              <input
                v-model="footer.bottomBar.copyrightText"
                type="text"
                class="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <!-- Guarantees Pills -->
            <div class="p-3.5 rounded-xl bg-white border border-cream-200 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-semibold text-charcoal-900">Studio Guarantee Badges</span>
                  <p class="text-[10px] text-charcoal-800/60">Comma-separated quality pillars displayed on the right of the copyright line</p>
                </div>
                <button
                  type="button"
                  :class="[
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    footer.bottomBar.showGuarantees ? 'bg-gold-600' : 'bg-charcoal-300'
                  ]"
                  @click="footer.bottomBar.showGuarantees = !footer.bottomBar.showGuarantees"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      footer.bottomBar.showGuarantees ? 'translate-x-4' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>
              <input
                :value="Array.isArray(footer.bottomBar.guarantees) ? footer.bottomBar.guarantees.join(', ') : footer.bottomBar.guarantees"
                type="text"
                class="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 text-xs text-charcoal-900 bg-cream-50 focus:outline-none focus:border-gold-500"
                :disabled="!footer.bottomBar.showGuarantees"
                @input="updateGuarantees($event.target.value)"
              />
            </div>
          </div>
        </div>

        <!-- SUB-CARD F: LIVE STOREFRONT FOOTER PREVIEW -->
        <div class="p-5 rounded-2xl bg-charcoal-950 text-cream-100 border border-charcoal-800 space-y-4">
          <div class="flex items-center justify-between border-b border-charcoal-800 pb-3">
            <div class="flex items-center gap-2">
              <Eye class="w-4 h-4 text-gold-400" />
              <span class="text-xs font-bold uppercase tracking-wider text-gold-400">Live Storefront Footer Preview</span>
            </div>
            <span class="text-[11px] text-cream-200/50">Real-time simulation</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-cream-200/75 py-2">
            <!-- Col 1 -->
            <div v-if="footer.brand.enabled">
              <strong class="text-white text-sm font-serif block">{{ footer.brand.title }}</strong>
              <span class="text-[10px] text-cream-200/50 block mt-0.5">{{ footer.brand.tagline }}</span>
              <p class="text-[11px] text-cream-200/70 mt-2 line-clamp-3">{{ footer.brand.description }}</p>
              <span v-if="footer.brand.showBadge" class="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] bg-charcoal-800 text-gold-400 border border-gold-500/20">
                {{ footer.brand.badgeText }}
              </span>
            </div>
            <div v-else class="text-charcoal-600 italic">Column 1 Hidden</div>

            <!-- Col 2 -->
            <div v-if="footer.collectionsColumn.enabled">
              <strong class="text-gold-400 text-xs uppercase tracking-wider block mb-2">{{ footer.collectionsColumn.heading }}</strong>
              <ul class="space-y-1">
                <li
                  v-for="l in (footer.collectionsColumn.links || []).filter(x => x.enabled)"
                  :key="l.id || l.label"
                  class="text-[11px]"
                >
                  {{ l.label }}
                </li>
              </ul>
            </div>
            <div v-else class="text-charcoal-600 italic">Column 2 Hidden</div>

            <!-- Col 3 -->
            <div v-if="footer.designsColumn.enabled">
              <strong class="text-gold-400 text-xs uppercase tracking-wider block mb-2">{{ footer.designsColumn.heading }}</strong>
              <ul class="space-y-1">
                <li
                  v-for="l in (footer.designsColumn.links || []).filter(x => x.enabled)"
                  :key="l.id || l.label"
                  class="text-[11px]"
                >
                  {{ l.label }}
                </li>
              </ul>
            </div>
            <div v-else class="text-charcoal-600 italic">Column 3 Hidden</div>

            <!-- Col 4 -->
            <div v-if="footer.contactColumn.enabled">
              <strong class="text-gold-400 text-xs uppercase tracking-wider block mb-2">{{ footer.contactColumn.heading }}</strong>
              <ul class="space-y-1.5 text-[11px]">
                <li v-if="footer.contactColumn.showAddress">{{ footer.contactColumn.address }}</li>
                <li v-if="footer.contactColumn.showPhone">{{ footer.contactColumn.phone }}</li>
                <li v-if="footer.contactColumn.showEmail">{{ footer.contactColumn.email }}</li>
                <li v-if="footer.contactColumn.showWhatsapp" class="text-emerald-400">WhatsApp: {{ footer.contactColumn.whatsapp }}</li>
                <li v-if="footer.contactColumn.showInstagram" class="text-rose-400">Instagram: {{ footer.contactColumn.instagram }}</li>
              </ul>
            </div>
            <div v-else class="text-charcoal-600 italic">Column 4 Hidden</div>
          </div>

          <div v-if="footer.bottomBar.enabled" class="pt-3 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between text-[10px] text-cream-200/50 gap-2">
            <span>© {{ new Date().getFullYear() }} {{ footer.bottomBar.copyrightText }}</span>
            <div v-if="footer.bottomBar.showGuarantees" class="flex items-center gap-3">
              <span v-for="(g, i) in (Array.isArray(footer.bottomBar.guarantees) ? footer.bottomBar.guarantees : footer.bottomBar.guarantees.split(','))" :key="i">
                {{ g.trim() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Save Bar -->
    <div class="sticky bottom-4 z-30 p-4 rounded-2xl bg-charcoal-900 text-white shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-xs text-cream-200">
        <Sparkles class="w-4 h-4 text-gold-400 shrink-0" />
        <span>Footer changes synchronize in real-time across the entire customer storefront.</span>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          :disabled="saving"
          class="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 text-xs font-semibold transition-colors"
          @click="loadSettingsIntoForm"
        >
          Discard Changes
        </button>

        <button
          type="button"
          :disabled="saving"
          class="px-6 py-2 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
          @click="handleSave"
        >
          <RefreshCw v-if="saving" class="w-3.5 h-3.5 animate-spin" />
          <Save v-else class="w-3.5 h-3.5" />
          <span>{{ saving ? 'Saving Changes...' : 'Save Footer Setup' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { defaultFooterSettings } from '@/services/settingsService'
import {
  LayoutTemplate,
  LayoutGrid,
  Award,
  Trash2,
  Plus,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Eye,
  RotateCcw,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-vue-next'

export default {
  name: 'AdminFooterSettings',
  components: {
    LayoutTemplate,
    LayoutGrid,
    Award,
    Trash2,
    Plus,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    Instagram,
    Eye,
    RotateCcw,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    ExternalLink
  },
  data() {
    return {
      saving: false,
      statusMessage: '',
      statusType: 'success',
      footer: JSON.parse(JSON.stringify(defaultFooterSettings))
    }
  },
  computed: {
    ...mapGetters('settings', ['allSettings'])
  },
  mounted() {
    this.loadSettingsIntoForm()
  },
  methods: {
    ...mapActions('settings', ['updateSettings']),

    loadSettingsIntoForm() {
      const current = this.allSettings || {}
      this.footer = current.footer
        ? JSON.parse(JSON.stringify(current.footer))
        : JSON.parse(JSON.stringify(defaultFooterSettings))

      if (!this.footer.brand) {
        this.footer.brand = JSON.parse(JSON.stringify(defaultFooterSettings.brand))
      }
      if (!this.footer.collectionsColumn) {
        this.footer.collectionsColumn = JSON.parse(JSON.stringify(defaultFooterSettings.collectionsColumn))
      }
      if (!this.footer.designsColumn) {
        this.footer.designsColumn = JSON.parse(JSON.stringify(defaultFooterSettings.designsColumn))
      }
      if (!this.footer.contactColumn) {
        this.footer.contactColumn = JSON.parse(JSON.stringify(defaultFooterSettings.contactColumn))
      }
      if (!this.footer.bottomBar) {
        this.footer.bottomBar = JSON.parse(JSON.stringify(defaultFooterSettings.bottomBar))
      }
      if (!Array.isArray(this.footer.collectionsColumn.links)) {
        this.footer.collectionsColumn.links = JSON.parse(JSON.stringify(defaultFooterSettings.collectionsColumn.links))
      }
      if (!Array.isArray(this.footer.designsColumn.links)) {
        this.footer.designsColumn.links = JSON.parse(JSON.stringify(defaultFooterSettings.designsColumn.links))
      }
    },

    addCollectionLink() {
      if (!Array.isArray(this.footer.collectionsColumn.links)) {
        this.footer.collectionsColumn.links = []
      }
      this.footer.collectionsColumn.links.push({
        id: 'col-' + Date.now(),
        label: 'New Frame Collection',
        url: '/frames',
        enabled: true
      })
    },

    removeCollectionLink(idx) {
      if (Array.isArray(this.footer.collectionsColumn.links)) {
        this.footer.collectionsColumn.links.splice(idx, 1)
      }
    },

    addDesignLink() {
      if (!Array.isArray(this.footer.designsColumn.links)) {
        this.footer.designsColumn.links = []
      }
      this.footer.designsColumn.links.push({
        id: 'des-' + Date.now(),
        label: 'New Design Category',
        url: '/customize/1',
        enabled: true
      })
    },

    removeDesignLink(idx) {
      if (Array.isArray(this.footer.designsColumn.links)) {
        this.footer.designsColumn.links.splice(idx, 1)
      }
    },

    updateGuarantees(val) {
      if (typeof val === 'string') {
        this.footer.bottomBar.guarantees = val
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      }
    },

    async handleSave() {
      this.saving = true
      this.statusMessage = ''
      try {
        await this.updateSettings({ footer: this.footer })
        this.statusType = 'success'
        this.statusMessage = 'Footer configuration saved successfully! Active across website.'
        this.$toast?.success('Footer configuration saved and updated live!', 'Footer Saved')
      } catch (err) {
        this.statusType = 'error'
        this.statusMessage = err.message || 'Failed to save footer settings. Please try again.'
        this.$toast?.error(this.statusMessage, 'Save Failed')
      } finally {
        this.saving = false
      }
    },

    async confirmReset() {
      if (confirm('Reset footer settings to studio factory defaults?')) {
        this.footer = JSON.parse(JSON.stringify(defaultFooterSettings))
        this.$toast?.info('Restoring default footer configuration...', 'Resetting')
        await this.handleSave()
      }
    }
  }
}
</script>
