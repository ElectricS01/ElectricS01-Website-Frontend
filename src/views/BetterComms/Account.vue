<template>
  <transition>
    <modal v-if="modalOpen" :is-active="modalOpen" @close="modalOpen = false">
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
        <button @click="submitFeedback">Enter</button>
        <p class="message-text-medium-gray">
          Your user identification number is recorded for reference
        </p>
      </div>
    </modal>
  </transition>
  <transition>
    <modal
      v-if="passwordModalOpen"
      :is-active="passwordModalOpen"
      @close="passwordModalOpen = false"
    >
      <div class="settings-modal">
        <p class="settings-text">Logout everywhere</p>
        <input
          v-model="password"
          placeholder="Password"
          class="settings-input"
          autocomplete="off"
          @keydown.enter="logoutAllSubmit"
        />
        <button @click="logoutAllSubmit">Enter</button>
      </div>
    </modal>
  </transition>
  <transition>
    <modal
      v-if="otpModelOpen"
      :is-active="otpModelOpen"
      @close="otpModelOpen = false"
    >
      <div class="settings-modal">
        <p class="settings-text">Enable 2FA</p>
        <img :src="qrCodeURL" alt="QR Code" />
        <p>or</p>
        <div>
          <a :href="qrURI">Click to add to 2FA app</a>
        </div>
        <p>or</p>
        <button :onclick="copyToken()">Copy Token</button>
        <input
          id="totp"
          v-model="totp"
          placeholder="2FA Code"
          class="modal-input"
          type="token"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          @keydown.enter="verify2FA()"
        />
        <button @click="verify2FA()">Enter</button>
      </div>
    </modal>
  </transition>
  <transition>
    <modal
      v-if="disableModelOpen"
      :is-active="disableModelOpen"
      @close="disableModelOpen = false"
    >
      <div class="settings-modal">
        <p class="settings-text">Disable 2FA</p>
        <input
          id="totp"
          v-model="totp"
          placeholder="2FA Code"
          class="modal-input"
          type="token"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          @keydown.enter="disable2FA()"
        />
        <button @click="disable2FA()">Enter</button>
      </div>
    </modal>
  </transition>
  <div class="container">
    <div class="grid-menu">
      <div class="settings-menu">
        <div class="settings-sidebar scroll-bar">
          <div class="settings-item" @click="changePage('account')">
            Account
          </div>
          <div class="settings-item" @click="changePage('privacy')">
            Privacy
          </div>
          <div class="settings-item" @click="changePage('security')">
            Security
          </div>
          <div class="settings-item" @click="changePage('appearance')">
            Appearance
          </div>
          <div class="settings-item" @click="changePage('profile')">
            Profile
          </div>
          <div
            v-if="store.userData?.admin"
            class="settings-item"
            @click="changePage('admin')"
          >
            Admin
          </div>
          <div class="settings-item" @click="changePage('about')">About</div>
          <div class="settings-item" @click="changePage('changelog')">
            Changelog
          </div>
          <div class="settings-item" @click="modalOpen = true">
            Any feedback?
          </div>
        </div>
        <div class="settings-page scroll-bar-dark">
          <div v-if="page === 'account'" class="settings-page-container">
            <h2 class="settings-text">Account</h2>
            Change your account settings
            <div class="settings-spacer" />
            <div class="settings-button-red" @click="logout">Logout</div>
            <div class="settings-spacer" />
            Username: {{ store.userData?.username }}
            <div class="settings-button" @click="changeUsername()">
              Change Username
            </div>
            <div class="settings-spacer" />
            Email: {{ store.userData?.email }}
            <div class="settings-button" @click="changeUsername()">
              Change Email
            </div>
            <div class="settings-spacer" />
            Email verified: {{ store.userData?.emailVerified }}
            <div
              v-if="!store.userData?.emailVerified"
              class="settings-button"
              @click="resendVerification()"
            >
              Resend email
            </div>
            <div class="settings-spacer" />
            Password: {{ store.userData?.password }}
            <div class="settings-button" @click="changeUsername()">
              Change Password
            </div>
            <div class="settings-spacer" />
            Creation date: {{ store.dayjsLong(store.userData?.createdAt) }}
            <div class="settings-spacer" />
            Account ID: {{ store.userData?.id }}
            <div class="settings-spacer" />
            <div class="settings-button-red" @click="changeUsername()">
              Close account
            </div>
          </div>
          <div v-else-if="page === 'privacy'" class="settings-page-container">
            <h2 class="settings-text">Privacy</h2>
            Change your privacy settings
            <div class="settings-spacer" />
            Allow direct messages from
            <div>
              <div class="dropdown">
                <div class="dropdown-toggle" @click="dmOpen = !dmOpen">
                  {{ store.userData?.directMessages }}
                </div>
                <ul v-if="dmOpen" class="dropdown-menu">
                  <li
                    v-for="option in dmOptions"
                    :key="option"
                    @click="selectDm(option)"
                  >
                    {{ option }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="settings-spacer" />
            Allow friend requests from new people
            <label class="switch">
              <input
                type="checkbox"
                :checked="store.userData?.friendRequests"
                @click="toggle('friendRequests')"
              />
              <span class="slider" />
            </label>
            <div class="settings-spacer" />
            Show the date of your accounts creation on your profile
            <label class="switch">
              <input
                type="checkbox"
                :checked="store.userData?.showCreated"
                @click="toggle('showCreated')"
              />
              <span class="slider" />
            </label>
            <div class="settings-spacer" />
            Save Quick Switcher history online
            <label class="switch">
              <input
                type="checkbox"
                :checked="store.userData?.saveSwitcher"
                @click="toggle('saveSwitcher')"
              />
              <span class="slider" />
            </label>
            <div class="settings-spacer" />
            Clear your Quick Switcher history
            <div class="settings-button" @click="clearHistory()">
              Clear history
            </div>
          </div>
          <div v-else-if="page === 'security'" class="settings-page-container">
            <h2 class="settings-text">Security</h2>
            Change your security settings
            <div class="settings-spacer" />
            Log you out on every device
            <div class="settings-button-red" @click="logoutAll">
              Logout everywhere
            </div>
            <div class="settings-spacer" />
            Allow Encrypted direct messages
            <div>
              <div class="dropdown">
                <div
                  class="dropdown-toggle"
                  @click="encryptionOpen = !encryptionOpen"
                >
                  {{ store.userData?.encryption }}
                </div>
                <ul v-if="encryptionOpen" class="dropdown-menu">
                  <li
                    v-for="option in encryptionOptions"
                    :key="option"
                    @click="selectEncryption(option)"
                  >
                    {{ option }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="message-text-small">
              <b>Never</b>
              - Messages sent to you will ever be encrypted so you cannot
              message those using "Always"
            </div>
            <div class="message-text-small">
              <b>Off</b>
              - Only messages sent to you by someone using "Always" will be
              encrypted
            </div>
            <div class="message-text-small">
              <b>On</b>
              - Any messages you send will be encrypted unless the other user
              has selected "Never" or "Off"
            </div>
            <div class="message-text-small">
              <b>Always</b>
              - You won't be able to send messages to those who have selected
              "Never"
            </div>
            <div class="settings-spacer" />
            <div
              :style="{
                opacity: store.userData?.encryption === 'never' ? '0.5' : ''
              }"
            >
              Save your Encryption Private Key
              <label class="switch">
                <input
                  type="checkbox"
                  :checked="store.userData?.savePrivateKey"
                  :disabled="store.userData?.encryption === 'never'"
                  @click="toggle('savePrivateKey')"
                />
                <span class="slider" />
              </label>
            </div>
            <div class="message-text-small">
              If enabled, your private key will be encrypted using your password
              and saved to the server
            </div>
            <div class="message-text-small">
              Disabling this option will delete your private key from the server
              so please back it up
            </div>
            <div class="settings-spacer" />
            2FA
            <div
              v-if="!store.userData?.otpVerified"
              class="settings-button"
              @click="enable2FA()"
            >
              Enable 2FA
            </div>
            <div
              v-else
              class="settings-button"
              @click="disableModelOpen = true"
            >
              Disable 2FA
            </div>
            <div class="settings-spacer" />
            Sessions
            <div class="grid-sessions">
              <div
                v-for="session in sessions"
                :key="session.id"
                class="grid-sessions-item"
              >
                <p>Id: {{ session.id }}</p>
                <p>Date created: {{ store.dayjsLong(session.createdAt) }}</p>
                <p>Platform: {{ platform(session.userAgent) }}</p>
              </div>
            </div>
          </div>
          <div
            v-else-if="page === 'appearance'"
            class="settings-page-container"
          >
            <h2 class="settings-text">Appearance</h2>
            Change your appearance settings
            <div class="settings-spacer" />
            Coming soon™
          </div>
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
                  @keydown.enter="toggle('banner', editBanner)"
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
                            ;(editing = 'status'),
                              (editStatus = store.userData?.statusMessage),
                              editFocus()
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
                    @keydown.enter="toggle('avatar', editAvatar)"
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
                        {{ store.dayjsDate(store.userData?.createdAt) }}
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
                            ;(editing = 'description'),
                              (editDescription = store.userData?.description),
                              editFocus()
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
                        @keydown.enter.exact.prevent="
                          toggle('description', editDescription)
                        "
                      />
                    </div>
                    <div v-if="store.userData?.tetris.length">
                      <div class="profile-spacer">
                        <p>Tetris Scores</p>
                        <div />
                      </div>
                      <p style="margin-top: 0">
                        Easy mode: {{ store.userData?.tetris[0]?.value }} lines
                      </p>
                      <p>
                        Medium mode:
                        {{ store.userData?.tetris[1]?.value }} lines
                      </p>
                      <p>
                        Hard mode: {{ store.userData?.tetris[2]?.value }} lines
                      </p>
                      <p>
                        God mode: {{ store.userData?.tetris[3]?.value }} lines
                      </p>
                      <p style="margin-bottom: 0">
                        Ultra Nightmare mode:
                        {{ store.userData?.tetris[4]?.value }} lines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="page === 'about'" class="settings-page-container">
            <h2 class="settings-text">About BetterCommunications</h2>
            <div>
              BetterCommunications is free and open-source chatting platform
              available to all
            </div>
            <div class="settings-spacer" />
            <div>
              Made by
              <router-link to="/">ElectricS01</router-link>
            </div>
            <div class="settings-spacer" />
            <div>Version: 1.227.1</div>
            <div class="settings-spacer" />
            <div>Backend name: {{ serverName }}</div>
          </div>
          <div v-else-if="page === 'changelog'" class="settings-page-container">
            <changelog />
          </div>
          <div v-else-if="page === 'admin'" class="settings-page-container">
            <h2 class="settings-text">Admin panel</h2>
            Admin info
            <div class="settings-spacer" />
            Feedback
            <div class="settings-spacer" />
            <table>
              <tr v-for="feedback in adminData.feedback" :key="feedback.id">
                <th>{{ feedback.id }}</th>
                <th>{{ feedback.userId }}</th>
                <th>{{ feedback.feedback }}</th>
                <th>{{ store.dayjsLong(feedback.createdAt) }}</th>
                <th>
                  <icons
                    size="16"
                    icon="delete"
                    style="cursor: pointer"
                    @click="deleteFeedback(feedback.id)"
                  />
                </th>
              </tr>
            </table>
            <div class="settings-spacer" />
            Users
            <div class="settings-spacer" />
            <table>
              <tr v-for="user in adminData.users" :key="user.id">
                <th>{{ user.id }}</th>
                <th>{{ user.username }}</th>
                <th>{{ user.admin }}</th>
                <th>{{ store.dayjsLong(user.createdAt) }}</th>
                <th>
                  <icons
                    size="16"
                    icon="delete"
                    style="cursor: pointer"
                    @click="deleteFeedback(user.id)"
                  />
                </th>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Changelog from "@/components/Changelog.vue"
import Modal from "@/components/core/Modal.vue"
import Icons from "@/components/core/Icons.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"
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
const properties = [
  "directMessages",
  "friendRequests",
  "showCreated",
  "saveSwitcher",
  "avatar",
  "banner",
  "description",
  "encryption",
  "savePrivateKey"
]
const dmOptions = ["no one", "friends", "everyone"]
const encryptionOptions = ["never", "off", "on", "always"]
const serverName = import.meta.env.VITE_SERVER_NAME || "Unknown"

const modalOpen = ref(false)
const passwordModalOpen = ref(false)
const otpModelOpen = ref(false)
const disableModelOpen = ref(false)
const dmOpen = ref(false)
const encryptionOpen = ref(false)
const sessions = ref([])
const adminData = ref([])
const editing = ref("")
const qrCodeURL = ref("")
const qrURI = ref("")
const totp = ref("")
let token = ""
let page = "account"
let feedbackText = ""
let editStatus = ""
let editDescription = ""
let password = ""

let editAvatar = store.userData?.avatar
let editBanner = store.userData?.banner

document.getElementById("favicon").href = "/icons/favicon.ico"
if (pages.includes(route.params.id)) {
  page = route.params.id
} else {
  if (route.params.id === "feedback") {
    modalOpen.value = true
  }
  router.push("/account/account")
}

const getAdmin = () => {
  if (localStorage.getItem("token")) {
    axios
      .get("/api/admin")
      .then((res) => {
        adminData.value = res.data
      })
      .catch((e) => {
        store.error = `Error ${e.request.status}, ${
          e.response.data.message || e.request.statusMessage
        }`
        setTimeout(store.errorFalse, 5000)
      })
  }
}
const getSessions = () => {
  if (localStorage.getItem("token")) {
    axios
      .get("/api/sessions")
      .then((res) => {
        sessions.value = res.data
      })
      .catch((e) => {
        store.error = `Error ${e.request.status}, ${
          e.response.data.message || e.request.statusMessage
        }`
        setTimeout(store.errorFalse, 5000)
      })
  }
}
const changePage = (newPage) => {
  if (pages.includes(page)) {
    page = newPage
    router.push(`/account/${newPage}`)
  } else {
    page = "account"
    router.push("/account/account")
  }
  if (page === "security") {
    getSessions()
  } else if (page === "admin") {
    getAdmin()
  }
}
const submitFeedback = () => {
  axios
    .post("/api/feedback", {
      feedback: feedbackText
    })
    .catch((e) => {
      if (e.response.data.message) {
        store.error = `${e.message}: ${e.response.data.message}`
      } else store.error = e.message
      setTimeout(store.errorFalse, 5000)
    })
  modalOpen.value = false
  feedbackText = ""
}
const deleteFeedback = (id) => {
  axios
    .delete(`/api/delete-feedback/${id}`)
    .then(() => {
      getAdmin()
    })
    .catch((e) => {
      store.error = `Error ${e.request.status}, ${
        e.response.data.message || e.request.statusMessage
      }`
      setTimeout(store.errorFalse, 5000)
    })
}
const selectDm = (option) => {
  toggle("directMessages", option)
  dmOpen.value = false
}
const selectEncryption = (option) => {
  toggle("encryption", option)
  encryptionOpen.value = false
}
const editFocus = () => {
  nextTick(() => {
    const feedback = document.getElementById("feedback")
    if (feedback) {
      feedback?.focus()
    }
  })
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
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const logout = () => {
  axios
    .post("/api/logout")
    .then(() => {
      Object.assign(axios.defaults, {
        headers: { Authorization: null }
      })
      localStorage.removeItem("token")
      router.push("/login")
    })
    .catch((e) => {
      store.error = `Error ${e.request.status}, ${
        e.response.data.message || e.request.statusMessage
      }`
      setTimeout(store.errorFalse, 5000)
    })
}
const logoutAll = () => {
  passwordModalOpen.value = true
  password = ""
}
const logoutAllSubmit = () => {
  if (password) {
    axios
      .post("/api/logout-all", {
        password
      })
      .then(() => {
        Object.assign(axios.defaults, {
          headers: { Authorization: null }
        })
        localStorage.removeItem("token")
        router.push("/login")
      })
      .catch((e) => {
        console.log(e)
        store.error = `Error ${e.request.status}, ${
          e.response.data.message || e.request.statusMessage
        }`
        setTimeout(store.errorFalse, 5000)
      })
  }
}
const changeUsername = () => {
  console.log("Coming Soon™")
}
const clearHistory = () => {
  localStorage.removeItem("switcherHistory")
  axios.delete("/api/clear-history").catch((e) => {
    store.error = `Error ${e.request.status}, ${
      e.response.data.message || e.request.statusMessage
    }`
    setTimeout(store.errorFalse, 5000)
  })
}
const resendVerification = () => {
  axios.post("/api/resend-verification").catch((e) => {
    store.error = `Error ${e.request.status}, ${
      e.response.data.message || e.request.statusMessage
    }`
    setTimeout(store.errorFalse, 5000)
  })
  if (localStorage.getItem("token")) {
    store.getUser()
  }
}
const enable2FA = () => {
  axios
    .post("/api/enable-2fa")
    .then((res) => {
      token = res.data.secret
      qrCodeURL.value = res.data.qrCodeDataURL
      qrURI.value = res.data.otpUri
      otpModelOpen.value = true
    })
    .catch((e) => {
      if (e.response.data.message) {
        store.error = `${e.message}: ${e.response.data.message}`
      } else store.error = e.message
      setTimeout(store.errorFalse, 5000)
    })
}
const verify2FA = () => {
  axios
    .post("/api/verify-2fa", {
      token: totp.value
    })
    .then(() => {
      otpModelOpen.value = false
      totp.value = ""
      store.userData.otpVerified = true
    })
    .catch((e) => {
      if (e.response.data.message) {
        store.error = `${e.message}: ${e.response.data.message}`
      } else store.error = e.message
      setTimeout(store.errorFalse, 5000)
    })
}
const disable2FA = () => {
  axios
    .post("/api/disable-2fa", {
      token: totp.value
    })
    .then(() => {
      disableModelOpen.value = false
      totp.value = ""
      store.userData.otpVerified = false
    })
    .catch((e) => {
      if (e.response.data.message) {
        store.error = `${e.message}: ${e.response.data.message}`
      } else store.error = e.message
      setTimeout(store.errorFalse, 5000)
    })
}
const copyToken = () => {
  navigator.clipboard.writeText(token)
}
const platform = (userAgent) => {
  if (userAgent) {
    let total = ""
    if (userAgent.toLowerCase().includes("windows")) {
      total += "Windows"
    } else if (userAgent.toLowerCase().includes("mac")) {
      total += "macOS"
    } else if (userAgent.toLowerCase().includes("iphone")) {
      total += "iOS"
    } else if (userAgent.toLowerCase().includes("android")) {
      total += "Android"
    } else if (userAgent.toLowerCase().includes("linux")) {
      total += "Linux"
    } else {
      total += "Unknown OS"
    }
    if (userAgent.toLowerCase().includes("chrome")) {
      total += " Chrome"
    } else if (userAgent.toLowerCase().includes("firefox")) {
      total += " Firefox"
    } else if (userAgent.toLowerCase().includes("safari")) {
      total += " Safari"
    } else if (userAgent.toLowerCase().includes("chromium")) {
      total += " Chromium"
    } else {
      total += " Unknown Browser"
    }
    return total
  }
  return "Unknown OS Unknown Browser"
}

async function toggle(property, value) {
  if (properties.includes(property)) {
    if (editing.value === "description") {
      editing.value = ""
    }
    if (
      ((property === "avatar" || property === "banner") &&
        value &&
        (await checkImage(value))) ||
      (property !== "avatar" && property !== "banner")
    ) {
      if (!value) {
        if (store.userData) {
          value = !store.userData[property]
        }
      }
      axios
        .post("/api/user-prop", {
          property,
          val: value
        })
        .then(() => {
          if (localStorage.getItem("token")) {
            store.getUser()
          }
        })
        .catch((e) => {
          store.error = `Error ${e.request.status}, ${
            e.response.data.message || e.request.statusMessage
          }`
          setTimeout(store.errorFalse, 5000)
        })
    }
  }
}
async function checkImage(url) {
  try {
    const res = await fetch(url)
    const buff = await res.blob()
    return buff.type.startsWith("image/")
  } catch (e) {
    store.error = "Invalid image"
  }
}

if (page === "security") {
  getSessions()
} else if (page === "admin") {
  getAdmin()
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
