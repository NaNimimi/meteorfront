<template>
  <div
    @click="goToAnime"
    class="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
  >
    <div
      class="relative h-44 sm:h-56 md:h-64 bg-slate-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden"
    >
      <img
        :src="imageSrc"
        :alt="animeTitle"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        v-if="anime.rating"
        class="absolute top-2 left-2 bg-amber-500 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-md"
      >
        {{ anime.rating.toFixed(1) }}
      </div>
    </div>

    <div class="p-3">
      <div
        class="text-base font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-amber-500 dark:hover:text-amber-400 transition"
      >
        {{ animeTitle }}
      </div>

      <div
        class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex justify-between items-center"
      >
        <span>{{ anime.year }} · {{ anime.type }}</span>
        <span v-if="anime.status" class="capitalize">
          {{ anime.status === 'ongoing' ? 'Ongoing' : 'Released' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  anime: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      title_ru: "Нет названия",
      title_uz: "Sarlavha yo‘q",
      poster_url: "",
      year: "2020",
      type: "series",
      status: "released",
      rating: 0,
    }),
  },
});

// Название
const animeTitle = computed(
  () => props.anime.title_ru || props.anime.title_uz || "Unknown Title"
);

// Постер
const imageSrc = computed(() => {
  return props.anime.poster_url || "/placeholder-mini.jpg";
});

// Переход по ID
function goToAnime() {
  if (props.anime.id) {
    router.push(`/anime/${props.anime.id}`);
  } else {
    console.warn("❗ Anime ID is missing for navigation.");
  }
}
</script>

<style scoped>
/* Можно добавить дополнительные стили при желании */
</style>
