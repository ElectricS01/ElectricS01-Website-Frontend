<template>
  <div class="container-flex scroll-bar">
    <div class="menu">
      <iframe
        id="game_drop"
        :style="minDimension"
        title="Tetris"
        allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
        src="/tetrisGame.html"
      />
      <h3>Tetris By ElectricS01 0.27</h3>
      {{
        store.userData.id
          ? "You are logged in"
          : "You are not logged in, your scores will not save to your account"
      }}
      <div class="center">
        <div v-if="store.userData.id" class="button" @click="leaving">
          Save Scores
        </div>
      </div>
      <p class="message-text-medium-gray">
        My own rendition of the popular game Tetris made with GameMaker Studio
      </p>
      <p class="message-text-medium-gray">
        <a href="https://github.com/ElectricS01/Tetris">source code</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { computed, onUnmounted } from "vue"
import { useDataStore } from "@/stores/main"
const store = useDataStore()

let viewportWidth = window.innerWidth - 16
let viewportHeight = window.innerHeight - 48

document.getElementById("favicon").href = "/icons/tetris.ico"

if (localStorage.getItem("token")) {
  setTimeout(() => {
    store.ws.send(JSON.stringify({ page: "Tetris" }))
  }, 1000)
}

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
  if (localStorage.getItem("token")) {
    axios
      .patch("/api/tetris", {
        data: searchLocalStorageItems("userdata.ini")[0].value
      })
      .catch((e) => {
        console.log(`Error 503, Cannot Connect to Server ${e}`)
      })
  }
}
const updateDimensions = () => {
  viewportWidth = window.innerWidth - 16
  viewportHeight = window.innerHeight - 48
}

const minDimension = computed(() => {
  const minWidthHeight = Math.min(viewportWidth, viewportHeight)
  return {
    height: minWidthHeight <= 720 ? `${minWidthHeight}px` : `${720}px`,
    width: minWidthHeight <= 720 ? `${minWidthHeight}px` : `${720}px`
  }
})

window.addEventListener("beforeunload", leaving)
document.addEventListener("resize", updateDimensions)

onUnmounted(() => {
  if (localStorage.getItem("token")) {
    axios
      .patch("/api/tetris", {
        data: searchLocalStorageItems("userdata.ini")[0].value
      })
      .catch((e) => {
        console.log(`Error 503, Cannot Connect to Server ${e}`)
      })
    setTimeout(() => {
      store.ws.send(JSON.stringify({ page: null }))
    }, 1000)
  }
  window.removeEventListener("beforeunload", leaving)
  document.removeEventListener("resize", updateDimensions)
})
</script>
