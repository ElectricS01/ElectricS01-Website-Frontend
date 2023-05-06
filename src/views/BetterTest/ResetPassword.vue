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
          <p class="message-text-large">Reset Password</p>
          <div class="text-small">
            <label for="email">Email</label>
          </div>
          <input
            @keydown.enter="submit"
            class="modal-input"
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
      error: ""
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
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
