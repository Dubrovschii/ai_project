import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue';
import Login from '@/views/Autification/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
      // beforeEnter: (to, from, next) => {
      //   const token = getCookie("user_token");
      //   if (token) {
      //     next("/home");
      //   } else {
      //     next();
      //   }
      // },
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router
