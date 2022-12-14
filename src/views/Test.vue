<template>
  <div style="text-align: center;">
    <p>Better Test</p>
  </div>
</template>

<script>
export default {
  mounted() {
    const favicon = document.getElementById("favicon");
    favicon.href = "/icons/mainicon.ico";
  }
}
</script>