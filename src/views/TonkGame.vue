<template>
  <div style="text-align: center;">
    <iframe allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated" webkitallowfullscreen="true" mozallowfullscreen="true" frameborder="0" allowfullscreen="true" scrolling="no" src="/game.html" allowtransparency="true" msallowfullscreen="true" id="game_drop" height = '560' width = '980'></iframe>
    <h3>TonkGame version 4.2.3 (beta 4)</h3>
  </div>
</template>

<script>
export default {
  mounted() {
    const favicon = document.getElementById("favicon");
    favicon.href = "/icons/tonkgameicon.ico";
  }
}
</script>