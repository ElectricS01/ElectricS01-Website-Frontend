<template>
  <div class="container">
    <div class="grid-menu">
      <div class="chat-menu">
        <p class="message-text-large">Login</p>
        <div class="text-small">
          <label class="text-small" for="username">Username</label>
        </div>
        <input
          id="username"
          v-model="username"
          placeholder="Username"
          class="modal-input"
          @keydown.enter="submit"
        />
        <div class="text-small">
          <label for="password">Password</label>
        </div>
        <input
          id="password"
          v-model="password"
          placeholder="Password"
          class="modal-input"
          type="password"
          @keydown.enter="submit"
        />
        <div class="text-small">
          <label for="password">2FA Code</label>
        </div>
        <input
          id="totp"
          v-model="totp"
          placeholder="2FA Code"
          class="modal-input"
          type="token"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          @keydown.enter="submit"
        />
        <div style="display: flex; justify-content: space-between">
          <div class="text-small">
            <router-link class="text-small" to="/reset">
              Forgot Password?
            </router-link>
          </div>
          <div class="text-small">
            <router-link class="text-small" to="/register">
              Register?
            </router-link>
          </div>
        </div>
        <button @click="submit">Enter</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "@/stores/main"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"

const store = useDataStore()
const route = useRoute()
const router = useRouter()

let username = ""
let password = ""
let totp = ""

document.getElementById("favicon").href = "/icons/favicon.ico"

const submit = () => {
  store.error = ""
  axios
    .post("/api/login", {
      password: password.trim(),
      token: totp,
      userAgent: navigator.userAgent,
      username: username.toLowerCase().trim()
    })
    .then((res) => {
      localStorage.setItem("token", res.data.token)
      store.ws.send(JSON.stringify({ token: localStorage.getItem("token") }))
      console.log("Socket connected")
      Object.assign(axios.defaults, {
        headers: { Authorization: res.data.token }
      })
      store.userData = res.data
      if (!store.userData.saveSwitcher) {
        store.userData.switcherHistory =
          JSON.parse(localStorage.getItem("switcherHistory")) || []
      }
      store.sortSwitcher()
      if (store.userData.chatsList) {
        store.switcherItems.push(
          ...store.userData.chatsList.map((obj) => [
            obj.type === 1 && obj.ownerDetails.id !== store.userData.id
              ? obj.ownerDetails.username
              : obj.name,
            obj.id
          ])
        )
        store.loadingChats = false
        store.chatSort()
      }
      router.push(route.query.redirect || "/chat")
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
</script>
