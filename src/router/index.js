import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AnimePage from "../pages/AnimePage.vue";
import ProfileView from "../views/ProfileView.vue";
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import { isAuthenticated } from '../utils/auth' // Функция, проверяющая LocalStorage

const routes = [
  { path: '/', name: 'Home', component: HomePage },
// 🚨 ИЗМЕНЕНИЕ: Меняем :id на :slug
// 🚨 ИЗМЕНЕНИЕ: Возвращаем :id
{ path: "/anime/:id", component: AnimePage, name: "anime" },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  
  // Маршруты профиля, требующие авторизации
  { path: "/profile", name: "Profile", component: ProfileView, meta: { requiresAuth: true } },
  { path: "/user/:id", name: "UserProfile", component: ProfileView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isProfileRoute = to.name === 'Profile' || to.name === 'UserProfile';

  // 1. Проверка, если маршрут требует авторизации И пользователь не авторизован
  if (requiresAuth && !isAuthenticated()) {
    
    // 2. Если это маршрут профиля
    if (isProfileRoute) {
      // 🟢 Показываем сообщение сразу на двух языках (без i18n, используя alert)
      const uzMessage = '🔒 Profilga kirish uchun tizimga kirish yoki ro‘yxatdan o‘tish zarur!';
      const ruMessage = '🔒 Для доступа к профилю необходимо выполнить вход или зарегистрироваться!';
      
      alert(`${uzMessage}\n\n${ruMessage}`);
      
      // 🟢 next(false) отменяет навигацию. Пользователь остается на текущей странице.
      next(false); 
    } else {
      // Если есть другие защищенные маршруты, просто отменяем переход.
      next(false);
    }
  } 
  // 4. Разрешаем переход
  else {
    next();
  }
})

export default router