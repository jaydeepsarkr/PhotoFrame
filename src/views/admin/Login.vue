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
      <div class="w-full max-w-md">
        <!-- Card Container -->
        <div class="bg-white dark:bg-charcoal-900 rounded-2xl sm:rounded-3xl border border-cream-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <!-- Subtle Top Gold Accent Bar -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-700"></div>

          <!-- Brand Emblem -->
          <div class="text-center mb-6 sm:mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cream-100 dark:bg-charcoal-800 border border-gold-400/40 text-gold-600 dark:text-gold-400 shadow-inner mb-3">
              <ShieldCheck v-if="step === 'otp'" class="w-7 h-7" />
              <KeyRound v-else class="w-7 h-7" />
            </div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
              {{ step === 'otp' ? 'Security Verification' : 'Admin Console' }}
            </h1>
            <p class="text-xs sm:text-sm text-charcoal-600 dark:text-cream-300/70 mt-1">
              {{ step === 'otp' ? 'Enter the 6-digit code dispatched via MailerSend' : 'Sign in to access your bespoke framing dashboard' }}
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

          <!-- STEP 1: Email & Password -->
          <form v-if="step === 'credentials'" @submit.prevent="handleLoginSubmit" class="space-y-4">
            <!-- Email Field -->
            <div>
              <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 mb-1.5 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <Mail class="w-4 h-4" />
                </div>
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  autocomplete="username"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 dark:bg-charcoal-800/80 border border-cream-300 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 dark:text-cream-400">
                  <Lock class="w-4 h-4" />
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••••••"
                  autocomplete="current-password"
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
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
              <span v-else class="flex items-center gap-2">
                Continue with 2FA
                <ArrowRight class="w-4 h-4" />
              </span>
            </button>

            <!-- Link to Signup -->
            <div class="text-center pt-2">
              <p class="text-xs text-charcoal-600 dark:text-cream-400">
                New studio curator or staff?
                <router-link to="/admin/signup" class="text-gold-600 dark:text-gold-400 font-semibold hover:underline ml-1">
                  Create Admin Account
                </router-link>
              </p>
            </div>
          </form>

          <!-- STEP 2: 6-Digit OTP Verification -->
          <div v-else class="space-y-5">
            <!-- MailerSend Protected Badge -->
            <div class="flex items-center justify-center gap-2 py-1 px-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-full text-amber-800 dark:text-amber-300 text-xs w-fit mx-auto">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>2FA Email dispatched via <strong>MailerSend</strong></span>
            </div>

            <!-- Destination Email Display -->
            <div class="text-center text-xs text-charcoal-600 dark:text-cream-300/80">
              Code sent to: <span class="font-mono font-bold text-charcoal-900 dark:text-gold-400">{{ pendingEmail }}</span>
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
                Verify & Enter Studio
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
                <span v-else>Resend OTP Code</span>
              </button>

              <button
                type="button"
                class="text-charcoal-500 dark:text-cream-400 hover:text-charcoal-800 dark:hover:text-cream-200 underline"
                @click="backToCredentials"
              >
                Change Credentials
              </button>
            </div>
          </div>

          <!-- Security Footer Badge -->
          <div class="mt-8 pt-6 border-t border-cream-200 dark:border-charcoal-800 text-center">
            <div class="flex items-center justify-center gap-2 text-[11px] text-charcoal-400 dark:text-charcoal-500 font-medium">
              <ShieldCheck class="w-3.5 h-3.5 text-gold-500" />
              <span>JWT Signed Session • 256-bit AES • MailerSend 2FA</span>
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
  KeyRound,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Store,
  Sun,
  Moon
} from 'lucide-vue-next'

export default {
  name: 'AdminLogin',
  components: {
    KeyRound,
    ShieldCheck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Store,
    Sun,
    Moon
  },
  data() {
    return {
      email: '',
      password: '',
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
    step() {
      return this.loginStep || 'credentials'
    },
    isOtpComplete() {
      return this.otpDigits.every(d => d.trim().length === 1)
    }
  },
  mounted() {
    // If already logged in, redirect straight to admin dashboard
    if (this.$store.getters['auth/isAuthenticated']) {
      const redirect = this.$route.query.redirect || '/admin'
      this.$router.replace(redirect)
    }
  },
  beforeUnmount() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer)
    }
  },
  methods: {
    ...mapActions(['toggleDarkMode']),
    ...mapActions('auth', ['login', 'verifyOtp', 'resendOtp', 'resetStep']),

    async handleLoginSubmit() {
      this.errorMessage = ''
      this.statusMessage = ''
      this.loading = true

      try {
        const response = await this.login({
          email: this.email,
          password: this.password
        })

        this.statusMessage = response.message || 'OTP verification code sent!'
        this.$toast?.success(response.message || 'Verification code sent to your email!', 'Code Dispatched')
        this.startCooldown(60)

        // Focus first OTP input
        this.$nextTick(() => {
          if (this.otpInputs[0]) {
            this.otpInputs[0].focus()
          }
        })
      } catch (error) {
        this.errorMessage = error.message || 'Invalid email or password.'
        this.$toast?.error(this.errorMessage, 'Login Failed')
      } finally {
        this.loading = false
      }
    },

    handleOtpInput(index, event) {
      const val = event.target.value
      // Keep only single numeric char
      const cleaned = val.replace(/[^0-9]/g, '')
      this.otpDigits[index] = cleaned.slice(-1)

      if (cleaned && index < 5) {
        this.$nextTick(() => {
          if (this.otpInputs[index + 1]) {
            this.otpInputs[index + 1].focus()
          }
        })
      }

      // Auto submit if all filled
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
        await this.verifyOtp({ otp: fullOtp })
        this.$toast?.success('Welcome back, Admin! Session verified.', 'Login Success')
        const target = this.$route.query.redirect || '/admin'
        this.$router.push(target)
      } catch (error) {
        this.errorMessage = error.message || 'Invalid or expired OTP code. Please try again.'
        this.$toast?.error(this.errorMessage, 'Verification Failed')
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
        this.statusMessage = res.message || 'A new verification code has been dispatched.'
        this.$toast?.success(this.statusMessage, 'Code Sent')
        this.startCooldown(60)
      } catch (error) {
        this.errorMessage = error.message || 'Failed to resend verification code.'
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

    backToCredentials() {
      this.resetStep()
      this.otpDigits = ['', '', '', '', '', '']
      this.errorMessage = ''
      this.statusMessage = ''
    }
  }
}
</script>
