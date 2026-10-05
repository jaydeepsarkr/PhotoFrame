import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from './utils/toast'
import './assets/main.css'

const app = createApp(App)

app.config.globalProperties.$toast = toast
app.provide('toast', toast)

app.use(store)
app.use(router)

app.mount('#app')
