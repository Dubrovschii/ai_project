import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Notifications from '@kyvg/vue3-notification'
const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives
})
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(Notifications)

app.mount('#app')
