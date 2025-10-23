```vue
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4 sm:p-6"
    style="background-image: url('/hero.jpg')"
  >
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/50"></div>

    <div class="relative z-10 w-full max-w-sm sm:max-w-md">
      <!-- Frosted glass effect -->
      <div
        class="absolute inset-0 rounded-3xl bg-white/15 border border-white/30 shadow-2xl"
        style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
      ></div>

      <div class="relative px-6 sm:px-8 py-8 sm:py-10 text-white">
        <h2
          class="text-2xl sm:text-3xl font-bold text-center mb-6 drop-shadow-md"
        >
          Ro‘yxatdan o‘tish
        </h2>

        <form @submit.prevent="handleSignup" class="space-y-4 sm:space-y-5">
          <!-- Name -->
          <div>
            <label class="block text-sm sm:text-base mb-1">Ism</label>
            <input
              v-model="name"
              type="text"
              required
              class="w-full px-4 py-2 sm:py-2.5 rounded-full bg-white/25 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
              placeholder="Ismingiz"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm sm:text-base mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-2 sm:py-2.5 rounded-full bg-white/25 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
              placeholder="Email manzilingiz"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm sm:text-base mb-1">Parol</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-2 sm:py-2.5 rounded-full bg-white/25 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
              placeholder="Parolingiz"
            />
          </div>

          <!-- Animated error alert -->
          <transition name="fade">
            <div
              v-if="error"
              class="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm sm:text-base mt-2 text-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-.01-10a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
              <span>{{ error }}</span>
            </div>
          </transition>

          <!-- Submit button -->
          <button
            type="submit"
            class="w-full py-2 sm:py-2.5 mt-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full transition duration-300 text-sm sm:text-base"
          >
            Ro‘yxatdan o‘tish
          </button>
        </form>

        <!-- Link to login -->
        <div class="text-center mt-5 text-xs sm:text-sm">
          <router-link to="/login" class="text-indigo-300 hover:underline">
            Tizimga kirish
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signup } from "../utils/auth";

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

const handleSignup = async () => {
  error.value = null;

  const res = await signup({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  if (!res.ok) {
    // Check for specific email error and translate to Uzbek
    if (res.errors && res.errors.email && res.errors.email.length > 0) {
      const emailError = res.errors.email[0];
      if (emailError === "user with this email already exists.") {
        error.value = "Bu email allaqachon band";
      } else {
        error.value = emailError; // Fallback to raw error if not recognized
      }
    } else {
      // Fallback to generic message
      error.value = res.message || "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";
    }
  } else {
    await new Promise(resolve => setTimeout(resolve, 50));
    router.push({ name: 'Home' });
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
```