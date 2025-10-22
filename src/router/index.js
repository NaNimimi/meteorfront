import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AnimePage from "../pages/AnimePage.vue";
import ProfileView from "../views/ProfileView.vue";
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import { isAuthenticated } from '../utils/auth'

const routes = [
  { path: '/', name: 'Home', component: HomePage, meta: { requiresAuth: true } },
  { path: "/anime/:id", component: AnimePage, name: "anime" },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  { path: "/profile", name: "Profile", component: ProfileView },
    { path: "/user/:id", name: "UserProfile", component: ProfileView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
