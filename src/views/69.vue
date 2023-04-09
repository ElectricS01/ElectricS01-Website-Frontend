<template>
  <div style="text-align: center">
    <h1>Error 69: Nice</h1>
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
