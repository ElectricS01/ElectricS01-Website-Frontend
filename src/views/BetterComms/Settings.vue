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
          <div v-if="store.userData?.admin" @click="changePage('admin')">
            Admin
          </div>
          <div @click="changePage('about')">About</div>
          <div @click="changePage('changelog')">Changelog</div>
          <div @click="modalOpen = true">Any feedback?</div>
        </div>
        <div class="settings-page scroll-bar-dark">
          <account v-if="page === 'account'"></account>
          <privacy v-else-if="page === 'privacy'" />
          <Security v-else-if="page === 'security'" />
          <appearance v-else-if="page === 'appearance'" />
          <div v-else-if="page === 'profile'" class="settings-page-container">
            <h2 class="settings-text">Profile</h2>
            Change your profile settings
            <div class="settings-spacer" />
            <div style="display: flex">
              <div style="width: min(500px, 100%)">
                <img
                  :src="
                    store.userData?.banner ||
                    'https://i.electrics01.com/i/d81dabf74c88.png'
                  "
                  width="500"
                  height="100"
                  alt="Profile banner"
                  class="profile-banner"
                />
                <input
                  id="banner"
                  v-model="editBanner"
                  placeholder="Edit your banner"
                  style="
                    margin: 1px;
                    height: fit-content;
                    width: calc(100% - 2px);
                  "
                  autocomplete="off"
                  @keydown.enter="changeProperty('banner', editBanner)"
                />
                <div class="profile-page">
                  <div class="profile-grid">
                    <div class="profile-picture-large">
                      <profile-picture
                        size="80"
                        :avatar="store.userData?.avatar"
                      />
                      <svg class="online-indicator" width="20" height="20">
                        <status-indicator
                          size="8"
                          :status="store.userData?.status"
                        />
                      </svg>
                    </div>
                    <div
                      style="
                        flex: 1 1 auto;
                        word-wrap: break-word;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                      class="message-item"
                    >
                      <h4 style="word-wrap: break-word">
                        {{ store.userData?.username }}
                      </h4>
                      <p
                        v-if="editing !== 'status'"
                        class="message-text-large"
                        style="word-wrap: break-word"
                      >
                        {{ store.userData?.statusMessage }}
                        <icons
                          style="cursor: pointer"
                          size="16"
                          icon="edit"
                          @click="
                            ;((editing = 'status'),
                              (editStatus = store.userData?.statusMessage),
                              editFocus())
                          "
                        />
                      </p>
                      <input
                        v-else
                        id="status"
                        v-model="editStatus"
                        placeholder="Edit your status"
                        style="margin: 1px; width: calc(100% - 2px)"
                        autocomplete="off"
                        @keydown.escape="editing = ''"
                        @keydown.enter="editStatusMessage()"
                      />
                    </div>
                  </div>
                  <input
                    id="avatar"
                    v-model="editAvatar"
                    placeholder="Edit your profile picture"
                    style="margin: 1px; height: fit-content"
                    autocomplete="off"
                    @keydown.enter="changeProperty('avatar', editAvatar)"
                  />
                  <div
                    style="height: 332px; overflow-y: auto"
                    class="scroll-bar"
                  >
                    <div v-if="store.userData?.createdAt">
                      <div class="profile-spacer">
                        <p>Date Created</p>
                        <div />
                      </div>
                      <p class="message-text-large">
                        {{ dayjsDate(store.userData?.createdAt) }}
                      </p>
                    </div>
                    <div>
                      <div class="profile-spacer">
                        <p>Description</p>
                        <div />
                      </div>
                      <p
                        v-if="editing !== 'description'"
                        class="message-text-large"
                        style="word-wrap: break-word; white-space: pre-wrap"
                      >
                        {{
                          store.userData?.description ||
                          `Hi, I'm ${store.userData?.username}!`
                        }}
                        <icons
                          style="cursor: pointer"
                          size="16"
                          icon="edit"
                          @click="
                            ;((editing = 'description'),
                              (editDescription = store.userData?.description),
                              editFocus())
                          "
                        />
                      </p>
                      <textarea
                        v-else
                        id="description"
                        v-model="editDescription"
                        placeholder="Edit your description"
                        style="
                          margin: 1px;
                          width: calc(100% - 2px);
                          resize: none;
                        "
                        autocomplete="off"
                        @keydown.escape="editing = ''"
                        @keydown.enter.exact.prevent="saveDescription()"
                      />
                    </div>
                    <div v-if="store.userData.tetris?.length">
                      <div class="profile-spacer">
                        <p>Tetris Scores</p>
                        <div />
                      </div>
                      <p style="margin-top: 0">
                        Easy mode: {{ store.userData.tetris[0]?.value }} lines
                      </p>
                      <p>
                        Medium mode:
                        {{ store.userData.tetris[1]?.value }} lines
                      </p>
                      <p>
                        Hard mode: {{ store.userData.tetris[2]?.value }} lines
                      </p>
                      <p>
                        God mode: {{ store.userData.tetris[3]?.value }} lines
                      </p>
                      <p style="margin-bottom: 0">
                        Ultra Nightmare mode:
                        {{ store.userData.tetris[4]?.value }} lines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <about v-else-if="page === 'about'" />
          <changelog v-else-if="page === 'changelog'" />
          <admin v-else-if="page === 'admin'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Changelog from "@/components/account/Changelog.vue"
import Modal from "@/components/core/Modal.vue"
import Icons from "@/components/core/Icons.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"
import About from "@/components/account/About.vue"
import Appearance from "@/components/account/Appearance.vue"
import Admin from "@/components/account/Admin.vue"
import Account from "@/components/account/Account.vue"
import Privacy from "@/components/account/Privacy.vue"
import Security from "@/components/account/Security.vue"

import { useDataStore } from "@/store"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"
import { nextTick, ref, watch } from "vue"
import { dayjsDate } from "@/helpers/dates"
import { changeProperty } from "@/helpers/settings"

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

const editing = ref("")

let page = "account"
let feedbackText = ""
let editStatus = ""
let editDescription = ""

let editAvatar = store.userData?.avatar
let editBanner = store.userData?.banner

if (pages.includes(route.params.id)) {
  page = route.params.id
} else {
  if (route.params.id === "feedback") {
    modalOpen.value = true
  }
  router.push("/account/account")
}

const changePage = (newPage) => {
  if (pages.includes(page)) {
    page = newPage
    router.push(`/account/${newPage}`)
  } else {
    page = "account"
    router.push("/account/account")
  }
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

const editStatusMessage = () => {
  if (
    editStatus.trim() === store.userData.statusMessage ||
    editStatus.trim().length > 50
  ) {
    editing.value = ""
  }
  axios
    .patch("/api/edit-status-message", {
      statusMessage: editStatus.trim()
    })
    .then((res) => {
      store.userData.statusMessage = res.data.statusMessage
      editing.value = ""
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const saveDescription = async () => {
  await changeProperty("description", editDescription)
  editing.value = ""
}

const editFocus = () => {
  nextTick(() => {
    const feedback = document.getElementById("feedback")
    if (feedback) {
      feedback?.focus()
    }
  })
}

watch(modalOpen, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    editFocus()
  }
})
watch(
  () => route.params.id,
  () => {
    if (route.params.id) changePage(route.params.id)
  }
)
</script>
