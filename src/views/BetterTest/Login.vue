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
    <div style="text-align: center" class="login-menu">
      <form>
        <p class="message-text-large">Login</p>
        <div style="text-align: left" class="text-small">
          <label for="username">Username</label>
        </div>
        <input type="username" class="login-input" id="username" />
        <div style="text-align: left" class="text-small">
          <label for="password">Password</label>
        </div>
        <input type="password" class="login-input" id="password" />
        <div style="text-align: left" class="text-small">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit">Enter</button>
      </form>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
export default {
  data() {
    return {
      messages: [],
      imputUser: "",
      imputText: "",
      error: "",
      loggedIn: false
    }
  },
  methods: {
    getMessages() {
      this.axios
        .get("/api/messages")
        .then((res) => {
          this.messages = res.data
        })
        .catch(() => {
          this.error = "Error 503 Cannot Connect to Server"
        })
    },
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
    dayjs(date) {
      return dayjs(date).format("HH:mm:ss DD/MM/YYYY")
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    this.getMessages()
  }
}
</script>
