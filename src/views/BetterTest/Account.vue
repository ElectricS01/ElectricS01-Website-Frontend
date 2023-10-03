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
          <div @click="changePage('appearance')" class="settings-item">
            Appearance
          </div>
          <div @click="changePage('profile')" class="settings-item">
            Profile
          </div>
          <div
            v-if="$store.userData?.admin"
            @click="changePage('admin')"
            class="settings-item"
          >
            Admin
          </div>
          <div @click="changePage('about')" class="settings-item">About</div>
          <div @click="openFeedback" class="settings-item">Any feedback?</div>
        </div>
        <div class="settings-page scroll-bar-dark">
          <div v-if="page === 'account'" class="settings-page-container">
            <h2 class="settings-text">Account</h2>
            Change your account settings
            <div class="settings-spacer"></div>
            Username: {{ $store.userData?.username }}
            <div @click="changeUsername()" class="settings-button">
              Change Username
            </div>
            <div class="settings-spacer"></div>
            Email: {{ $store.userData?.email }}
            <div @click="changeUsername()" class="settings-button">
              Change Email
            </div>
            <div class="settings-spacer"></div>
            Email verified: {{ $store.userData?.emailVerified }}
            <div
              v-if="!$store.userData?.emailVerified"
              @click="resendVerification()"
              class="settings-button"
            >
              Resend email
            </div>
            <div class="settings-spacer"></div>
            Password: {{ $store.userData?.password }}
            <div @click="changeUsername()" class="settings-button">
              Change Password
            </div>
            <div class="settings-spacer"></div>
            Creation date: {{ $store.dayjs($store.userData?.createdAt) }}
            <div class="settings-spacer"></div>
            Account ID: {{ $store.userData?.id }}
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
                <div class="dropdown-toggle" @click="toggleDropdown">
                  {{ $store.userData?.directMessages }}
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
                :checked="$store.userData?.friendRequests"
                @click="toggle('friendRequests')"
              />
              <span class="slider"></span>
            </label>
            <div class="settings-spacer"></div>
            Show the date of your accounts creation on your profile
            <label class="switch">
              <input
                type="checkbox"
                :checked="$store.userData?.showCreated"
                @click="toggle('showCreated')"
              />
              <span class="slider"></span>
            </label>
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
                    $store.userData?.banner ||
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
                        :avatar="$store.userData?.avatar"
                      ></profile-picture>
                      <svg class="online-indicator" width="20" height="20">
                        <status-indicator
                          size="8"
                          :status="$store.userData?.status"
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
                        {{ $store.userData?.username }}
                      </h4>
                      <p
                        v-if="editing !== 'status'"
                        class="message-text-large"
                        style="word-wrap: break-word"
                      >
                        {{ $store.userData?.statusMessage }}
                        <icons
                          style="cursor: pointer"
                          size="16"
                          icon="edit"
                          @click="
                            ;(editing = 'status'),
                              (editStatus = $store.userData?.statusMessage),
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
                    <div v-if="$store.userData?.createdAt">
                      <p>Date Created</p>
                      <p class="message-text-large">
                        {{ $store.dayjsDate($store.userData?.createdAt) }}
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
                              (editDescription = $store.userData?.description),
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
                          $store.userData?.description ||
                          `Hi, I'm ${$store.userData?.username}!`
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
                    <div v-if="$store.userData?.tetris">
                      <div class="profile-spacer"></div>
                      <p>Tetris Scores</p>
                      <p>
                        Easy mode:
                        {{ $store.userData?.tetris[0].highscore_easy }} lines
                      </p>
                      <p>
                        Medium mode:
                        {{ $store.userData?.tetris[1].highscore_medium }} lines
                      </p>
                      <p>
                        Hard mode:
                        {{ $store.userData?.tetris[2].highscore_hard }} lines
                      </p>
                      <p>
                        God mode:
                        {{ $store.userData?.tetris[3].highscore_god }} lines
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
            <div>Version: 1.178</div>
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
                <th>{{ $store.dayjs(feedback.createdAt) }}</th>
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

<script>
import Modal from "@/components/Modal.vue"
import Icons from "@/components/Icons.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"

export default {
  components: { StatusIndicator, ProfilePicture, Icons, Modal },
  data() {
    return {
      page: "account",
      pages: ["account", "privacy", "appearance", "profile", "about", "admin"],
      properties: [
        "directMessages",
        "friendRequests",
        "showCreated",
        "avatar",
        "banner",
        "description"
      ],
      user: [],
      editAvatar: "",
      editBanner: "",
      isOpen: false,
      options: ["no one", "friends", "everyone"],
      modalOpen: false,
      editing: false,
      editStatus: "",
      editDescription: "",
      feedbackText: "",
      adminData: []
    }
  },
  methods: {
    changePage(page) {
      if (this.pages.includes(page)) {
        this.page = page
        this.$router.push(`/account/${page}`)
      } else {
        this.page = "account"
        this.$router.push("/account/account")
      }
      if (this.page === "admin") {
        this.getAdmin()
      }
    },
    getAdmin() {
      if (localStorage.getItem("token")) {
        this.axios
          .get("/api/admin")
          .then((res) => {
            this.adminData = res.data
          })
          .catch((e) => {
            this.$store.error = "Error 503, Cannot Connect to Server " + e
            setTimeout(this.$store.errorFalse, 5000)
          })
      }
    },
    changeUsername() {
      while (true) {
        console.log("Get Better™")
      }
    },
    resendVerification() {
      this.axios.post("/api/resend-verification", {}).catch((e) => {
        this.$store.error = "Error 503, Cannot Connect to Server " + e
        setTimeout(this.$store.errorFalse, 5000)
      })
      if (localStorage.getItem("token")) {
        this.$store.getUser()
      }
    },
    async checkImage(url) {
      try {
        const res = await fetch(url)
        const buff = await res.blob()
        return buff.type.startsWith("image/")
      } catch (e) {
        this.$store.error = "Invalid image"
      }
    },
    async toggle(property, value) {
      if (this.properties.includes(property)) {
        if (this.editing === "description") {
          this.editing = false
        }
        if (
          ((property === "avatar" || property === "banner") &&
            value &&
            (await this.checkImage(value))) ||
          (property !== "avatar" && property !== "banner")
        ) {
          if (!value) {
            if (this.$store.userData) {
              value = !this.$store.userData[property]
            }
          }
          this.axios
            .post("/api/user-prop", {
              prop: property,
              val: value
            })
            .then(() => {
              if (localStorage.getItem("token")) {
                this.$store.getUser()
              }
            })
            .catch((e) => {
              this.$store.error = "Error 503, Cannot Connect to Server " + e
              setTimeout(this.$store.errorFalse, 5000)
            })
        }
      }
    },
    editStatusMessage() {
      if (
        this.editStatus.trim() === this.$store.userData.statusMessage ||
        this.editStatus.trim().length > 50
      ) {
        return (this.editing = false)
      }
      this.axios
        .patch("/api/edit-status-message", {
          statusMessage: this.editStatus.trim()
        })
        .then((res) => {
          this.$store.userData.statusMessage = res.data.statusMessage
          this.editing = false
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
        })
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    selectOption(option) {
      this.toggle("directMessages", option)
      this.isOpen = false
    },
    openFeedback() {
      this.modalOpen = true
    },
    submitFeedback() {
      this.axios
        .post("/api/feedback", {
          feedback: this.feedbackText
        })
        .catch((e) => {
          this.$store.error = "Error 503, Cannot Connect to Server " + e
          setTimeout(this.$store.errorFalse, 5000)
        })
      this.modalOpen = false
      this.feedbackText = ""
    },
    deleteFeedback(id) {
      this.axios
        .delete(`/api/delete-feedback/${id}`)
        .then(this.getAdmin)
        .catch((e) => {
          this.$store.error = "Error 503, Cannot Connect to Server " + e
          setTimeout(this.$store.errorFalse, 5000)
        })
    },
    editFocus() {
      this.$nextTick(() => {
        const feedback = document.getElementById("feedback")
        if (feedback) {
          feedback?.focus()
        }
      })
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
    if (this.pages.includes(this.$route.params.id)) {
      this.page = this.$route.params.id
    } else {
      if (this.$route.params.id === "feedback") {
        this.modalOpen = true
        console.log(this.modalOpen)
      }
      this.$router.push("/account/account")
    }
    if (this.page === "admin") {
      this.getAdmin()
    }
    this.editAvatar = this.$store.userData?.avatar
    this.editBanner = this.$store.userData?.banner
  },
  watch: {
    modalOpen(newValue, oldValue) {
      if (newValue === true && oldValue === false) {
        this.editFocus()
      }
    }
  }
}
</script>
