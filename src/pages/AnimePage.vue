<template>
  <div
    class="min-h-screen transition-colors duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <div
      class="max-w-6xl mx-auto bg-white dark:bg-gray-800 mt-6 rounded-2xl shadow-lg p-4 sm:p-8 transition-all"
    >
      <!-- Назад -->
      <div class="mb-5">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-green-600 transition-all font-semibold text-sm sm:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Назад
        </button>
      </div>

      <!-- Контент -->
      <div
        v-if="anime"
        class="flex flex-row flex-wrap items-start justify-between gap-3 sm:gap-6"
      >
        <!-- Левая часть -->
        <div class="flex-1 min-w-[180px]">
          <h1
            class="text-2xl sm:text-3xl font-extrabold mb-2 text-gray-800 dark:text-gray-100"
          >
            {{ anime.title }}
          </h1>

          <div class="flex items-center gap-2 mb-3">
            <span class="text-yellow-400 text-xl">⭐</span>
            <span
              class="bg-yellow-400 text-black font-semibold px-2 py-0.5 rounded-full text-sm"
            >
              {{ anime.rating }}
            </span>
          </div>

          <!-- Инфо -->
          <div class="space-y-0.5 text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-4">
            <p>
              <b>Holati:</b>
              <span
                :class="anime.status === 'Completed' ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'"
                class="font-semibold"
              >
                {{ anime.status }}
              </span>
            </p>
            <p><b>Turi:</b> {{ anime.type }}</p>
            <p><b>Chiqarilgan yili:</b> {{ anime.year }}</p>
            <p><b>Yosh reytingi:</b> {{ anime.ageRating }}</p>
            <p><b>Janr:</b> {{ anime.genre }}</p>
          </div>
        </div>

        <!-- Правая часть -->
        <div
          class="flex flex-col items-center sm:items-end ml-auto w-[130px] sm:w-[250px]"
        >
          <img
            :src="anime.image"
            alt="poster"
            class="rounded-xl shadow-md object-cover transform hover:scale-105 transition duration-500 w-[130px] sm:w-[250px]"
          />

          <!-- Теги -->
          <div class="grid grid-cols-2 gap-1.5 mt-2 w-full">
            <button
              v-for="tag in tags"
              :key="tag.name"
              @click="selectTag(tag.name)"
              class="flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg border text-[9px] sm:text-[11px] font-medium transition-all duration-200 text-center w-full"
              :class="[
                activeTag === tag.name
                  ? tag.name === 'watching'
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 scale-[1.03]'
                    : tag.name === 'paused'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 scale-[1.03]'
                    : tag.name === 'finished'
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 scale-[1.03]'
                    : tag.name === 'favorite'
                    ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700 scale-[1.03]'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <component :is="tag.icon" class="w-3.5 h-3.5 opacity-80" />
              <span class="font-semibold">{{ tag.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Описание -->
      <div v-if="anime" class="mt-6">
        <h2 class="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Anime haqida:
        </h2>
        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-5">
          {{ anime.description }}
        </p>

        <!-- Эпизоды -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="(ep, i) in anime.episodes"
            :key="i"
            class="min-w-[80px] px-3 py-1.5 rounded-full font-semibold transition-all shadow-sm text-xs sm:text-sm text-center"
            :class="
              selectedEpisode === i
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-green-400 hover:text-white'
            "
            @click="selectedEpisode = i"
          >
            {{ i + 1 }} - EP
          </button>
        </div>

        <!-- Видео -->
        <div class="aspect-video bg-black rounded-xl overflow-hidden shadow-xl mb-8">
          <iframe
            class="w-full h-full"
            :src="anime.episodes[selectedEpisode].video"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <!-- Комментарии -->
        <div class="border-t pt-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-inner">
          <h2 class="text-base sm:text-lg font-semibold mb-2 dark:text-gray-100">
            Комментарии
          </h2>
          <textarea
            v-model="comment"
            placeholder="Оставь комментарий..."
            class="w-full border dark:border-gray-700 rounded-xl p-3 mb-2 resize-none focus:ring-2 focus:ring-green-400 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            rows="3"
          ></textarea>
          <div class="flex justify-between items-center mb-3">
            <div class="space-x-2">
              <button class="px-2 py-1 border dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm">
                B
              </button>
              <button class="px-2 py-1 border dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 italic text-sm">
                I
              </button>
              <button class="px-2 py-1 border dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 underline text-sm">
                U
              </button>
            </div>
            <button
              @click="addComment"
              class="bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition text-sm"
            >
              Отправить
            </button>
          </div>

          <transition-group name="fade" tag="div">
            <div
              v-for="(c, i) in comments"
              :key="i"
              class="border-t pt-2 mt-2 bg-white dark:bg-gray-700 p-2 rounded shadow-sm text-sm"
            >
              <p class="text-gray-800 dark:text-gray-100">{{ c }}</p>
            </div>
          </transition-group>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 py-20 text-xl">
        Anime topilmadi 😢
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  EyeIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  HeartIcon,
} from "lucide-vue-next";

const goBack = () => window.history.back();

// ✅ Поддержка глобальной темы
onMounted(() => {
  const savedMode = JSON.parse(localStorage.getItem("darkMode"));
  if (savedMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

const anime = ref({
  id: 1,
  title: "Naruto",
  rating: "8.5",
  status: "Completed",
  type: "TV",
  year: "2002",
  ageRating: "13+",
  genre: "Action",
  image: "/image.jpeg",
  description: "История молодого ниндзя, который мечтает стать Хокаге.",
  episodes: [
    { video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ],
});

const selectedEpisode = ref(0);
const comment = ref("");
const comments = ref([]);

const addComment = () => {
  if (comment.value.trim()) {
    comments.value.unshift(comment.value);
    comment.value = "";
  }
};

const tags = ref([
  { name: "watching", label: "Смотрю", icon: EyeIcon },
  { name: "paused", label: "Заброшено", icon: PauseCircleIcon },
  { name: "finished", label: "Просмотрено", icon: CheckCircleIcon },
  { name: "favorite", label: "Избранное", icon: HeartIcon },
]);

const activeTag = ref(localStorage.getItem("activeTag") || null);
const selectTag = (name) => {
  activeTag.value = activeTag.value === name ? null : name;
  localStorage.setItem("activeTag", activeTag.value || "");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
