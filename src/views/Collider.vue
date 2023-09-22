<template>
  <div class="container scroll-bar">
    <iframe
      style="border: 0"
      :style="minDimension"
      title="Collider"
      allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; xr-spatial-tracking; gamepad; gyroscope; accelerometer; cross-origin-isolated"
      src="/collidergame.html"
      allowtransparency="true"
      id="game_drop"
    ></iframe>
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

<script>
export default {
  data() {
    return {
      viewportWidth: window.innerWidth - 16,
      viewportHeight: window.innerHeight - 48
    }
  },
  // created() {
  //   window.addEventListener("beforeunload", this.leaving)
  // },
  // mounted() {
  //   console.log(this.searchLocalStorageItems("userdata.ini")[0].value)
  //   const favicon = document.getElementById("favicon")
  //   favicon.href = "/icons/tetris.ico"
  //   window.addEventListener("resize", this.updateDimensions)
  // },
  methods: {
    // leaving() {
    //   this.axios
    //     .patch("/api/tetris", {
    //       data: this.searchLocalStorageItems("userdata.ini")[0].value
    //     })
    //     .catch((e) => {
    //       console.log("Error 503, Cannot Connect to Server " + e)
    //     })
    // },
    // searchLocalStorageItems(searchString) {
    //   const matchingItems = []
    //
    //   for (let i = 0; i < localStorage.length; i++) {
    //     const key = localStorage.key(i)
    //
    //     if (key.includes(searchString)) {
    //       const value = localStorage.getItem(key)
    //       matchingItems.push({ key, value })
    //     }
    //   }
    //
    //   return matchingItems
    // },
    updateDimensions() {
      this.viewportWidth = window.innerWidth - 16
      this.viewportHeight = window.innerHeight - 48
    }
  },
  computed: {
    minDimension() {
      const minWidthHeight = Math.min(this.viewportWidth, this.viewportHeight)
      return {
        width: minWidthHeight <= 600 ? minWidthHeight + "px" : 600 + "px",
        height: minWidthHeight <= 600 ? minWidthHeight + "px" : 600 + "px"
      }
    }
  },
  unmounted() {
    // this.axios
    //   .patch("/api/tetris", {
    //     data: this.searchLocalStorageItems("userdata.ini")[0].value
    //   })
    //   .catch((e) => {
    //     console.log("Error 503, Cannot Connect to Server " + e)
    //   })
    // document.removeEventListener("beforeunload", this.leaving)
    window.removeEventListener("resize", this.updateDimensions)
  },
  beforeRouteLeave() {
    window.removeEventListener("resize", this.updateDimensions)
  }
}
</script>
