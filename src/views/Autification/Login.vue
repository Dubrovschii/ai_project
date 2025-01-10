<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "@/router";
import logo from "@/assets/img/logo.webp";
import { useTheme } from "vuetify";
import { useNotification } from "@kyvg/vue3-notification";
const user = ref("");
const password = ref("");
const visible = ref(false);

const { notify } = useNotification();

notify({
  title: "Authorization",
  text: "You need have been logged in!",
});
const logoUrl = logo;

const login = async () => {
  if (!user.value || !password.value) {
    notify({ type: "error", text: "Enter your login and Enter your password" });
    return;
  }
  try {
    const response = await axios.post("/api/login", {
      username: user.value,
      password: password.value,
    });

    if (response.status === 200 && response.data.success) {
      notify({
        title: "Success 🎉 ",
        message: "Logged in successfully!",
        type: "success",
      });

      setCookie("user_token", response.data.token, 365);
      setCookie("user_name", user.value, 365);
      setCookie("user_id", response.data.user_id, 365);

      router.push("/home");
    } else {
      notify({
        title: "Error",
        message:
          response.data.message || "Invalid credentials. Please try again.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);

    if (error.response) {
      // Сервер ответил с ошибкой
      notify({
        title: "Error",
        message: error.response.data.message || "Server error occurred.",
        type: "error",
      });
    } else if (error.request) {
      // Сервер не ответил
      notify({
        title: "Error",
        message: "No response from the server. Please check your connection.",
        type: "error",
      });
    } else {
      // Что-то ещё пошло не так
      notify({
        title: "Error",
        message: "An unknown error occurred. Please try again later.",
        type: "error",
      });
    }
  }

  // try {
  //   const response = await axios.post("/api/login", {
  //     username: user.value,
  //     password: password.value,
  //   });

  //   // Обработка успешного ответа
  //   if (response.status === 200 && response.data.success) {
  //     notify({
  //       title: "Success 🎉",
  //       message: "Logged in successfully!",
  //       type: "success",
  //     });

  //     // Установка cookies (сервер должен устанавливать HttpOnly для безопасности)
  //     setCookie("user_token", response.data.token, 365);
  //     setCookie("user_name", user.value, 365); // Используем введённое имя пользователя
  //     setCookie("user_id", response.data.user_id, 365); // Убедитесь, что сервер возвращает `user_id`

  //     // Перенаправление на домашнюю страницу
  //     router.push("/home");
  //   } else {
  //     console.log(response);
  //   }

  //   //  else {
  //   //   notify({
  //   //     title: "Error",
  //   //     message:
  //   //       response.data.message || "Invalid credentials. Please try again.",
  //   //     type: "error",
  //   //   });
  //   // }
  // } catch (error) {
  //   console.log(21441, error);

  //   if (error.response) {
  //     notify({
  //       title: error.response.data.message,
  //       message: error.response.data.message,
  //       type: "error",
  //     });
  //   }
  //   // else if (error.request) {
  //   //   console.error(error.request);
  //   //   notify({
  //   //     title: "Error",
  //   //     message: "No response from server. Please check your connection.",
  //   //     type: "error",
  //   //   });
  //   // } else {
  //   //   console.error("Error", error.message);
  //   //   notify({
  //   //     title: "Error",
  //   //     message: "Something went wrong. Please try again.",
  //   //     type: "error",
  //   //   });
  //   // }
  // }
};

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // Cookies устанавливаются только с флагом Secure и SameSite=Strict
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`;
};
</script>

<template>
  <section class="login">
    <img :src="logoUrl" alt="Logo" class="logo" />
    <form class="form" theme="dark">
      <div class="form__wrap">
        <v-window>
          <div>
            <v-text-field
              placeholder="Login"
              variant="outlined"
              class="input_pas"
              v-model="user"
              theme="dark"
            ></v-text-field>

            <v-text-field
              :type="visible ? 'text' : 'password'"
              placeholder="Enter your password"
              variant="outlined"
              class="input_pas"
              v-model="password"
              @click:append-inner="visible = !visible"
              theme="dark"
              autocomplete="current-password"
            ></v-text-field>
            <v-btn
              class="btn-login"
              size="large"
              variant="outlined"
              block
              :disabled="!user || !password"
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
}

.form__wrap {
  width: 100%;
  height: 100%;
  padding: 50px;
  display: flex;
  flex-flow: column;
  align-items: center;
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
  animation: logo 3.3s ease-in-out infinite;
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
</style>
