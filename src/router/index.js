import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Autification/Login.vue';
import About from '@/views/About.vue';
import Rewiew from '@/views/Rewiew.vue';
import Myaccount from '@/views/Myaccount.vue';
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};
console.log(import.meta.env.BASE_URL);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
      beforeEnter: (to, from, next) => {
        const token = getCookie("user_token");
        if (token) {
          next("/home");
        } else {
          next();
        }
      },
    },

    {
      path: "/home",
      name: "Home",
      component: Home,
      beforeEnter: (to, from, next) => {
        const token = getCookie("user_token");
        if (!token) {
          next("/");
        } else {
          next();
        }
      },
    },
    {
      path: "/about",
      name: "About",
      component: About,
      beforeEnter: (to, from, next) => {
        const token = getCookie("user_token");
        if (!token) {
          next("/");
        } else {
          next();
        }
      },
    },
    {
      path: "/rewiew",
      name: "Rewiew",
      component: Rewiew,
      beforeEnter: (to, from, next) => {
        const token = getCookie("user_token");
        if (!token) {
          next("/");
        } else {
          next();
        }
      },
    },
    {
      path: "/myaccount",
      name: "Myaccount ",
      component: Myaccount,
      beforeEnter: (to, from, next) => {
        const token = getCookie("user_token");
        if (!token) {
          next("/");
        } else {
          next();
        }
      },
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

export default router;
