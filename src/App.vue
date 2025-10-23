<template>
  <div class="min-h-screen flex flex-col">
    <!-- Навбар показывается везде, кроме anime, login и signup -->
    <NavBar v-if="!hideNavbar" />

    <main class="flex-1">
      <router-view />
    </main>

    <!-- Футер скрывается только на login и signup -->
    <AppFooter v-if="!hideFooter" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()

// скрываем Navbar на anime, login, signup
const hideNavbar = computed(() => 
  ['anime', 'Login', 'Signup'].includes(route.name)
)

// скрываем Footer только на login и signup
const hideFooter = computed(() => 
  ['Login', 'Signup'].includes(route.name)
)
</script>
