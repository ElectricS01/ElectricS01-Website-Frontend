<template>
  <div class="container scroll-bar">
    <iframe
      style="border: 0"
      title="Tetris"
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
      src="/tetrisgame.html"
      allowtransparency="true"
      id="game_drop"
      height="600"
      width="600"
    ></iframe>
    <h3>Tetris By ElectricS01 0.23</h3>
  </div>
</template>

<script>
export default {
  created() {
    window.addEventListener("beforeunload", this.leaving)
  },
  mounted() {
    console.log(this.searchLocalStorageItems("userdata.ini")[0].value)
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/tetris.ico"
  },
  methods: {
    leaving() {
      this.axios
        .patch("/api/tetris", {
          data: this.searchLocalStorageItems("userdata.ini")[0].value
        })
        .catch((e) => {
          console.log("Error 503 Cannot Connect to Server " + e)
        })
    },
    searchLocalStorageItems(searchString) {
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
  },
  unmounted() {
    this.axios
      .patch("/api/tetris", {
        data: this.searchLocalStorageItems("userdata.ini")[0].value
      })
      .catch((e) => {
        console.log("Error 503 Cannot Connect to Server " + e)
      })
    document.removeEventListener("beforeunload", this.leaving)
  }
}
</script>
