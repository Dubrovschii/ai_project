// Импорт Vue и необходимых плагинов
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Состояние приложения
import { createVuetify } from 'vuetify'; // Vuetify
import App from './App.vue'; // Главный компонент приложения
import router from './router'; // Роутер для навигации
import * as components from 'vuetify/components'; // Все компоненты Vuetify
import * as directives from 'vuetify/directives'; // Все директивы Vuetify
import Notifications from '@kyvg/vue3-notification'; // Плагин для уведомлений

// Создание экземпляра приложения
const app = createApp(App);

// Создание экземпляра Vuetify с подключением компонентов и директив
const vuetify = createVuetify({
    components,
    directives,
});

// Подключение Vuetify, Pinia, роутера и уведомлений
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(Notifications);

// Монтирование приложения
app.mount('#app');



// "scripts": {
//     "dev": "vite",
//     "build": "vite build",
//     "preview": "vite preview"
//   },