<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";
import { useApiStore } from "@/stores/apiStore";

const apiStore = useApiStore();
const socket = io("http://localhost:5003", { withCredentials: true });

const userName = apiStore.getCookie("user_name");

const users = ref([]);
const selectedUser = ref("");
const messages = ref([]);
const message = ref("");
const usersOnline = ref([]);
const usersAll = ref([]);
function itemProps(item) {
  return {
    title: item.text,
    subtitle: item.value,
  };
}

// Подключаемся к серверу
onMounted(() => {
  socket.connect();
  socket.emit("user connected", userName);

  // Получаем список пользователей
  // socket.on("users list", (userList) => {
  //   users.value = userList.filter((user) => user.name !== userName); // Исключаем себя
  // });
  // socket.on("users list", (userList) => {
  //   usersAll.value = userList.filter((user) => user.name !== userName); // Все пользователи (кроме себя)
  //   usersOnline.value = usersAll.value.filter((user) => user.online); // Только онлайн пользователи
  //   console.log(usersAll);
  // });
  socket.on("users list", (userList) => {
    console.log("Получен список пользователей:", userList);
    usersAll.value = userList.filter((user) => user.name !== userName);
    console.log("Обновленный usersAll:", usersAll.value);
  });
  // Получаем личные сообщения
  socket.on("private message", (data) => {
    if (data.to === userName || data.from === userName) {
      messages.value.push(data);
    }
  });
});

// Отключаем сокеты при размонтировании компонента
onBeforeUnmount(() => {
  socket.off("users list");
  socket.off("private message");
});

// Отправка сообщения
function sendMessage() {
  if (message.value.trim() !== "" && selectedUser.value) {
    const newMessage = {
      from: userName,
      to: selectedUser.value,
      message: message.value,
    };

    socket.emit("private message", newMessage);
    messages.value.push(newMessage);
    message.value = "";
  }
}
</script>

<template>
  <div>
    <h2 class="chat__title">Чат</h2>

    <!-- Список пользователей -->
    <div class="chat__choice">
      <v-select
        v-model="selectedUser"
        :items="usersOnline"
        item-title="name"
        item-value="name"
        label="Online собеседник"
        :item-props="(user) => ({ class: user.online ? 'online' : 'offline' })"
        variant="outlined"
      ></v-select>

      <v-select
        v-model="selectedUser"
        :items="usersAll"
        item-title="name"
        item-value="name"
        label="Все собеседники"
        :item-props="(user) => ({ class: user.online ? 'online' : 'offline' })"
        variant="outlined"
      ></v-select>

      <!-- <v-select
        v-model="selectedUser"
        :items="users"
        item-title="name"
        item-value="name"
        label="Online coбеседник"
        :item-props="(user) => ({ class: user.online ? 'online' : 'offline' })"
        variant="outlined"
      ></v-select>
      <v-select
        v-model="selectedUser"
        :items="users"
        item-title="name"
        item-value="name"
        label="Все собеседника"
        :item-props="(user) => ({ class: user.online ? 'online' : 'offline' })"
        variant="outlined"
      ></v-select> -->
    </div>

    <!-- <ul>
      <li
        v-for="user in users"
        :key="user.name"
        @click="selectedUser = user.name"
        :class="{ online: user.online, offline: !user.online }"
      >
        {{ user.name }} <span v-if="user.online">(онлайн)</span>
        <span v-else>(оффлайн)</span>
      </li>
    </ul> -->

    <div v-if="selectedUser" class="chat__wrap">
      <h3>Чат с {{ selectedUser }}</h3>
      <div class="chat__message">
        <div
          v-for="msg in messages"
          :key="msg.message"
          :class="msg.from === userName ? 'chat__author' : 'chat__from'"
        >
          <div
            :class="
              msg.from === userName ? 'chat__mymessage' : 'chat__frmessage'
            "
            v-if="msg.from === userName"
          >
            <b>{{ msg.from }}:</b> {{ msg.message }}
          </div>
          <div
            :class="
              msg.from === userName ? 'chat__mymessage' : 'chat__frmessage'
            "
            v-if="msg.from !== userName"
          >
            <b>{{ msg.from }}:</b> {{ msg.message }}
          </div>
        </div>
      </div>

      <v-text-field
        v-model="message"
        variant="outlined"
        placeholder="Ваше сообщение"
        @keyup.enter="sendMessage"
      ></v-text-field>
      <v-btn
        @click="sendMessage"
        variant="plain"
        color="primary"
        :disabled="!selectedUser"
        >Отправить</v-btn
      >
    </div>
  </div>
</template>

<style lang="scss">
.online {
  color: green;
}
.offline {
  color: gray;
}
.chat {
  &__title {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  &__list {
    background: transparent !important;
    margin-top: 15px;
  }
  &__choice {
    display: flex;
    gap: 25px;
  }
  &__item {
    padding: 0 !important;
    .v-select {
      padding-top: 10px;
    }
  }
  &__message {
    position: relative;
  }
  &__from {
    display: flex;
    justify-content: flex-end;
  }
  &__mymessage {
    border: 1px solid rgb(59, 189, 59);
    min-height: 45px;
    padding: 5px 10px;
    display: flex;
    width: fit-content;
    align-items: center;
    border-radius: 8px;
    margin-bottom: 10px;

    b {
      margin-right: 5px;
    }
  }
  &__frmessage {
    border: 1px solid rgb(59, 189, 59);
    min-height: 45px;
    padding: 5px 10px;
    display: flex;
    width: fit-content;
    align-items: center;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: end;
  }
}
</style>

<!-- <v-list density="compact" class="chat__list" theme="dark"> -->
<!-- <v-list-item class="chat__item">
      <v-select
        v-model="select"
        :items="items"
        :item-props="itemProps"
        @change="handleConnection"
        variant="outlined"
        theme="dark"
      ></v-select>
    </v-list-item>
  </v-list>

  <v-text-field
    v-model="from"
    variant="outlined"
    :placeholder="userName"
  ></v-text-field> -->

<!-- <script>
socket.on("disconnect", async () => {
         const disconnectedUser = Object.keys(users).find((key) => users[key] === socket.id);
         if (disconnectedUser) {
             delete users[disconnectedUser];

             await User.findOneAndUpdate({ name: disconnectedUser }, { online: false });

             console.log(${ disconnectedUser } отключился.Онлайн:, Object.keys(users));
             updateUserList();
         }
     });
         async function updateUserList() {
             const dbUsers = await User.find();
             const userList = dbUsers.map((user) => ({
                 name: user.username,
                 online: user.online
             }));

             console.log("Обновленный список пользователей:", userList);
             io.emit("users list", userList);
         }
</script> -->
