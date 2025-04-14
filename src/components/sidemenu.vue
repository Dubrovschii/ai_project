<script setup>
import { ref, watch, onMounted } from "vue";

import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification();
import { useApiStore } from "@/stores/apiStore";
import { useRoute } from "vue-router";
const drawer = ref(null);
const apiStore = useApiStore();

const home_route = ref("");
const about_route = ref("");
const review_route = ref("");
const userName = apiStore.getCookie("user_name");
watch(
  () => apiStore.contentRouteSideMenu.value,
  (newValue) => {
    if (newValue) {
      home_route.value = newValue.home_route;
      about_route.value = newValue.about_route;
      review_route.value = newValue.review_route;
    }
  },
  { immediate: true }
);
onMounted(async () => {
  await apiStore.loadTranslations(apiStore.currentLang);
});
const enLang = ref(apiStore.enLang);
const ruLang = ref(apiStore.ruLang);

apiStore.getAvatarUsers();
</script>

<template>
  <header class="header">
    <router-link
      class="mdi mdi-account-circle-outline header__myaccount"
      to="/myaccount"
      v-if="apiStore.avatarSrc == '' || apiStore.avatarSrc == userName"
    ></router-link>
    <router-link
      class="header__myaccount"
      to="/myaccount"
      v-if="apiStore.avatarSrc !== '' && apiStore.avatarSrc !== userName"
    >
      <img
        :src="apiStore.avatarSrc"
        alt="User Avatar"
        id="avatarImage"
        width="150px"
        height="150px"
      />
    </router-link>
    <div class="header__menu">
      <v-card>
        <v-layout>
          <v-main>
            <div class="d-flex justify-center align-center h-100">
              <v-app-bar-nav-icon
                v-if="!drawer"
                color="#95fcfc"
                @click.stop="drawer = !drawer"
              ></v-app-bar-nav-icon>
              <div class="close" v-if="drawer">
                <v-btn class="mdi mdi-close" @click.stop="drawer = !drawer">
                </v-btn>
              </div>
            </div>
          </v-main>
          <v-navigation-drawer v-model="drawer" temporary>
            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-information-outline">
                <router-link class="header__link" to="/home">{{
                  home_route
                }}</router-link>
              </v-list-item>

              <v-list-item prepend-icon="mdi-forum">
                <router-link class="header__link" to="/about">{{
                  about_route
                }}</router-link>
              </v-list-item>
              <v-list-item prepend-icon="mdi-forum">
                <router-link class="header__link" to="/rewiew">{{
                  review_route
                }}</router-link>
              </v-list-item>
            </v-list>
            <v-btn
              prepend-icon="mdi-logout"
              title="Logout"
              value="Logout"
              class="logout"
              @click="apiStore.logout()"
            ></v-btn>
          </v-navigation-drawer>
        </v-layout>
      </v-card>
    </div>
  </header>
</template>

<style lang="scss">
.header {
  display: flex;
  &__myaccount {
    position: absolute;
    width: 50px;
    height: 50px;
    z-index: 9;
    display: block;
    right: 75px;
    top: 25px;
    text-decoration: none;
    &:hover {
      opacity: 0.7;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  &__myaccount::before {
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #48fdfe;
  }
  &__link {
    text-decoration: none;
    color: #1d1d1d;
  }
  &__menu {
    height: 50px;
    width: 50px;
    position: absolute;
    width: 50px;
    height: 50px;
    z-index: 9;
    display: block;
    right: 25px;
    top: 25px;

    .v-card {
      background: none;
      box-shadow: none;
    }
    .v-navigation-drawer {
      background: #45c7ff;
    }
    .v-navigation-drawer__scrim {
      background: #48fdfe;
      border-radius: 50%;
      cursor: pointer !important;
    }
    .v-btn:hover {
      background: #45c7ff;
    }
    .close {
      height: 50px;
      position: relative;
      .v-btn {
        background: none;
        border: none;
        box-shadow: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        color: #48fdfe;
      }
    }

    .logout {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      border: none;
      background: none;
      box-shadow: none;
      &:hover {
        background: #48fdfe;
      }
    }
  }
}
</style>
