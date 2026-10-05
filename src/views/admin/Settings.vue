<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-12">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-50 text-gold-800 border border-gold-200">
            Studio Controls
          </span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs text-emerald-700 font-medium">Real-Time Sync</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
          Studio Settings &amp; Configuration
        </h1>
        <p class="text-xs sm:text-sm text-charcoal-800/70 mt-1">
          Manage storefront appearance, theme mode switcher, delivery pricing, and order alert emails.
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
          @click="handleSaveSettings"
        >
          <RefreshCw v-if="saving" class="w-3.5 h-3.5 animate-spin" />
          <Save v-else class="w-3.5 h-3.5 text-gold-300" />
          <span>{{ saving ? 'Saving Changes...' : 'Save Settings' }}</span>
        </button>
      </div>
    </div>

    <!-- Success / Error Banner Toast -->
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
        to="/admin/settings"
        class="px-4 py-2 rounded-full text-xs font-bold bg-gold-600 text-white shadow-sm flex items-center gap-2 shrink-0"
      >
        <span>⚙️ Studio Settings</span>
      </router-link>

      <router-link
        to="/admin/sections"
        class="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-cream-200 text-charcoal-800 hover:border-gold-400 hover:text-gold-600 transition-colors shrink-0 shadow-xs flex items-center gap-2"
      >
        <LayoutGrid class="w-3.5 h-3.5" />
        <span>Store Sections</span>
      </router-link>

      <router-link
        to="/admin/footer"
        class="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-cream-200 text-charcoal-800 hover:border-gold-400 hover:text-gold-600 transition-colors shrink-0 shadow-xs flex items-center gap-2"
      >
        <LayoutTemplate class="w-3.5 h-3.5" />
        <span>⚓ Footer Setup</span>
      </router-link>

      <router-link
        to="/"
        target="_blank"
        class="ml-auto px-3.5 py-1.5 rounded-full text-xs font-medium text-gold-700 bg-gold-50 border border-gold-200 hover:bg-gold-100 transition-colors shrink-0 flex items-center gap-1.5"
      >
        <ExternalLink class="w-3.5 h-3.5" />
        <span>View Live Store</span>
      </router-link>
    </div>

    <!-- 0. STUDIO BRANDING & LOGO IDENTITY -->
    <div id="section-branding" class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-7 shadow-soft space-y-6">
      <div class="flex items-center justify-between border-b border-cream-200 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center">
            <ImageIcon class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-serif font-bold text-charcoal-900">
              Studio Branding &amp; Logo
            </h2>
            <p class="text-xs text-charcoal-800/65">
              Customize the studio logo, brand title, and subtitle displayed on the console and synchronized across all emails (Order alerts, customer offers, 2FA OTP).
            </p>
          </div>
        </div>
        <span
          class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          :class="[
            form.logoUrl
              ? 'bg-gold-50 text-gold-700 border border-gold-200'
              : 'bg-cream-100 text-charcoal-600 border border-cream-300'
          ]"
        >
          {{ form.logoUrl ? 'Custom Logo Active' : 'Default Icon' }}
        </span>
      </div>

      <!-- Live Sidebar Header Preview -->
      <div class="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold text-charcoal-900 uppercase tracking-wider block mb-1">
            Live Console Sidebar Preview
          </span>
          <p class="text-xs text-charcoal-800/70">
            This is exactly how your logo and branding appear at the top of the admin sidebar and header of all transactional emails:
          </p>
        </div>

        <!-- Visual replica of sidebar header from user screenshot -->
        <div class="p-3.5 px-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex items-center gap-3 w-fit shadow-md shrink-0">
          <div
            v-if="form.logoUrl"
            class="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 overflow-hidden flex items-center justify-center shadow-sm shrink-0"
          >
            <img :src="form.logoUrl" :alt="form.brandName" class="w-full h-full object-contain p-1" />
          </div>
          <div
            v-else
            class="w-9 h-9 rounded-xl bg-gold-600 text-white flex items-center justify-center shadow-sm shrink-0"
          >
            <Frame class="w-5 h-5" />
          </div>
          <div>
            <span class="block text-lg font-serif font-bold text-white leading-none">
              {{ previewBrandName.primary }}<span class="text-gold-400">{{ previewBrandName.accent }}</span>
            </span>
            <span class="block text-[10px] uppercase tracking-[0.2em] text-cream-200/50 mt-1">
              {{ form.brandSubtitle || 'Studio Console' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Logo Upload & Controls -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
        <!-- Logo File Upload -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
            Upload Custom Studio Logo
          </label>
          <p class="text-xs text-charcoal-800/65">
            Upload your company or brand logo. Image will be hosted on Cloudinary CDN and automatically embedded in the admin console &amp; all client/notification emails.
          </p>

          <input
            ref="logoFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleLogoFileSelect"
          />

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              :disabled="uploadingLogo"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
              @click="triggerLogoUpload"
            >
              <RefreshCw v-if="uploadingLogo" class="w-3.5 h-3.5 animate-spin" />
              <Upload v-else class="w-3.5 h-3.5" />
              <span>{{ uploadingLogo ? 'Uploading to Cloudinary...' : 'Upload Logo Image' }}</span>
            </button>

            <button
              v-if="form.logoUrl"
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
              title="Reset to default Frame icon"
              @click="removeLogo"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Reset Icon</span>
            </button>
          </div>
          <span class="block text-[11px] text-charcoal-800/50">
            Recommended: Square PNG, SVG or WebP with transparent background (120×120px)
          </span>
        </div>

        <!-- Direct Logo Image URL -->
        <div class="space-y-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
            Or Provide Direct Logo URL
          </label>
          <input
            v-model.trim="form.logoUrl"
            type="url"
            placeholder="https://res.cloudinary.com/.../my-logo.png"
            class="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
          <p class="text-[11px] text-charcoal-800/60">
            You can paste any secure HTTPS image URL directly or upload a file using the button on the left.
          </p>
        </div>
      </div>

      <!-- Brand Name & Brand Subtitle Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-cream-200">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1.5">
            Admin Brand Name
          </label>
          <input
            v-model.trim="form.brandName"
            type="text"
            placeholder="e.g. AtelierAdmin"
            class="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
          <span class="block text-[11px] text-charcoal-800/60 mt-1">
            Primary title displayed next to your logo in the admin sidebar.
          </span>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1.5">
            Studio Tagline / Subtitle
          </label>
          <input
            v-model.trim="form.brandSubtitle"
            type="text"
            placeholder="e.g. STUDIO CONSOLE"
            class="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-gold-600"
          />
          <span class="block text-[11px] text-charcoal-800/60 mt-1">
            Secondary tagline under the brand name (uppercase tracking).
          </span>
        </div>
      </div>
    </div>

    <!-- 1. APPEARANCE & THEME CONTROLS -->
    <div id="section-appearance" class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-7 shadow-soft space-y-6">
      <div class="flex items-center justify-between border-b border-cream-200 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center">
            <SunMoon class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-serif font-bold text-charcoal-900">
              Appearance &amp; Theme Mode
            </h2>
            <p class="text-xs text-charcoal-800/65">
              Control the dark mode toggle switch and enforce a global aesthetic across the website.
            </p>
          </div>
        </div>
        <span
          class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          :class="[
            form.allowThemeToggle
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-charcoal-100 text-charcoal-600 border border-charcoal-200'
          ]"
        >
          {{ form.allowThemeToggle ? 'Switcher Active' : 'Switcher Off' }}
        </span>
      </div>

      <!-- Feature 1: Allow / Turn Off Dark Mode Switcher -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-cream-50 border border-cream-200">
        <div>
          <label class="block text-sm font-semibold text-charcoal-900">
            Allow Light / Dark Mode Toggle Switch
          </label>
          <p class="text-xs text-charcoal-800/65 mt-0.5 max-w-xl">
            When turned <strong>OFF</strong>, the Sun/Moon toggle button is completely hidden from the customer storefront header, mobile menu, and admin panel.
          </p>
        </div>
        <button
          type="button"
          :class="[
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
            form.allowThemeToggle ? 'bg-gold-600' : 'bg-charcoal-300'
          ]"
          @click="form.allowThemeToggle = !form.allowThemeToggle"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              form.allowThemeToggle ? 'translate-x-5' : 'translate-x-0'
            ]"
          />
        </button>
      </div>

      <!-- Feature 2: Forced Theme Preset -->
      <div class="p-4 rounded-xl bg-cream-50 border border-cream-200 space-y-3">
        <div>
          <label class="block text-sm font-semibold text-charcoal-900">
            Default Studio Theme Preset
          </label>
          <p class="text-xs text-charcoal-800/65 mt-0.5">
            Choose which color aesthetic visitors see by default upon entering the store.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <!-- Light Mode Option -->
          <div
            :class="[
              'p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3',
              form.themeMode === 'light'
                ? 'border-gold-600 bg-white shadow-soft text-charcoal-900'
                : 'border-cream-300 bg-cream-100/50 hover:bg-cream-100 text-charcoal-800'
            ]"
            @click="form.themeMode = 'light'"
          >
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sun class="w-4 h-4" />
            </div>
            <div>
              <span class="block text-xs font-bold">Always Light</span>
              <p class="text-[10px] text-charcoal-800/60 leading-tight">Warm Parisian archival cream palette</p>
            </div>
          </div>

          <!-- Dark Mode Option -->
          <div
            :class="[
              'p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3',
              form.themeMode === 'dark'
                ? 'border-gold-600 bg-charcoal-900 shadow-soft text-cream-100'
                : 'border-cream-300 bg-cream-100/50 hover:bg-cream-100 text-charcoal-800'
            ]"
            @click="form.themeMode = 'dark'"
          >
            <div class="w-8 h-8 rounded-lg bg-charcoal-800 text-gold-400 flex items-center justify-center shrink-0">
              <Moon class="w-4 h-4" />
            </div>
            <div>
              <span class="block text-xs font-bold" :class="form.themeMode === 'dark' ? 'text-white' : ''">Always Dark</span>
              <p class="text-[10px] leading-tight" :class="form.themeMode === 'dark' ? 'text-cream-200/70' : 'text-charcoal-800/60'">
                Museum gallery midnight aesthetic
              </p>
            </div>
          </div>

          <!-- System Auto Option -->
          <div
            :class="[
              'p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3',
              form.themeMode === 'system'
                ? 'border-gold-600 bg-white shadow-soft text-charcoal-900'
                : 'border-cream-300 bg-cream-100/50 hover:bg-cream-100 text-charcoal-800'
            ]"
            @click="form.themeMode = 'system'"
          >
            <div class="w-8 h-8 rounded-lg bg-cream-200 text-charcoal-700 flex items-center justify-center shrink-0">
              <Laptop class="w-4 h-4" />
            </div>
            <div>
              <span class="block text-xs font-bold">System Auto</span>
              <p class="text-[10px] text-charcoal-800/60 leading-tight">
                Matches visitor's OS preference
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. STORE PRICING, CURRENCY & ANNOUNCEMENT BANNER -->
    <div id="section-pricing" class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-7 shadow-soft space-y-6">
      <div class="flex items-center justify-between border-b border-cream-200 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center">
            <Coins class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-serif font-bold text-charcoal-900">
              Pricing, Logistics &amp; Top Announcement
            </h2>
            <p class="text-xs text-charcoal-800/65">
              Set standard delivery rates, free shipping thresholds, and top promotion ribbons.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <!-- Currency Symbol -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Store Currency
          </label>
          <input
            v-model="form.currencySymbol"
            type="text"
            maxlength="4"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-charcoal-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <span class="text-[11px] text-charcoal-800/60 mt-1 block">e.g. ₹, $, €, £</span>
        </div>

        <!-- Standard Delivery Fee -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Standard Delivery Fee ({{ form.currencySymbol }})
          </label>
          <input
            v-model.number="form.deliveryFee"
            type="number"
            min="0"
            step="10"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-charcoal-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <span class="text-[11px] text-charcoal-800/60 mt-1 block">Flat rate applied during checkout</span>
        </div>

        <!-- Free Delivery Threshold -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Free Shipping Minimum ({{ form.currencySymbol }})
          </label>
          <input
            v-model.number="form.freeDeliveryThreshold"
            type="number"
            min="0"
            step="100"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-charcoal-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <span class="text-[11px] text-charcoal-800/60 mt-1 block">Orders above this get free shipping</span>
        </div>
      </div>

      <!-- Top Announcement Ribbon Configuration -->
      <div class="p-4 rounded-xl bg-cream-50 border border-cream-200 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Megaphone class="w-4 h-4 text-gold-600" />
            <span class="text-sm font-semibold text-charcoal-900">Storefront Announcement Banner</span>
          </div>
          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              form.announcementBanner.enabled ? 'bg-gold-600' : 'bg-charcoal-300'
            ]"
            @click="form.announcementBanner.enabled = !form.announcementBanner.enabled"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.announcementBanner.enabled ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <div v-if="form.announcementBanner.enabled" class="pt-1">
          <input
            v-model="form.announcementBanner.text"
            type="text"
            placeholder="Enter promotional message (e.g. Free archival matboard on orders above ₹1,999)"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-charcoal-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>
    </div>

    <!-- 3. STUDIO NOTIFICATIONS & NOTIFY ADMIN EMAIL -->
    <div id="section-notifications" class="bg-white rounded-2xl border border-cream-200 p-6 sm:p-7 shadow-soft space-y-6">
      <div class="flex items-center justify-between border-b border-cream-200 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center">
            <Mail class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-serif font-bold text-charcoal-900">
              Admin Order Notification Dispatch
            </h2>
            <p class="text-xs text-charcoal-800/65">
              MailerSend automated sales notification sent when customer orders are placed.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Admin Notification Email
          </label>
          <input
            v-model="form.adminNotificationEmail"
            type="email"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-charcoal-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <span class="text-[11px] text-charcoal-800/60 mt-1 block">Receives full order breakdown and photo links</span>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Order Reference Code Prefix
          </label>
          <input
            v-model="form.orderIdPrefix"
            type="text"
            maxlength="6"
            class="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-charcoal-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <span class="text-[11px] text-charcoal-800/60 mt-1 block">e.g. PF generates PF-20261004-001</span>
        </div>
      </div>
    </div>

    <!-- SEPARATE MODULE CARDS PROMO BANNER -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <router-link
        to="/admin/sections"
        class="p-5 rounded-2xl bg-white border border-cream-200 hover:border-gold-400 hover:shadow-soft transition-all group flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-gold-600/10 text-gold-700 flex items-center justify-center shrink-0 group-hover:bg-gold-600 group-hover:text-white transition-colors">
          <LayoutGrid class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-serif font-bold text-charcoal-900 group-hover:text-gold-600 transition-colors flex items-center justify-between">
            <span>Storefront Sections Setup</span>
            <span class="text-xs text-gold-600 font-sans font-semibold">Manage &rarr;</span>
          </h3>
          <p class="text-xs text-charcoal-800/65 mt-1 leading-relaxed">
            Turn ON or OFF the signature design templates, multi-photo collages, custom text engraving, and reviews.
          </p>
        </div>
      </router-link>

      <router-link
        to="/admin/footer"
        class="p-5 rounded-2xl bg-white border border-cream-200 hover:border-gold-400 hover:shadow-soft transition-all group flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-gold-600/10 text-gold-700 flex items-center justify-center shrink-0 group-hover:bg-gold-600 group-hover:text-white transition-colors">
          <LayoutTemplate class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-serif font-bold text-charcoal-900 group-hover:text-gold-600 transition-colors flex items-center justify-between">
            <span>Footer &amp; Links Setup</span>
            <span class="text-xs text-gold-600 font-sans font-semibold">Manage &rarr;</span>
          </h3>
          <p class="text-xs text-charcoal-800/65 mt-1 leading-relaxed">
            Configure atelier brand story, dynamic links, concierge contacts, guarantees, and individual link toggles.
          </p>
        </div>
      </router-link>
    </div>

    <!-- Sticky Bottom Action Ribbon -->
    <div class="sticky bottom-4 z-30 p-4 rounded-2xl bg-charcoal-900 text-white shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-xs text-cream-200">
        <Sparkles class="w-4 h-4 text-gold-400 shrink-0" />
        <span>Settings take immediate effect on the customer storefront.</span>
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
          @click="handleSaveSettings"
        >
          <RefreshCw v-if="saving" class="w-3.5 h-3.5 animate-spin" />
          <Save v-else class="w-3.5 h-3.5" />
          <span>{{ saving ? 'Saving Changes...' : 'Save Settings Now' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  SunMoon,
  Sun,
  Moon,
  Laptop,
  Coins,
  Megaphone,
  Mail,
  RotateCcw,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  LayoutTemplate,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  Trash2,
  Frame
} from 'lucide-vue-next'
import { uploadService } from '@/services/uploadService'

export default {
  name: 'AdminSettings',
  components: {
    SunMoon,
    Sun,
    Moon,
    Laptop,
    Coins,
    Megaphone,
    Mail,
    RotateCcw,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    LayoutGrid,
    LayoutTemplate,
    ExternalLink,
    ImageIcon,
    Upload,
    Trash2,
    Frame
  },
  data() {
    return {
      saving: false,
      uploadingLogo: false,
      statusMessage: '',
      statusType: 'success',
      form: {
        brandName: 'AtelierAdmin',
        brandSubtitle: 'Studio Console',
        logoUrl: '',
        allowThemeToggle: true,
        themeMode: 'system',
        currencySymbol: '₹',
        deliveryFee: 100,
        freeDeliveryThreshold: 2000,
        announcementBanner: {
          enabled: false,
          text: ''
        },
        adminNotificationEmail: 'jaydeepsarkr@gmail.com',
        notifyAdminOnNewOrder: true,
        orderIdPrefix: 'PF'
      }
    }
  },
  computed: {
    ...mapGetters('settings', ['allSettings']),
    previewBrandName() {
      const raw = this.form.brandName || 'AtelierAdmin'
      if (raw.toLowerCase().includes('admin')) {
        const idx = raw.toLowerCase().indexOf('admin')
        return {
          primary: raw.slice(0, idx),
          accent: raw.slice(idx)
        }
      }
      const words = raw.trim().split(' ')
      if (words.length > 1) {
        return {
          primary: words.slice(0, -1).join(' ') + ' ',
          accent: words[words.length - 1]
        }
      }
      return {
        primary: raw,
        accent: ''
      }
    }
  },
  mounted() {
    this.loadSettingsIntoForm()
  },
  methods: {
    ...mapActions('settings', ['updateSettings', 'resetSettings']),

    loadSettingsIntoForm() {
      const current = this.allSettings || {}
      this.form = {
        brandName: current.brandName || 'AtelierAdmin',
        brandSubtitle: current.brandSubtitle || 'Studio Console',
        logoUrl: current.logoUrl || '',
        allowThemeToggle: current.allowThemeToggle !== false,
        themeMode: current.themeMode || 'system',
        currencySymbol: current.currencySymbol || '₹',
        deliveryFee: Number(current.deliveryFee) || 100,
        freeDeliveryThreshold: Number(current.freeDeliveryThreshold) || 2000,
        announcementBanner: {
          enabled: Boolean(current.announcementBanner?.enabled),
          text: current.announcementBanner?.text || '✨ Limited Time: Handcrafted Italian Walnut finishes now available in all studio sizes!'
        },
        adminNotificationEmail: current.adminNotificationEmail || 'jaydeepsarkr@gmail.com',
        notifyAdminOnNewOrder: current.notifyAdminOnNewOrder !== false,
        orderIdPrefix: current.orderIdPrefix || 'PF'
      }
    },

    triggerLogoUpload() {
      this.$refs.logoFileInput?.click()
    },

    async handleLogoFileSelect(event) {
      const file = event.target.files?.[0]
      if (!file) return

      this.uploadingLogo = true
      try {
        console.log(`🖼️ [SETTINGS:LOGO] Uploading custom admin logo to Cloudinary: ${file.name}`)
        const result = await uploadService.uploadFileToCloudinary(file)
        this.form.logoUrl = result.url
        console.log(`✅ [SETTINGS:LOGO] Cloudinary logo asset ready:`, result.url)
        this.$toast?.success('Custom logo uploaded! Click "Save Settings" to apply live across the console.', 'Logo Uploaded')
      } catch (err) {
        console.error('❌ [SETTINGS:LOGO] Upload failed:', err.message)
        this.$toast?.error(err.message || 'Failed to upload logo image.', 'Upload Failed')
      } finally {
        this.uploadingLogo = false
        event.target.value = ''
      }
    },

    removeLogo() {
      this.form.logoUrl = ''
      this.$toast?.info('Custom logo removed. Default studio icon restored.', 'Logo Reset')
    },

    async handleSaveSettings() {
      this.saving = true
      this.statusMessage = ''
      try {
        await this.updateSettings(this.form)
        this.statusType = 'success'
        this.statusMessage = 'Settings saved successfully! Changes are now active across the platform.'
        this.$toast?.success('Studio settings & branding saved successfully!', 'Settings Saved')
      } catch (err) {
        this.statusType = 'error'
        this.statusMessage = err.message || 'Failed to save settings. Please try again.'
        this.$toast?.error(this.statusMessage, 'Save Failed')
      } finally {
        this.saving = false
      }
    },

    async confirmReset() {
      if (confirm('Are you sure you want to reset all studio settings to factory defaults?')) {
        this.saving = true
        try {
          await this.resetSettings()
          this.loadSettingsIntoForm()
          this.statusType = 'success'
          this.statusMessage = 'Studio settings reset to factory defaults.'
          this.$toast?.success('Studio settings reset to factory defaults.', 'Reset Completed')
        } catch (err) {
          this.statusType = 'error'
          this.statusMessage = 'Failed to reset settings.'
          this.$toast?.error(this.statusMessage, 'Reset Failed')
        } finally {
          this.saving = false
        }
      }
    }
  }
}
</script>
