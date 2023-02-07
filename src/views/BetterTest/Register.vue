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
    <div style="text-align: center" class="register-menu">
      <div class="login-card">
        <p class="message-text-large">Register</p>
        <div style="text-align: left" class="text-small">
          <label for="username">Username</label>
        </div>
        <input
          @keydown.enter="submit"
          class="login-input"
          id="username"
          v-model="username"
        />
        <div style="text-align: left" class="text-small">
          <label for="email">Email</label>
        </div>
        <input
          @keydown.enter="submit"
          class="login-input"
          id="email"
          v-model="email"
          type="email"
        />
        <div style="text-align: left" class="text-small">
          <label for="password">Password</label>
        </div>
        <input
          @keydown.enter="submit"
          class="login-input"
          id="password"
          v-model="password"
          type="password"
        />
        <div style="text-align: left" class="text-small">
          <router-link to="/login">Back to Login</router-link>
        </div>
        <button>Enter</button>
        <div class="error-message">
          {{ error }}
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
