<template>
  <div class="container">
    <iframe
      title="Tetris"
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      frameborder="0"
      allowfullscreen="true"
      scrolling="no"
      src="/tetrisgame.html"
      allowtransparency="true"
      msallowfullscreen="true"
      id="game_drop"
      height="620"
      width="620"
    ></iframe>
    <h3>Tetris By ElectricS01 0.22</h3>
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
