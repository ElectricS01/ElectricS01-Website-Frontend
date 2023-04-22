<template>
  <header>
    <div class="navbar" id="mobile-navbar" v-if="navbarShown">
      <router-link class="main" to="/" @click="responsive_navbar(true)">
        Home
      </router-link>
      <router-link
        to="/tonkgame"
        :class="{ active: active('/tonkgame') }"
        @click="responsive_navbar()"
      >
        TonkGame
      </router-link>
      <router-link
        to="/calculator"
        :class="{ active: active('/calculator') }"
        @click="responsive_navbar()"
      >
        Calculator
      </router-link>
      <router-link
        to="/tetris"
        :class="{ active: active('/tetris') }"
        @click="responsive_navbar()"
      >
        Tetris
      </router-link>
      <a href="https://bettercompassclub.netlify.app">BetterCompass Club</a>
      <router-link
        v-if="$data"
        class="right"
        to="/account"
        @click="responsive_navbar()"
      >
        Account
      </router-link>
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
  data() {
    return {
      error: "",
      loggedIn: false
    }
  },
  methods: {
    getUser() {
      this.axios
        .get("/api/user")
        .then((res) => {
          this.loggedIn = res.data
        })
        .catch((e) => {
          console.log("Error 503 Cannot Connect to Server " + e)
        })
    },
    active(route) {
      return route === this.$route.path
    },
    responsive_navbar(override) {
      const responsive_navbar = document.getElementById("mobile-navbar")
      if (!override) {
        if (responsive_navbar.className === "navbar") {
          responsive_navbar.className += " responsive"
        } else {
          responsive_navbar.className = "navbar"
        }
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
    this.getUser()
  }
}
</script>
