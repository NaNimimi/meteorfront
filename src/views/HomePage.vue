<template>
  <!-- Global background -->
  <div
    class="min-h-screen w-full transition-colors duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <div class="max-w-6xl mx-auto px-4">
      <!-- Theme toggle button -->
      <button
        @click="toggleDarkMode"
        class="fixed top-4 right-4 px-4 py-2 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold transition-colors shadow-md hover:scale-105"
      >
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>

      <!-- HERO SLIDER -->
      <section
        class="relative bg-cover bg-center rounded-b-3xl overflow-hidden mt-6 transition-all duration-700"
        :style="{
          backgroundImage: `url(${slides[currentIndex].hero})`,
          minHeight:
            windowWidth < 640
              ? '300px'
              : windowWidth < 1024
              ? '380px'
              : '420px',
        }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
        ></div>

        <div
          class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center px-4 sm:px-6 md:px-8 py-10 sm:py-14 text-white"
        >
          <!-- Text -->
          <transition name="fade-up" mode="out-in">
            <div
              :key="slides[currentIndex].title"
              class="lg:col-span-2 space-y-3 sm:space-y-4 max-w-2xl"
            >
              <h1
                class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white drop-shadow-lg"
              >
                {{ slides[currentIndex].title }}
              </h1>
              <p class="text-sm sm:text-base md:text-lg opacity-90 text-gray-100">
                {{ slides[currentIndex].desc }}
              </p>
              <div class="flex flex-wrap gap-3 pt-2">
                <button
                  class="px-4 py-2 sm:px-5 sm:py-2.5 bg-yellow-500 hover:bg-yellow-400 rounded text-gray-900 font-semibold hover:scale-105 transition-transform"
                >
                  Смотреть
                </button>
                <button
                  class="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded text-white font-semibold transition-colors"
                >
                  Подробнее
                </button>
              </div>
            </div>
          </transition>

          <!-- Mini photo -->
          <div class="hidden lg:block">
            <transition name="slide-mini" mode="out-in">
              <div
                :key="slides[currentIndex].mini"
                class="relative rounded-xl shadow-lg w-56 xl:w-64 h-56 xl:h-64 overflow-hidden group bg-white/10 backdrop-blur-sm"
              >
                <img
                  :src="slides[currentIndex].mini"
                  alt="mini photo"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white"
                >
                  <div class="font-semibold text-lg">
                    {{ slides[currentIndex].label }}
                  </div>
                  <div class="text-sm opacity-90">
                    {{ slides[currentIndex].subtitle }}
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Dots -->
        <div
          class="absolute bottom-3 sm:bottom-5 left-0 right-0 flex justify-center space-x-2 z-10"
        >
          <button
            v-for="(slide, i) in slides"
            :key="i"
            @click="setSlide(i)"
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all"
            :class="
              i === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
            "
          ></button>
        </div>
      </section>

      <!-- GRID -->
      <section
        class="mt-10 pb-10 bg-gray-100 dark:bg-gray-800 rounded-3xl transition-colors duration-500"
      >
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6"
        >
          <Card v-for="i in 8" :key="i" :index="i" />
        </div>

        <div class="flex justify-center mt-8">
          <button
            class="px-6 py-3 rounded-full bg-amber-400 dark:bg-amber-500 text-gray-900 dark:text-gray-100 font-semibold hover:scale-105 transition-transform"
          >
            Load more
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Card from '../components/Card.vue';

const currentIndex = ref(0);
const windowWidth = ref(window.innerWidth);
const interval = ref(null);
const isDarkMode = ref(JSON.parse(localStorage.getItem('darkMode')) || false);

const slides = ref([
  {
    hero: '/hero.jpg',
    mini: '/mini.jpg',
    title: 'Аниме 1 — Приключения!',
    desc: 'Описание первого слайда. Интересный сюжет и красочный мир.',
    label: 'Новинка',
    subtitle: 'Лучший релиз месяца',
  },
  {
    hero: '/hero2.jpg',
    mini: '/mini3.jpg',
    title: 'Аниме 2 — Магия и битвы',
    desc: 'Эпическая история о героях и их приключениях.',
    label: 'Популярное',
    subtitle: 'Смотрите прямо сейчас',
  },
  {
    hero: '/hero3.jpg',
    mini: '/mini2.jpeg',
    title: 'Аниме 3 — Любовь и драма',
    desc: 'Трогательная история с красивой графикой и атмосферой.',
    label: 'Рекомендация',
    subtitle: 'Не пропустите новый сезон',
  },
]);

function startSlider() {
  interval.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length;
  }, 5000);
}

function setSlide(i) {
  currentIndex.value = i;
  clearInterval(interval.value);
  startSlider();
}

function handleResize() {
  windowWidth.value = window.innerWidth;
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value));
  document.documentElement.classList.toggle('dark', isDarkMode.value);
}

onMounted(() => {
  // Initialize dark mode state
  const savedMode = JSON.parse(localStorage.getItem('darkMode'));
  if (savedMode) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }

  startSlider();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  clearInterval(interval.value);
  window.removeEventListener('resize', handleResize);
});

// Sync dark mode with navbar
watch(isDarkMode, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal);
  localStorage.setItem('darkMode', JSON.stringify(newVal));
});
</script>

<style>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.8s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-mini-enter-active,
.slide-mini-leave-active {
  transition: all 0.6s ease;
}
.slide-mini-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-mini-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Background smooth transition */
html,
body {
  min-height: 100vh;
  background-color: #f9fafb; /* Light */
  transition: background-color 0.5s ease;
}

html.dark,
body.dark {
  background-color: #0f172a; /* Dark */
}
</style>
