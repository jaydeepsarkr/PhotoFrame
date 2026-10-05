<template>
  <div class="min-h-screen bg-cream-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-100 flex flex-col justify-between transition-colors duration-300">
    <!-- Top Bar -->
    <header class="w-full px-6 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded-lg bg-gold-600 text-white flex items-center justify-center shadow-sm group-hover:bg-gold-500 transition-colors">
          <Store class="w-4 h-4" />
        </div>
        <span class="text-sm font-serif font-bold tracking-tight text-charcoal-900 dark:text-cream-100">
          Atelier<span class="text-gold-600">Cadre</span>
        </span>
      </router-link>

      <div class="flex items-center gap-3">
        <!-- Dark Mode Toggle -->
        <button
          type="button"
          class="p-2 rounded-xl bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-cream-200 border border-cream-200 dark:border-charcoal-800 hover:border-gold-500 shadow-xs transition-colors"
          :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="toggleDarkMode"
        >
          <Sun v-if="darkMode" class="w-4 h-4 text-gold-400" />
          <Moon v-else class="w-4 h-4 text-charcoal-800" />
        </button>

        <router-link
          to="/"
          class="text-xs font-semibold text-charcoal-600 dark:text-cream-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors hidden sm:inline-flex items-center gap-1"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          Back to Store
        </router-link>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div class="w-full max-w-lg">
        <!-- Card Container -->
        <div class="bg-white dark:bg-charcoal-900 rounded-2xl sm:rounded-3xl border border-cream-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <!-- Subtle Top Gold Accent Bar -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-700"></div>

          <!-- Brand Emblem -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cream-100 dark:bg-charcoal-800 border border-gold-400/40 text-gold-600 dark:text-gold-400 shadow-inner mb-3">
              <ShieldCheck v-if="step === 'otp'" class="w-7 h-7" />
              <UserPlus v-else class="w-7 h-7" />
            </div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
              {{ step === 'otp' ? 'Activate Admin Account' : 'Admin Registration' }}
            </h1>
            <p class="text-xs sm:text-sm text-charcoal-600 dark:text-cream-300/70 mt-1">
              {{ step === 'otp' ? 'Enter the 6-digit activation code sent via MailerSend' : 'Join the Atelier Cadre curation team and studio management' }}
            </p>
          </div>

          <!-- Global Error Banner -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="errorMessage"
              class="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs sm:text-sm"
            >
              <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
              <div class="flex-1 font-medium">{{ errorMessage }}</div>
              <button
                type="button"
                class="text-red-500 hover:text-red-700 dark:hover:text-red-200 ml-1"
                @click="errorMessage = ''"
              >
                ✕
              </button>
            </div>
          </transition>

          <!-- Success / Status Toast Banner -->
          <div
            v-if="statusMessage && !errorMessage"
            class="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2"
          >
            <CheckCircle2 class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{{ statusMessage }}</span>
          </div>

          <!-- STEP 1: Registration Form -->
          <form v-if="step === 'credentials'" @submit.prevent="handleSignupSubmit" class="space-y-4">
            <!-- Full Name -->
            <div>
              <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <User class="w-4 h-4" />
                </div>
                <input
                  v-model="name"
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  autocomplete="name"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                />
              </div>
            </div>

            <!-- Studio Name -->
            <div>
              <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 mb-1.5 uppercase tracking-wider">
                Studio / Brand Name
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <Store class="w-4 h-4" />
                </div>
                <input
                  v-model="studioName"
                  type="text"
                  placeholder="e.g. Grand Artisan Framing Studio"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                />
              </div>
            </div>

            <!-- Storefront Handle (adminId) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                  Storefront Handle (adminId)
                </label>
                <span class="text-[11px] text-charcoal-500 dark:text-cream-400 font-mono">
                  /s/{{ previewSlug }}
                </span>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <Globe class="w-4 h-4" />
                </div>
                <input
                  v-model="adminId"
                  type="text"
                  placeholder="e.g. grand-artisan"
                  @input="customSlugEdited = true"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                />
              </div>
              <p class="text-[11px] text-charcoal-500 dark:text-cream-400 mt-1 font-mono truncate">
                Live URL: <span class="text-gold-600 dark:text-gold-400 font-semibold">{{ storefrontPreviewUrl }}</span>
              </p>
            </div>

            <!-- Email Address -->
            <div>
              <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 mb-1.5 uppercase tracking-wider">
                Official Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <Mail class="w-4 h-4" />
                </div>
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="curator@ateliercadre.in"
                  autocomplete="email"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <Lock class="w-4 h-4" />
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Min. 8 characters"
                  autocomplete="new-password"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-200"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                >
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>

              <!-- Password Strength Meter -->
              <div v-if="password.length > 0" class="mt-2 space-y-1.5">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-charcoal-500 dark:text-cream-400 font-medium">Password Strength:</span>
                  <span
                    :class="[
                      'font-bold',
                      strengthLabel === 'Strong' ? 'text-emerald-600 dark:text-emerald-400' :
                      strengthLabel === 'Good' ? 'text-blue-600 dark:text-blue-400' :
                      strengthLabel === 'Fair' ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-500 dark:text-red-400'
                    ]"
                  >
                    {{ strengthLabel }}
                  </span>
                </div>
                <div class="h-1.5 w-full bg-cream-200 dark:bg-charcoal-700 rounded-full overflow-hidden flex gap-1">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="[
                      strengthScore >= 1 ? (strengthScore === 4 ? 'bg-emerald-500' : strengthScore >= 3 ? 'bg-blue-500' : strengthScore >= 2 ? 'bg-amber-500' : 'bg-red-500') : 'bg-transparent',
                      'w-1/4'
                    ]"
                  ></div>
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="[
                      strengthScore >= 2 ? (strengthScore === 4 ? 'bg-emerald-500' : strengthScore >= 3 ? 'bg-blue-500' : 'bg-amber-500') : 'bg-transparent',
                      'w-1/4'
                    ]"
                  ></div>
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="[
                      strengthScore >= 3 ? (strengthScore === 4 ? 'bg-emerald-500' : 'bg-blue-500') : 'bg-transparent',
                      'w-1/4'
                    ]"
                  ></div>
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="[
                      strengthScore >= 4 ? 'bg-emerald-500' : 'bg-transparent',
                      'w-1/4'
                    ]"
                  ></div>
                </div>

                <!-- Criteria Checklist -->
                <div class="grid grid-cols-2 gap-1 pt-1 text-[11px] text-charcoal-500 dark:text-cream-400">
                  <span :class="hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''" class="flex items-center gap-1">
                    <span>{{ hasMinLength ? '✓' : '○' }}</span> 8+ characters
                  </span>
                  <span :class="hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''" class="flex items-center gap-1">
                    <span>{{ hasLowercase ? '✓' : '○' }}</span> Lowercase letter
                  </span>
                  <span :class="hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''" class="flex items-center gap-1">
                    <span>{{ hasUppercase ? '✓' : '○' }}</span> Uppercase letter
                  </span>
                  <span :class="hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''" class="flex items-center gap-1">
                    <span>{{ hasNumber ? '✓' : '○' }}</span> Number (0-9)
                  </span>
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                  Confirm Password
                </label>
                <span
                  v-if="confirmPassword.length > 0"
                  class="text-[11px] font-semibold flex items-center gap-1"
                  :class="passwordsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'"
                >
                  <Check v-if="passwordsMatch" class="w-3 h-3" />
                  <span>{{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}</span>
                </span>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <Lock class="w-4 h-4" />
                </div>
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Re-enter password"
                  autocomplete="new-password"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                />
              </div>
            </div>

            <!-- Studio Security Key -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                  Studio Security Key
                </label>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <KeyRound class="w-4 h-4" />
                </div>
                <input
                  v-model="adminSecret"
                  type="password"
                  required
                  placeholder="Enter studio invitation or security key"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all font-mono"
                />
              </div>
              <p class="text-[11px] text-charcoal-500 dark:text-cream-400 mt-1">
                Authorization key issued by the studio management to verify new administrator onboarding.
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !canSubmit"
              class="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
              <span v-else class="flex items-center gap-2">
                <UserPlus class="w-4 h-4" />
                Create Administrator Account
              </span>
            </button>

            <!-- Link to Login -->
            <div class="text-center pt-2">
              <p class="text-xs text-charcoal-600 dark:text-cream-400">
                Already have an administrator account?
                <router-link to="/admin/login" class="text-gold-600 dark:text-gold-400 font-semibold hover:underline ml-1">
                  Sign In
                </router-link>
              </p>
            </div>
          </form>

          <!-- STEP 2: 6-Digit Activation OTP Verification -->
          <div v-else class="space-y-5">
            <!-- MailerSend Activation Badge -->
            <div class="flex items-center justify-center gap-2 py-1 px-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-full text-emerald-800 dark:text-emerald-300 text-xs w-fit mx-auto">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Account Activation via <strong>MailerSend</strong></span>
            </div>

            <!-- Destination Email Display -->
            <div class="text-center text-xs text-charcoal-600 dark:text-cream-300/80">
              Activation code dispatched to: <span class="font-mono font-bold text-charcoal-900 dark:text-gold-400">{{ pendingEmail }}</span>
            </div>

            <!-- OTP Input Boxes (6 digits) -->
            <div class="flex justify-center gap-2 sm:gap-3" @paste="handleOtpPaste">
              <input
                v-for="(digit, idx) in otpDigits"
                :key="idx"
                :ref="el => otpInputs[idx] = el"
                v-model="otpDigits[idx]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl bg-cream-50 dark:bg-charcoal-800 border-2 border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                @input="handleOtpInput(idx, $event)"
                @keydown="handleOtpKeydown(idx, $event)"
              />
            </div>

            <!-- Verify Button -->
            <button
              type="button"
              :disabled="loading || !isOtpComplete"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
              @click="handleOtpVerify"
            >
              <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
              <span v-else class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4" />
                Activate & Launch Studio Console
              </span>
            </button>

            <!-- Actions: Resend & Back -->
            <div class="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                :disabled="resendCooldown > 0 || resending"
                class="text-gold-600 dark:text-gold-400 hover:underline font-medium disabled:opacity-40 disabled:no-underline"
                @click="handleResendOtp"
              >
                <span v-if="resending">Sending code...</span>
                <span v-else-if="resendCooldown > 0">Resend code in {{ resendCooldown }}s</span>
                <span v-else>Resend Activation Code</span>
              </button>

              <button
                type="button"
                class="text-charcoal-500 dark:text-cream-400 hover:text-charcoal-800 dark:hover:text-cream-200 underline"
                @click="backToForm"
              >
                Edit Information
              </button>
            </div>
          </div>

          <!-- Security Footer Badge -->
          <div class="mt-8 pt-6 border-t border-cream-200 dark:border-charcoal-800 text-center">
            <div class="flex items-center justify-center gap-2 text-[11px] text-charcoal-400 dark:text-charcoal-500 font-medium">
              <ShieldCheck class="w-3.5 h-3.5 text-gold-500" />
              <span>JWT Signed Admin Session • MailerSend Email Verification</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Copyright -->
    <footer class="w-full py-4 text-center text-xs text-charcoal-400 dark:text-charcoal-600">
      © {{ currentYear }} Atelier Cadre Studio Console. All rights reserved.
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  User,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Store,
  KeyRound,
  Sun,
  Moon,
  Globe
} from 'lucide-vue-next'

export default {
  name: 'AdminSignup',
  components: {
    User,
    UserPlus,
    ShieldCheck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Check,
    ArrowLeft,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Store,
    KeyRound,
    Sun,
    Moon,
    Globe
  },
  data() {
    return {
      name: '',
      studioName: '',
      adminId: '',
      customSlugEdited: false,
      email: '',
      password: '',
      confirmPassword: '',
      adminSecret: '',
      showPassword: false,
      otpDigits: ['', '', '', '', '', ''],
      otpInputs: [],
      errorMessage: '',
      statusMessage: '',
      loading: false,
      resending: false,
      resendCooldown: 0,
      cooldownTimer: null,
      currentYear: new Date().getFullYear()
    }
  },
  computed: {
    ...mapGetters(['darkMode']),
    ...mapGetters('auth', ['loginStep', 'pendingEmail']),
    previewSlug() {
      if (this.adminId && this.adminId.trim()) {
        return this.adminId.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-')
      }
      if (this.studioName && this.studioName.trim()) {
        return this.studioName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      }
      if (this.name && this.name.trim()) {
        return this.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      }
      return 'my-studio'
    },
    storefrontPreviewUrl() {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://framevue.onrender.com'
      return `${origin}/s/${this.previewSlug}`
    },
    step() {
      return this.loginStep || 'credentials'
    },
    hasMinLength() {
      return this.password.length >= 8
    },
    hasLowercase() {
      return /[a-z]/.test(this.password)
    },
    hasUppercase() {
      return /[A-Z]/.test(this.password)
    },
    hasNumber() {
      return /[0-9]/.test(this.password)
    },
    strengthScore() {
      let score = 0
      if (this.hasMinLength) score++
      if (this.hasLowercase) score++
      if (this.hasUppercase) score++
      if (this.hasNumber) score++
      return score
    },
    strengthLabel() {
      if (this.strengthScore <= 1) return 'Weak'
      if (this.strengthScore === 2) return 'Fair'
      if (this.strengthScore === 3) return 'Good'
      return 'Strong'
    },
    passwordsMatch() {
      return this.password.length > 0 && this.password === this.confirmPassword
    },
    canSubmit() {
      return (
        this.name.trim().length >= 2 &&
        this.email.includes('@') &&
        this.hasMinLength &&
        this.passwordsMatch &&
        this.adminSecret.trim().length > 0
      )
    },
    isOtpComplete() {
      return this.otpDigits.every(d => d.trim().length === 1)
    }
  },
  watch: {
    studioName(newVal) {
      if (!this.customSlugEdited && newVal) {
        this.adminId = newVal.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      }
    }
  },
  mounted() {
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$router.replace('/admin')
    }
  },
  beforeUnmount() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer)
    }
  },
  methods: {
    ...mapActions(['toggleDarkMode']),
    ...mapActions('auth', ['signup', 'verifySignupOtp', 'resendOtp', 'resetStep']),

    async handleSignupSubmit() {
      if (!this.canSubmit) return

      this.errorMessage = ''
      this.statusMessage = ''
      this.loading = true

      try {
        const response = await this.signup({
          name: this.name,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
          adminSecret: this.adminSecret,
          studioName: this.studioName,
          adminId: this.previewSlug
        })

        this.statusMessage = response.message || 'Activation code sent via MailerSend!'
        this.$toast?.success(this.statusMessage, 'Code Sent')
        this.startCooldown(60)

        this.$nextTick(() => {
          if (this.otpInputs[0]) {
            this.otpInputs[0].focus()
          }
        })
      } catch (error) {
        this.errorMessage = error.message || 'Registration failed. Please check the provided information.'
        this.$toast?.error(this.errorMessage, 'Registration Failed')
      } finally {
        this.loading = false
      }
    },

    handleOtpInput(index, event) {
      const val = event.target.value
      const cleaned = val.replace(/[^0-9]/g, '')
      this.otpDigits[index] = cleaned.slice(-1)

      if (cleaned && index < 5) {
        this.$nextTick(() => {
          if (this.otpInputs[index + 1]) {
            this.otpInputs[index + 1].focus()
          }
        })
      }

      if (this.isOtpComplete) {
        this.handleOtpVerify()
      }
    },

    handleOtpKeydown(index, event) {
      if (event.key === 'Backspace') {
        if (!this.otpDigits[index] && index > 0) {
          this.otpDigits[index - 1] = ''
          this.$nextTick(() => {
            if (this.otpInputs[index - 1]) {
              this.otpInputs[index - 1].focus()
            }
          })
        }
      } else if (event.key === 'ArrowLeft' && index > 0) {
        this.otpInputs[index - 1].focus()
      } else if (event.key === 'ArrowRight' && index < 5) {
        this.otpInputs[index + 1].focus()
      }
    },

    handleOtpPaste(event) {
      event.preventDefault()
      const pasted = (event.clipboardData || window.clipboardData).getData('text')
      const digits = pasted.replace(/[^0-9]/g, '').slice(0, 6)
      if (digits.length > 0) {
        for (let i = 0; i < 6; i++) {
          this.otpDigits[i] = digits[i] || ''
        }
        const nextFocusIndex = Math.min(digits.length, 5)
        if (this.otpInputs[nextFocusIndex]) {
          this.otpInputs[nextFocusIndex].focus()
        }

        if (this.isOtpComplete) {
          this.handleOtpVerify()
        }
      }
    },

    async handleOtpVerify() {
      if (!this.isOtpComplete) return

      this.errorMessage = ''
      this.statusMessage = ''
      this.loading = true

      const fullOtp = this.otpDigits.join('')

      try {
        await this.verifySignupOtp({ otp: fullOtp })
        this.$toast?.success('Admin account created & verified successfully! Welcome aboard.', 'Account Activated')
        this.$router.push('/admin')
      } catch (error) {
        this.errorMessage = error.message || 'Invalid or expired activation code. Please try again.'
        this.$toast?.error(this.errorMessage, 'Activation Failed')
      } finally {
        this.loading = false
      }
    },

    async handleResendOtp() {
      if (this.resendCooldown > 0) return
      this.resending = true
      this.errorMessage = ''

      try {
        const res = await this.resendOtp()
        this.statusMessage = res.message || 'A new activation code has been dispatched.'
        this.$toast?.success(this.statusMessage, 'Code Sent')
        this.startCooldown(60)
      } catch (error) {
        this.errorMessage = error.message || 'Failed to resend code.'
        this.$toast?.error(this.errorMessage, 'Resend Failed')
      } finally {
        this.resending = false
      }
    },

    startCooldown(seconds) {
      this.resendCooldown = seconds
      if (this.cooldownTimer) clearInterval(this.cooldownTimer)
      this.cooldownTimer = setInterval(() => {
        this.resendCooldown--
        if (this.resendCooldown <= 0) {
          clearInterval(this.cooldownTimer)
        }
      }, 1000)
    },

    backToForm() {
      this.resetStep()
      this.otpDigits = ['', '', '', '', '', '']
      this.errorMessage = ''
      this.statusMessage = ''
    }
  }
}
</script>
