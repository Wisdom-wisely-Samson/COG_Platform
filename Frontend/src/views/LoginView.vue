<template>
  <div class="min-h-screen bg-[#F4F5F7] flex font-sans">
    <!-- ===== LEFT PANEL — Motivational Quotes ===== -->
    <div
      class="hidden lg:flex w-[52%] bg-navy relative overflow-hidden flex-col items-center justify-center px-14"
    >
      <!-- Background geometric shapes -->
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/[0.03]"
        ></div>
        <div
          class="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-accent/10"
        ></div>
        <div
          class="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-white/[0.03]"
        ></div>
        <div
          class="absolute top-16 right-16 w-2 h-2 rounded-full bg-accent/60"
        ></div>
        <div
          class="absolute top-1/4 left-20 w-1.5 h-1.5 rounded-full bg-white/30"
        ></div>
        <div
          class="absolute bottom-1/3 right-24 w-1 h-1 rounded-full bg-white/20"
        ></div>
        <!-- Grid lines -->
        <svg
          class="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="white"
                stroke-width="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Logo -->
      <div class="absolute top-8 left-8">
        <div
          class="bg-white rounded-lg px-3 py-2 inline-flex items-center shadow-sm"
        >
          <img
            src="/logo images/Logo.svg"
            alt="Capital One Group"
            class="h-8 w-auto"
          />
        </div>
      </div>

      <!-- Quote card -->
      <div class="relative z-10 w-full max-w-md">
        <!-- Quote icon -->
        <div
          class="w-12 h-12 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center mb-7"
        >
          <i class="ti ti-quote text-accent text-[22px]"></i>
        </div>

        <!-- Quote text with fade transition -->
        <transition name="quote-fade" mode="out-in">
          <div :key="currentQuoteIndex">
            <p
              class="text-white text-[24px] font-heading leading-snug tracking-wide mb-6"
            >
              "{{ quotes[currentQuoteIndex].text }}"
            </p>
            <div class="flex items-center gap-3">
              <div class="w-8 h-[2px] bg-accent rounded-full"></div>
              <span
                class="text-white/60 text-[12px] font-medium tracking-wider uppercase"
              >
                {{ quotes[currentQuoteIndex].author }}
              </span>
            </div>
          </div>
        </transition>

        <!-- Dot indicators -->
        <div class="flex items-center gap-2 mt-10">
          <button
            v-for="(_, i) in quotes"
            :key="i"
            @click="goToQuote(i)"
            :class="
              i === currentQuoteIndex
                ? 'w-6 bg-accent'
                : 'w-2 bg-white/25 hover:bg-white/40'
            "
            class="h-2 rounded-full transition-all duration-300 cursor-pointer border-none p-0"
          ></button>
        </div>

        <!-- Progress bar -->
        <div
          class="mt-4 w-full h-[2px] bg-white/10 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-accent/60 rounded-full transition-none"
            :style="{ width: progressWidth + '%' }"
          ></div>
        </div>
      </div>

      <!-- Bottom tag -->
      <div
        class="absolute bottom-8 left-8 right-8 flex items-center justify-between"
      >
        <span class="text-white/25 text-[10px] tracking-widest uppercase"
          >Empowering Performance</span
        >
        <span class="text-white/25 text-[10px]">© 2025 Capital One Group</span>
      </div>
    </div>

    <!-- ===== RIGHT PANEL — Login Form ===== -->
    <div class="flex-1 flex items-center justify-center px-6 py-10">
      <div class="w-full max-w-[400px]">
        <!-- Mobile logo (hidden on large screens) -->
        <div class="flex items-center justify-center mb-8 lg:hidden">
          <img
            src="/logo images/Logo.svg"
            alt="Capital One Group"
            class="h-10 w-auto"
          />
        </div>

        <!-- Heading -->
        <div class="mb-8">
          <h1
            class="text-[28px] font-heading text-[#1A2332] leading-tight mb-1.5"
          >
            Welcome back
          </h1>
          <p class="text-[13px] text-muted">
            Sign in to access your performance dashboard
          </p>
        </div>

        <!-- Card -->
        <div
          class="bg-white border border-[#E1E4E9] rounded-xl shadow-sm overflow-hidden"
        >
          <div class="px-7 pt-7 pb-5">
            <!-- Error -->
            <div
              v-if="error"
              class="flex items-center gap-2 text-[12px] text-accent bg-[#FDE8EC] border border-[#F5C0CB] rounded-md px-3 py-2.5 mb-4"
            >
              <i class="ti ti-alert-circle text-[15px]"></i>{{ error }}
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-4">
                <label
                  class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5"
                  >Email address</label
                >
                <div class="relative">
                  <i
                    class="ti ti-mail absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[15px]"
                  ></i>
                  <input
                    v-model="email"
                    type="email"
                    autocomplete="off"
                    placeholder="you@capitalonegroup.com"
                    class="bg-white border border-[#E1E4E9] rounded-md pl-9 pr-3 py-2.5 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors"
                    :class="{ 'border-accent': error }"
                  />
                </div>
              </div>

              <div class="mb-6">
                <div class="flex items-center justify-between mb-1.5">
                  <label
                    class="block text-[11px] font-semibold uppercase tracking-wider text-muted"
                    >Password</label
                  >
                  <span
                    @click="openForgot"
                    class="text-[11px] text-info cursor-pointer hover:underline"
                    >Forgot password?</span
                  >
                </div>
                <div class="relative">
                  <i
                    class="ti ti-lock absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[15px]"
                  ></i>
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="off"
                    placeholder="••••••••"
                    class="bg-white border border-[#E1E4E9] rounded-md pl-9 pr-10 py-2.5 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors"
                    :class="{ 'border-accent': error }"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#1A2332] transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <i
                      :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"
                      class="text-[16px]"
                    ></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full flex items-center justify-center gap-2 px-4 py-2.75 rounded-md bg-accent border border-accent text-white text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="loading"
                  class="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <i v-else class="ti ti-arrow-right text-[15px]"></i>
                <span>{{ loading ? "Signing in…" : "Sign in" }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== FORGOT PASSWORD MODAL ===== -->
    <div v-if="showForgot" @click.self="closeForgot"
         class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl w-full max-w-[420px] shadow-2xl overflow-hidden">

        <!-- Header -->
        <div class="px-6 py-4 border-b border-[#E1E4E9] flex items-center justify-between">
          <div class="text-[14px] font-semibold">
            {{ forgotStep === 1 ? 'Reset Password' : 'Set New Password' }}
          </div>
          <button @click="closeForgot" class="bg-transparent border-none cursor-pointer text-muted text-lg hover:text-[#1A2332] leading-none">✕</button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5">

          <!-- Error / Success -->
          <div v-if="forgotError"
               class="flex items-center gap-2 text-[12px] text-accent bg-[#FDE8EC] border border-[#F5C0CB] rounded-md px-3 py-2.5 mb-4">
            <i class="ti ti-alert-circle text-[14px]"></i>{{ forgotError }}
          </div>
          <div v-if="forgotSuccess"
               class="flex items-center gap-2 text-[12px] text-success bg-[#E6F7EF] border border-[#B6E6D0] rounded-md px-3 py-2.5 mb-4">
            <i class="ti ti-circle-check text-[14px]"></i>{{ forgotSuccess }}
          </div>

          <!-- Step 1: Enter email -->
          <template v-if="forgotStep === 1">
            <p class="text-[12px] text-muted mb-4">
              Enter your email address and a 6-digit reset code will be generated for you.
            </p>
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Email address</label>
            <input v-model="forgotEmail" type="email" autocomplete="off"
                   placeholder="you@capitalonegroup.com"
                   class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2.5 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors mb-4">
            <button @click="requestReset" :disabled="forgotLoading"
                    class="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-accent text-white text-[13px] font-medium cursor-pointer hover:opacity-90 disabled:opacity-60 border border-accent">
              <svg v-if="forgotLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ forgotLoading ? 'Generating…' : 'Get Reset Code' }}
            </button>
          </template>

          <!-- Step 2: Enter code + new password -->
          <template v-else>
            <p class="text-[12px] text-muted mb-4">
              Enter the 6-digit reset code and your new password.
            </p>
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Reset Code</label>
            <input v-model="forgotCode" autocomplete="off" placeholder="6-digit code"
                   class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2.5 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors mb-3">

            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">New Password</label>
            <div class="relative mb-3">
              <input v-model="forgotNewPwd" :type="showForgotPwd ? 'text' : 'password'" autocomplete="off"
                     placeholder="Min. 6 characters"
                     class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2.5 text-[13px] text-[#1A2332] w-full pr-10 focus:outline-none focus:border-accent transition-colors">
              <button type="button" @click="showForgotPwd = !showForgotPwd"
                      class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-muted hover:text-[#1A2332]">
                <i :class="showForgotPwd ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-[15px]"></i>
              </button>
            </div>

            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Confirm New Password</label>
            <input v-model="forgotConfirmPwd" :type="showForgotPwd ? 'text' : 'password'" autocomplete="off"
                   placeholder="Repeat new password"
                   class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2.5 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors mb-4">

            <div class="flex gap-2">
              <button @click="forgotStep = 1"
                      class="flex-1 py-2.5 rounded-md border border-[#E1E4E9] bg-white text-[13px] text-muted hover:bg-[#F4F5F7] cursor-pointer">
                Back
              </button>
              <button @click="submitReset" :disabled="forgotLoading"
                      class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-accent text-white text-[13px] font-medium cursor-pointer hover:opacity-90 disabled:opacity-60 border border-accent">
                <svg v-if="forgotLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {{ forgotLoading ? 'Resetting…' : 'Reset Password' }}
              </button>
            </div>
          </template>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { USERS, setUser } from "../users.js";
import { api } from "../api.js";

const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

// ── Motivational quotes ──────────────────────────────────────────────────
const quotes = [
  {
    text: "Success is not final, failure is not fatal — it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Excellence is not a destination but a continuous journey that never ends.",
    author: "Brian Tracy",
  },
  {
    text: "Your work is going to fill a large part of your life. Do great work.",
    author: "Steve Jobs",
  },
  {
    text: "Talent wins games, but teamwork and intelligence win championships.",
    author: "Michael Jordan",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
  },
];

const INTERVAL = 6000; // ms per quote
const currentQuoteIndex = ref(0);
const progressWidth = ref(0);

let quoteTimer = null;
let progressTimer = null;

function goToQuote(i) {
  currentQuoteIndex.value = i;
  resetProgress();
}

function nextQuote() {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length;
  resetProgress();
}

function resetProgress() {
  progressWidth.value = 0;
  clearInterval(progressTimer);
  // Tick every 60ms → 100 ticks over 6 s
  progressTimer = setInterval(() => {
    progressWidth.value = Math.min(
      progressWidth.value + 100 / (INTERVAL / 60),
      100,
    );
  }, 60);
}

onMounted(() => {
  resetProgress();
  quoteTimer = setInterval(nextQuote, INTERVAL);
});

onUnmounted(() => {
  clearInterval(quoteTimer);
  clearInterval(progressTimer);
});

// ── Forgot password ───────────────────────────────────────────────────────
const showForgot      = ref(false)
const forgotStep      = ref(1)          // 1 = enter email, 2 = enter code + new pwd
const forgotEmail     = ref('')
const forgotCode      = ref('')
const forgotNewPwd    = ref('')
const forgotConfirmPwd = ref('')
const showForgotPwd   = ref(false)
const forgotLoading   = ref(false)
const forgotError     = ref('')
const forgotSuccess   = ref('')

function openForgot() {
  forgotStep.value      = 1
  forgotEmail.value     = ''
  forgotCode.value      = ''
  forgotNewPwd.value    = ''
  forgotConfirmPwd.value = ''
  forgotError.value     = ''
  forgotSuccess.value   = ''
  showForgotPwd.value   = false
  showForgot.value      = true
}

function closeForgot() {
  showForgot.value = false
}

async function requestReset() {
  forgotError.value   = ''
  forgotSuccess.value = ''
  if (!forgotEmail.value.trim()) {
    forgotError.value = 'Please enter your email address.'
    return
  }
  forgotLoading.value = true
  try {
    const res = await api.forgotPassword(forgotEmail.value.trim())
    // If a reset code was returned (internal platform — no email server),
    // show it so the user / admin can use it immediately.
    if (res.resetCode) {
      forgotSuccess.value = `Your reset code is: ${res.resetCode}  (valid for 15 minutes)`
    } else {
      forgotSuccess.value = res.message
    }
    forgotStep.value = 2
  } catch (e) {
    forgotError.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    forgotLoading.value = false
  }
}

async function submitReset() {
  forgotError.value   = ''
  forgotSuccess.value = ''
  if (!forgotCode.value.trim())    { forgotError.value = 'Please enter the reset code.'; return }
  if (!forgotNewPwd.value)         { forgotError.value = 'Please enter a new password.'; return }
  if (forgotNewPwd.value.length < 6) { forgotError.value = 'Password must be at least 6 characters.'; return }
  if (forgotNewPwd.value !== forgotConfirmPwd.value) {
    forgotError.value = 'Passwords do not match.'
    return
  }
  forgotLoading.value = true
  try {
    const res = await api.resetPassword(forgotEmail.value.trim(), forgotCode.value.trim(), forgotNewPwd.value)
    forgotSuccess.value = res.message
    // Auto-close after 2s and pre-fill email on login form
    email.value = forgotEmail.value.trim()
    setTimeout(closeForgot, 2000)
  } catch (e) {
    forgotError.value = e.message || 'Reset failed. Please try again.'
  } finally {
    forgotLoading.value = false
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────
function autofill(addr) {
  email.value = addr;
  password.value = "admin123";
  error.value = "";
}

async function handleLogin() {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Please enter your email and password.";
    return;
  }

  loading.value = true;

  try {
    const { token, user } = await api.login(
      email.value.toLowerCase().trim(),
      password.value
    );
    setUser(user, token);
    router.replace(user.role === "admin" ? "/dashboard" : user.dept);
  } catch (e) {
    // e.status is set by api.js for every HTTP error response (401, 403, etc.)
    // Only fall back to demo accounts when the backend is genuinely unreachable
    // (network error → no status code). Never bypass a real 401 from the backend.
    if (!e.status) {
      const addr     = email.value.toLowerCase().trim();
      const mockUser = USERS[addr];
      if (mockUser && password.value === "admin123") {
        setUser({ ...mockUser, email: addr });
        router.replace(mockUser.role === "admin" ? "/dashboard" : mockUser.dept);
        return;
      }
    }
    error.value = e.message || "Invalid credentials.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.quote-fade-enter-active,
.quote-fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.quote-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.quote-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
