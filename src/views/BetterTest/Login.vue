<template>
  <div class="container">
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <p class="message-text-large">Login</p>
          <div class="text-small">
            <label class="text-small" for="username">Username</label>
          </div>
          <input
            placeholder="Username"
            @keydown.enter="submit"
            class="modal-input"
            v-model="username"
            id="username"
          />
          <div class="text-small">
            <label for="password">Password</label>
          </div>
          <input
            placeholder="Password"
            @keydown.enter="submit"
            type="password"
            class="modal-input"
            v-model="password"
            id="password"
          />
          <div style="display: flex; justify-content: space-between">
            <div class="text-small">
              <router-link class="text-small" to="/reset">
                Forgot Password?
              </router-link>
            </div>
            <div class="text-small">
              <router-link class="text-small" to="/register">
                Register?
              </router-link>
            </div>
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
      password: ""
    }
  },
  methods: {
    submit() {
      this.$store.error = ""
      this.axios
        .post("/api/login", {
          username: this.username.toLowerCase().trim(),
          password: this.password.trim()
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token)
          Object.assign(this.axios.defaults, {
            headers: { Authorization: res.data.token }
          })
          this.getUser()
          this.$router.push("/test")
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    getUser() {
      this.axios
        .get("/api/user")
        .then((res) => {
          this.$store.loggedIn = res.data
        })
        .catch((e) => {
          this.$store.error = "Error 503, Cannot Connect to Server " + e
        })
    },
    errorFalse() {
      this.$store.error = false
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
