<template>
  <div class="container">
    <div class="grid-menu">
      <div class="chat-menu">
        <p class="message-text-large">Register</p>
        <div class="text-small">
          <label for="username">Username</label>
        </div>
        <input
          id="username"
          v-model="username"
          placeholder="Username"
          class="modal-input"
          autofocus
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
</template>

<script setup>
import axios from "axios"
import { useDataStore } from "@/store"
import { useRouter } from "vue-router"
import { onMounted } from "vue"

let username = ""
let email = ""
let password = ""

const store = useDataStore()
const router = useRouter()

document.getElementById("favicon").href = "/icons/favicon.ico"

const submit = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      hash: { name: "SHA-256" },
      modulusLength: 2048,
      name: "RSA-OAEP",
      publicExponent: new Uint8Array([0x01, 0x00, 0x01])
    },
    true,
    ["encrypt", "decrypt"]
  )
  const exportedKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  )
  const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
  await store.savePrivateKey(keyPair.privateKey)
  const privateKey = await store.encryptPrivateKey(
    keyPair.privateKey,
    password.trim()
  )
  store.error = ""
  axios
    .post("/api/register", {
      email: email.toLowerCase().trim(),
      password: password.trim(),
      privateKey,
      publicKey: keyString,
      savePrivateKey: false,
      userAgent: navigator.userAgent,
      username: username.trim()
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
      router.push("/chat")
    })
    .catch((e) => {
      store.error = `Error ${e.request.status}, ${
        e.response.data.message || e.request.statusMessage
      }`
      setTimeout(store.errorFalse, 5000)
    })
}

onMounted(() => {
  const usernameInput = document.getElementById("username")
  usernameInput?.focus()
})
</script>
