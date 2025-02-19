<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  highlight: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div class="promo">
    <div class="container__promo">
      <div class="promo__content">
        <h2 class="promo__title">{{ title }}</h2>
        <h4 class="promo__descr mt-small" v-if="description">
          {{ description }}
        </h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.promo {
  &__title {
    font-size: clamp(32px, 3vw, 72px);
    color: #95fcfc;
    text-align: center;
    font-family: "Open Sans", sans-serif;
    font-weight: 900;
  }
  &__descr {
    color: #50fcf3;
    border: 1px solid #95fcfc;
    padding: 15px;
    border-radius: 8px;
    box-shadow: -1px 0px 9px 1px #45c7ff;
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    span {
      text-transform: uppercase;
      font-weight: 900;
    }
  }
}
</style>
