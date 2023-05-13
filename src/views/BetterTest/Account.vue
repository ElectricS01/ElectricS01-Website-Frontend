<template>
  <div class="container">
    <transition>
      <p v-if="error" class="error-banner">
        {{ error }}
      </p>
    </transition>
    <div class="grid-menu">
      <div class="settings-menu">
        <div style="display: flex">
          <div class="settings-sidebar">
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
            <div @click="changePage('about')" class="settings-item">About</div>
          </div>
          <div v-if="page === 'account'" class="settings-page">
            <h2 class="settings-text">Account</h2>
            Username: {{ $user.loggedIn?.username }}
            <div @click="changeUsername()" class="settings-button">
              Change Username
            </div>
            <div class="settings-spacer"></div>
            Email: {{ $user.loggedIn?.email }}
            <div @click="changeUsername()" class="settings-button">
              Change Email
            </div>
            <div class="settings-spacer"></div>
            Password: {{ $user.loggedIn?.password }}
            <div @click="changeUsername()" class="settings-button">
              Change Password
            </div>
            <div class="settings-spacer"></div>
            Creation date: {{ dayjs($user.loggedIn?.createdAt) }}
            <div @click="changeUsername()" class="settings-button-red">
              Close account
            </div>
          </div>
          <div v-else-if="page === 'privacy'" class="settings-page">
            <h2 class="settings-text">Privacy</h2>
            Coming soon™
          </div>
          <div v-else-if="page === 'appearance'" class="settings-page">
            <h2 class="settings-text">Appearance</h2>
            Coming soon™
          </div>
          <div v-else-if="page === 'about'" class="settings-page">
            <h2 class="settings-text">About Better Test</h2>
            <div style="word-wrap: break-word">
              Better Test is currently a chatting platform without a Better™
              name
            </div>
            <div class="settings-spacer"></div>
            <div style="word-wrap: break-word">
              Made by
              <router-link to="/">ElectricS01</router-link>
            </div>
            <div class="settings-spacer"></div>
            <div>Version: 1.126</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"

export default {
  data() {
    return {
      page: "account",
      error: "",
      pages: ["account", "privacy", "appearance", "about"],
      user: []
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
    },
    getUser() {
      if (localStorage.getItem("token")) {
        this.axios
          .get("/api/user")
          .then((res) => {
            this.$user.loggedIn = res.data
          })
          .catch((e) => {
            console.log("Error 503 Cannot Connect to Server " + e)
          })
      }
    },
    changeUsername() {
      while (true) {
        console.log("Get Better™")
      }
    },
    dayjs(date) {
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
    if (this.pages.includes(this.$route.params.id)) {
      this.page = this.$route.params.id
    } else {
      this.$router.push("/account/account")
    }
  }
}
</script>
