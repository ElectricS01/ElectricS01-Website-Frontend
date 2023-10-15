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
            placeholder="Username"
            @keydown.enter="submit"
            class="modal-input"
            id="username"
            v-model="username"
          />
          <div class="text-small">
            <label for="email">Email</label>
          </div>
          <input
            placeholder="Email"
            @keydown.enter="submit"
            class="modal-input"
            id="email"
            v-model="email"
            type="email"
          />
          <div class="text-small">
            <label for="password">Password</label>
          </div>
          <input
            placeholder="Password"
            @keydown.enter="submit"
            class="modal-input"
            id="password"
            v-model="password"
            type="password"
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
import router from "@/router"
import axios from "axios"
import { useDataStore } from "@/stores/main"

let username = ""
let email = ""
let password = ""

const store = useDataStore()

document.getElementById("favicon").href = "/icons/favicon.ico"

const submit = () => {
  store.error = ""
  axios
    .post("/api/register", {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim()
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
