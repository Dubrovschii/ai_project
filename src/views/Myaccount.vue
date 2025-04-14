<script setup>
import { ref, watch, onMounted } from "vue";
import logo from "@/assets/img/logo.webp";
import sidemenu from "@/components/sidemenu.vue";
import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
import promo from "@/components/promo.vue";
import chat from "@/components/chat.vue";
import modals from "@/components/modals.vue";
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

const chatContent = ref(false);
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
const file = ref(null);

const firstname = ref("");
const surname = ref("");
const avatar = ref("");
const email = ref("");
const age = ref("");
const profession = ref("");
const hobby = ref("");
const phone = ref("");

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);
const select = ref(capitalizeFirstLetter(apiStore.currentLang));

async function switchLanguage() {
  try {
    const newLang = apiStore.currentLang === "en" ? "ru" : "en";
    apiStore.currentLang = newLang;
    localStorage.setItem("currentLang", newLang);
    await apiStore.loadTranslations(newLang);
  } catch (error) {
    console.error("Ошибка переключения языка:", error);
  }
}

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

async function toggleState(target) {
  if (userName !== "") {
    target.value = !target.value;
    activeBtn.value = !activeBtn.value;

    if (target !== infoListShow) infoListShow.value = false;
    if (target !== infoStatisticShow) infoStatisticShow.value = false;
    if (target !== chatContent) chatContent.value = false;
  }
}
async function getUserList() {
  await toggleState(infoListShow);
}

async function getUserStatistic() {
  await toggleState(infoStatisticShow);
}

async function getUserChat() {
  await toggleState(chatContent);
}

const setActive = (button) => {
  if (button === "list") {
    getUserList();
  } else if (button === "statistic") {
    getUserStatistic();
  } else if (button === "chat") {
    getUserChat();
  }
};

apiStore.getInfoUsers();
// apiStore.getAvatarUsers();
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
                <v-btn
                  @click="apiStore.dialog = true"
                  icon="mdi-cog"
                  class="sdb__btn"
                >
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
              <v-btn
                @click="setActive('chat')"
                :class="chatContent ? 'btn-active' : 'static'"
                >{{ linkChat }}</v-btn
              >
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
            <div
              class="info__user"
              v-if="!infoListShow && !infoStatisticShow && !chatContent"
            >
              <div class="info__name">
                {{ firstname }}:
                <v-skeleton-loader
                  v-if="!apiStore.usernameName"
                  type="text"
                  theme="dark"
                ></v-skeleton-loader>

                <v-list-item v-else rounded>
                  {{ apiStore.usernameName }}
                </v-list-item>
              </div>
              <div class="info__name">
                {{ surname }}:
                <v-skeleton-loader
                  v-if="!apiStore.usernameSurname"
                  type="text"
                  theme="dark"
                ></v-skeleton-loader>

                <v-list-item v-else rounded>
                  {{ apiStore.usernameSurname }}
                </v-list-item>
              </div>
              <div class="info__name">
                {{ email }} :
                <v-skeleton-loader
                  v-if="!apiStore.usernameEmail"
                  type="text"
                  theme="dark"
                ></v-skeleton-loader>

                <v-list-item v-else rounded>
                  {{ apiStore.usernameEmail }}
                </v-list-item>
              </div>
              <div class="info__name">
                {{ age }}:
                <v-skeleton-loader
                  v-if="!apiStore.usernameAge"
                  type="text"
                  theme="dark"
                ></v-skeleton-loader>

                <v-list-item v-else rounded>
                  {{ apiStore.usernameAge }}
                </v-list-item>
              </div>
              <div class="info__name">
                {{ profession }}:
                <v-skeleton-loader
                  v-if="!apiStore.usernameProfession"
                  type="text"
                  theme="dark"
                ></v-skeleton-loader>

                <v-list-item v-else rounded>
                  {{ apiStore.usernameProfession }}
                </v-list-item>
              </div>
              <div class="info__name">
                {{ hobby }}:
                <v-skeleton-loader
                  v-if="!apiStore.usernameHobby"
                  type="text"
                  theme="dark"
                ></v-skeleton-loader>

                <v-list-item v-else rounded>
                  {{ apiStore.usernameHobby }}
                </v-list-item>
              </div>
              <div class="info__name">
                {{ phone }} :
                <v-skeleton-loader
                  v-if="!apiStore.usernamePhone"
                  type="text"
                  theme="dark"
                ></v-skeleton-loader>

                <v-list-item v-else rounded>
                  {{ apiStore.usernamePhone }}
                </v-list-item>
              </div>
            </div>

            <div class="info__list" v-if="infoListShow">
              {{ content_nofouded }}
            </div>
            <div class="info__list" v-if="infoStatisticShow && !infoListShow">
              {{ content_nofouded }}
            </div>
            <chat v-if="chatContent" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <modals />
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
    .v-file-input input[type="file"] {
      color: #7cfdfe;
      .v-field__input {
        padding: 20px 15px;
        padding-bottom: 0;
      }
    }
    .v-file-input {
      .v-label {
        position: absolute !important;
        top: 0 !important;
      }
      .v-field--active {
        .v-label {
          position: absolute !important;
          top: 10px !important;
          font-size: 14px;
        }
      }
    }

    .v-field__input {
      padding: 20px 15px;
      padding-bottom: 0;
    }
    .v-field-label {
      padding: 5px 15px;
      padding-bottom: 0;
    }
    .v-card {
      border: 1px solid #7cfdfe !important;
      box-shadow: -1px 0px 9px 1px #45c7ff !important;
      background: #181818 !important;
      padding: 15px;
    }
    .v-field {
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
.info {
  &__user {
    margin-top: 40px;
  }
  &__name {
    color: #7cfdfe;
    font-size: clamp(20px, 3vw, 30px);
    display: flex;
    align-items: center;
    line-height: 34px;
    .v-skeleton-loader {
      min-width: 100px;
      max-width: 100%;
      width: auto;

      background: transparent;
    }
  }
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
