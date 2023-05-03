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
      <div class="register-menu">
        <div class="login-card">
          <p class="message-text-large">Register</p>
          <div class="text-small">
            <label for="username">Username</label>
          </div>
          <input
            @keydown.enter="submit"
            class="login-input"
            id="username"
            v-model="username"
          />
          <div class="text-small">
            <label for="email">Email</label>
          </div>
          <input
            @keydown.enter="submit"
            class="login-input"
            id="email"
            v-model="email"
            type="email"
          />
          <div class="text-small">
            <label for="password">Password</label>
          </div>
          <input
            @keydown.enter="submit"
            class="login-input"
            id="password"
            v-model="password"
            type="password"
          />
          <div class="text-small">
            <router-link class="text-small" to="/login">
              Back to Login
            </router-link>
          </div>
          <button @click="submit">Enter</button>
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
      email: "",
      password: "",
      error: "",
      loggedIn: false
    }
  },
  methods: {
    submit() {
      this.error = ""
      this.axios
        .post("/api/register", {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token)
          Object.assign(this.axios.defaults, {
            headers: { Authorization: res.data.token }
          })
          this.$router.push("/test")
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
