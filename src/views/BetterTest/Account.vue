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
          <p class="message-text-large">Your Account</p>
          Get Better
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: "",
      loggedIn: false
    }
  },
  methods: {
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
