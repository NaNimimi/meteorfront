<template>
  <header
    class="sticky top-0 z-50 shadow-sm transition-colors duration-500"
    :class="darkMode ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-900 shadow-sm'"
    @click.self="closeAll"
  >
    <div class="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
      <!-- Левая часть -->
      <div class="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div class="flex items-center gap-2 cursor-pointer" @click="goHome">
          <img src="/Logo.png" alt="Logo"
               class="w-10 h-10 sm:w-12 sm:h-12 object-contain hover:scale-105 transition" />
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <img
            v-if="user && user.avatar"
            :src="user.avatar"
            alt="avatar"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border cursor-pointer hover:scale-105 transition object-cover"
            :class="darkMode ? 'border-slate-700' : 'border-slate-200'"
            @click="openProfile"
          />
          <div
            v-else
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition"
            :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'"
            @click="openProfile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5.121 17.804A10.97 10.97 0 0112 15c2.485 0 4.78.815 6.879 2.196M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Правая часть -->
      <div class="flex items-center gap-2 sm:gap-3 relative flex-wrap sm:flex-nowrap">
        <!-- Поиск мобилка -->
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

        <!-- Поиск desktop -->
        <div class="hidden sm:flex items-center relative min-w-[200px]">
          <input v-model="search" @input="emitSearch" type="text" placeholder="Найти аниме..."
                 class="w-full pl-9 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base transition-colors duration-500"
                 :class="darkMode ? 'bg-slate-800 border-slate-700 placeholder-slate-400 text-white' : 'bg-white border-slate-300 placeholder-slate-500 text-slate-900'" />
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-1/2 -translate-y-1/2"
               :class="darkMode ? 'text-slate-300' : 'text-slate-500'" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-4.35-4.35M11 6a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        </div>

        <!-- Фильтр -->
        <button @click.stop="toggleFilter"
                class="flex items-center justify-center gap-1 w-10 sm:w-auto h-10 rounded-full text-sm font-medium transition px-3 sm:px-4"
                :class="darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4h18v2l-7 8v6l-4-2v-4L3 6z" />
          </svg>
          <span class="hidden sm:inline">Фильтр</span>
        </button>

        <!-- Жанры -->
        <button @click.stop="toggleGenres"
                class="flex items-center justify-center h-10 rounded-full text-sm font-medium transition px-3 sm:px-4"
                :class="darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'">
          ЖАНРЫ
        </button>

        <!-- Настройки -->
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
          Войти
        </router-link>

        <!-- Настройки меню -->
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
                      class="w-full py-2 rounded-lg  text-left transition">
                🚪 Выйти
              </button>

              <div class="flex items-center justify-between py-2">
                <span>🌙 Тёмная тема</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" v-model="darkMode" @change="toggleDarkMode" />
                  <div class="w-10 h-5 rounded-full transition-all"
                       :class="darkMode ? 'bg-amber-400' : 'bg-slate-300'"></div>
                  <div class="absolute left-[2px] top-[2px] bg-white h-4 w-4 rounded-full transition-all peer-checked:translate-x-5 peer-checked:rotate-[360deg]"></div>
                </label>
              </div>

              <!-- Переключатель языка -->
              <button @click="toggleLang"
                      class="w-full py-2 rounded-lg font-semibold text-center transition-all"
                      :class="lang === 'UZ' ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-blue-500 text-white hover:bg-blue-400'">
                🌐 Язык: {{ lang }}
              </button>
            </div>
          </div>
        </transition>

        <!-- ЖАНРЫ -->
        <transition name="fade">
          <div v-if="showGenres"
               class="absolute right-0 top-[calc(100%+14px)] w-72 sm:w-80 p-4 rounded-xl shadow-lg border z-50 transition-colors duration-500"
               :class="darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'"
               @click.stop>
            <div class="font-semibold mb-2 text-center">Выберите жанры</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <label v-for="genre in genres" :key="genre" class="flex items-center space-x-2">
                <input type="checkbox" :value="genre" v-model="selectedGenres" class="accent-amber-500" />
                <span class="truncate">{{ genre }}</span>
              </label>
            </div>
            <div class="border-t mt-3 pt-3">
              <button @click="applyFilterGenres"
                      class="w-full py-2 rounded-full font-semibold bg-amber-400 text-black hover:bg-amber-300 transition">
                Применить
              </button>
            </div>
          </div>
        </transition>

        <!-- ФИЛЬТР -->
        <transition name="fade">
          <div v-if="showFilter"
               class="absolute right-0 top-[calc(100%+14px)] w-80 max-h-[70vh] overflow-y-auto p-4 rounded-xl shadow-lg border z-50 transition-colors duration-500"
               :class="darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'"
               @click.stop>
            <div class="font-semibold mb-3 text-center">Фильтр</div>
            <div class="space-y-3 text-sm">
              <input type="text" v-model="filter.search" placeholder="Поиск..."
                     class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400"
                     :class="darkMode ? 'bg-slate-700 border-slate-600 placeholder-slate-400 text-white' : 'bg-white border-slate-300 placeholder-slate-500 text-slate-800'" />
              <div>
                <label class="font-medium">Тип</label>
                <select v-model="filter.type"
                        class="w-full border rounded-lg px-3 py-2 mt-1"
                        :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'">
                  <option value="">Любой</option>
                  <option>Сериал</option>
                  <option>Фильм</option>
                </select>
              </div>
              <div>
                <label class="font-medium">Статус</label>
                <select v-model="filter.status"
                        class="w-full border rounded-lg px-3 py-2 mt-1"
                        :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'">
                  <option value="">Любой</option>
                  <option>Онгоинг</option>
                  <option>Вышел</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-medium">Год с</label>
                  <input type="number" v-model="filter.yearFrom" min="1980" max="2025"
                         class="w-full border rounded-lg px-3 py-2 mt-1"
                         :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'" />
                </div>
                <div>
                  <label class="font-medium">Год до</label>
                  <input type="number" v-model="filter.yearTo" min="1980" max="2025"
                         class="w-full border rounded-lg px-3 py-2 mt-1"
                         :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'" />
                </div>
              </div>
              <div>
                <label class="font-medium">Рейтинг от</label>
                <input type="number" v-model="filter.ratingFrom" step="0.1" min="0" max="10"
                       class="w-full border rounded-lg px-3 py-2 mt-1"
                       :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'" />
              </div>
              <div>
                <label class="font-medium">Сортировка</label>
                <select v-model="filter.sort"
                        class="w-full border rounded-lg px-3 py-2 mt-1"
                        :class="darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'">
                  <option value="">Без сортировки</option>
                  <option>По рейтингу</option>
                  <option>По году</option>
                  <option>По алфавиту</option>
                </select>
              </div>
              <div class="border-t pt-3">
                <button @click="applyMainFilter"
                        class="w-full bg-amber-400 text-black py-2 rounded-full font-semibold hover:bg-amber-300 transition">
                  Применить
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Мобильный поиск -->
    <transition name="slide">
      <div v-if="showMobileSearch"
           class="px-4 pb-3 border-t sm:hidden transition-colors duration-500"
           :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
        <div class="relative">
          <input v-model="search" @input="emitSearch" type="text" placeholder="Найти аниме..."
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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref({ avatar: "/avatar.jpg" });
const search = ref("");
const showGenres = ref(false);
const showFilter = ref(false);
const showMobileSearch = ref(false);
const showSettings = ref(false);
const darkMode = ref(JSON.parse(localStorage.getItem("darkMode")) || false);
const lang = ref(localStorage.getItem("lang") || "UZ");
const selectedGenres = ref([]);

const genres = [
  "Экшен","Драма","Комедия","Романтика","Фэнтези","Ужасы","Психология","Повседневность","Детектив","Боевые искусства","Мистика","Приключения","Научная фантастика","Историческое",
];

const filter = ref({
  search: "", type: "", status: "", yearFrom: "", yearTo: "", ratingFrom: "", sort: "",
});

function emitSearch() { console.log("Поиск:", search.value); }
function toggleGenres() { closeAll(); showGenres.value = !showGenres.value; }
function toggleFilter() { closeAll(); showFilter.value = !showFilter.value; }
function toggleSearch() { showMobileSearch.value = !showMobileSearch.value; }
function toggleSettings() { closeAll(); showSettings.value = !showSettings.value; }
function closeAll() { showGenres.value = false; showFilter.value = false; showSettings.value = false; }
function goHome() { router.push("/"); }
function openProfile() { closeAll(); router.push("/profile"); }
function doLogout() { console.log("Выход выполнен"); }

function toggleLang() {
  lang.value = lang.value === "UZ" ? "RU" : "UZ";
  localStorage.setItem("lang", lang.value);
}

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark", darkMode.value);
  localStorage.setItem("darkMode", JSON.stringify(darkMode.value));
}

function applyFilterGenres() { console.log("Жанры:", selectedGenres.value); showGenres.value = false; }
function applyMainFilter() { console.log("Фильтр:", filter.value); showFilter.value = false; }

onMounted(() => {
  if (darkMode.value) document.documentElement.classList.add("dark");
  window.addEventListener("click", closeAll);
});
onBeforeUnmount(() => { window.removeEventListener("click", closeAll); });

watch(darkMode, (newVal) => {
  const header = document.querySelector("header");
  if (header) {
    if (newVal) {
      header.classList.remove("bg-white", "text-slate-900", "shadow-sm");
      header.classList.add("bg-slate-900", "text-white", "shadow-lg");
    } else {
      header.classList.remove("bg-slate-900", "text-white", "shadow-lg");
      header.classList.add("bg-white", "text-slate-900", "shadow-sm");
    }
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
