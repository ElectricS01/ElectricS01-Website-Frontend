<template>
  <transition>
    <modal v-if="modalOpen" :is-active="modalOpen" @close="modalOpen = false">
      <div class="settings-modal">
        <p class="settings-text">Submit feedback</p>
        <input
          placeholder="Feedback"
          @keydown.enter="submitFeedback"
          class="settings-input"
          v-model="feedbackText"
          id="feedback"
          autocomplete="off"
        />
        <button @click="submitFeedback">Enter</button>
        <p class="message-text-medium-gray">
          Your user identification number is recorded for reference
        </p>
      </div>
    </modal>
  </transition>
  <div class="container">
    <div class="grid-menu">
      <div class="settings-menu">
        <div class="settings-sidebar scroll-bar">
          <div @click="changePage('account')" class="settings-item">
            Account
          </div>
          <div @click="changePage('privacy')" class="settings-item">
            Privacy
          </div>
          <div @click="changePage('security')" class="settings-item">
            Security
          </div>
          <div @click="changePage('appearance')" class="settings-item">
            Appearance
          </div>
          <div @click="changePage('profile')" class="settings-item">
            Profile
          </div>
          <div
            v-if="store.userData?.admin"
            @click="changePage('admin')"
            class="settings-item"
          >
            Admin
          </div>
          <div @click="changePage('about')" class="settings-item">About</div>
          <div @click="changePage('changelog')" class="settings-item">
            Changelog
          </div>
          <div @click="modalOpen = true" class="settings-item">
            Any feedback?
          </div>
        </div>
        <div class="settings-page scroll-bar-dark">
          <div v-if="page === 'account'" class="settings-page-container">
            <h2 class="settings-text">Account</h2>
            Change your account settings
            <div class="settings-spacer"></div>
            <div @click="logout()" class="settings-button-red">Logout</div>
            <div class="settings-spacer"></div>
            Username: {{ store.userData?.username }}
            <div @click="changeUsername()" class="settings-button">
              Change Username
            </div>
            <div class="settings-spacer"></div>
            Email: {{ store.userData?.email }}
            <div @click="changeUsername()" class="settings-button">
              Change Email
            </div>
            <div class="settings-spacer"></div>
            Email verified: {{ store.userData?.emailVerified }}
            <div
              v-if="!store.userData?.emailVerified"
              @click="resendVerification()"
              class="settings-button"
            >
              Resend email
            </div>
            <div class="settings-spacer"></div>
            Password: {{ store.userData?.password }}
            <div @click="changeUsername()" class="settings-button">
              Change Password
            </div>
            <div class="settings-spacer"></div>
            Creation date: {{ store.dayjsLong(store.userData?.createdAt) }}
            <div class="settings-spacer"></div>
            Account ID: {{ store.userData?.id }}
            <div class="settings-spacer"></div>
            <div @click="changeUsername()" class="settings-button-red">
              Close account
            </div>
          </div>
          <div v-else-if="page === 'privacy'" class="settings-page-container">
            <h2 class="settings-text">Privacy</h2>
            Change your privacy settings
            <div class="settings-spacer"></div>
            Allow direct messages from
            <div>
              <div class="dropdown">
                <div class="dropdown-toggle" @click="isOpen = !isOpen">
                  {{ store.userData?.directMessages }}
                </div>
                <ul class="dropdown-menu" v-if="isOpen">
                  <li
                    v-for="option in options"
                    :key="option"
                    @click="selectOption(option)"
                  >
                    {{ option }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="settings-spacer"></div>
            Allow friend requests from new people
            <label class="switch">
              <input
                type="checkbox"
                :checked="store.userData?.friendRequests"
                @click="toggle('friendRequests')"
              />
              <span class="slider"></span>
            </label>
            <div class="settings-spacer"></div>
            Show the date of your accounts creation on your profile
            <label class="switch">
              <input
                type="checkbox"
                :checked="store.userData?.showCreated"
                @click="toggle('showCreated')"
              />
              <span class="slider"></span>
            </label>
            <div class="settings-spacer"></div>
            Save Quick Switcher history online
            <label class="switch">
              <input
                type="checkbox"
                :checked="store.userData?.saveSwitcher"
                @click="toggle('saveSwitcher')"
              />
              <span class="slider"></span>
            </label>
            <div class="settings-spacer"></div>
            Clear your Quick Switcher history
            <div @click="clearHistory()" class="settings-button">
              Clear history
            </div>
          </div>
          <div v-else-if="page === 'security'" class="settings-page-container">
            <h2 class="settings-text">Security</h2>
            Change your security settings
            <div class="settings-spacer"></div>
          </div>
          <div
            v-else-if="page === 'appearance'"
            class="settings-page-container"
          >
            <h2 class="settings-text">Appearance</h2>
            Change your appearance settings
            <div class="settings-spacer"></div>
            Coming soon™
          </div>
          <div v-else-if="page === 'profile'" class="settings-page-container">
            <h2 class="settings-text">Profile</h2>
            Change your profile settings
            <div class="settings-spacer"></div>
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
                  placeholder="Edit your profile picture"
                  @keydown.enter="toggle('banner', editBanner)"
                  v-model="editBanner"
                  style="
                    margin: 1px;
                    height: fit-content;
                    width: calc(100% - 2px);
                  "
                  id="banner"
                  autocomplete="off"
                />
                <div class="profile-page">
                  <div class="profile-grid">
                    <div class="profile-picture-large">
                      <profile-picture
                        size="80"
                        :avatar="store.userData?.avatar"
                      ></profile-picture>
                      <svg class="online-indicator" width="20" height="20">
                        <status-indicator
                          size="8"
                          :status="store.userData?.status"
                        ></status-indicator>
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
                        placeholder="Edit your status"
                        @keydown.enter="editStatusMessage()"
                        v-model="editStatus"
                        style="margin: 1px; width: calc(100% - 2px)"
                        id="status"
                        autocomplete="off"
                      />
                    </div>
                  </div>
                  <input
                    placeholder="Edit your profile picture"
                    @keydown.enter="toggle('avatar', editAvatar)"
                    v-model="editAvatar"
                    style="margin: 1px; height: fit-content"
                    id="avatar"
                    autocomplete="off"
                  />
                  <div class="profile-spacer"></div>
                  <div
                    style="height: 332px; overflow-y: auto"
                    class="scroll-bar"
                  >
                    <div v-if="store.userData?.createdAt">
                      <p>Date Created</p>
                      <p class="message-text-large">
                        {{ store.dayjsDate(store.userData?.createdAt) }}
                      </p>
                      <div class="profile-spacer"></div>
                    </div>
                    <div>
                      <p>
                        Description
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
                      <p
                        v-if="editing !== 'description'"
                        class="message-text-large"
                        style="word-wrap: break-word"
                      >
                        {{
                          store.userData?.description ||
                          `Hi, I'm ${store.userData?.username}!`
                        }}
                      </p>
                      <input
                        v-else
                        placeholder="Edit your description"
                        @keydown.enter="toggle('description', editDescription)"
                        v-model="editDescription"
                        style="margin: 1px; width: calc(100% - 2px)"
                        id="description"
                        autocomplete="off"
                      />
                    </div>
                    <div v-if="store.userData?.tetris">
                      <div class="profile-spacer"></div>
                      <p>Tetris Scores</p>
                      <p>
                        Easy mode:
                        {{ store.userData?.tetris[0].highscore_easy }} lines
                      </p>
                      <p>
                        Medium mode:
                        {{ store.userData?.tetris[1].highscore_medium }} lines
                      </p>
                      <p>
                        Hard mode:
                        {{ store.userData?.tetris[2].highscore_hard }} lines
                      </p>
                      <p>
                        God mode:
                        {{ store.userData?.tetris[3].highscore_god }} lines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="page === 'about'" class="settings-page-container">
            <h2 class="settings-text">About Better Communications</h2>
            <div>
              Better Communications is free and open-source chatting platform
              available to all
            </div>
            <div class="settings-spacer"></div>
            <div>
              Made by
              <router-link to="/">ElectricS01</router-link>
            </div>
            <div class="settings-spacer"></div>
            <div>Version: 1.189.2</div>
          </div>
          <div v-else-if="page === 'changelog'" class="settings-page-container">
            <h2 class="settings-text">Changelog</h2>
            <div>Better Communications changelog</div>
            <div class="settings-spacer"></div>
            <h2 class="settings-text">1.189 Logout button</h2>
            <div class="settings-spacer"></div>
            <ul>
              <li>
                Added a logout button in
                <router-link to="/account/account">
                  Account Settings
                </router-link>
              </li>
              <li>
                Added
                <router-link to="/account/account">
                  Security Settings
                </router-link>
              </li>
              <li>Bug fixes</li>
              <li>Updated dependencies</li>
            </ul>
            <h2 class="settings-text">1.188 Quick Switcher updates</h2>
            <div class="settings-spacer"></div>
            <ul>
              <li>You can now press on Quick Switcher items</li>
              <li>Updates to "New Messages" status indicator</li>
              <li>Bug fixes</li>
            </ul>
            <h2 class="settings-text">
              1.187 Quick Switcher communications updates
            </h2>
            <div class="settings-spacer"></div>
            <ul>
              <li>Your chats are now shown in the Quick Switcher</li>
              <li>Bug fixes</li>
              <li>Updated dependencies</li>
            </ul>
            <h2 class="settings-text">1.186 Quick Switcher History</h2>
            <div class="settings-spacer"></div>
            <ul>
              <li>
                Your most switched pages will be sorted to the top of the quick
                switcher
              </li>
              <li>Bug fixes</li>
              <li v-markdown>Finish switch to `script setup`</li>
            </ul>
            <h2 class="settings-text">1.185 Quick Switcher updates</h2>
            <div class="settings-spacer"></div>
            <ul>
              <li>Quick Switcher history will now be saved</li>
              <li>Experimental fix for context menus</li>
              <li>Fixes to the "New Messages" status indicator</li>
              <li>Fix to CSS on homepage</li>
              <li v-markdown>Switched more code to `script setup`</li>
            </ul>
            <h2 class="settings-text">1.184 Quick Switcher Added</h2>
            <div class="settings-spacer"></div>
            <ul>
              <li>Added Quick Switcher</li>
              <li>
                Added an option to not save Quick Switcher history online in
                <router-link to="/account/privacy">
                  Privacy Settings
                </router-link>
              </li>
              <li>Added a button to clear your Quick Switcher history</li>
              <li>
                Added
                <router-link to="/mapit">/mapit link</router-link>
              </li>
              <li v-markdown>Switched more code to `script setup`</li>
              <li v-markdown>Remove `VueAxios` as a dependency</li>
              <li>Refactoring</li>
              <li>Updated dependencies</li>
            </ul>
            <h2 class="settings-text">1.183 Changelog Added</h2>
            <div class="settings-spacer"></div>
            <ul>
              <li>Added changelog</li>
              <li>Added "New Messages" status indicator</li>
              <li>Fixed issue with search</li>
              <li>Fixed issue with changing status message</li>
              <li>Support for TypeScript backend</li>
              <li v-markdown>Switched more code to `script setup`</li>
              <li>Refactoring</li>
              <li>Updated dependencies</li>
            </ul>
            <div class="settings-spacer"></div>
          </div>
          <div v-else-if="page === 'admin'" class="settings-page-container">
            <h2 class="settings-text">Admin panel</h2>
            Admin info
            <div class="settings-spacer"></div>
            Feedback
            <div class="settings-spacer"></div>
            <table>
              <tr v-for="(feedback, index) in adminData" :key="feedback">
                <th>{{ feedback.id }}</th>
                <th>{{ index }}</th>
                <th>{{ feedback.userId }}</th>
                <th>{{ feedback.feedback }}</th>
                <th>{{ store.dayjsLong(feedback.createdAt) }}</th>
                <th>
                  <Icons
                    size="16"
                    icon="delete"
                    style="cursor: pointer"
                    @click="deleteFeedback(feedback.id)"
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
import Modal from "@/components/core/Modal.vue"
import Icons from "@/components/core/Icons.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"
import { useDataStore } from "@/stores/main"
import router from "@/router"
import axios from "axios"
import { useRoute } from "vue-router"
import { nextTick, ref, watch } from "vue"

const store = useDataStore()
const route = useRoute()

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
  "description"
]
const options = ["no one", "friends", "everyone"]

const modalOpen = ref(false)
const isOpen = ref(false)
const adminData = ref([])
let page = "account"
let feedbackText = ""
let editing = false
let editStatus = ""
let editDescription = ""

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
        store.error = "Error 503, Cannot Connect to Server " + e
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
  if (page === "admin") {
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
        store.error = e.message + ": " + e.response.data.message
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
      store.error = "Error 503, Cannot Connect to Server " + e
      setTimeout(store.errorFalse, 5000)
    })
}
const selectOption = (option) => {
  toggle("directMessages", option)
  isOpen.value = false
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
    return (editing = false)
  }
  axios
    .patch("/api/edit-status-message", {
      statusMessage: editStatus.trim()
    })
    .then((res) => {
      store.userData.statusMessage = res.data.statusMessage
      editing = false
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const logout = () => {
  Object.assign(axios.defaults, {
    headers: { Authorization: null }
  })
  localStorage.removeItem("token")
  router.push("/login")
}
const changeUsername = () => {
  while (true) {
    console.log("Get Better™")
  }
}
const clearHistory = () => {
  localStorage.removeItem("switcherHistory")
  axios.delete("/api/clear-history").catch((e) => {
    store.error = "Error 503, Cannot Connect to Server " + e
    setTimeout(store.errorFalse, 5000)
  })
}
const resendVerification = () => {
  axios.post("/api/resend-verification").catch((e) => {
    store.error = "Error 503, Cannot Connect to Server " + e
    setTimeout(store.errorFalse, 5000)
  })
  if (localStorage.getItem("token")) {
    store.getUser()
  }
}

async function toggle(property, value) {
  if (properties.includes(property)) {
    if (editing === "description") {
      editing = false
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
          prop: property,
          val: value
        })
        .then(() => {
          if (localStorage.getItem("token")) {
            store.getUser()
          }
        })
        .catch((e) => {
          store.error = "Error 503, Cannot Connect to Server " + e
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

if (page === "admin") {
  getAdmin()
}
watch(modalOpen, (newValue, oldValue) => {
  if (newValue === true && oldValue === false) {
    editFocus()
  }
})
</script>
