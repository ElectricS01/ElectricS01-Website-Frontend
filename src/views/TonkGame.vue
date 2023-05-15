<template>
  <div class="container scroll-bar">
    <iframe
      style="border: 0"
      title="TonkGame"
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
      src="/game.html"
      allowtransparency="true"
      id="game_drop"
      height="540"
      width="960"
    ></iframe>
    <h3>TonkGame version 4.2.5 (beta 6)</h3>
  </div>
</template>

<script>
export default {
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/tonkgameicon.ico"
  }
}
</script>
