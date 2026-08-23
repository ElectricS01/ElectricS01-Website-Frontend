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
          autocomplete="username webauthn"
          autofocus
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

<script setup lang="ts">
import { useDataStore } from "@/store"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"
import {
  startAuthentication,
  WebAuthnAbortService
} from "@simplewebauthn/browser"
import { onMounted, onUnmounted } from "vue"
import { decryptPrivateKey, importPublicKey } from "@/helpers/encryption"
import { loadPrivateKey, savePrivateKey } from "@/helpers/indexedDb"
import { LoginData } from "@/types/user"

const store = useDataStore()
const route = useRoute()
const router = useRouter()

let username = ""
let password = ""
let totp = ""

const handleLoginSuccess = async (
  data: LoginData,
  privateKey: CryptoKey | undefined
) => {
  localStorage.setItem("token", data.token)
  store.openWebSocket()
  Object.assign(axios.defaults, {
    headers: { Authorization: data.token }
  })
  store.userData = store.handleUser(data)

  store.userData.publicKey = await importPublicKey(data.publicKey)
  if (privateKey) store.userData.privateKey = privateKey

  const redirect = route.query.redirect

  router.push(typeof redirect === "string" ? redirect : "/chat")
}

const submit = () => {
  store.errorFalse()
  axios
    .post("/api/login", {
      password: password.trim(),
      token: totp,
      userAgent: navigator.userAgent,
      username: username.toLowerCase().trim()
    })
    .then(async (res) => {
      let privateKey = await loadPrivateKey(res.data.id)
      if (!privateKey && res.data.savePrivateKey && res.data.privateKey) {
        privateKey = await decryptPrivateKey(
          res.data.privateKey,
          password.trim()
        )
        await savePrivateKey(privateKey, res.data.id)
      }
      await handleLoginSuccess(res.data, privateKey)
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

axios.get("/api/passkey-challenge").then((challengeResponse) => {
  startAuthentication({
    optionsJSON: challengeResponse.data.options,
    useBrowserAutofill: true
  }).then((result) => {
    axios
      .post("/api/verify-passkey", {
        ...result,
        challengeId: challengeResponse.data.challengeId,
        userAgent: navigator.userAgent
      })
      .then(async (verificationResponse) => {
        if (verificationResponse.data.verified) {
          const privateKey = await loadPrivateKey(verificationResponse.data.id)
          await handleLoginSuccess(verificationResponse.data, privateKey)
        }
      })
  })
})

onMounted(() => {
  const usernameInput = document.getElementById("username")
  usernameInput?.focus()
})

onUnmounted(() => {
  WebAuthnAbortService.cancelCeremony()
})
</script>
