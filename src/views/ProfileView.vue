<template>
  <div
    class="min-h-screen flex flex-col items-center transition-colors duration-500"
    :class="darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'"
  >
    <!-- Фон профиля -->
    <div
      class="w-full h-56 relative overflow-hidden transition-all"
      :style="`background-image: url(${background}); background-size: cover; background-position: center;`"
    >
      <div
        class="absolute inset-0 transition-colors duration-500"
        :class="darkMode ? 'bg-black/50' : 'bg-black/30'"
      ></div>
    </div>

    <!-- Аватар -->
    <div class="relative -mt-16 cursor-pointer group" @click="triggerAvatarUpload">
      <img
        :src="avatar || '/avatar.jpg'"
        class="w-32 h-32 rounded-full border-4 object-cover shadow-lg group-hover:scale-105 transition"
        :class="darkMode ? 'border-slate-800' : 'border-white'"
        alt="Аватар"
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <input
        ref="avatarInput"
        type="file"
        class="hidden"
        accept="image/*"
        @change="changeAvatar"
      />
    </div>

    <!-- Инфо -->
    <div class="text-center mt-4">
      <h2 class="text-2xl font-bold">{{ user.name }}</h2>
      <p
        class="text-sm transition-colors"
        :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        {{ user.email }}
      </p>

      <!-- 💎 Премиум -->
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
        Купить Премиум
      </button>
    </div>

    <!-- Теги -->
    <div class="mt-6 w-full max-w-3xl px-4">
      <h3
        class="text-lg font-semibold mb-2 transition-colors"
        :class="darkMode ? 'text-gray-200' : 'text-gray-700'"
      >
        Мои теги
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="tag in tags"
          :key="tag.name"
          @click="selectTag(tag.name)"
          class="flex flex-col items-center justify-center py-2 rounded-lg border text-sm font-medium transition-all duration-200"
          :class="[
            activeTag === tag.name
              ? tag.activeClass
              : darkMode
              ? 'bg-slate-800 text-gray-200 border-slate-700 hover:bg-slate-700'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
          ]"
        >
          <component :is="tag.icon" class="w-4 h-4 mb-0.5" />
          <span>{{ tag.label }}</span>
        </button>
      </div>
    </div>

    <!-- Истории -->
    <div class="mt-8 w-full max-w-5xl px-4">
      <h3
        class="text-lg font-semibold mb-3 transition-colors"
        :class="darkMode ? 'text-gray-200' : 'text-gray-700'"
      >
        Мои истории
      </h3>

      <div
        v-if="stories.length"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        <div
          v-for="story in stories"
          :key="story.id"
          class="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          :class="darkMode ? 'bg-slate-800 text-gray-200' : 'bg-white text-gray-800'"
        >
          <img
            :src="story.image"
            class="w-full h-40 object-cover"
            alt="Story image"
          />
          <div class="p-3">
            <h4 class="text-sm font-semibold truncate">{{ story.title }}</h4>
            <p
              class="text-xs mt-1 transition-colors"
              :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ story.tag }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-20 text-sm transition-colors"
        :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        Нет историй 😢
      </div>
    </div>

    <!-- Назад -->
    <button
      @click="goBack"
      class="fixed bottom-6 right-6 px-4 py-2 rounded-full shadow-md transition"
      :class="darkMode
        ? 'bg-slate-800 text-white hover:bg-slate-700'
        : 'bg-gray-800 text-white hover:bg-gray-700'"
    >
      Назад
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  EyeIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  HeartIcon,
} from "lucide-vue-next";

const router = useRouter();
const goBack = () => router.push({ name: "Home" });

const darkMode = ref(JSON.parse(localStorage.getItem("darkMode")) || false);

onMounted(() => {
  darkMode.value = JSON.parse(localStorage.getItem("darkMode")) || false;
  if (darkMode.value) document.documentElement.classList.add("dark");
});

const user = ref({
  name: "Мой Профиль",
  email: "user@example.com",
});

const avatar = ref(localStorage.getItem("avatar") || "/avatar.jpg");
const background = ref("/hero.jpg");
const avatarInput = ref(null);

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

const changeAvatar = (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    avatar.value = url;
    localStorage.setItem("avatar", url);
  }
};

const tags = [
  {
    name: "watching",
    label: "Смотрю",
    icon: EyeIcon,
    activeClass:
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700 scale-[1.03]",
  },
  {
    name: "paused",
    label: "Заброшено",
    icon: PauseCircleIcon,
    activeClass:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700 scale-[1.03]",
  },
  {
    name: "finished",
    label: "Просмотрено",
    icon: CheckCircleIcon,
    activeClass:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700 scale-[1.03]",
  },
  {
    name: "favorite",
    label: "Избранное",
    icon: HeartIcon,
    activeClass:
      "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900 dark:text-pink-300 dark:border-pink-700 scale-[1.03]",
  },
];

const activeTag = ref(localStorage.getItem("activeTag") || "");
const selectTag = (name) => {
  activeTag.value = activeTag.value === name ? "" : name;
  localStorage.setItem("activeTag", activeTag.value);
};

const stories = ref([
  {
    id: 1,
    title: "Naruto",
    image: "/image.jpeg",
    tag: "Смотрю",
  },
  {
    id: 2,
    title: "One Piece",
    image: "/op.jpeg",
    tag: "Избранное",
  },
]);

const buyPremium = () => {
  alert("🎉 Спасибо за интерес! Страница покупки премиум скоро появится.");
};
</script>
