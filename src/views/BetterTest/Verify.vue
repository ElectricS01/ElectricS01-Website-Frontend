<template>
  <div class="container">
    <div class="grid-menu">
      <div class="menu">
        <div class="grid-card">
          <p>Verify your account</p>
          <button style="margin-top: 12px" @click="submit">Verify</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    submit() {
      this.$store.error = ""
      this.axios
        .post("/api/verify", {
          token: this.$route.query.token
        })
        .then(() => {
          this.axios
            .get("/api/user")
            .then((res) => {
              this.$store.loggedIn = res.data
            })
            .catch((e) => {
              this.$store.error = "Error 503, Cannot Connect to Server " + e
            })
          this.$router.push("/test")
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
