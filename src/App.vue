<template>
  <header>
    <div class="navbar" id="mobile-navbar" v-if="navbarShown">
      <router-link class="main" to="/">Home</router-link>
      <router-link to="/tonkgame" :class="{ active: active('/tonkgame') }">
        TonkGame
      </router-link>
      <router-link to="/calculator" :class="{ active: active('/calculator') }">
        Calculator
      </router-link>
      <router-link to="/tetris" :class="{ active: active('/tetris') }">
        Tetris
      </router-link>
      <a href="https://bettercompassclub.netlify.app">BetterCompass Club</a>
      <a class="icon" @click="responsive_navbar()">☰</a>
    </div>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script>
export default {
  name: "App",
  methods: {
    active(route) {
      return route === this.$route.path
    },
    responsive_navbar() {
      const responsive_navbar = document.getElementById("mobile-navbar")
      if (responsive_navbar.className === "navbar") {
        responsive_navbar.className += " responsive"
      } else {
        responsive_navbar.className = "navbar"
      }
    }
  },
  computed: {
    navbarShown() {
      return (
        this.$route.path !== "/test" &&
        this.$route.path !== "/login" &&
        this.$route.path !== "/register" &&
        this.$route.path !== "/account" &&
        this.$route.path !== "/resetpassword"
      )
    }
  },
  mounted() {
    Object.assign(this.axios.defaults, {
      headers: { Authorization: localStorage.getItem("token") }
    })
  }
}
</script>
