<script setup>
import logo from "@/assets/img/logo.webp";
</script>

<template>
  <img :src="logo" alt="" class="logo" />
</template>

<style lang="scss">
.logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
  margin-top: 20px;
  box-shadow: 0px -2px 16px 1px #48fdfe;
  animation: logo 1.3s ease-in-out forwards;
}
// p {
//   color: #7cfdfe;
//   border: 1px solid #45c7ff;
//   background: #95fcfc;
//   // #50fcf3 #48fdfe #fbfffe #95fcfc #45c7ff
// }
@keyframes logo {
  0% {
    box-shadow: 0px -2px 16px 1px #45c7ff;
    opacity: 0.2;
  }
  25% {
    box-shadow: 0px -2px 16px 10px #fbfffe;
    opacity: 0.4;
  }
  50% {
    box-shadow: 0px -2px 16px 8px #50fcf3;
    opacity: 0.6;
  }
  75% {
    box-shadow: 0px -2px 16px 4px #7cfdfe;
    opacity: 0.8;
  }
  100% {
    box-shadow: 0px -2px 16px 1px #48fdfe;
    opacity: 1;
  }
}
</style>
