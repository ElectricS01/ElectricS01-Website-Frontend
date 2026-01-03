<template>
  <div class="container-flex scroll-bar">
    <div class="menu">
      <iframe
        id="game_drop"
        title="TonkGame"
        allow="
          autoplay;
          fullscreen *;
          geolocation;
          microphone;
          camera;
          midi;
          xr-spatial-tracking;
          gamepad;
          gyroscope;
          accelerometer;
          cross-origin-isolated;
        "
        src="/game.html"
        height="540"
        width="960"
      />
      <h3>TonkGame version 4.3.1.0 (beta 2)</h3>
      <p class="message-text-medium-gray">
        My first ever coding project, a simple 2D Top Down Shooter made with
        GameMaker Studio
      </p>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted } from "vue"
import { useDataStore } from "@/store"
const store = useDataStore()

document.getElementById("favicon").href = "/icons/tonkgameIcon.ico"

if (localStorage.getItem("token")) {
  setTimeout(() => {
    store.ws.send(JSON.stringify({ page: "TonkGame" }))
  }, 1000)
}

onUnmounted(() => {
  if (localStorage.getItem("token")) {
    setTimeout(() => {
      store.ws.send(JSON.stringify({ page: null }))
    }, 1000)
  }
})
</script>
