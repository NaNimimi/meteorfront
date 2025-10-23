<template>
  <div
    class="min-h-screen flex flex-col items-center pb-12 transition-colors duration-500"
    :class="darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'"
  >
    <!-- Header background -->
    <div
      class="w-full h-56 relative overflow-hidden transition-all"
      :style="`background-image: url(${background}); background-size: cover; background-position: center;`"
    >
      <div
        class="absolute inset-0 transition-colors duration-500"
        :class="darkMode ? 'bg-black/50' : 'bg-black/30'"
      ></div>
    </div>

    <!-- Avatar -->
    <div class="relative -mt-16 cursor-pointer group" @click="triggerAvatarUpload">
      <img
        :src="user.avatar || '/avatar.jpg'"
        class="w-32 h-32 rounded-full border-4 object-cover shadow-lg group-hover:scale-105 transition"
        :class="darkMode ? 'border-slate-800' : 'border-white'"
        alt="User avatar"
      />
      <div
        class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      </div>
      <input
        ref="avatarInput"
        type="file"
        class="hidden"
        accept="image/*"
        @change="changeAvatar"
        :disabled="isUploading"
      />
    </div>

    <!-- User info -->
    <div class="text-center mt-4">
      <h2 class="text-2xl font-bold">{{ user.name || 'User' }}</h2>
      <p
        class="text-sm transition-colors"
        :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        {{ user.email || 'N/A' }}
      </p>

      <button
        @click="buyPremium"
        class="mt-3 px-5 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
        :class="darkMode
          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900'
          : 'bg-gradient-to-r from-amber-300 to-yellow-400 text-gray-900'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-yellow-800"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
        {{ user.is_premium ? 'Premium Active' : 'Buy Premium' }}
      </button>
    </div>

    <!-- Tags -->
    <div class="mt-8 w-full max-w-3xl px-4">
      <h3
        class="text-xl font-bold mb-4 transition-colors"
        :class="darkMode ? 'text-gray-200' : 'text-gray-700'"
      >
        My Tags
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          v-for="tag in tags"
          :key="tag.name"
          @click="selectTag(tag.name)"
          class="flex flex-col items-center justify-center py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 shadow-sm"
          :class="[
            activeTag === tag.name
              ? tag.activeClass
              : darkMode
              ? 'bg-slate-800/70 text-gray-200 border-slate-700 hover:bg-slate-700'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100',
          ]"
        >
          <component :is="tag.icon" class="w-4 h-4 mb-0.5" />
          <span>{{ tag.label }}</span>
        </button>
      </div>
    </div>

    <!-- Stories -->
    <div class="mt-8 w-full max-w-6xl px-4">
      <h3
        class="text-xl font-bold mb-4 transition-colors"
        :class="darkMode ? 'text-gray-200' : 'text-gray-700'"
      >
        {{ activeTag ? activeTag : 'My Stories' }}
        <span v-if="isLoadingStories" class="text-sm font-normal ml-2">(Loading...)</span>
      </h3>

      <div v-if="isLoadingStories" class="text-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
      </div>

      <div
        v-else-if="stories.length"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <div
          v-for="story in stories"
          :key="story.id"
          class="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
          :class="darkMode ? 'bg-slate-800 text-gray-200' : 'bg-white text-gray-800'"
          @click="goToAnime(story.id)"
        >
          <img
            :src="story.poster_url || '/placeholder.jpg'"
            class="w-full h-48 object-cover"
            :alt="story.title"
          />
          <div class="p-3">
            <h4 class="text-sm font-semibold truncate">{{ story.title }}</h4>
            <p
              class="text-xs mt-1 transition-colors"
              :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ story.type || 'Anime' }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-20 text-sm transition-colors"
        :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        No stories found.
      </div>
    </div>

    <!-- Back button -->
    <button
      @click="goBack"
      class="fixed bottom-6 right-6 px-4 py-2 rounded-full shadow-lg transition"
      :class="darkMode
        ? 'bg-slate-700 text-white hover:bg-slate-600'
        : 'bg-gray-800 text-white hover:bg-gray-700'"
    >
      Back
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  EyeIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  HeartIcon,
} from "lucide-vue-next";

const API_BASE = "http://api.meteordub.uz/api";
const getAuthToken = () => localStorage.getItem("access_token");
const router = useRouter();

const darkMode = ref(false);
const user = ref({
  name: "Loading...",
  email: "Loading...",
  avatar: "/avatar.jpg",
  is_premium: false,
});
const background = ref("/hero.jpg");
const avatarInput = ref(null);
const isUploading = ref(false);
const isLoadingStories = ref(false);
const stories = ref([]);
const activeTag = ref(localStorage.getItem("activeTag") || "watching");

// Tags
const tags = [
  {
    name: "watching",
    label: "Watching",
    icon: EyeIcon,
    activeClass:
      "bg-blue-500 text-white border-blue-500 dark:bg-blue-700 dark:border-blue-700 scale-[1.03]",
  },
  {
    name: "paused",
    label: "Paused",
    icon: PauseCircleIcon,
    activeClass:
      "bg-red-500 text-white border-red-500 dark:bg-red-700 dark:border-red-700 scale-[1.03]",
  },
  {
    name: "finished",
    label: "Finished",
    icon: CheckCircleIcon,
    activeClass:
      "bg-green-500 text-white border-green-500 dark:bg-green-700 dark:border-green-700 scale-[1.03]",
  },
  {
    name: "favorite",
    label: "Favorite",
    icon: HeartIcon,
    activeClass:
      "bg-pink-500 text-white border-pink-500 dark:bg-pink-700 dark:border-pink-700 scale-[1.03]",
  },
];

// =====================
// Fetch User
// =====================
async function fetchMe() {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load user");
    const result = await res.json();
    const data = result.data || {};

    user.value.name = data.full_name || "User";
    user.value.email = data.email || "N/A";
    user.value.avatar = data.avatar_url || "/avatar.jpg";
    user.value.is_premium = data.is_premium || false;
  } catch (err) {
    console.error("Error fetching user:", err);
  }
}

// =====================
// Avatar Upload
// =====================
async function uploadAvatar(file) {
  isUploading.value = true;
  const token = getAuthToken();
  if (!token) {
    alert("Please log in first.");
    isUploading.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await fetch(`${API_BASE}/me/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload avatar");

    // Re-fetch user to get actual avatar URL from backend
    await fetchMe();
    alert("Avatar updated successfully!");
  } catch (err) {
    console.error("Avatar upload error:", err);
    alert("Failed to upload avatar.");
  } finally {
    isUploading.value = false;
  }
}

const triggerAvatarUpload = () => {
  if (!isUploading.value) avatarInput.value?.click();
};

const changeAvatar = (e) => {
  const file = e.target.files[0];
  if (file) uploadAvatar(file);
};

// =====================
// Stories by Tag (Local)
// =====================
function getLocalAnimeIds(tag) {
  const key = `${tag}_anime_ids`;
  try {
    const list = localStorage.getItem(key);
    return list ? JSON.parse(list).map((id) => parseInt(id)) : [];
  } catch {
    return [];
  }
}

async function fetchAnimeDetailById(id) {
  try {
    const res = await fetch(`${API_BASE}/animes/${id}/`);
    if (!res.ok) return null;
    const data = (await res.json()).data;
    return {
      id: data.id,
      title: data.title_ru || data.title || "Untitled",
      poster_url: data.poster_url,
      type: data.type,
    };
  } catch {
    return null;
  }
}

async function fetchStoriesByTagFromLocal() {
  stories.value = [];
  if (!activeTag.value) return;
  isLoadingStories.value = true;

  const animeIds = getLocalAnimeIds(activeTag.value);
  const results = await Promise.all(animeIds.map((id) => fetchAnimeDetailById(id)));
  stories.value = results.filter((s) => s);
  isLoadingStories.value = false;
}

// =====================
// Misc
// =====================
const selectTag = (tag) => {
  activeTag.value = activeTag.value === tag ? "" : tag;
  localStorage.setItem("activeTag", activeTag.value);
};
const buyPremium = () => alert("Premium feature coming soon!");
const goBack = () => router.push({ name: "Home" });
const goToAnime = (id) => router.push(`/anime/${id}`);

// =====================
// Lifecycle
// =====================
onMounted(() => {
  darkMode.value = JSON.parse(localStorage.getItem("darkMode")) || false;
  document.documentElement.classList.toggle("dark", darkMode.value);
  fetchMe();
  fetchStoriesByTagFromLocal();
});

watch(activeTag, fetchStoriesByTagFromLocal);
</script>
