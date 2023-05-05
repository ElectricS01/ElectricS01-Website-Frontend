<template>
  <div class="container">
    <h2>Error 404: Page not found</h2>
    <div class="button">
      <router-link to="/">Return to Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
