<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

import { useApiStore } from "@/stores/apiStore";
const apiStore = useApiStore();

const save = ref("");

const userName = apiStore.getCookie("user_name");

const file = ref(null);

const firstname = ref("");
const surname = ref("");
const avatar = ref("");
const email = ref("");
const age = ref("");
const profession = ref("");
const hobby = ref("");
const phone = ref("");

watch(
  [() => apiStore.contentMyaccount.value, () => apiStore.contentGlobal.value],
  ([newValue, newValueGlobal]) => {
    if (newValueGlobal) {
      save.value = newValueGlobal.save;
      firstname.value = newValueGlobal.firstname;
      surname.value = newValueGlobal.surname;
      avatar.value = newValueGlobal.avatar;
      email.value = newValueGlobal.email;
      age.value = newValueGlobal.age;
      profession.value = newValueGlobal.profession;
      hobby.value = newValueGlobal.hobby;
      phone.value = newValueGlobal.phone;
    }
  },
  { immediate: true }
);

let loading = apiStore.loading;

const onSubmitInfo = async () => {
  const username = userName;
  try {
    const formData = new FormData();
    if (file.value) {
      try {
        const formData = new FormData();
        formData.append("file", file.value);

        const response = await axios.post(`/api/upload/${username}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        apiStore.getAvatarUsers();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    formData.append("name", apiStore.usernameName);
    formData.append("surname", apiStore.usernameSurname);
    formData.append("email", apiStore.usernameEmail);
    formData.append("age", apiStore.usernameAge);
    formData.append("profession", apiStore.usernameProfession);
    formData.append("hobby", apiStore.usernameHobby);
    formData.append("phone", apiStore.usernamePhone);
    const response = await axios.post(`/api/post-info/${username}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    apiStore.getAvatarUsers();
    apiStore.dialog = false;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

apiStore.getInfoUsers();
apiStore.getAvatarUsers();
</script>
<template>
  <v-form ref="form" @submit.prevent="onSubmitInfo()">
    <v-file-input
      v-model="file"
      :label="avatar"
      variant="plain"
      accept=".jpg,.jpeg,.png,.pdf,.webp"
      v-if="!apiStore.avatarSrc"
    ></v-file-input>

    <v-text-field
      v-model="apiStore.usernameName"
      :label="firstname"
      variant="plain"
    ></v-text-field>
    <v-text-field
      v-model="apiStore.usernameSurname"
      :label="surname"
      variant="plain"
    ></v-text-field>
    <v-text-field
      v-model="apiStore.usernameEmail"
      :label="email"
      variant="plain"
    ></v-text-field>
    <v-text-field
      v-model="apiStore.usernameAge"
      :label="age"
      variant="plain"
    ></v-text-field>
    <v-text-field
      v-model="apiStore.usernameProfession"
      :label="profession"
      variant="plain"
    ></v-text-field>
    <v-text-field
      v-model="apiStore.usernameHobby"
      :label="hobby"
      variant="plain"
    ></v-text-field>
    <v-text-field
      v-model="apiStore.usernamePhone"
      :label="phone"
      variant="plain"
    ></v-text-field>
    <v-btn type="submit" color="#7cfdfe" :loading="loading">{{ save }} </v-btn>
  </v-form>
</template>

<style>
.v-text-field {
  border: none !important;
}
.v-text-field:focus {
  border: none;
}
</style>
