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
          <div
            @click="changePage('account')"
            class="settings-item"
            style="border-top-left-radius: 25px"
          >
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
            v-if="$store.loggedIn?.admin"
            @click="changePage('admin')"
            class="settings-item"
          >
            Admin
          </div>
          <div @click="changePage('about')" class="settings-item">About</div>
          <div @click="openFeedback" class="settings-item">Any feedback?</div>
        </div>
        <div class="settings-page scroll-bar-dark">
          <div v-if="page === 'account'" style="width: fit-content">
            <h2 class="settings-text">Account</h2>
            Change your account settings
            <div class="settings-spacer"></div>
            Username: {{ $store.loggedIn?.username }}
            <div @click="changeUsername()" class="settings-button">
              Change Username
            </div>
            <div class="settings-spacer"></div>
            Email: {{ $store.loggedIn?.email }}
            <div @click="changeUsername()" class="settings-button">
              Change Email
            </div>
            <div class="settings-spacer"></div>
            Email verified: {{ $store.loggedIn?.emailVerified }}
            <div
              v-if="!$store.loggedIn?.emailVerified"
              @click="resendVerification()"
              class="settings-button"
            >
              Resend email
            </div>
            <div class="settings-spacer"></div>
            Password: {{ $store.loggedIn?.password }}
            <div @click="changeUsername()" class="settings-button">
              Change Password
            </div>
            <div class="settings-spacer"></div>
            Creation date: {{ $store.dayjs($store.loggedIn?.createdAt) }}
            <div class="settings-spacer"></div>
            Account ID: {{ $store.loggedIn?.id }}
            <div class="settings-spacer"></div>
            <div @click="changeUsername()" class="settings-button-red">
              Close account
            </div>
          </div>
          <div v-else-if="page === 'privacy'" style="width: fit-content">
            <h2 class="settings-text">Privacy</h2>
            Change your privacy settings
            <div class="settings-spacer"></div>
            Allow direct messages from
            <div>
              <div class="dropdown">
                <div class="dropdown-toggle" @click="toggleDropdown">
                  {{ $store.loggedIn?.directMessages }}
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
                :checked="$store.loggedIn?.friendRequests"
                @click="toggle('friendRequests')"
              />
              <span class="slider"></span>
            </label>
            <div class="settings-spacer"></div>
            Show the date of your accounts creation on your profile
            <label class="switch">
              <input
                type="checkbox"
                :checked="$store.loggedIn?.showCreated"
                @click="toggle('showCreated')"
              />
              <span class="slider"></span>
            </label>
          </div>
          <div v-else-if="page === 'appearance'" style="width: fit-content">
            <h2 class="settings-text">Appearance</h2>
            Change your appearance settings
            <div class="settings-spacer"></div>
            Coming soon™
          </div>
          <div v-else-if="page === 'profile'" style="width: fit-content">
            <h2 class="settings-text">Profile</h2>
            Change your profile settings
            <div class="settings-spacer"></div>
            Coming soon™
          </div>
          <div v-else-if="page === 'about'" style="width: fit-content">
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
            <div>Version: 1.145</div>
          </div>
          <div v-else-if="page === 'admin'" style="width: fit-content">
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

export default {
  components: { Icons, Modal },
  data() {
    return {
      page: "account",
      pages: ["account", "privacy", "appearance", "profile", "about", "admin"],
      properties: ["directMessages", "friendRequests", "showCreated"],
      user: [],
      isOpen: false,
      options: ["no one", "friends", "everyone"],
      modalOpen: false,
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
    getUser() {
      if (localStorage.getItem("token")) {
        this.axios
          .get("/api/user")
          .then((res) => {
            this.$store.loggedIn = res.data
          })
          .catch((e) => {
            this.$store.error = "Error 503, Cannot Connect to Server " + e
            setTimeout(this.$store.errorFalse, 5000)
          })
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
      this.getUser()
    },
    toggle(property, value) {
      if (this.properties.includes(property)) {
        if (!value) {
          if (this.$store.loggedIn) {
            value = !this.$store.loggedIn[property]
          }
        }
        this.axios
          .post("/api/user-prop", {
            prop: property,
            val: value
          })
          .then(() => {
            this.getUser()
          })
          .catch((e) => {
            this.$store.error = "Error 503, Cannot Connect to Server " + e
            setTimeout(this.$store.errorFalse, 5000)
          })
      }
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
