<template>
  <div class="container scroll-bar">
    <p class="title">Error 404: Page not found</p>
    <router-link class="button" to="/">Return to Home</router-link>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"

const route = useRoute()

document.getElementById("favicon").href = "/icons/favicon.ico"

if (route.path.toLowerCase().startsWith("/mapit")) {
  window.location.href = "https://mapit.electrics01.com"
} else if (
  route.path.toLowerCase().startsWith("/schedule") ||
  route.path.toLowerCase().startsWith("/scheduler")
) {
  window.location.href = "https://scheduler.electrics01.com"
} else if (route.path.toLowerCase().startsWith("/planit")) {
  window.location.href = "https://planit.electrics01.com"
}
</script>
