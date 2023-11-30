<template>
  <div class="container">
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <div v-if="success">An email has been sent to {{ email }}</div>
          <div v-else>
            <p class="message-text-large">Reset Password</p>
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
              <router-link class="text-small" to="/login">
                Back to Login
              </router-link>
            </div>
            <button @click="submit">Enter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "@/stores/main"
import axios from "axios"

let email = ""
let success = false

const store = useDataStore()

document.getElementById("favicon").href = "/icons/favicon.ico"

const submit = () => {
  store.error = ""
  axios
    .post("/api/reset-password", {
      email: email.toLowerCase().trim()
    })
    .then(() => {
      success = true
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
</script>
