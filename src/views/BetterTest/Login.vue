<template>
  <div class="container">
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <p class="message-text-large">Login</p>
          <div class="text-small">
            <label class="text-small" for="username">Username</label>
          </div>
          <input
            placeholder="Username"
            @keydown.enter="submit"
            class="modal-input"
            v-model="username"
            id="username"
          />
          <div class="text-small">
            <label for="password">Password</label>
          </div>
          <input
            placeholder="Password"
            @keydown.enter="submit"
            class="modal-input"
            v-model="password"
            id="password"
            type="password"
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
  </div>
</template>

<script setup>
import { useDataStore } from "@/stores/main"
import axios from "axios"
import router from "@/router"

const store = useDataStore()

let username = ""
let password = ""

document.getElementById("favicon").href = "/icons/favicon.ico"

const submit = () => {
  store.error = ""
  axios
    .post("/api/login", {
      username: username.toLowerCase().trim(),
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
