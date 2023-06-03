<template>
  <div class="container">
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <div v-if="success">An email has been sent to {{ email }}</div>
          <div v-else>
            <p class="message-text-large">Reset Password</p>
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
              <router-link class="text-small" to="/login">
                Back to Login
              </router-link>
            </div>
            <button @click="submit">Enter</button>
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
      email: "",
      success: false
    }
  },
  methods: {
    submit() {
      this.$store.error = ""
      this.axios
        .post("/api/reset-email", {
          email: this.email.toLowerCase().trim()
        })
        .then(() => {
          this.success = true
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
