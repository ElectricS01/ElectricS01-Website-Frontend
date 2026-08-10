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

<script setup lang="ts">
import axios from "axios"
import { useDataStore } from "@/store"
import { useRouter } from "vue-router"
import { onMounted } from "vue"
import { savePrivateKey } from "@/helpers/indexedDb"
import {
  encryptPrivateKey,
  generateKeyPair,
  stringifyPrivateKey,
  stringifyPublicKey
} from "@/helpers/encryption"

let username = ""
let email = ""
let password = ""
let creating = false

const store = useDataStore()
const router = useRouter()

const submit = async () => {
  if (!username) {
    store.handleError("Username is required", 2500)
    return
  }

  if (!email) {
    store.handleError("Email is required", 2500)
    return
  }

  if (!password) {
    store.handleError("Password is required", 2500)
    return
  }

  if (creating) return
  creating = true

  try {
    const keyPair = await generateKeyPair()

    const publicKeyString = await stringifyPublicKey(keyPair.publicKey)
    const privateKeyString = await stringifyPrivateKey(keyPair.privateKey)

    const encryptedPrivateKey = await encryptPrivateKey(
      privateKeyString,
      password.trim()
    )

    console.log(encryptedPrivateKey)

    store.errorFalse()

    const res = await axios.post("/api/register", {
      email: email.toLowerCase().trim(),
      password: password.trim(),
      privateKey: encryptedPrivateKey,
      publicKey: publicKeyString,
      savePrivateKey: true,
      userAgent: navigator.userAgent,
      username: username.trim()
    })

    localStorage.setItem("token", res.data.token)
    store.openWebSocket()
    Object.assign(axios.defaults, {
      headers: { Authorization: res.data.token }
    })
    store.handleUser(res.data)
    await savePrivateKey(keyPair.privateKey, store.userData.id)

    store.userData.publicKey = keyPair.publicKey
    store.userData.privateKey = keyPair.privateKey

    console.log(store.userData.publicKey)
    console.log(store.userData.privateKey)

    router.push("/chat")
  } catch (e) {
    creating = false
    store.handleAxiosError(e)
  }
}

onMounted(() => {
  const usernameInput = document.getElementById("username")
  usernameInput?.focus()
})
</script>
