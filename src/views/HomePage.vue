<template>
  <div
    class="min-h-screen w-full transition-colors duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <div class="max-w-6xl mx-auto px-4">
      <!-- HERO SLIDER -->
      <section
        v-if="slides.length"
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
          class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none"
        ></div>

        <div
          class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center px-4 sm:px-6 md:px-8 py-10 sm:py-14 text-white"
        >
          <transition name="fade-up" mode="out-in">
            <div
              :key="slides[currentIndex].id"
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
                  :disabled="!slides[currentIndex]?.id"
                  @click="navigateToAnime(slides[currentIndex]?.id)"
                  class="px-4 py-2 sm:px-5 sm:py-2.5 bg-yellow-500 hover:bg-yellow-400 rounded text-gray-900 font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {{ $t('watch') }}
                </button>
                <button
                  :disabled="!slides[currentIndex]?.id"
                  @click="navigateToAnimeDetails(slides[currentIndex]?.id)"
                  class="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {{ $t('details') }}
                </button>
              </div>
            </div>
          </transition>

          <div class="hidden lg:block">
            <transition name="slide-mini" mode="out-in">
              <div
                :key="slides[currentIndex].id"
                class="relative rounded-xl shadow-lg w-56 xl:w-64 h-56 xl:h-64 overflow-hidden group bg-white/10 backdrop-blur-sm"
              >
                <img
                  :src="slides[currentIndex].mini"
                  :alt="slides[currentIndex].title"
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

      <section
        v-else-if="isLoadingSlider"
        class="flex justify-center items-center h-64 mt-6"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"
        ></div>
        <p class="ml-4 text-lg">{{ $t('loading') }}...</p>
      </section>

      <section
        v-else-if="isErrorSlider"
        class="flex justify-center items-center h-64 mt-6 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg"
      >
        <p
          class="text-red-600 dark:text-red-400 font-semibold"
        >{{ $t('errorLoadingSlides') }}</p>
      </section>

      <section
        v-else
        class="flex justify-center items-center h-64 mt-6 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg"
      >
        <p
          class="text-gray-600 dark:text-gray-400 font-semibold"
        >{{ $t('noContentAvailable') }}</p>
      </section>

      <!-- MAIN ANIME LIST -->
      <section
        class="mt-10 pb-10 bg-gray-100 dark:bg-gray-800 rounded-3xl transition-colors duration-500"
      >
        <h2 class="text-2xl font-bold pt-6 px-6 mb-4">
          {{
            currentSearchQuery || currentGenres.length || isFiltered
              ? $t('searchResults')
              : $t('latestReleases')
          }}
        </h2>

        <div v-if="isLoadingAnimes" class="flex justify-center p-10">
          <div
            class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"
          ></div>
        </div>

        <div
          v-else-if="animeList.length === 0"
          class="text-center p-10 text-xl font-medium"
        >
          {{ $t('noAnimesFound') }}
        </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6"
        >
          <Card v-for="anime in animeList" :key="anime.id" :anime="anime" />
        </div>

        <div v-if="animeNextPage" class="flex justify-center mt-8">
          <button
            @click="loadMoreAnimes"
            :disabled="isLoadingAnimes"
            class="px-6 py-3 rounded-full bg-amber-400 dark:bg-amber-500 text-gray-900 dark:text-gray-100 font-semibold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {{ $t('loadMore') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Card from '../components/Card.vue';

const { t } = useI18n();
const router = useRouter();

const API_BASE = 'http://api.meteordub.uz/api';

// --- SLIDER ---
const currentIndex = ref(0);
const slides = ref([]);
const isLoadingSlider = ref(true);
const isErrorSlider = ref(false);

// --- ANIME LIST ---
const animeList = ref([]);
const isLoadingAnimes = ref(false);
const animeNextPage = ref(null);
const animeCurrentPage = ref(1);

// --- FILTERS ---
const currentSearchQuery = ref('');
const currentGenres = ref([]);
const currentMainFilter = ref({});
const isFiltered = computed(() =>
  Object.values(currentMainFilter.value).some((val) => val)
);

// --- UI ---
const windowWidth = ref(window.innerWidth);
const interval = ref(null);
const isDarkMode = ref(JSON.parse(localStorage.getItem('darkMode')) || false);

// ------------------------------------------------
// FETCH FUNCTIONS
// ------------------------------------------------

function buildQueryString(page = 1) {
  const params = new URLSearchParams();
  const finalSearch = currentSearchQuery.value || currentMainFilter.value.search;
  if (finalSearch) params.append('search', finalSearch);
  if (currentGenres.value.length)
    params.append('genres', currentGenres.value.join(','));
  const filter = currentMainFilter.value;
  if (filter.type) params.append('type', filter.type);
  if (filter.status) params.append('status', filter.status);
  if (filter.sort) params.append('ordering', filter.sort);
  if (filter.yearFrom) params.append('year_after', filter.yearFrom);
  if (filter.yearTo) params.append('year_before', filter.yearTo);
  if (filter.ratingFrom) params.append('rating_min', filter.ratingFrom);
  params.append('page', page);
  return params.toString();
}

async function fetchAnimes(append = false) {
  isLoadingAnimes.value = true;
  const pageToLoad = append ? animeCurrentPage.value + 1 : 1;
  const queryString = buildQueryString(pageToLoad);
  const url = `${API_BASE}/animes/?${queryString}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
    const data = await res.json();
    const newAnimes = data.data || [];

    if (append) {
      animeList.value = [...animeList.value, ...newAnimes];
      animeCurrentPage.value = pageToLoad;
    } else {
      animeList.value = newAnimes;
      animeCurrentPage.value = 1;
    }
    animeNextPage.value = data.links?.next || null;
  } catch (error) {
    console.error('Ошибка загрузки аниме:', error);
    if (!append) animeList.value = [];
  } finally {
    isLoadingAnimes.value = false;
  }
}

async function fetchAnimesForSlider() {
  isLoadingSlider.value = true;
  isErrorSlider.value = false;

  try {
    const url = `${API_BASE}/animes/?limit=20&ordering=-rating`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const data = await res.json();
    const allAnimes = data.data || [];

    if (allAnimes.length === 0) return;

    const shuffled = allAnimes.sort(() => 0.5 - Math.random());
    const selectedSlides = shuffled.slice(0, 3);

    slides.value = selectedSlides.map((anime) => ({
      id: anime.id,
      hero: anime.banner_url || '/placeholder-hero.jpg',
      mini: anime.poster_url || '/placeholder-mini.jpg',
      title: anime.title_ru || anime.title_uz || 'No title',
      desc:
        anime.description?.substring(0, 200) + '...' || t('noDescription'),
      label: anime.status === 'ongoing' ? t('ongoing') : t('released'),
      subtitle: `${anime.year || '—'}, ${anime.type || '—'}`,
      slug: anime.slug,
    }));

    currentIndex.value = 0;
    if (slides.value.length > 1) startSlider();
  } catch (error) {
    console.error('Ошибка загрузки слайдов:', error);
    isErrorSlider.value = true;
    slides.value = [];
  } finally {
    isLoadingSlider.value = false;
  }
}

// ------------------------------------------------
// SLIDER LOGIC
// ------------------------------------------------

function startSlider() {
  if (interval.value) clearInterval(interval.value);
  if (slides.value.length > 1) {
    interval.value = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % slides.value.length;
    }, 5000);
  }
}

function setSlide(i) {
  currentIndex.value = i;
  clearInterval(interval.value);
  startSlider();
}

// ------------------------------------------------
// NAVIGATION
// ------------------------------------------------

function navigateToAnime(id) {
  if (!id) return console.warn('No id found for current slide.');
  router.push(`/anime/${id}`);
}

function navigateToAnimeDetails(id) {
  if (!id) return console.warn('No id found for details.');
  router.push(`/anime/${id}`); // Change later if needed (e.g. `/anime/${slug}/details`)
}

// ------------------------------------------------
// UI EVENTS
// ------------------------------------------------

function handleResize() {
  windowWidth.value = window.innerWidth;
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('darkMode', JSON.stringify(isDark));
}

// ------------------------------------------------
// LIFECYCLE
// ------------------------------------------------

onMounted(() => {
  applyTheme(isDarkMode.value);
  window.addEventListener('resize', handleResize);
  fetchAnimesForSlider();
  fetchAnimes();
});

onUnmounted(() => {
  clearInterval(interval.value);
  window.removeEventListener('resize', handleResize);
});

watch(isDarkMode, (newVal) => {
  applyTheme(newVal);
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

html,
body {
  min-height: 100vh;
  background-color: #f9fafb;
  transition: background-color 0.5s ease;
}
html.dark,
body.dark {
  background-color: #0f172a;
}
</style>
