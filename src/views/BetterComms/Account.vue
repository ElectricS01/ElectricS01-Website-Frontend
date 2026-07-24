<template>
  <modal :is-active="changeUsernameOpen" @close="changeUsernameOpen = false">
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
  </modal>
  <modal :is-active="renamePasskeyOpen" @close="renamePasskeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">
        Rename {{ selectedPasskey?.name ?? "Passkey" }}
      </p>
      <input
        v-model="passkeyName"
        placeholder="Passkey Name"
        class="modal-input"
        autocomplete="off"
        @keydown.enter="updatePasskeyName"
      />
      <div class="settings-button-container">
        <button @click="renamePasskeyOpen = false">Cancel</button>
        <button @click="updatePasskeyName">Save</button>
      </div>
    </div>
  </modal>
  <modal :is-active="deletePasskeyOpen" @close="deletePasskeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">
        Delete {{ passkeyToDelete?.name ?? "Passkey" }}
      </p>
      <p class="message-text-medium-gray" style="margin-bottom: 10px">
        This will remove the passkey from your account, but it will remain on
        your device
      </p>
      <div class="settings-button-container">
        <button class="settings-button" @click="deletePasskeyOpen = false">
          Cancel
        </button>
        <button
          class="settings-button-red"
          @click="confirmDeletePasskeyOpen = true"
        >
          Delete
        </button>
      </div>
    </div>
  </modal>
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
        <button class="settings-button" @click="submitFeedback">Enter</button>
      </div>
      <p class="message-text-medium-gray">
        Your user identification number is recorded for reference
      </p>
    </div>
  </modal>
  <modal :is-active="logoutAllOpen" @close="logoutAllOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Logout everywhere</p>
      <input
        v-model="password"
        placeholder="Password"
        class="settings-input"
        autocomplete="off"
        type="password"
        @keydown.enter="logoutAllSubmit"
      />
      <div class="settings-button-container">
        <button class="settings-button" @click="logoutAllOpen = false">
          Cancel
        </button>
        <button class="settings-button-red" @click="logoutAllSubmit">
          Logout everywhere
        </button>
      </div>
    </div>
  </modal>
  <modal
    :is-active="confirmDeletePasskeyOpen"
    @close="confirmDeletePasskeyOpen = false"
  >
    <div class="settings-modal">
      <p class="settings-text">
        Delete
        {{ passkeyToDelete.name ?? "Passkey" }}
      </p>
      <p class="message-text-medium-gray">This action cannot be undone</p>
      <input
        v-model="password"
        placeholder="Password"
        class="settings-input"
        autocomplete="off"
        type="password"
        @keydown.enter="confirmDeletePasskey"
      />
      <div class="settings-button-container">
        <button
          class="settings-button"
          @click="confirmDeletePasskeyOpen = false"
        >
          Cancel
        </button>
        <button class="settings-button-red" @click="confirmDeletePasskey">
          Delete
        </button>
      </div>
    </div>
  </modal>
  <modal :is-active="enableOtpOpen" @close="enableOtpOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Enable 2FA</p>
      <img :src="qrCodeURL" alt="QR Code" />
      <p>or</p>
      <div>
        <a :href="qrURI">Click to add to 2FA app</a>
      </div>
      <p>or</p>
      <button @click="copyToken">Copy Token</button>
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
      <div class="settings-button-container">
        <button class="settings-button" @click="verify2FA()">Enable</button>
      </div>
    </div>
  </modal>
  <modal :is-active="disableOtpOpen" @close="disableOtpOpen = false">
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
      <div class="settings-button-container">
        <button class="settings-button" @click="disable2FA()">Disable</button>
      </div>
    </div>
  </modal>
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
            <div class="settings-button" @click="showChangeUsername()">
              Change Username
            </div>
            <div class="settings-spacer" />
            Email address: {{ store.userData?.email }}
            <div class="settings-button" @click="showChangeEmail()">
              Change Email Address
            </div>
            <div class="settings-spacer" />
            Email verified: {{ store.userData?.emailVerified }}
            <div
              v-if="!store.userData?.emailVerified"
              class="settings-button"
              @click="resendVerification()"
            >
              Resend Verification Email
            </div>
            <div class="settings-spacer" />
            Password: {{ store.userData?.password }}
            <div class="settings-button" @click="showChangePassword()">
              Change Password
            </div>
            <div class="settings-spacer" />
            Account creation date: {{ dayjsLong(store.userData?.createdAt) }}
            <div class="settings-spacer" />
            Account ID: {{ store.userData?.id }}
            <div class="settings-spacer" />
            <div class="settings-button-red" @click="showCloseAccount()">
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
              @click="enable2FA"
            >
              Enable 2FA
            </div>
            <div v-else class="settings-button" @click="disableOtpOpen = true">
              Disable 2FA
            </div>
            <div class="message-text-small">
              Two-factor authentication (2FA) prevents unauthorised access by
              requiring a code from your authenticator app
            </div>
            <div class="settings-spacer" />
            Passkeys
            <div class="settings-button" @click="registerPasskey">
              Add Passkey
            </div>
            <div class="message-text-small">
              Passkeys allow you to log in securely without a password using
              Touch ID, Face ID, Windows Hello, or security keys
            </div>
            <div v-if="passkeys.length > 0" class="settings-spacer" />
            <div class="grid-sessions">
              <div
                v-for="passkey in passkeys"
                :key="passkey.id"
                class="grid-sessions-item"
              >
                <div>
                  <p class="message-text">
                    {{ passkey.name }}
                  </p>
                  <p class="message-text-small">
                    Added: {{ dayjsLong(passkey.createdAt) }} -
                    {{ dayjsSince(passkey.createdAt) }}
                  </p>
                  <p
                    class="message-text-small"
                    :title="passkey.credentialDeviceType"
                  >
                    {{ passkey.credentialBackedUp ? "Synced" : "Device only" }}
                  </p>
                </div>
                <div class="button-container">
                  <button
                    class="settings-button"
                    @click="renamePasskey(passkey)"
                  >
                    Rename
                  </button>
                  <button
                    class="settings-button-red"
                    @click="deletePasskey(passkey)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div class="settings-spacer" />
            Sessions
            <div class="grid-sessions">
              <div
                v-for="session in sessions"
                :key="session.id"
                class="grid-sessions-item"
              >
                <p>{{ platform(session.userAgent) }}</p>
                <p class="message-text-small">
                  Added: {{ dayjsLong(session.createdAt) }} -
                  {{ dayjsSince(session.createdAt) }}
                </p>
                <p class="message-text-small">Id: {{ session.id }}</p>
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
                        @keydown.enter.exact.prevent="
                          changeProperty('description', editDescription)
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
            <div>Version: 1.238.0</div>
            <div class="settings-spacer" />
            <div>Backend name: {{ serverName }}</div>
            <div class="settings-spacer" />
            <div>Build date: {{ dayjsLong(buildDate) }}</div>
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
              <thead>
                <tr>
                  <th>ID</th>
                  <th>UserID</th>
                  <th>Content</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tr v-for="feedback in adminData.feedback" :key="feedback.id">
                <td>{{ feedback.id }}</td>
                <td>{{ feedback.userId }}</td>
                <td>{{ feedback.feedback }}</td>
                <td>{{ dayjsLong(feedback.createdAt) }}</td>
                <td>
                  <icons
                    size="16"
                    icon="delete"
                    style="cursor: pointer"
                    @click="deleteFeedback(feedback.id)"
                  />
                </td>
              </tr>
            </table>
            <div class="settings-spacer" />
            Users
            <div class="settings-spacer" />
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Admin</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tr v-for="user in adminData.users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.admin }}</td>
                <td>{{ dayjsLong(user.createdAt) }}</td>
                <td>
                  <icons
                    size="16"
                    icon="delete"
                    style="cursor: pointer"
                    @click="deleteFeedback(user.id)"
                  />
                </td>
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
import { startRegistration } from "@simplewebauthn/browser"
import { dayjsDate, dayjsLong, dayjsSince } from "@/helpers/dates"

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
const buildDate = __VITE_BUILD_DATE__ || "Unknown"

const changeUsernameOpen = ref(false)
const renamePasskeyOpen = ref(false)
const deletePasskeyOpen = ref(false)
const modalOpen = ref(false)
const logoutAllOpen = ref(false)
const confirmDeletePasskeyOpen = ref(false)
const enableOtpOpen = ref(false)
const disableOtpOpen = ref(false)
const dmOpen = ref(false)
const encryptionOpen = ref(false)
const sessions = ref([])
const passkeys = ref([])
const adminData = ref([])
const editing = ref("")
const qrCodeURL = ref("")
const qrURI = ref("")
const totp = ref("")
const newUsername = ref("")
const passkeyName = ref("")
const selectedPasskey = ref()
const passkeyToDelete = ref()
let token = ""
let page = "account"
let feedbackText = ""
let editStatus = ""
let editDescription = ""
let password = ""

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

const getAdmin = () => {
  if (localStorage.getItem("token")) {
    axios
      .get("/api/admin")
      .then((res) => {
        adminData.value = res.data
      })
      .catch((e) => {
        store.handleAxiosError(e)
      })
  }
}
const getSessions = () => {
  if (!localStorage.getItem("token")) return

  axios
    .get("/api/sessions")
    .then((res) => {
      sessions.value = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const getPasskeys = () => {
  if (!localStorage.getItem("token")) return

  axios
    .get("/api/passkeys")
    .then((res) => {
      passkeys.value = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
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
    getPasskeys()
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
      store.handleAxiosError(e)
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
      store.handleAxiosError(e)
    })
}
const selectDm = async (option) => {
  await changeProperty("directMessages", option)
  dmOpen.value = false
}
const selectEncryption = async (option) => {
  await changeProperty("encryption", option)
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
      store.handleAxiosError(e)
    })
}
const onLogout = () => {
  Object.assign(axios.defaults, {
    headers: { Authorization: null }
  })
  store.ws.close()
  store.ws = null
  console.log("Socket closed")

  store.userData = {}
  localStorage.removeItem("token")
  router.push("/login")
}
const logout = () => {
  axios
    .post("/api/logout")
    .then(() => {
      onLogout()
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const logoutAll = () => {
  logoutAllOpen.value = true
}
const logoutAllSubmit = () => {
  if (password) {
    axios
      .post("/api/logout-all", {
        password
      })
      .then(() => {
        onLogout()
      })
      .catch((e) => {
        store.handleAxiosError(e)
      })
  }
}
const showChangeUsername = () => {
  changeUsernameOpen.value = true
  newUsername.value = store.userData?.username
  password = ""
}

const updateUsername = () => {
  if (!newUsername.value) {
    store.handleError("Username cannot be empty", 2500)
    return
  }
  if (!password) {
    store.handleError("Password is required", 2500)
    return
  }
  axios
    .patch("/api/edit-username", {
      password,
      username: newUsername.value
    })
    .then((res) => {
      store.userData.username = res.data.username
      changeUsernameOpen.value = false
      newUsername.value = ""
      password = ""
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const showChangeEmail = () => {
  console.log("Unavailable")
}

const showChangePassword = () => {
  console.log("Unavailable")
}

const showCloseAccount = () => {
  console.log("Unavailable")
}

const clearHistory = () => {
  localStorage.removeItem("switcherHistory")
  axios.delete("/api/clear-history").catch((e) => {
    store.handleAxiosError(e)
  })
}
const resendVerification = () => {
  axios.post("/api/resend-verification").catch((e) => {
    store.handleAxiosError(e)
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
      enableOtpOpen.value = true
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const verify2FA = () => {
  axios
    .post("/api/verify-2fa", {
      token: totp.value
    })
    .then(() => {
      enableOtpOpen.value = false
      totp.value = ""
      store.userData.otpVerified = true
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const disable2FA = () => {
  axios
    .post("/api/disable-2fa", {
      token: totp.value
    })
    .then(() => {
      disableOtpOpen.value = false
      totp.value = ""
      store.userData.otpVerified = false
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const copyToken = () => {
  navigator.clipboard.writeText(token)
}

const registerPasskey = async () => {
  try {
    const optionsResponse = await axios.post("/api/add-passkey")

    const registrationResponse = await startRegistration({
      optionsJSON: optionsResponse.data.options
    })

    await axios.post("/api/confirm-passkey", {
      ...registrationResponse,
      challengeId: optionsResponse.data.challengeId,
      passkeyName: platform(navigator.userAgent)
    })

    getPasskeys()
    store.errorFalse()
  } catch (error) {
    if (error.name === "NotAllowedError") {
      store.handleError("Passkey registration was cancelled")
    } else {
      store.handleAxiosError(error)
    }
  }
}

const renamePasskey = (passkey) => {
  selectedPasskey.value = passkey
  passkeyName.value = passkey.name
  renamePasskeyOpen.value = true
}

const updatePasskeyName = () => {
  if (!passkeyName.value) return

  axios
    .patch(`/api/edit-passkey/${selectedPasskey.value.id}`, {
      passkeyName: passkeyName.value
    })
    .then(() => {
      getPasskeys()
      renamePasskeyOpen.value = false
      passkeyName.value = ""
      selectedPasskey.value = null
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const deletePasskey = (passkey) => {
  passkeyToDelete.value = passkey
  deletePasskeyOpen.value = true
}

const confirmDeletePasskey = () => {
  if (!password) return

  axios
    .post(`/api/delete-passkey/${passkeyToDelete.value.id}`, {
      password: password
    })
    .then(() => {
      password = ""
      getPasskeys()
      deletePasskeyOpen.value = false
      confirmDeletePasskeyOpen.value = false
      passkeyToDelete.value = null
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
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

const checkImage = async (url) => {
  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)

    img.src = url
  })
}

async function toggle(property) {
  if (!properties.includes(property)) {
    return
  }

  if (!store.userData || typeof store.userData[property] === "undefined") {
    return
  }

  const value = !store.userData[property]
  setProperty(property, value)
}

const changeProperty = async (property, value) => {
  if (!properties.includes(property)) {
    return
  }

  if (property === "description") {
    editing.value = ""
  }

  if (!value) {
    return
  }

  if (
    (property === "avatar" || property === "banner") &&
    !(await checkImage(value))
  ) {
    store.handleError("Invalid URL", 2500)
    return
  }

  setProperty(property, value)
}

const setProperty = (property, value) => {
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
      store.handleAxiosError(e)
    })
}

if (page === "security") {
  getSessions()
  getPasskeys()
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
