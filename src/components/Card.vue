<template>
  <div
    @click="goToAnime"
    class="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
  >
    <div class="h-36 bg-slate-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
      <img :src="imageSrc" alt="Card image" class="w-full h-full object-cover" />
    </div>
    <div class="p-3">
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Card Title {{ index }}
      </div>
      <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Short description
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({ index: Number });
const router = useRouter();

const images = [
  '/image.jpeg',
  '/image2.jpeg',
  '/image3.jpeg',
  '/image4.jpeg',
  '/image5.jpeg',
  '/image6.jpeg',
  '/image7.jpeg',
  '/image8.jpeg',
];

const imageSrc = computed(() => images[(props.index - 1) % images.length]);

function goToAnime() {
  router.push(`/anime/${props.index}`);
}
</script>
