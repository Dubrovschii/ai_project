<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "@/router";
import logo from "@/assets/img/logo.webp";
import { useNotification } from "@kyvg/vue3-notification";
import EarthAnimation from "@/components/EarthAnimation.vue";
import { useApiStore } from "@/stores/apiStore";
const apiStore = useApiStore();
const user = ref("");
const password = ref("");
const visible = ref(false);
const { notify } = useNotification();
const loading = ref(false);

const logoUrl = logo;

const login = async () => {
  loading.value = true;
  if (!user.value || !password.value) {
    notify({ type: "error", text: "Enter your login and Enter your password" });
    loading.value = false;
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
        text: "Logged in successfully!",
        type: "success",
      });
      loading.value = false;

      apiStore.setCookie("user_token", response.data.token, 365);
      apiStore.setCookie("user_name", user.value, 365);
      apiStore.setCookie("user_id", response.data.user_id, 365);
      apiStore.avatarSrc = user.value;
      apiStore.getAvatarUsers();

      router.push("/home");
    } else {
      notify({
        title: "Error",
        text: response.data.message || "Invalid credentials. Please try again.",
        type: "error",
      });
      loading.value = false;
    }
  } catch (error) {
    // if{error}{
    notify({
      title: `Error`,
      text: error.response.data.message || "Server error occurred.",
      type: "error",
    });
    loading.value = false;
    // }
  }
};
const clickTest = async () => {
  user.value = "testuser";
  password.value = "password123";
  login();
};
const userName = apiStore.getCookie("user_name");

const getAvatarUsers = async () => {
  try {
    const username = userName;
    const response = await axios.get(`/api/avatar/${username}`, {
      responseType: "blob",
    });
    console.log(apiStore.avatarSrc);
    if (response && response.data && response.data.size !== 0) {
      const imageUrlFromServer = URL.createObjectURL(response.data);
      apiStore.avatarSrc = imageUrlFromServer;
    }
  } catch (error) {
    console.error("Error retrieving avatar:", error);
  }
};
</script>

<template class="login">
  <div class="container">
    <EarthAnimation />
    <img :src="logoUrl" alt="Logo" class="logo" />
    <div class="col-sm-12">
      <div class="row">
        <form class="form col-sm-12" theme="dark">
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
                  :loading="loading"
                >
                  Log In
                </v-btn>
                <div class="login__test">
                  Do you want test app ?Click down
                  <v-btn
                    theme="dark"
                    color="#95fcfc"
                    variant="outlined"
                    @click="clickTest"
                    >Click for test</v-btn
                  >
                </div>
              </div>
            </v-window>
          </div>
        </form>
      </div>
    </div>
  </div>
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
  &__test {
    display: flex;
    flex-flow: column;
    text-align: center;
  }
}

.form {
  max-width: 600px;
  width: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translate(-50%);
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
@media (max-width: 1600px) {
  .logo {
    width: 100px;
    height: 100px;
    top: 10px;
  }
}
@media (max-width: 768px) {
  .form {
    max-width: calc(100% - 40px);
    &__wrap {
      padding: 25px 0;
    }
  }
}
@media (max-width: 578px) {
  .form {
    max-width: calc(100% - 15px);
    &__wrap {
      .input_pas {
        width: 220px;
      }
    }
  }
}
</style>
