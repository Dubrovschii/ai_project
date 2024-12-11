<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { notify } from "path-to-notify"; // Убедитесь, что импортируете notify, если оно используется

const nameField = ref("");
const passwordField = ref("");
const visible = ref(false);
const router = useRouter();

const setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  if (exdays === "") {
    exdays = 1;
  }
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie =
    cname +
    "=" +
    cvalue +
    "; SameSite=None; Secure; domain=" +
    (window.location.hostname === "localhost"
      ? "localhost"
      : "tailormusic.onstep.it") +
    ";" +
    expires +
    ";path=/";
};

const login = async (event) => {
  event.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузка страницы)

  if (!nameField.value || !passwordField.value) {
    notify({
      title: "Please fill in both fields",
      type: "error",
      duration: 1000,
    });
    return;
  }

  try {
    const res = await axios.post(
      "/api/login",
      {
        mail: nameField.value,
        password: passwordField.value,
      },
      {
        withCredentials: true,
      }
    );

    if (res.data.errors) {
      res.data.errors.forEach((error) => {
        notify({
          title: error,
          type: "error",
          duration: 1000,
        });
      });
      return;
    }

    if (res.data.message) {
      notify({
        title: res.data.message,
        type: "success",
        duration: 1000,
      });
    }

    if (res.data.user_token) {
      setCookie("user_token", res.data.user_token, 365);
      setCookie("user_name", res.data.user_name, 365);
      setCookie("user_id", res.data.user_id, 365);

      router.push({ path: "/home" });
    }
  } catch (error) {
    notify({
      title: "Login failed. Please try again.",
      type: "error",
      duration: 1000,
    });
  }
};
</script>

<template>
  <section class="login">
    <img :src="logo" alt="" class="logo" />
    <form class="form" theme="dark" @submit="login">
      <div class="form__wrap">
        <v-window>
          <div>
            <v-text-field
              placeholder="Email address"
              variant="outlined"
              class="input_pas"
              v-model="nameField"
              theme="dark"
            ></v-text-field>

            <v-text-field
              :type="visible ? 'text' : 'password'"
              placeholder="Enter your password"
              variant="outlined"
              class="input_pas"
              v-model="passwordField"
              @click:append-inner="visible = !visible"
              theme="dark"
              append-icon="mdi-eye"
              <!--
              Иконка
              для
              отображения
              пароля
              --
            >
              ></v-text-field
            >

            <v-btn
              class="btn-login"
              size="large"
              variant="outlined"
              block
              type="submit"
              <!--
              Тип
              кнопки
              для
              отправки
              формы
              --
            >
              color="#95fcfc" theme="dark" > Log In
            </v-btn>
          </div>
        </v-window>
      </div>
    </form>
  </section>
</template>

<!-- <script setup>
import { ref } from "vue";

import axios from "axios";
import router from "@/router";
import logo from "@/assets/img/logo.webp";
import { useNotification } from "@kyvg/vue3-notification";
import { useTheme } from "vuetify";
const theme = useTheme();
const { notify } = useNotification();
// const props = defineProps({
//   items: {
//     type: Array,
//   },
// });

// const nameField = ref("alexei.dubrovschii@onstep-lab.com");
// const passwordField = ref("sfgasjgaiohjgva");
const nameField = ref("");
const passwordField = ref("");

const setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  if (exdays === "") {
    exdays = 1;
  }
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie =
    cname +
    "=" +
    cvalue +
    "; SameSite=None; Secure; domain=" +
    (window.location.hostname === "localhost"
      ? "localhost"
      : "tailormusic.onstep.it") +
    ";" +
    expires +
    ";path=/";
};

const login = async () => {
  await axios
    .post(
      "/api/login",
      {
        mail: nameField.value,
        password: passwordField.value,
      },
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      if (res.data.errors) {
        res.data.errors.forEach((error) => {
          notify({
            title: error,
            type: "error",
            duration: 1000,
          });
        });
        return;
      }
      if (res.data.message) {
        notify({
          title: res.data.message,
          type: "success",
          duration: 1000,
        });
      }

      if (res.data.user_token) {
        setCookie("user_token", res.data.user_token, 365);
        setCookie("user_name", res.data.user_name, 365);
        setCookie("user_id", res.data.user_id, 365);

        router.push({ path: "/home" });
      }
    });
};
const visible = ref(false);
</script>
<template>
  <section class="login">
    <img :src="logo" alt="" class="logo" />
    <form class="form" theme="dark">
      <div class="form__wrap">
        <v-window>
          <div>
            <v-text-field
              placeholder="Email address"
              variant="outlined"
              class="input_pas"
              v-model="nameField"
              theme="dark"
            ></v-text-field>

            <v-text-field
              :type="visible ? 'text' : 'password'"
              placeholder="Enter your password"
              variant="outlined"
              class="input_pas"
              @click:append-inner="visible = !visible"
              theme="dark"
            ></v-text-field>
            
            <v-btn
              class="btn-login"
              size="large"
              variant="outlined"
              block
              @click="login"
              color="#95fcfc"
              theme="dark"
            >
              Log In
            </v-btn>
          </div>
        </v-window>
      </div>
    </form>
  </section>
</template>
 -->

<style scoped lang="scss">
.input_pas {
  width: 300px;
}

.login {
  height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #202733;
}
.form {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 25px;
  background: #242b36;
  border: 1px solid #48fdfe;
  border-radius: 8px;
  &__wrap {
    width: 100%;
    height: 100%;
    padding: 50px;
    display: flex;
    flex-flow: column;
    align-items: center;
  }
}

.menu__logo {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 150px;
  width: 100%;
  display: none;
  img {
    display: block;
    margin: 0 auto;
    margin-top: 10px;
  }
}
.form__wrap .v-text-field,
.v-btn {
  margin-bottom: 15px;
}
.logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
  margin-top: 20px;
  margin-bottom: 50px;
  box-shadow: 0px -2px 16px 1px #48fdfe;
  // animation: logo 1.3s ease-in-out forwards;
  animation: logo 3.3s ease-in-out infinite;
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
