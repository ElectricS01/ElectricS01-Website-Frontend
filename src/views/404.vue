<template>
  <div class="container scroll-bar">
    <h2>Error 404: Page not found</h2>
    <div class="button">
      <router-link to="/">Return to Home</router-link>
    </div>
  </div>
</template>

<script setup>
const favicon = document.getElementById("favicon")
favicon.href = "/icons/favicon.ico"
</script>
