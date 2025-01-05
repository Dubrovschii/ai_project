<script setup>
import { RouterView } from "vue-router";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import "@/assets/base.css";
import { useNotification } from "@kyvg/vue3-notification";
</script>

<template>
  <RouterView />
  <notifications />
</template>
