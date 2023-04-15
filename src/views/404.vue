<template>
  <div
    style="
      position: fixed;
      top: 48px;
      width: 100%;
      height: calc(100% - 48px);
      overflow-y: auto;
      text-align: center;
    "
  >
    <h1>Error 404: Page not found</h1>
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
