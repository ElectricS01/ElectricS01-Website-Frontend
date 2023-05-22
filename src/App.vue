<template>
  <header>
    <div class="navbar" id="mobile-navbar" v-if="navbarShown">
      <router-link class="main" to="/" @click="responsive_navbar(true)">
        ElectricS01.com
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
        v-if="$store.loggedIn"
        class="right"
        to="/account"
        @click="responsive_navbar()"
      >
        Account
      </router-link>
      <div class="icon-mobile" @click="responsive_navbar()">☰</div>
    </div>
    <div class="chat-navbar" v-else>
      <router-link to="/test">Better Test</router-link>
      <router-link
        v-if="$store.loggedIn"
        class="right"
        to="/account"
        style="width: 28px; height: 28px; padding: 10px"
      >
        <Icons size="28" icon="settings" />
      </router-link>
      <router-link v-else class="right" to="/login">Login</router-link>
      <router-link class="right" to="/">Home</router-link>
      <div
        @click="toggleSidebar"
        class="right"
        style="width: 28px; height: 28px; padding: 10px"
      >
        <Icons size="28" icon="account" />
      </div>
      <div
        @click="toggleSearch"
        class="right"
        style="width: 28px; height: 28px; padding: 10px"
      >
        <Icons size="28" icon="search" />
      </div>
    </div>
    <transition>
      <p v-if="$store.error" class="error-banner">
        {{ $store.error }}
      </p>
    </transition>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script>
import Icons from "@/components/Icons.vue"

export default {
  name: "App",
  components: { Icons },
  methods: {
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
    },
    toggleSidebar() {
      if (
        localStorage.getItem("sidebarOpen") !== "true" ||
        this.$store.search === true
      ) {
        localStorage.setItem("sidebarOpen", "true")
        this.$store.search = false
      } else {
        localStorage.setItem("sidebarOpen", "false")
        this.$store.search = false
      }
      this.$store.sidebarOpen = localStorage.getItem("sidebarOpen")
    },
    toggleSearch() {
      this.$store.search = !this.$store.search
    },
    errorFalse() {
      this.$store.error = false
    }
  },
  computed: {
    navbarShown() {
      return (
        !this.$route.path.startsWith("/test") &&
        !this.$route.path.startsWith("/login") &&
        !this.$route.path.startsWith("/register") &&
        !this.$route.path.startsWith("/account") &&
        !this.$route.path.startsWith("/reset")
      )
    }
  },
  created() {
    Object.assign(this.axios.defaults, {
      headers: { Authorization: localStorage.getItem("token") }
    })
    if (localStorage.getItem("token")) {
      this.axios
        .get("/api/user")
        .then((res) => {
          this.$store.loggedIn = res.data
        })
        .catch((e) => {
          this.$store.error = "Error 503, Cannot Connect to Server " + e
        })
    }
    if (localStorage.getItem("sidebarOpen")) {
      this.$store.sidebarOpen = localStorage.getItem("sidebarOpen")
    } else {
      this.$store.sidebarOpen = false
    }
    if (localStorage.getItem("sortUsers")) {
      this.$store.sortUsers = localStorage.getItem("sortUsers")
    } else {
      this.$store.sortUsers = "id"
    }
    this.$store.error = ""
    this.$store.search = ""
  }
}
</script>
