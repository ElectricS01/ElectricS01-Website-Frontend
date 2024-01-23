<template>
  <div class="container scroll-bar">
    <iframe
      id="game_drop"
      :style="minDimension"
      title="Collider"
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
      src="/colliderGame.html"
      allowtransparency="true"
    />
    <h3>Collider By ElectricS01</h3>
    <p class="message-text-medium-gray">
      Inspired by
      <a href="https://github.com/KDE/kollision">Kollision</a>
    </p>
    <p class="message-text-medium-gray">
      <a href="https://github.com/ElectricS01/Collider">source code</a>
    </p>
  </div>
</template>

<script setup>
// import axios from "axios"
import { computed, onUnmounted } from "vue"

let viewportWidth = window.innerWidth - 16
let viewportHeight = window.innerHeight - 48

document.getElementById("favicon").href = "/icons/favicon.ico"

// const searchLocalStorageItems = (searchString) => {
//   const matchingItems = []
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i)
//     if (key.includes(searchString)) {
//       const value = localStorage.getItem(key)
//       matchingItems.push({ key, value })
//     }
//   }
//   return matchingItems
// }
// const leaving = () => {
//   if (localStorage.getItem("token")) {
//     axios
//       .patch("/api/tetris", {
//         data: searchLocalStorageItems("userdata.ini")[0].value
//       })
//       .catch((e) => {
//         console.log("Error 503, Cannot Connect to Server " + e)
//       })
//   }
// }
const updateDimensions = () => {
  viewportWidth = window.innerWidth - 16
  viewportHeight = window.innerHeight - 48
}

const minDimension = computed(() => {
  const minWidthHeight = Math.min(viewportWidth, viewportHeight)
  return {
    height: minWidthHeight <= 600 ? `${minWidthHeight}px` : `${600}px`,
    width: minWidthHeight <= 600 ? `${minWidthHeight}px` : `${600}px`
  }
})

// window.addEventListener("beforeunload", leaving)
window.addEventListener("resize", updateDimensions)

onUnmounted(() => {
  // if (localStorage.getItem("token")) {
  //   axios
  //     .patch("/api/tetris", {
  //       data: searchLocalStorageItems("userdata.ini")[0].value
  //     })
  //     .catch((e) => {
  //       console.log("Error 503, Cannot Connect to Server " + e)
  //     })
  // }
  // document.removeEventListener("beforeunload", leaving)
  window.removeEventListener("resize", updateDimensions)
})
</script>
