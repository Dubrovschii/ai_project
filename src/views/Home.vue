<script setup>
import logo from "@/assets/img/logo.webp";
import { ref, watch, onMounted } from "vue";
import { gsap } from "gsap";
import promoimg from "@/assets/promo.webp";
import sidemenu from "@/components/sidemenu.vue";
import promo from "@/components/promo.vue";
import { useApiStore } from "@/stores/apiStore";
import axios from "axios";
const apiStore = useApiStore();
const home_title = ref("");
const home_descr = ref("");
const home_review = ref([]);

watch(
  () => apiStore.contentHomePage.value,
  (newValue) => {
    if (newValue) {
      home_title.value = newValue.home_title;
      home_descr.value = newValue.home_descr;
      home_review.value = newValue.home_review || [];
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // await apiStore.loadTranslations(apiStore.currentLang);

  gsap.to(".green", {
    rotation: 360,
    x: 200,
    duration: 1,
    onComplete: () => {
      gsap.to(".green", { width: 450, height: 200, duration: 1 });
    },
  });

  gsap.from(".purple", {
    rotation: -360,
    x: -200,
    duration: 1,
    onComplete: () => {
      gsap.to(".purple", { width: 450, height: 200, duration: 1 });
    },
  });

  gsap.fromTo(
    ".blue",
    { x: -100 },
    {
      rotation: 360,
      x: 200,
      duration: 1.2,
      onComplete: () => {
        gsap.to(".blue", { width: 450, height: 200, duration: 1 });
      },
    }
  );
});
</script>

<template class="home">
  <img :src="logo" alt="Logo" class="logo" />
  <sidemenu />
  <div class="container">
    <promo :title="home_title" :description="home_descr" highlight="" />
    <div class="home__wrap mt-medium">
      <div class="home__animation">
        <div
          v-for="(review, index) in home_review"
          :key="index"
          :class="`box gradient-${review.color} ${review.color}`"
        >
          <div class="box__rewiew">
            <div class="box__author">{{ review.name }}</div>
            <div class="box__message mt-small">{{ review.text }}</div>
          </div>
        </div>
      </div>
      <div class="home__img">
        <img :src="promoimg" alt="Promo Image" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
  margin-top: 20px;
  box-shadow: 0px -2px 16px 1px #48fdfe;
  animation: logo 1.3s ease-in-out forwards;
}
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
.home {
  &__wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  &__animation {
    display: flex;
    gap: 20px;
    margin-top: 50px;
    justify-content: center;
    flex-flow: column;
    max-width: 50%;
    width: 100%;
  }
  &__img {
    max-width: 50%;
    width: 100%;
    margin-top: 50px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }
}
.green,
.purple,
.blue {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d1d1d;
  font-weight: bold;
  border-radius: 5px;
  transition: all 0.3s ease;
}
.box__rewiew {
  display: flex;
  flex-flow: column;
  align-items: left;
  padding: 10px;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  line-height: 1.2;
  animation: boxrewiew 5.5s ease-in-out forwards;
}
@keyframes boxrewiew {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
  60% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
.green {
  background-color: #7cfdfe;
  box-shadow: -1px 0px 9px 1px #45c7ff;
}

.purple {
  background-color: #45c7ff;
  box-shadow: -1px 0px 9px 1px #fbfffe;
}

.blue {
  background-color: #fbfffe;
  box-shadow: -1px 0px 9px 1px #45c7ff;
}
</style>
