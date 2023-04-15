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
    <iframe
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      frameborder="0"
      allowfullscreen="true"
      scrolling="no"
      src="/game.html"
      allowtransparency="true"
      msallowfullscreen="true"
      id="game_drop"
      height="560"
      width="980"
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
