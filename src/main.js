import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import axios from "axios"
import VueAxios from "vue-axios"
import { useDataStore } from "@/stores/loggedIn"

const pinia = createPinia()
const app = createApp(App).use(router)
app.use(VueAxios, axios)
app.use(pinia)
app.config.globalProperties.$loggedIn = useDataStore()
app.mount("#app")
