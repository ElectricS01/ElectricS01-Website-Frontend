<template>
  <div class="container">
    <transition>
      <p v-if="error" class="error-banner">
        {{ error }}
      </p>
    </transition>
    <div class="grid-menu">
      <div class="settings-menu">
        <div>
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
            Coming soon™
            <div @click="changeUsername()" class="settings-button">
              Change Username
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
            <div style="margin-bottom: 10px; word-wrap: break-word">
              Better Test is currently a chatting platform without a Better™
              name
            </div>
            <p>
              Made by
              <router-link to="/">ElectricS01</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: "account",
      error: "",
      pages: ["account", "privacy", "appearance", "about"]
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
    changeUsername() {
      while (true) {
        console.log("Get Better™")
      }
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
