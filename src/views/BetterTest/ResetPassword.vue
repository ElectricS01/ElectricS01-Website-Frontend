<template>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link v-if="loggedIn" class="right" to="/account"
      >Account</router-link
    >
    <router-link v-else class="right" to="/login">Login</router-link>
    <router-link class="right" to="/">Home</router-link>
  </div>
  <div class="grid-login">
    <div style="text-align: center" class="reset-menu">
      <div class="login-card">
        <p class="message-text-large">Reset Password</p>
        <div style="text-align: left" class="text-small">
          <label for="email">Email</label>
        </div>
        <input
          @keydown.enter="submit"
          class="login-input"
          id="email"
          type="email"
        />
        <div style="text-align: left" class="text-small">
          <router-link to="/login">Back to Login</router-link>
        </div>
        <button type="submit">Enter</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
      loggedIn: false
    }
  },
  methods: {
    submit() {
      this.error = ""
      this.axios
        .post("/api/message", {
          userName: this.imputUser,
          messageContents: this.imputText
        })
        .then(() => {
          this.getMessages()
          this.imputUser = ""
          this.imputText = ""
        })
        .catch((e) => {
          this.error = e.response.data.message
        })
    },
    user() {
      this.axios.get("/api/user").then((res) => {
        this.loggedIn = res.data
      })
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    this.user()
  }
}
</script>
