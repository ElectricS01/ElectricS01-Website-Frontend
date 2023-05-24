<template>
  <div class="container">
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
            Password: {{ $store.loggedIn?.password }}
            <div @click="changeUsername()" class="settings-button">
              Change Password
            </div>
            <div class="settings-spacer"></div>
            Creation date: {{ dayjs($store.loggedIn?.createdAt) }}
            <div @click="changeUsername()" class="settings-button-red">
              Close account
            </div>
          </div>
          <div v-else-if="page === 'privacy'" class="settings-page">
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
          <div v-else-if="page === 'appearance'" class="settings-page">
            <h2 class="settings-text">Appearance</h2>
            Change your appearance settings
            <div class="settings-spacer"></div>
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
            <div>Version: 1.131</div>
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
      pages: ["account", "privacy", "appearance", "about"],
      properties: ["directMessages", "friendRequests", "showCreated"],
      user: [],
      isOpen: false,
      options: ["no one", "friends", "everyone"]
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
            this.$store.loggedIn = res.data
          })
          .catch((e) => {
            this.$store.error = "Error 503, Cannot Connect to Server " + e
            setTimeout(this.errorFalse, 5000)
          })
      }
    },
    changeUsername() {
      while (true) {
        console.log("Get Better™")
      }
    },
    toggle(property, value) {
      if (this.properties.includes(property)) {
        if (!value) {
          value = !this.$store.loggedIn[property]
          console.log("e")
        }
        console.log(property)
        console.log(this.$store.loggedIn[property])
        console.log(value)
        this.axios
          .post("/api/user-prop", {
            prop: property,
            val: value
          })
          .then(() => {
            this.getUser()
            console.log(property)
            console.log(this.$store.loggedIn[property])
          })
          .catch((e) => {
            this.$store.error = "Error 503, Cannot Connect to Server " + e
            setTimeout(this.errorFalse, 5000)
          })
      }
    },
    dayjs(date) {
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
    },
    errorFalse() {
      this.$store.error = false
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    selectOption(option) {
      this.toggle("directMessages", option)
      this.isOpen = false
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
