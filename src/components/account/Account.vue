<template>
  <Modal :is-active="changeUsernameOpen" @close="changeUsernameOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Change Username</p>
      <div class="text-small">
        <label for="username">Username</label>
      </div>
      <input
        id="username"
        v-model="newUsername"
        placeholder="Username"
        class="modal-input"
        autocomplete="off"
        @keydown.enter="updateUsername"
      />
      <div class="text-small">
        <label for="password">Password</label>
      </div>
      <input
        id="password"
        v-model="password"
        placeholder="Password"
        class="modal-input"
        autocomplete="off"
        type="password"
        @keydown.enter="updateUsername"
      />
      <div class="settings-button-container">
        <button @click="changeUsernameOpen = false">Cancel</button>
        <button @click="updateUsername">Save</button>
      </div>
    </div>
  </Modal>
  <h2 class="settings-text">Account</h2>
  Change your account settings
  <div class="settings-spacer" />
  <div class="settings-button-red" @click="logout">Logout</div>
  <div class="settings-spacer" />
  Username: {{ store.userData.username }}
  <div class="settings-button" @click="showChangeUsername()">
    Change Username
  </div>
  <div class="settings-spacer" />
  Email address: {{ store.userData.email }}
  <div class="settings-button" @click="showChangeEmail()">
    Change Email Address
  </div>
  <div class="settings-spacer" />
  Email verified: {{ store.userData.emailVerified }}
  <div
    v-if="!store.userData.emailVerified"
    class="settings-button"
    @click="resendVerification()"
  >
    Resend Verification Email
  </div>
  <div class="settings-spacer" />
  Password
  <div class="settings-button" @click="showChangePassword()">
    Change Password
  </div>
  <div class="settings-spacer" />
  Account creation date: {{ dayjsLong(store.userData.createdAt) }}
  <div class="settings-spacer" />
  Account ID: {{ store.userData.id }}
  <div class="settings-spacer" />
  <div class="settings-button-red" @click="showCloseAccount()">
    Close account
  </div>
</template>

<script setup lang="ts">
import Modal from "../core/Modal.vue"

import { onLogout } from "@/helpers/settings"
import { useDataStore } from "@/store"
import { ref } from "vue"
import axios from "axios"
import { dayjsLong } from "@/helpers/dates"

const store = useDataStore()

const changeUsernameOpen = ref(false)
const newUsername = ref("")
const password = ref("")

const logout = async () => {
  try {
    await axios.post("/api/logout")
    onLogout()
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 401) {
      onLogout()
      return
    }

    store.handleAxiosError(e)
  }
}

const resendVerification = async () => {
  try {
    await axios.post("/api/resend-verification")
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const showChangeUsername = () => {
  changeUsernameOpen.value = true
  newUsername.value = store.userData.username ?? ""
  password.value = ""
}

const updateUsername = () => {
  if (!newUsername.value) {
    store.handleError("Username cannot be empty", 2500)
    return
  }
  if (!password.value) {
    store.handleError("Password is required", 2500)
    return
  }
  axios
    .patch("/api/edit-username", {
      password: password.value,
      username: newUsername.value
    })
    .then((res) => {
      store.userData.username = res.data.username
      changeUsernameOpen.value = false
      newUsername.value = ""
      password.value = ""
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const showChangeEmail = () => {
  console.log("Unavailable")
  store.handleError("Unavailable, please contact support")
}

const showChangePassword = () => {
  console.log("Unavailable")
  store.handleError("Unavailable, please contact support")
}

const showCloseAccount = () => {
  console.log("Unavailable")
  store.handleError("Unavailable, please contact support")
}
</script>
