<template>
  <div class="container">
    <transition>
      <p v-if="error" class="error-banner">
        {{ error }}
      </p>
    </transition>
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <p class="message-text-large">Register</p>
          <div class="text-small">
            <label for="username">Username</label>
          </div>
          <input
            placeholder="Username"
            @keydown.enter="submit"
            class="modal-input"
            id="username"
            v-model="username"
          />
          <div class="text-small">
            <label for="email">Email</label>
          </div>
          <input
            placeholder="Email"
            @keydown.enter="submit"
            class="modal-input"
            id="email"
            v-model="email"
            type="email"
          />
          <div class="text-small">
            <label for="password">Password</label>
          </div>
          <input
            placeholder="Password"
            @keydown.enter="submit"
            class="modal-input"
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
      error: ""
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
          this.getUser()
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
          this.$user.loggedIn = res.data
        })
        .catch((e) => {
          this.error = "Error 503 Cannot Connect to Server " + e
        })
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>