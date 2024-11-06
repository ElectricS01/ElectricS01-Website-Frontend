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
      <h3>Tetris By ElectricS01 0.28</h3>
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
    const lines =
      searchLocalStorageItems("userdata.ini")[0]?.value.split("\r\n")
    if (lines) {
      const nonEmptyLines = lines.filter(
        (line) => line.trim() !== "" && line.includes("=")
      )

      const keyValuePairs = nonEmptyLines.map((line) => {
        const separatorIndex = line.indexOf("=")
        const key = line.slice(0, separatorIndex).trim()
        let value = line.slice(separatorIndex + 1).trim()

        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        }

        return { key, value }
      })

      const pairs = keyValuePairs.map((pair) => ({
        [pair.key]: pair.value
      }))
      axios
        .patch("/api/score", {
          gameId: 1,
          scores: [
            { difficulty: 0, value: parseInt(pairs[0].highscore_easy) },
            { difficulty: 1, value: parseInt(pairs[1].highscore_medium) },
            { difficulty: 2, value: parseInt(pairs[2].highscore_hard) },
            { difficulty: 3, value: parseInt(pairs[3].highscore_god) },
            { difficulty: 4, value: parseInt(pairs[4].highscore_ultra) }
          ]
        })
        .catch((e) => {
          console.log(`Error 503, Cannot Connect to Server ${e}`)
        })
    }
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
  leaving()
  window.removeEventListener("beforeunload", leaving)
  document.removeEventListener("resize", updateDimensions)
})
</script>
