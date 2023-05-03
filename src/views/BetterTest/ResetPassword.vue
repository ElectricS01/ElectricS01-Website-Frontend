<template>
  <div class="container">
    <div class="chat-navbar">
      <router-link to="/test">Better Test</router-link>
      <router-link v-if="loggedIn" class="right" to="/account">
        Account
      </router-link>
      <router-link v-else class="right" to="/login">Login</router-link>
      <router-link class="right" to="/">Home</router-link>
    </div>
    <transition>
      <p v-if="error" class="error-banner">
        {{ error }}
      </p>
    </transition>
    <div class="grid-login">
      <div class="reset-menu">
        <div class="login-card">
          <p class="message-text-large">Reset Password</p>
          <div class="text-small">
            <label for="email">Email</label>
          </div>
          <input
            @keydown.enter="submit"
            class="login-input"
            id="email"
            type="email"
          />
          <div class="text-small">
            <router-link class="text-small" to="/login">
              Back to Login
            </router-link>
          </div>
          <button type="submit">Enter</button>
        </div>
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
          messageContents: this.inputText
        })
        .then(() => {
          this.getMessages()
          this.imputUser = ""
          this.inputText = ""
        })
        .catch((e) => {
          this.error = e.response.data.message
        })
    },
    getUser() {
      this.axios
        .get("/api/user")
        .then((res) => {
          this.loggedIn = res.data
        })
        .catch((e) => {
          this.error = "Error 503 Cannot Connect to Server " + e
        })
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"

    this.getUser()
  }
}
</script>
