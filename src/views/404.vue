<template>
  <div class="container scroll-bar">
    <h2>Error 404: Page not found</h2>
    <div class="button">
      <router-link to="/">Return to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

document.getElementById("favicon").href = "/icons/favicon.ico"
onMounted(() => {
  if (route.path.toLowerCase().startsWith("/mapit")) {
    window.location.href = "https://mapit.electrics01.com"
  } else if (route.path.toLowerCase().startsWith("/schedule")) {
    window.location.href = "https://scheduler.electrics01.com"
  }
})
</script>
