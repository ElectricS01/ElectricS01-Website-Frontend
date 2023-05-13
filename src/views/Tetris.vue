<template>
  <div class="container scroll-bar">
    <iframe
      style="border: 0"
      title="Tetris"
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
      src="/tetrisgame.html"
      allowtransparency="true"
      id="game_drop"
      height="600"
      width="600"
    ></iframe>
    <h3>Tetris By ElectricS01 0.23</h3>
  </div>
</template>

<script>
export default {
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/tetris.ico"
  }
}
</script>
