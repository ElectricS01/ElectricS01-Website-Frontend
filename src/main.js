import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import axios from "axios"
import VueAxios from "vue-axios"
import { useDataStore } from "@/stores/loggedIn"
import MarkdownIt from "markdown-it"

const md = new MarkdownIt({ linkify: true })

const pinia = createPinia()
const app = createApp(App).use(router)
app.directive("markdown", {
  mounted(el) {
    el.innerHTML = md.render(el.innerHTML)
  }
})
app.use(VueAxios, axios)
app.use(pinia)
app.config.globalProperties.$loggedIn = useDataStore()
app.mount("#app")
