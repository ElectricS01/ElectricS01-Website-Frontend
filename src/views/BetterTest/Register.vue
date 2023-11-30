<template>
  <div class="container">
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <p class="message-text-large">Register</p>
          <div class="text-small">
            <label for="username">Username</label>
          </div>
          <input
            id="username"
            v-model="username"
            placeholder="Username"
            class="modal-input"
            @keydown.enter="submit"
          />
          <div class="text-small">
            <label for="email">Email</label>
          </div>
          <input
            id="email"
            v-model="email"
            placeholder="Email"
            class="modal-input"
            type="email"
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
            <router-link class="text-small" to="/login">
              Back to Login
            </router-link>
          </div>
          <button @click="submit">Enter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { useDataStore } from "@/stores/main"
import { useRouter } from "vue-router"

let username = ""
let email = ""
let password = ""

const store = useDataStore()
const router = useRouter()

document.getElementById("favicon").href = "/icons/favicon.ico"

const submit = () => {
  store.error = ""
  axios
    .post("/api/register", {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
      userAgent: navigator.userAgent
    })
    .then((res) => {
      localStorage.setItem("token", res.data.token)
      Object.assign(axios.defaults, {
        headers: { Authorization: res.data.token }
      })
      store.getUser()
      router.push("/chat")
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
</script>
