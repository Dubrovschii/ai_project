<script setup>
import { useApiStore } from "@/stores/apiStore";
import { computed } from "vue";
import formContent from "./formComp.vue";
import axios from "axios";

const apiStore = useApiStore();
const userName = apiStore.getCookie("user_name");

const closeDialog = () => {
  apiStore.dialog = false;
};

const deleteAvatar = async () => {
  try {
    const username = userName;

    const response = await axios.delete(`/api/avatar/${username}`);
    if (response.data.success) {
      apiStore.avatarSrc = "";
    } else {
      console.error("Error deleting avatar:", response.data.message);
    }
  } catch (error) {
    console.error("Error deleting avatar:", error);
  }
};
</script>

<template>
  <v-dialog v-model="apiStore.dialog" width="auto" class="myaccount__model">
    <v-card width="700">
      <v-btn class="ms-auto close_delete-btn" text @click="closeDialog" icon>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>

      <div class="myaccount__icons">
        <img
          :src="apiStore.avatarSrc"
          alt="User Avatar"
          v-if="apiStore.avatarSrc"
          width="150px"
          height="150px"
        />

        <v-btn
          v-if="apiStore.avatarSrc"
          @click="deleteAvatar()"
          icon
          class="close_delete-btn myaccount__icons_delete"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>

        <svg
          v-if="!apiStore.avatarSrc"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"
          />
        </svg>
      </div>
      <formContent />
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
@media (max-width: 992px) {
  .myaccount__model {
    .v-card {
      width: 400px !important;
    }
  }
}
@media (max-width: 475px) {
  .myaccount__model {
    .v-card {
      width: 320px !important;
    }
  }
  .v-dialog > .v-overlay__content {
    max-width: 100% !important;
  }
}
</style>
