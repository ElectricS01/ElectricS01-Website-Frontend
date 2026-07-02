<template>
  <div class="container">
    <div class="grid-menu">
      <div class="chat-menu">
        <div class="grid-card">
          <p>Verify your account</p>
          <button style="margin-top: 12px" @click="submit">Verify</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { useDataStore } from "@/store"
import axios from "axios"

const route = useRoute()
const router = useRouter()
const store = useDataStore()

const submit = () => {
  store.errorFalse()
  axios
    .post("/api/verify", {
      token: route.query.token
    })
    .then(() => {
      router.push("/chat")
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
</script>
