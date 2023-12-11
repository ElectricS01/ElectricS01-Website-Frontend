<template>
  <div class="container scroll-bar">
    <iframe
      id="game_drop"
      :style="minDimension"
      title="Tetris"
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
      src="/tetrisGame.html"
      allowtransparency="true"
    />
    <h3>Tetris By ElectricS01 0.25</h3>
    <p class="message-text-medium-gray">
      My own rendition of the popular game Tetris made with GameMaker Studio
    </p>
    <p class="message-text-medium-gray">
      <a href="https://github.com/ElectricS01/Tetris">source code</a>
    </p>
  </div>
</template>

<script setup>
import axios from "axios"
import { computed, onUnmounted } from "vue"

let viewportWidth = window.innerWidth - 16
let viewportHeight = window.innerHeight - 48

document.getElementById("favicon").href = "/icons/tetris.ico"

const searchLocalStorageItems = (searchString) => {
  const matchingItems = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.includes(searchString)) {
      const value = localStorage.getItem(key)
      matchingItems.push({ key, value })
    }
  }
  return matchingItems
}
const leaving = () => {
  axios
    .patch("/api/tetris", {
      data: searchLocalStorageItems("userdata.ini")[0].value
    })
    .catch((e) => {
      console.log(`Error 503, Cannot Connect to Server ${e}`)
    })
}
const updateDimensions = () => {
  viewportWidth = window.innerWidth - 16
  viewportHeight = window.innerHeight - 48
}

const minDimension = computed(() => {
  const minWidthHeight = Math.min(viewportWidth, viewportHeight)
  return {
    width: minWidthHeight <= 600 ? `${minWidthHeight}px` : `${600}px`,
    height: minWidthHeight <= 600 ? `${minWidthHeight}px` : `${600}px`
  }
})

window.addEventListener("beforeunload", leaving)
document.addEventListener("resize", updateDimensions)

onUnmounted(() => {
  axios
    .patch("/api/tetris", {
      data: searchLocalStorageItems("userdata.ini")[0].value
    })
    .catch((e) => {
      console.log(`Error 503, Cannot Connect to Server ${e}`)
    })
  window.removeEventListener("beforeunload", leaving)
  document.removeEventListener("resize", updateDimensions)
})
</script>
