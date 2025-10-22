<template>
  <footer
    class="mt-8 py-10 transition-colors duration-500"
    :class="darkMode ? 'bg-slate-900 text-gray-300' : 'bg-gray-100 text-gray-700'"
  >
    <div
      class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-sm"
    >
      <!-- Левая колонка -->
      <div>
        <h3
          class="font-bold text-lg mb-3 transition-colors"
          :class="darkMode ? 'text-white' : 'text-slate-900'"
        >
          Ijtimoiy Tarmoqlar
        </h3>
        <div class="flex justify-center md:justify-start space-x-4 mb-4">
          <a href="#" class="hover:opacity-80 transition">
            <img src="/telegram.svg" alt="Telegram" class="w-6 h-6" />
          </a>
          <a href="#" class="hover:opacity-80 transition">
            <img src="/youtube.svg" alt="YouTube" class="w-6 h-6" />
          </a>
          <a href="#" class="hover:opacity-80 transition">
            <img src="/instagram.svg" alt="Instagram" class="w-6 h-6" />
          </a>
        </div>
        <p
          class="text-xs transition-colors"
          :class="darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          Ushbu Saytdagi Barcha Videolar Faqat Ma'lumot Uchun Taqdim Etiladi.
        </p>
      </div>

      <!-- Центр -->
      <div>
        <h3
          class="font-bold text-lg mb-3 underline underline-offset-2 transition-colors"
          :class="darkMode ? 'text-white' : 'text-slate-900'"
        >
          SAYT HAQIDAGI MA'LUMOT
        </h3>
        <ul class="space-y-1">
          <li>
            <a
              href="#"
              class="hover:underline transition-colors"
              :class="darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-slate-900'"
            >
              Sayt Haqida
            </a>
          </li>
          <li>
            <a
              href="#"
              class="hover:underline transition-colors"
              :class="darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-slate-900'"
            >
              Пользовательское Соглашение
            </a>
          </li>
          <li>
            <a
              href="#"
              class="hover:underline transition-colors"
              :class="darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-slate-900'"
            >
              Политика
            </a>
          </li>
          <li>
            <a
              href="#"
              class="hover:underline transition-colors"
              :class="darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-slate-900'"
            >
              Конфиденциальность
            </a>
          </li>
        </ul>
      </div>

      <!-- Правая колонка -->
      <div>
        <h3
          class="font-bold text-lg mb-3 underline underline-offset-2 transition-colors"
          :class="darkMode ? 'text-white' : 'text-slate-900'"
        >
          TEXNIK YORDAM VA YORDAM
        </h3>
        <ul class="space-y-1">
          <li>
            <a
              href="#"
              class="hover:underline transition-colors"
              :class="darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-slate-900'"
            >
              Yordam bilan chat
            </a>
          </li>
          <li>
            <a
              href="#"
              class="hover:underline transition-colors"
              :class="darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-slate-900'"
            >
              Telegram
            </a>
          </li>
          <li>
            <a
              href="#"
              class="hover:underline transition-colors"
              :class="darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-slate-900'"
            >
              Rivojlanish kanali
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="text-center text-xs mt-8 transition-colors"
      :class="darkMode ? 'text-gray-500' : 'text-gray-500'"
    >
      © 2025 Barcha huquqlar himoyalangan.
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";

const darkMode = ref(JSON.parse(localStorage.getItem("darkMode")) || false);

onMounted(() => {
  // Синхронизация при загрузке
  darkMode.value = JSON.parse(localStorage.getItem("darkMode")) || false;

  // Реагирует на изменения из других компонентов (через localStorage)
  window.addEventListener("storage", (e) => {
    if (e.key === "darkMode") {
      darkMode.value = JSON.parse(e.newValue);
    }
  });
});
</script>
