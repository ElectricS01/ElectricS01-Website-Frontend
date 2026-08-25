<template>
  <modal :is-active="modalOpen" @close="modalOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Submit feedback</p>
      <input
        id="feedback"
        v-model="feedbackText"
        placeholder="Feedback"
        class="settings-input"
        autocomplete="off"
        @keydown.enter="submitFeedback"
      />
      <div class="settings-button-container">
        <button @click="submitFeedback">Enter</button>
      </div>
      <p class="message-text-medium-gray">
        Your user identification number is recorded for reference
      </p>
    </div>
  </modal>
  <div class="container">
    <div class="grid-menu">
      <div class="settings-menu">
        <div class="settings-sidebar scroll-bar">
          <div @click="changePage('account')">Account</div>
          <div @click="changePage('privacy')">Privacy</div>
          <div @click="changePage('security')">Security</div>
          <div @click="changePage('appearance')">Appearance</div>
          <div @click="changePage('profile')">Profile</div>
          <div v-if="store.userData.admin" @click="changePage('admin')">
            Admin
          </div>
          <div @click="changePage('about')">About</div>
          <div @click="changePage('changelog')">Changelog</div>
          <div @click="showFeedback">Any feedback?</div>
        </div>
        <div class="settings-page scroll-bar-dark">
          <account v-if="page === 'account'"></account>
          <privacy v-else-if="page === 'privacy'" />
          <security v-else-if="page === 'security'" />
          <appearance v-else-if="page === 'appearance'" />
          <profile v-else-if="page === 'profile'" />
          <about v-else-if="page === 'about'" />
          <changelog v-else-if="page === 'changelog'" />
          <admin v-else-if="page === 'admin'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Changelog from "@/components/account/Changelog.vue"
import Modal from "@/components/core/Modal.vue"
import About from "@/components/account/About.vue"
import Appearance from "@/components/account/Appearance.vue"
import Admin from "@/components/account/Admin.vue"
import Account from "@/components/account/Account.vue"
import Privacy from "@/components/account/Privacy.vue"
import Security from "@/components/account/Security.vue"
import Profile from "@/components/account/Profile.vue"

import { useDataStore } from "@/store"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"
import { nextTick, ref, watch } from "vue"

const store = useDataStore()
const route = useRoute()
const router = useRouter()

const pages = [
  "account",
  "privacy",
  "security",
  "appearance",
  "profile",
  "about",
  "changelog",
  "admin"
]

const modalOpen = ref(false)

let page = "account"
let feedbackText = ""

if (typeof route.params.id === "string" && pages.includes(route.params.id)) {
  page = route.params.id
} else {
  if (route.params.id === "feedback") {
    modalOpen.value = true
  }
  router.push("/account/account")
}

const changePage = (newPage: string) => {
  if (pages.includes(page)) {
    page = newPage
    router.push(`/account/${newPage}`)
  } else {
    page = "account"
    router.push("/account/account")
  }
}

const showFeedback = () => {
  modalOpen.value = true
  editFocus()
}

const submitFeedback = () => {
  axios
    .post("/api/feedback", {
      feedback: feedbackText
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
  modalOpen.value = false
  feedbackText = ""
}

const editFocus = () => {
  nextTick(() => {
    const feedback = document.getElementById("feedback")
    if (feedback) {
      feedback?.focus()
    }
  })
}

watch(
  () => route.params.id,
  (id) => {
    if (typeof id === "string") changePage(id)
  }
)
</script>
