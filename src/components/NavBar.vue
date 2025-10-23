<template>
  <header
    class="sticky top-0 z-50 shadow-sm transition-colors duration-500"
    :class="darkMode ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-900 shadow-sm'"
    @click.self="closeAll"
  >
    <div class="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div class="flex items-center gap-2 cursor-pointer" @click="goHome">
          <img :src="logoSrc" alt="Logo"
               class="w-10 h-10 sm:w-12 sm:h-12 object-contain hover:scale-105 transition" />
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
  <img
    :src="user?.avatar || '/avatar.jpg'"
    alt="avatar"
    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border cursor-pointer hover:scale-105 transition object-cover"
    :class="darkMode ? 'border-slate-700' : 'border-slate-200'"
    @click="openProfile"
  />
</div>

      </div>

      <div class="flex items-center gap-2 sm:gap-3 relative flex-wrap sm:flex-nowrap">
        <button
          @click.stop="toggleSearch"
          class="sm:hidden flex items-center justify-center w-10 h-10 rounded-full transition"
          :class="darkMode ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-700'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-4.35-4.35M11 6a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        </button>

        <div
    class="flex items-center relative min-w-[200px]"
    :class="[
      isKeyboardOpen
        ? 'fixed top-0 left-0 z-50 w-full px-4 sm:relative sm:w-auto sm:px-0'
        : 'hidden sm:flex'
    ]"
  >
    <input
      v-model="search"
      @input="emitSearch"
      @focus="isKeyboardOpen = true"
      @blur="onBlur"
      type="text"
      :placeholder="$t('searchPlaceholder')"
      class="w-full pl-9 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base transition-colors duration-500"
      :class="darkMode
        ? 'bg-slate-800 border-slate-700 placeholder-slate-400 text-white'
        : 'bg-white border-slate-300 placeholder-slate-500 text-slate-900'"
    />

    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      :class="darkMode ? 'text-slate-300' : 'text-slate-500'"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-4.35-4.35M11 6a5 5 0 100 10 5 5 0 000-10z"
      />
    </svg>
  </div>

        <button @click.stop="toggleFilter"
                class="flex items-center justify-center gap-1 w-10 sm:w-auto h-10 rounded-full text-sm font-medium transition px-3 sm:px-4"
                :class="darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4h18v2l-7 8v6l-4-2v-4L3 6z" />
          </svg>
          <span class="hidden sm:inline">{{ $t('filter') }}</span>
        </button>

        <button @click.stop="toggleGenres"
                class="flex items-center justify-center h-10 rounded-full text-sm font-medium transition px-3 sm:px-4"
                :class="darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'">
          {{ $t('genres') }}
        </button>

        <button v-if="user" @click.stop="toggleSettings"
                class="flex items-center justify-center w-10 h-10 rounded-full border transition"
                :class="darkMode ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
               viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        <router-link v-else to="/login"
                     class="flex items-center justify-center h-10 px-3 sm:px-4 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
          {{ $t('login') }}
        </router-link>

        <transition name="fade">
          <div v-if="showSettings"
               class="absolute right-0 top-[calc(100%+12px)] border shadow-xl rounded-xl w-60 p-4 z-50 transition-colors duration-500"
               :class="darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'"
               @click.stop>
            <button @click="showSettings = false" class="absolute top-2 right-2 hover:text-amber-400 transition">
              ✖
            </button>

            <div class="space-y-3 text-sm mt-5">
              <button @click="doLogout"
                      class="w-full py-2 rounded-lg text-left hover:bg-red-500 hover:text-white px-2 transition-all">
                🚪 {{ $t('logout') }}
              </button>

              <div class="flex items-center justify-between py-2">
                <span>{{ $t(darkMode ? 'darkTheme' : 'lightMode') }}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" v-model="darkMode" @change="toggleDarkMode" />
                  <div class="w-10 h-5 rounded-full transition-all"
                       :class="darkMode ? 'bg-amber-400' : 'bg-slate-300'"></div>
                  <div class="absolute left-[2px] top-[2px] bg-white h-4 w-4 rounded-full transition-all peer-checked:translate-x-5 peer-checked:rotate-[360deg]"></div>
                </label>
              </div>

              <button @click="toggleLang"
                      class="w-full py-2 rounded-lg font-semibold text-center transition-all"
                      :class="locale === 'UZ' ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-blue-500 text-white hover:bg-blue-400'">
                {{ $t('languageText') }}: {{ locale }}
              </button>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="showGenres"
               class="absolute right-0 top-[calc(100%+14px)] w-72 sm:w-80 p-4 rounded-xl shadow-lg border z-50 transition-colors duration-500"
               :class="darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'"
               @click.stop>
            <button @click="showGenres = false" class="absolute top-2 right-2 hover:text-amber-400 transition">
              ✖
            </button>
            
            <div class="font-semibold mb-2 text-center">{{ $t('selectGenres') }}</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <label v-for="genre in genresList" :key="genre.id" class="flex items-center space-x-2">
                <input type="checkbox" :value="genre.slug || genre.name" v-model="selectedGenres" class="accent-amber-500" />
                <span class="truncate">{{ genre.name }}</span>
              </label>
            </div>
            <div class="border-t mt-3 pt-3">
              <button @click="applyFilterGenres"
                      class="w-full py-2 rounded-full font-semibold bg-amber-400 text-black hover:bg-amber-300 transition">
                {{ $t('apply') }}
              </button>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="showFilter"
               class="absolute right-0 top-[calc(100%+14px)] w-80 max-h-[70vh] overflow-y-auto p-4 rounded-xl shadow-lg border z-50 transition-colors duration-500"
               :class="darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'"
               @click.stop>
            <button @click="showFilter = false" class="absolute top-2 right-2 hover:text-amber-400 transition">
              ✖
            </button>

            <div class="font-semibold mb-3 text-center">{{ $t('filter') }}</div>
            <div class="space-y-3 text-sm">
              <input type="text" v-model="filter.search" :placeholder="$t('searchPlaceholder')"
                     class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400"
                     :class="darkMode ? 'bg-slate-700 border-slate-600 placeholder-slate-400 text-white' : 'bg-white border-slate-300 placeholder-slate-500 text-slate-800'" />
              <div>
                <label class="font-medium">{{ $t('type') }}</label>
                <select v-model="filter.type"
                        class="w-full border rounded-lg px-3 py-2 mt-1"
                        :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'">
                  <option value="">{{ $t('any') }}</option>
                  <option value="TV">{{ $t('series') }}</option> 
                  <option value="Movie">{{ $t('movie') }}</option>
                  </select>
              </div>
              <div>
                <label class="font-medium">{{ $t('status') }}</label>
                <select v-model="filter.status"
                        class="w-full border rounded-lg px-3 py-2 mt-1"
                        :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'">
                  <option value="">{{ $t('any') }}</option>
                  <option value="Ongoing">{{ $t('ongoing') }}</option>
                  <option value="Completed">{{ $t('released') }}</option> 
                </select>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-medium">{{ $t('yearFrom') }}</label>
                  <input type="number" v-model="filter.yearFrom" min="1980" max="2025"
                         class="w-full border rounded-lg px-3 py-2 mt-1"
                         :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'" />
                </div>
                <div>
                  <label class="font-medium">{{ $t('yearTo') }}</label>
                  <input type="number" v-model="filter.yearTo" min="1980" max="2025"
                         class="w-full border rounded-lg px-3 py-2 mt-1"
                         :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'" />
                </div>
              </div>
              <div>
                <label class="font-medium">{{ $t('ratingFrom') }}</label>
                <input type="number" v-model="filter.ratingFrom" step="0.1" min="0" max="10"
                       class="w-full border rounded-lg px-3 py-2 mt-1"
                       :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'" />
              </div>
              <div>
                <label class="font-medium">{{ $t('sort') }}</label>
                <select v-model="filter.sort"
                        class="w-full border rounded-lg px-3 py-2 mt-1"
                        :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'">
                  <option value="">{{ $t('noSort') }}</option>
                  <option value="-rating">{{ $t('sortByRating') }} ({{ $t('desc') }})</option>
                  <option value="rating">{{ $t('sortByRating') }} ({{ $t('asc') }})</option>
                  <option value="-release_year">{{ $t('sortByYear') }} ({{ $t('desc') }})</option>
                  <option value="release_year">{{ $t('sortByYear') }} ({{ $t('asc') }})</option>
                  <option value="name">{{ $t('sortByAlphabet') }}</option> 
                </select>
              </div>
              <div class="border-t pt-3">
                <button @click="applyMainFilter"
                        class="w-full bg-amber-400 text-black py-2 rounded-full font-semibold hover:bg-amber-300 transition">
                  {{ $t('apply') }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <transition name="slide">
      <div v-if="showMobileSearch"
           class="px-4 pb-3 border-t sm:hidden transition-colors duration-500"
           :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
        <div class="relative">
          <input v-model="search" @input="emitSearch" type="text" :placeholder="$t('searchPlaceholder')"
                 class="w-full pl-9 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm transition-colors duration-500"
                 :class="darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500'" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
               :class="darkMode ? 'text-slate-300' : 'text-slate-500'" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-4.35-4.35M11 6a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import { logout as authLogout, currentUser, fetchMe } from '../utils/auth'; 

const API_BASE = 'https://api.meteordub.uz/api';

const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter();
const route = useRoute();

const user = ref(currentUser()); 
const search = ref(route.query.search || "");
const showGenres = ref(false);
const showFilter = ref(false);
const showMobileSearch = ref(false);
const showSettings = ref(false);
const darkMode = ref(JSON.parse(localStorage.getItem("darkMode")) || false);
const selectedGenres = ref([]); 
const logoSrc = ref("/Logo.png"); 
const genresList = ref([]);

const filter = ref({
  search: route.query.search || "", 
  type: route.query.type || "",
  status: route.query.status || "",
  yearFrom: route.query.release_year_gte || "",
  yearTo: route.query.release_year_lte || "",
  ratingFrom: route.query.rating_gte || "",
  sort: route.query.ordering || "",
});

async function fetchGenres() {
  try {
    const res = await fetch(`${API_BASE}/genres/`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    genresList.value = data.data || [];
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    genresList.value = [];
  }
}

// ✅ Debounced Search — updates router query instead of emit()
let searchTimeout = null;
function emitSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = { ...route.query };
    if (search.value.trim()) query.search = search.value.trim();
    else delete query.search;
    query.page = 1;
    router.push({ name: "Home", query });
  }, 500);
}

// ✅ Apply filters through query params
function getFilterQueryParams() {
  const params = { ...route.query };
  const f = filter.value;

  if (f.search) params.search = f.search;
  else delete params.search;
  if (f.type) params.type = f.type;
  else delete params.type;
  if (f.status) params.status = f.status;
  else delete params.status;
  if (f.yearFrom) params.release_year_gte = f.yearFrom;
  else delete params.release_year_gte;
  if (f.yearTo) params.release_year_lte = f.yearTo;
  else delete params.release_year_lte;
  if (f.ratingFrom) params.rating_gte = f.ratingFrom;
  else delete params.rating_gte;
  if (f.sort) params.ordering = f.sort;
  else delete params.ordering;

  return params;
}


// --- Search keyboard fix ---
const isKeyboardOpen = ref(false)

function onBlur() {
  // Delay reset to avoid flicker when keyboard closes
  setTimeout(() => {
    isKeyboardOpen.value = false
  }, 300)
}

function applyMainFilter() {
  const newQuery = getFilterQueryParams();
  newQuery.page = 1;
  router.push({ name: "Home", query: newQuery });
  showFilter.value = false;
}

// ✅ Apply selected genres as search query (API uses “search”)
function applyFilterGenres() {
  const query = { ...route.query };

  if (selectedGenres.value.length > 0) {
    // ✅ Use 'genres' instead of 'search'
    query.genres = selectedGenres.value.join(",");
  } else {
    delete query.genres;
  }

  query.page = 1;
  router.push({ name: "Home", query });
  showGenres.value = false;
}


// --- UI Toggles ---
function toggleGenres() { closeAll(); showGenres.value = !showGenres.value; }
function toggleFilter() { closeAll(); showFilter.value = !showFilter.value; }
function toggleSearch() { showMobileSearch.value = !showMobileSearch.value; }
function toggleSettings() { closeAll(); showSettings.value = !showSettings.value; }
function closeAll() { showGenres.value = false; showFilter.value = false; showSettings.value = false; showMobileSearch.value = false; }
function goHome() { router.push({ name: "Home" }); }
function openProfile() { closeAll(); router.push("/profile"); }

// --- Auth ---
function doLogout() {
  authLogout(); 
  user.value = null; 
  router.push("/");
  showSettings.value = false;
}

// --- UI Preferences ---
function toggleLang() {
  const newLang = locale.value === "UZ" ? "RU" : "UZ";
  locale.value = newLang; 
  localStorage.setItem("lang", newLang);
}

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark", darkMode.value);
  localStorage.setItem("darkMode", JSON.stringify(darkMode.value));
}

// --- Load user data ---
async function loadUserData() {
  const localUser = currentUser();
  if (localUser) {
    user.value = localUser; 
    const freshUser = await fetchMe();
    if (freshUser) user.value = freshUser;
    else { authLogout(); user.value = null; }
  } else {
    user.value = null;
  }
}

// --- Lifecycle ---
onMounted(() => {
  if (darkMode.value) document.documentElement.classList.add("dark");

  // Only close dropdowns if click is OUTSIDE header
  document.addEventListener("click", (e) => {
    const header = document.querySelector("header");
    if (header && !header.contains(e.target)) {
      closeAll();
    }
  });

  loadUserData(); 
  fetchGenres();
});


onBeforeUnmount(() => {
  window.removeEventListener("click", closeAll);
});

// --- Watch router to sync search/filter ---
watch(() => route.query, (q) => {
  search.value = q.search || "";
  filter.value = {
    search: q.search || "",
    type: q.type || "",
    status: q.status || "",
    yearFrom: q.release_year_gte || "",
    yearTo: q.release_year_lte || "",
    ratingFrom: q.rating_gte || "",
    sort: q.ordering || "",
  };
});
watchEffect(() => {
  if (isKeyboardOpen.value) {
    // Lock scrolling but don't force height (prevents white screen)
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
  } else {
    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.style.width = ""
  }
})
</script>

<style  scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }

html,
body {
  height: 100%;
  overflow-x: hidden;
  overscroll-behavior: contain; /* stops mobile bounce */
}
</style>