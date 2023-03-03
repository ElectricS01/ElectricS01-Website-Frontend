<template>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link v-if="loggedIn" class="right" to="/account">
      Account
    </router-link>
    <router-link v-else class="right" to="/login">Login</router-link>
    <router-link class="right" to="/">Home</router-link>
    <a class="icon" @click="responsive_topnav()">☰</a>
  </div>
  <transition>
    <p v-if="error" class="error-button">
      {{ error }}
    </p>
  </transition>
  <div class="grid-login">
    <div style="text-align: center" class="login-menu">
      <div class="login-card">
        <p class="message-text-large">Login</p>
        <div style="text-align: left" class="text-small">
          <label for="username">Username</label>
        </div>
        <input
          @keydown.enter="submit"
          class="login-input"
          v-model="username"
          id="username"
        />
        <div style="text-align: left" class="text-small">
          <label for="password">Password</label>
        </div>
        <input
          @keydown.enter="submit"
          type="password"
          class="login-input"
          v-model="password"
          id="password"
        />
        <div style="display: flex; justify-content: space-between">
          <div class="text-small">
            <router-link to="/resetpassword">Forgot Password?</router-link>
          </div>
          <div class="text-small">
            <router-link to="/register">Register?</router-link>
          </div>
        </div>
        <button @click="submit">Enter</button>
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
        .post("/api/login", {
          username: this.username,
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
    },
    responsive_topnav() {
      const responsive_topnav = document.getElementById("mobile-topnav")
      if (responsive_topnav.className === "topnav") {
        responsive_topnav.className += " responsive"
      } else {
        responsive_topnav.className = "topnav"
      }
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    this.user()
  }
}
</script>
