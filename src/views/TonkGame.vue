<template>
  <div class="container-flex scroll-bar">
    <div class="menu">
      <iframe
        id="game_drop"
        title="TonkGame"
        allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
        src="/game.html"
        height="540"
        width="960"
      />
      <h3>TonkGame version 4.3.0.0 (beta 1)</h3>
      <p class="message-text-medium-gray">
        My first ever coding project, a simple 2D Top Down Shooter made with
        GameMaker Studio
      </p>
    </div>
  </div>
</template>

<script setup>
document.getElementById("favicon").href = "/icons/tonkgameIcon.ico"
</script>
