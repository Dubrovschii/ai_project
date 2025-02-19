<script setup>
import logo from "@/assets/img/logo.webp";
import sidemenu from "@/components/sidemenu.vue";
import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
import promo from "@/components/promo.vue";
import { ref, watch, onMounted } from "vue";
import { useApiStore } from "@/stores/apiStore";
const apiStore = useApiStore();

const { notify } = useNotification();

const save = ref("");
const titlePage = ref("");
const linkList = ref("");
const linkStatistic = ref("");
const linkAi = ref("");
const linkChat = ref("");
const linkRewiew = ref("");
const linkLang = ref("");
const linkExit = ref("");
const title_sidebar = ref("");
const title_content = ref("");
const content_nofouded = ref("");
const items = ["En", "Ru"];

const usernameName = ref("");
const usernameSurname = ref("");
const usernameEmail = ref("");
const usernameAge = ref("");
const usernameProfession = ref("");
const usernameHobby = ref("");
const usernamePhone = ref("");
const userName = apiStore.getCookie("user_name");
const activeBtn = ref(false);
const infoListShow = ref(false);
const infoStatisticShow = ref(false);
const sdbList = ref(true);
const dialog = ref(false);
const file = ref(null);
const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);
const select = ref(capitalizeFirstLetter(apiStore.currentLang));

const switchLanguage = async () => {
  try {
    const newLang = apiStore.currentLang === "en" ? "ru" : "en";

    apiStore.currentLang = newLang;

    localStorage.setItem("currentLang", newLang);

    await apiStore.loadTranslations(newLang);
  } catch (error) {
    console.error("Ошибка переключения языка:", error);
  }
};
watch(select, async (newLang) => {
  if (newLang !== apiStore.currentLang) {
    await switchLanguage();
  }
});
watch(
  [() => apiStore.contentMyaccount.value, () => apiStore.contentGlobal.value],
  ([newValue, newValueGlobal]) => {
    if (newValue) {
      titlePage.value = newValue.titlePage;
      linkList.value = newValue.linkList;
      linkStatistic.value = newValue.linkStatistic;
      linkAi.value = newValue.linkAi;
      linkChat.value = newValue.linkChat;
      linkRewiew.value = newValue.linkRewiew;
      linkLang.value = newValue.linkLang;
      linkExit.value = newValue.linkExit;
      title_sidebar.value = newValue.title_sidebar;
      title_content.value = newValue.title_content;
      content_nofouded.value = newValue.content_nofouded;
    }

    if (newValueGlobal) {
      save.value = newValueGlobal.save;
    }
  },
  { immediate: true }
);

// onMounted(async () => {
//   await apiStore.loadTranslations(apiStore.currentLang);
// });

async function getUserList() {
  if (userName === "testuser") {
    infoListShow.value = !infoListShow.value;
    activeBtn.value = !activeBtn.value;
    if (infoListShow) {
      infoStatisticShow.value = false;
    }
  }
}
async function getUserStatistic() {
  console.log(userName === "testuser");
  if (userName === "testuser") {
    infoStatisticShow.value = !infoStatisticShow.value;
    activeBtn.value = !activeBtn.value;
    if (infoStatisticShow) {
      infoListShow.value = false;
    }
  }
}
const setActive = (button) => {
  if (button === "list") {
    getUserList();
  } else if (button === "statistic") {
    getUserStatistic();
  }
};

// const onSubmit = async () => {
//   if (file.value) {
//     try {
//       const formData = new FormData();
//       formData.append("file", file.value);

//       const username = userName;

//       const response = await axios.post(`/api/upload/${username}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       apiStore.getAvatarUsers();
//       console.log("File uploaded successfully:", response.data);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   } else {
//     console.log("No file selected");
//   }
// };

const onSubmitInfo = async () => {
  try {
    const formData = new FormData();
    if (file.value) {
      try {
        const formData = new FormData();
        formData.append("file", file.value);

        const username = userName;

        const response = await axios.post(`/api/upload/${username}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        apiStore.getAvatarUsers();
        console.log("File uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    const username = userName;

    // formData.append("file", file.value);
    formData.append("name", usernameName.value);
    formData.append("surname", usernameSurname.value);
    formData.append("email", usernameEmail.value);
    formData.append("age", usernameAge.value);
    formData.append("profession", usernameProfession.value);
    formData.append("hobby", usernameHobby.value);
    formData.append("phone", usernamePhone.value);
    const response = await axios.post(`/api/post-info/${username}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    apiStore.getAvatarUsers();
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const getInfoUsers = async () => {
  const username = userName;
  const formData = new FormData();

  const response = await axios.get(`/api/post-info/${username}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response.data);

  if (response && response.data && response.data.success === true) {
    usernameName.value = response.data.data.name;
    if (usernameName.value === undefined) {
      usernameName.value = "";
    }
    usernameSurname.value = response.data.data.surname;
    usernameEmail.value = response.data.data.email;
    usernameAge.value = response.data.data.age;
    usernameProfession.value = response.data.data.profession;
    usernameHobby.value = response.data.data.hobby;
    usernamePhone.value = response.data.data.phone;
  }
};
getInfoUsers();
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
apiStore.getAvatarUsers();
</script>

<template class="myaccount">
  <img :src="logo" alt="" class="logo" />
  <sidemenu />

  <div class="container">
    <promo :title="titlePage" description="" highlight="" />
    <div class="myaccount__wrap col-sm-12 mt-big">
      <div class="row">
        <div class="col-sm-4 myaccount__sidebar sdb">
          <v-list density="compact" nav v-model="sdbList" class="sdb__list">
            <div class="sdb__head">
              <div class="sdb__username_s">{{ title_sidebar }} :</div>
              <div class="sdb__username">
                {{ userName }}
                <v-btn @click="dialog = true" icon="mdi-cog" class="sdb__btn">
                </v-btn>
              </div>
            </div>
            <v-list-item prepend-icon="mdi-format-list-checkbox">
              <v-btn
                @click="setActive('list')"
                :class="infoListShow ? 'btn-active' : 'static'"
                >{{ linkList }}</v-btn
              >
            </v-list-item>

            <v-list-item prepend-icon="mdi-list-status">
              <v-btn
                @click="setActive('statistic')"
                :class="infoStatisticShow ? 'btn-active' : 'static'"
                >{{ linkStatistic }}</v-btn
              >
            </v-list-item>
            <v-list-item prepend-icon="mdi-forum">
              <v-btn>{{ linkChat }}</v-btn>
            </v-list-item>
            <v-list-item prepend-icon="mdi-forum">
              <v-btn>{{ linkAi }}</v-btn>
            </v-list-item>
            <v-list-item prepend-icon="mdi-forum">
              <v-btn>{{ linkRewiew }}</v-btn>
            </v-list-item>
            <v-list-item prepend-icon="mdi-translate-variant">
              <v-select
                v-model="select"
                :items="items"
                :label="linkLang"
                variant="solo-filled"
                compact
              ></v-select>
            </v-list-item>
            <v-list-item prepend-icon="mdi-logout">
              <v-btn
                value="Logout"
                class="logout"
                @click="apiStore.logout()()"
                >{{ linkExit }}</v-btn
              >
            </v-list-item>
          </v-list>
        </div>
        <div class="col-sm-8 myaccount__content cnt">
          <div class="cnt__start">{{ title_content }}</div>
          <div class="info">
            <div class="info__user" v-if="!infoListShow && !infoStatisticShow">
              <div class="info__name">
                {{ usernameName }}
              </div>
              <div class="info__name">
                {{ usernameSurname }}
              </div>
              <div class="info__name">
                {{ usernameEmail }}
              </div>
              <div class="info__name">
                {{ usernameAge }}
              </div>
              <div class="info__name">
                {{ usernameProfession }}
              </div>
              <div class="info__name">
                {{ usernameHobby }}
              </div>
              <div class="info__name">
                {{ usernamePhone }}
              </div>
            </div>

            <div class="info__list" v-if="infoListShow">
              {{ content_nofouded }}
            </div>
            <div class="info__list" v-if="infoStatisticShow && !infoListShow">
              {{ content_nofouded }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <v-dialog v-model="dialog" width="auto" class="myaccount__model">
    <v-card width="700">
      <v-btn class="ms-auto close_delete-btn" text @click="dialog = false" icon
        ><v-icon>mdi-window-close</v-icon></v-btn
      >

      <div class="myaccount__icons">
        <img
          :src="apiStore.avatarSrc"
          alt="User Avatar"
          id="avatarImage"
          v-if="apiStore.avatarSrc !== ''"
          width="150px"
          height="150px"
        />

        <v-btn
          v-if="apiStore.avatarSrc !== ''"
          @click="deleteAvatar()"
          icon
          aria-label="Delete icons"
          class="close_delete-btn myaccount__icons_delete"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          v-if="apiStore.avatarSrc == ''"
        >
          <path
            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"
          />
        </svg>
      </div>

      <v-form ref="form" @submit.prevent="onSubmitInfo()">
        <v-file-input
          v-model="file"
          label="Аватарка"
          accept=".jpg,.jpeg,.png,.pdf,.webp"
          outlined
        ></v-file-input>
        <v-text-field
          v-model="usernameName"
          label="Имя"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="usernameSurname"
          label="Фамилия"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="usernameEmail"
          label="Email"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="usernameAge"
          label="Возраст"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="usernameProfession"
          label="Профессия"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="usernameHobby"
          label="Увлечение"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="usernamePhone"
          label="Телефон"
          outlined
        ></v-text-field>
        <v-btn type="submit" color="primary">{{ save }}</v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.myaccount {
  &__wrap {
    border: 1px solid #7cfdfe;
    box-shadow: -1px 0px 9px 1px #45c7ff;
  }
  &__icons {
    width: 150px;
    height: 150px;
    display: block;
    margin: 0 auto;
    position: relative;
    &_delete {
      position: absolute !important;
      top: 0;
      right: -15px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    svg {
      fill: #7cfdfe;
    }
  }
  &__model {
    .v-card {
      border: 1px solid #7cfdfe !important;
      box-shadow: -1px 0px 9px 1px #45c7ff !important;
      background: #181818 !important;
      padding: 15px;
    }
    .v-field__field {
      border: 1px solid #7cfdfe !important;
      box-shadow: -1px 0px 9px 1px #45c7ff !important;
      color: #7cfdfe;
      border-radius: 8px;
      margin-top: 10px;
      position: relative;
    }
    .v-form {
      margin-bottom: 20px;
      .v-btn {
        display: block !important;
        margin: 0 auto !important;
      }
    }
    .v-input__prepend {
      display: none;
    }
    .v-field.v-field--appended {
      padding: 0;
    }
    .mdi-close-circle::before {
      color: red;
    }
    .v-field__clearable {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
      width: 35px;
    }
  }
}
.sdb {
  background: #45c7ff;
  &__head {
    display: flex;
    align-items: center;
    position: relative;
    min-height: 45px;
    justify-content: space-between;
    &::before {
      content: "";
      position: absolute;
      display: block;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      margin-top: 20px;
      background: #1d1d1d;
    }
    .mdi-cog {
      font-size: 32px;
      color: #1d1d1d;
      animation: settingbtn 1.5s ease-in infinite;
    }
  }
  &__username {
    font-family: "Open Sans", sans-serif;
    font-weight: 900;
    line-height: 1.2;
    font-size: clamp(18px, 3vw, 32px);
    color: #1d1d1d;
    text-transform: uppercase;
    padding-left: 10px;
    display: flex;
    align-items: center;
    &_s {
      font-family: "Open Sans", sans-serif;
      font-weight: 900;
      font-size: clamp(18px, 3vw, 28px);
      color: #1d1d1d;
      line-height: 1.2;
    }
  }
  &__list {
    background: none !important;
    .v-btn {
      width: 100%;
      .v-btn__content {
        padding: 0 5px;
      }
    }
  }
  &__btn {
    background: none !important;
    box-shadow: none !important;
  }
}
.cnt {
  &__start {
    font-family: "Open Sans", sans-serif;
    font-weight: 900;
    line-height: 1.4;
    font-size: 32px;
    display: flex;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      display: block;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      margin-top: 20px;
      background: #7cfdfe;
    }
  }
}
.btn-active {
  background: rgb(59, 189, 59) !important;
  color: #7cfdfe !important;
}
.info__name {
  color: #7cfdfe;
  font-size: 32px;
  display: block;
  line-height: 34px;
}
@keyframes settingbtn {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  25% {
    opacity: 0.1;
    transform: rotate(90deg);
  }
  50% {
    opacity: 0.2;
    transform: rotate(180deg);
  }
  60% {
    opacity: 0.5;
    transform: rotate(270deg);
  }
  75% {
    opacity: 0.8;
    transform: rotate(360deg);
  }
  100% {
    opacity: 1;
    transform: rotate(360deg);
  }
}

.close_delete-btn {
  width: 25px !important;
  height: 25px !important;
  background: none !important;
  color: red !important;
  display: block;
  border: 1px solid red !important;
}

@media (max-width: 1200px) {
  .sdb__head {
    flex-flow: column;
  }
}
</style>
