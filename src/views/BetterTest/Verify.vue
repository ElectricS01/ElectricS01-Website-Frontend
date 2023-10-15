<template>
  <div class="container">
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <p>Verify your account</p>
          <button style="margin-top: 12px" @click="submit">Verify</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { useDataStore } from "@/stores/main"
import axios from "axios"
import router from "@/router"

const route = useRoute()
const store = useDataStore()

document.getElementById("favicon").href = "/icons/favicon.ico"

const submit = () => {
  store.error = ""
  axios
    .post("/api/verify", {
      token: route.query.token
    })
    .then(() => {
      store.getUser()
      router.push("/chat")
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
</script>
