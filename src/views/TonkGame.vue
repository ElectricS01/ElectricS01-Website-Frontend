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
    <h3>TonkGame version 4.2.9.2 (beta 10)</h3>
    <p class="message-text-medium-gray">
      My first ever coding project, a simple 2D Top Down Shooter made
      with GameMaker Studio
    </p>
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
