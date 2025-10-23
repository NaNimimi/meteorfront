<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4 sm:p-6"
    style="background-image: url('/hero.jpg')"
  >
    <div class="absolute inset-0 bg-black/60"></div>

    <div class="relative z-10 w-full max-w-sm sm:max-w-md">
      <div
        class="absolute inset-0 rounded-3xl bg-white/10 border border-white/20 shadow-2xl"
        style="backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);"
      ></div>

      <div class="relative px-6 sm:px-8 py-8 sm:py-10 text-white">
        <h2
          class="text-2xl sm:text-3xl font-bold text-center mb-6 drop-shadow-md"
        >
          Tizimga kirish
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
          <div>
            <label class="block text-sm sm:text-base mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-2 sm:py-2.5 rounded-full bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
              placeholder="Email manzilingiz"
            />
          </div>

          <div>
            <label class="block text-sm sm:text-base mb-1">Parol</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-2 sm:py-2.5 rounded-full bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
              placeholder="Parolingiz"
            />
          </div>

          <p
            v-if="error"
            class="text-red-300 text-xs sm:text-sm text-center font-medium"
          >
            {{ error }}
          </p>

          <button
            type="submit"
            class="w-full py-2 sm:py-2.5 mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full transition duration-300 text-sm sm:text-base"
          >
            Kirish
          </button>
        </form>

        <div class="text-center mt-5 text-xs sm:text-sm">
          <router-link to="/signup" class="text-indigo-300 hover:underline">
            Ro‘yxatdan o‘tish
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// Убедитесь, что путь к файлу auth.js верен
import { login } from "../utils/auth"; 

const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

const handleLogin = async () => {
  error.value = null;

  // 1. Вызываем обновленную async-функцию
  const res = await login({ email: email.value, password: password.value });

  if (!res.ok) {
    error.value = res.message;
  } else {
    // 2. Переходим на главную страницу (Home)
    router.push({ name: "Home" });
  }
};
</script>