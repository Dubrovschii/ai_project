<script setup>
import { ref } from "vue";

import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification();
const drawer = ref(null);
const logout = async () => {
  try {
    // Удаляем cookies
    deleteCookie("user_token");
    deleteCookie("user_name");
    deleteCookie("user_id");

    // // Отправляем запрос на сервер для завершения сессии (если требуется)
    // await axios.post("/api/logout");

    // Оповещение о выходе
    notify({
      title: "Logged out",
      message: "You have been logged out successfully.",
      type: "info",
    });

    // Перезагрузка страницы
    location.reload();
  } catch (error) {
    console.error("Logout error:", error);
    notify({
      title: "Error",
      message: "An error occurred while logging out. Please try again.",
      type: "error",
    });
  }
};

// Утилита для удаления cookies
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;Secure;SameSite=Strict`;
};
</script>

<template>
  <div class="menu">
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
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Home"
              value="home"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-forum"
              title="About"
              value="about"
            ></v-list-item>
          </v-list>
          <v-btn
            prepend-icon="mdi-logout"
            title="Logout"
            value="Logout"
            class="logout"
            @click="logout()"
          ></v-btn>
        </v-navigation-drawer>
      </v-layout>
    </v-card>
  </div>
</template>

<style lang="scss">
.menu {
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
  }
}
</style>
