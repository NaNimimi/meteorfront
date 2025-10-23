<template>
  <div
    class="min-h-screen w-full transition-colors duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <!-- NAVBAR -->

    <div class="max-w-6xl mx-auto px-4">
      <!-- HERO SLIDER (hidden when searching/filtering) -->
      <section
        v-if="showSlider && slides.length"
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
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"></div>
        </div>

        <div v-else-if="animeList.length === 0" class="text-center p-10 text-xl font-medium">
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
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Card from '../components/Card.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const API_BASE = 'http://api.meteordub.uz/api';

// --- STATE ---
const currentIndex = ref(0);
const slides = ref([]);
const animeList = ref([]);
const animeNextPage = ref(null);
const animeCurrentPage = ref(1);
const isLoadingAnimes = ref(false);
const isLoadingSlider = ref(true);
const isDarkMode = ref(JSON.parse(localStorage.getItem('darkMode')) || false);

// --- FILTERS / SEARCH ---
const currentSearchQuery = ref(route.query.search || '');
const currentGenres = ref([]);
const currentMainFilter = ref({
  search: route.query.search || '',
  type: route.query.type || '',
  status: route.query.status || '',
  season: route.query.season || '',
  yearFrom: route.query.release_year_gte || '',
  yearTo: route.query.release_year_lte || '',
  sort: route.query.ordering || '',
});
const isFiltered = computed(() => Object.values(currentMainFilter.value).some(v => v));
const showSlider = computed(() => !route.query.search && !isFiltered.value && !currentGenres.value.length);

// --- UI ---
const windowWidth = ref(window.innerWidth);
const interval = ref(null);

// ------------------------------------------------
// BUILD QUERY STRING
// ------------------------------------------------
function buildQueryString(page = 1) {
  const params = new URLSearchParams();

  if (route.query.search) params.append('search', route.query.search);
  if (route.query.genres) params.append('genres', route.query.genres);
  if (route.query.type) params.append('type', route.query.type);
  if (route.query.status) params.append('status', route.query.status);
  if (route.query.season) params.append('season', route.query.season);
  if (route.query.release_year) params.append('release_year', route.query.release_year);
  if (route.query.release_year_gte) params.append('release_year_gte', route.query.release_year_gte);
  if (route.query.release_year_lte) params.append('release_year_lte', route.query.release_year_lte);
  if (route.query.ordering) params.append('ordering', route.query.ordering);

  params.append('page', page);
  return params.toString();
}


// ------------------------------------------------
// FETCH FUNCTIONS
// ------------------------------------------------
async function fetchAnimes(append = false) {
  isLoadingAnimes.value = true;
  const pageToLoad = append ? animeCurrentPage.value + 1 : 1;
  const url = `${API_BASE}/animes/?${buildQueryString(pageToLoad)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const animes = data.data || [];

    if (append) {
      animeList.value = [...animeList.value, ...animes];
      animeCurrentPage.value = pageToLoad;
    } else {
      animeList.value = animes;
      animeCurrentPage.value = 1;
    }

    animeNextPage.value = data.links?.next || null;
  } catch (err) {
    console.error('❌ Error loading animes:', err);
  } finally {
    isLoadingAnimes.value = false;
  }
}

async function fetchAnimesForSlider() {
  isLoadingSlider.value = true;
  try {
    const res = await fetch(`${API_BASE}/animes/?limit=20&ordering=-rating`);
    const data = await res.json();
    const all = data.data || [];
    const randomSlides = all.sort(() => 0.5 - Math.random()).slice(0, 3);
    slides.value = randomSlides.map(a => ({
      id: a.id,
      hero: a.banner_url || '/placeholder-hero.jpg',
      mini: a.poster_url || '/placeholder-mini.jpg',
      title: a.russian_title || a.uzbek_title || 'No title',
      desc: a.description?.slice(0, 200) + '...',
      label: a.status === 'ongoing' ? t('ongoing') : t('released'),
      subtitle: `${a.year || '—'}, ${a.type || '—'}`,
    }));
    startSlider();
  } catch (err) {
    console.error('❌ Slider fetch failed:', err);
  } finally {
    isLoadingSlider.value = false;
  }
}

// ------------------------------------------------
// WATCHERS — React to URL changes from NavBar
// ------------------------------------------------
watch(
  () => route.query,
  (newQuery) => {
    currentSearchQuery.value = newQuery.search || '';
    currentGenres.value = newQuery.genres ? newQuery.genres.split(',') : [];

    currentMainFilter.value = {
      search: newQuery.search || '',
      type: newQuery.type || '',
      status: newQuery.status || '',
      season: newQuery.season || '',
      yearFrom: newQuery.release_year_gte || '',
      yearTo: newQuery.release_year_lte || '',
      sort: newQuery.ordering || '',
    };

    fetchAnimes();
  },
  { immediate: true }
);

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
function navigateToAnime(id) {
  router.push(`/anime/${id}`);
}

// ------------------------------------------------
// LIFECYCLE
// ------------------------------------------------
onMounted(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  window.addEventListener('resize', () => (windowWidth.value = window.innerWidth));
  fetchAnimesForSlider();
});
onUnmounted(() => {
  clearInterval(interval.value);
  window.removeEventListener('resize', () => (windowWidth.value = window.innerWidth));
});
</script>

