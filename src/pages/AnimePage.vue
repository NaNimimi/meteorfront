<template>
  <div
    class="min-h-screen transition-colors duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <div
      class="max-w-6xl mx-auto bg-white dark:bg-gray-800 mt-6 rounded-2xl shadow-lg p-4 sm:p-8 transition-all"
    >
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ $t('detail.back') }}
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">{{ $t('loading') }}...</p>
      </div>

      <div
        v-else-if="!anime || isError"
        class="text-center text-gray-500 dark:text-gray-400 py-20 text-xl"
      >
        {{ $t('detail.notFound') }}
      </div>

      <div v-else>
        <div class="flex flex-row flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex-1 min-w-[180px]">
            <h1 class="text-2xl sm:text-3xl font-extrabold mb-2 text-gray-800 dark:text-gray-100">
              {{ anime.title }}
            </h1>

            <div class="flex items-center gap-2 mb-3">
              <span class="text-yellow-400 text-xl">⭐</span>
              <span class="bg-yellow-400 text-black font-semibold px-2 py-0.5 rounded-full text-sm">
                {{ anime.rating }}
              </span>
            </div>

            <div class="space-y-0.5 text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-4">
              <p>
                <b>{{ $t('detail.status') }}:</b>
                <span
                  :class="anime.status === 'Completed'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-500 dark:text-orange-400'"
                  class="font-semibold"
                >
                  {{ anime.status === 'Completed' ? $t('released') : $t('ongoing') }}
                </span>
              </p>
              <p><b>{{ $t('detail.type') }}:</b> {{ anime.type }}</p>
              <p><b>{{ $t('detail.year') }}:</b> {{ anime.year }}</p>
              <p><b>{{ $t('detail.ageRating') }}:</b> {{ anime.ageRating }}</p>
              <p><b>{{ $t('detail.genre') }}:</b> {{ anime.genre }}</p>
            </div>
          </div>

          <div class="flex flex-col items-center sm:items-end ml-auto w-[130px] sm:w-[250px]">
            <img
              :src="anime.image"
              :alt="anime.title"
              class="rounded-xl shadow-md object-cover transform hover:scale-105 transition duration-500 w-[130px] sm:w-[250px]"
            />

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
                <span class="font-semibold">{{ $t(`tag.${tag.name}`) }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h2 class="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
            {{ $t('detail.aboutAnime') }}:
          </h2>
          <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-5">
            {{ anime.description }}
          </p>

          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="(ep, i) in anime.episodes"
              :key="ep.id"
              class="min-w-[80px] px-3 py-1.5 rounded-full font-semibold transition-all shadow-sm text-xs sm:text-sm text-center"
              :class="
                selectedEpisode === i
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-green-400 hover:text-white'
              "
              @click="selectedEpisode = i"
            >
              {{ ep.episode_number || (i + 1) }} - {{ $t('detail.ep') }}
            </button>
          </div>

          <div class="aspect-video bg-black rounded-xl overflow-hidden shadow-xl mb-8">
            <iframe
              v-if="currentVideoUrl"
              class="w-full h-full"
              :src="currentVideoUrl"
              frameborder="0"
              allowfullscreen
            ></iframe>
            <div v-else class="w-full h-full flex items-center justify-center text-white/50">
              {{ $t('detail.noVideo') }}
            </div>
          </div>

          <div
            class="border-t pt-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-inner"
          >
            <h2 class="text-base sm:text-lg font-semibold mb-2 dark:text-gray-100">
              {{ $t('detail.comments') }}
            </h2>
            <textarea
              v-model="comment"
              :placeholder="$t('detail.commentPlaceholder')"
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
                {{ $t('detail.send') }}
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  EyeIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  HeartIcon,
} from "lucide-vue-next";

const API_BASE = "http://api.meteordub.uz/api";
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const anime = ref(null);
const isLoading = ref(true);
const isError = ref(false);
const selectedEpisode = ref(0);
const comment = ref("");
const comments = ref([]);
// activeTag хранит имя списка, в котором находится аниме, или null
const activeTag = ref(null); 

const tags = ref([
  { name: "watching", icon: EyeIcon },
  { name: "paused", icon: PauseCircleIcon },
  { name: "finished", icon: CheckCircleIcon },
  { name: "favorite", icon: HeartIcon },
]);

// ---------------------------------------------
// ЛОКАЛЬНОЕ ХРАНЕНИЕ СПИСКОВ (localStorage)
// ---------------------------------------------

/**
 * Получает список ID аниме из localStorage для указанного тега.
 * Ключи: 'watching_anime_ids', 'favorite_anime_ids' и т.д.
 * @param {string} tag - Ключ списка.
 * @returns {Array<number>} Массив ID аниме.
 */
function getLocalAnimeList(tag) {
  const key = `${tag}_anime_ids`;
  try {
    const list = localStorage.getItem(key);
    // Используем parseInt для конвертации ID в числа, так как они в JSON - числа
    return list ? JSON.parse(list).map(id => parseInt(id)) : [];
  } catch (e) {
    console.error(`Error parsing localStorage key: ${key}`, e);
    return [];
  }
}

/**
 * Сохраняет массив ID аниме в localStorage.
 * @param {string} tag - Ключ списка.
 * @param {Array<number>} list - Массив ID аниме.
 */
function saveLocalAnimeList(tag, list) {
  const key = `${tag}_anime_ids`;
  localStorage.setItem(key, JSON.stringify(list));
}

/**
 * Инициализирует activeTag, проверяя, в каком списке находится текущее аниме.
 */
function initializeActiveTag() {
  if (!anime.value) return;

  // Убеждаемся, что ID - это число
  const animeId = parseInt(anime.value.id); 
  const allTags = tags.value.map(t => t.name);
  
  // Проверяем каждый список
  for (const tag of allTags) {
    const list = getLocalAnimeList(tag);
    if (list.includes(animeId)) {
      activeTag.value = tag;
      return;
    }
  }
  activeTag.value = null;
}

/**
 * Обрабатывает нажатие на кнопку тега, обновляя списки в localStorage.
 * @param {string} tag - Выбранный тег.
 */
const selectTag = (tag) => {
  if (!anime.value) return;

  const animeId = parseInt(anime.value.id);
  const currentTag = activeTag.value;

  if (currentTag === tag) {
    // 1. Снимаем выделение: Удаляем аниме из текущего списка
    const currentList = getLocalAnimeList(currentTag);
    const newList = currentList.filter(id => id !== animeId);
    saveLocalAnimeList(currentTag, newList);
    activeTag.value = null;

  } else {
    // 2. Выделяем новый тег: 
    
    // Сначала удаляем аниме из старого списка, если оно там было
    if (currentTag) {
      const oldList = getLocalAnimeList(currentTag);
      const newOldList = oldList.filter(id => id !== animeId);
      saveLocalAnimeList(currentTag, newOldList);
    }

    // Добавляем аниме в новый список
    const newList = getLocalAnimeList(tag);
    if (!newList.includes(animeId)) {
      newList.push(animeId);
    }
    saveLocalAnimeList(tag, newList);
    activeTag.value = tag;
  }
};

// ---------------------------------------------
// ЛОГИКА ВИДЕОПЛЕЕРА (без изменений)
// ---------------------------------------------
const currentVideoUrl = computed(() => {
  if (!anime.value || anime.value.episodes.length <= selectedEpisode.value || selectedEpisode.value < 0) {
    return null;
  }
  const episode = anime.value.episodes[selectedEpisode.value];
  
  if (Array.isArray(episode.languages) && episode.languages.length > 0) {
    let videoObject = episode.languages.find(lang => lang.is_default);
    if (!videoObject) {
        videoObject = episode.languages[0];
    }
    return videoObject.video_url || null;
  }
  return episode.video_url || null; 
});


// ---------------------------------------------
// API FETCH (Обновлен для вызова initializeActiveTag)
// ---------------------------------------------
async function fetchAnimeById(animeId) {
  isLoading.value = true;
  isError.value = false;
  anime.value = null;

  if (!animeId || isNaN(parseInt(animeId))) {
    console.error("Invalid anime ID provided.");
    isError.value = true;
    isLoading.value = false;
    return;
  }

  try {
    const detailUrl = `${API_BASE}/animes/${animeId}/`;
    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) throw new Error(`HTTP ${detailRes.status}`);

    const detailData = (await detailRes.json()).data;

    const episodeUrl = `${API_BASE}/animes/${animeId}/episodes/`;
    const episodeRes = await fetch(episodeUrl);
    let episodes = [];
    if (episodeRes.ok) {
      const episodeList = await episodeRes.json();
      episodes = episodeList.data 
        ? episodeList.data.sort((a, b) => a.episode_number - b.episode_number) 
        : [];
    }

    anime.value = {
      id: detailData.id, // ID аниме очень важен!
      title: detailData.title_ru || detailData.title || "Title N/A",
      rating: detailData.rating ? detailData.rating.toFixed(1) : "N/A",
      status: detailData.status?.toUpperCase() === "ONGOING" ? "Ongoing" : "Completed",
      type: detailData.type || "N/A",
      year: detailData.release_year || "N/A",
      ageRating: detailData.age_rating || "N/A",
      genre: Array.isArray(detailData.genres) && detailData.genres.length
        ? detailData.genres.map((g) => g.name).join(", ")
        : t("detail.noGenre"),
      image: detailData.poster_url || "/placeholder.jpg",
      description: detailData.description || t("detail.noDescription"),
      episodes, 
    };

    selectedEpisode.value = anime.value.episodes.length > 0 ? 0 : -1;
    
    // ВЫЗОВ ИНИЦИАЛИЗАЦИИ ТЕГА ПОСЛЕ ЗАГРУЗКИ ДЕТАЛЕЙ
    initializeActiveTag(); 

  } catch (err) {
    console.error("Critical error:", err.message);
    isError.value = true;
    anime.value = null;
  } finally {
    isLoading.value = false;
  }
}

// ---------------------------------------------
// UI LOGIC & LIFECYCLE
// ---------------------------------------------

const goBack = () => router.go(-1);
const addComment = () => {
  if (comment.value.trim()) {
    comments.value.unshift(comment.value);
    comment.value = "";
  }
};

onMounted(() => {
  const savedMode = JSON.parse(localStorage.getItem("darkMode"));
  document.documentElement.classList.toggle("dark", savedMode);

  const animeId = route.params.id;
  fetchAnimeById(animeId);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchAnimeById(newId);
  }
);
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