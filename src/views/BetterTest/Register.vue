<template>
  <div class="container">
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
      password: ""
    }
  },
  methods: {
    submit() {
      this.$store.error = ""
      this.axios
        .post("/api/register", {
          username: this.username.trim(),
          email: this.email.toLowerCase().trim(),
          password: this.password.trim()
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token)
          Object.assign(this.axios.defaults, {
            headers: { Authorization: res.data.token }
          })
          this.$store.getUser()
          this.$router.push("/chat")
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
        })
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
