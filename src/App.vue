<template>
  <header>
    <div class="topnav" id="mobile-topnav">
      <router-link class="main" to="/">Home</router-link>
      <router-link to="/tonkgame" :class="{ active: active('/tonkgame') }">TonkGame</router-link>
      <router-link to="/calculator" :class="{ active: active('/calculator') }">Calculator</router-link>
      <router-link to="/tetris" :class="{ active: active('/tetris') }">Tetris</router-link>
      <a href="https://bettercompassclub.netlify.app">BetterCompass Club</a>
      <a class="icon" @click="responsive_topnav()">☰</a>
    </div>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<script>
export default {
  name: "App",
  methods:{
    active(route) {
      return route === this.$route.path;
    },
    responsive_topnav() {
      const responsive_topnav = document.getElementById("mobile-topnav");
      if (responsive_topnav.className === "topnav") {
        responsive_topnav.className += " responsive";
      } else {
        responsive_topnav.className = "topnav";
      }
    }
  }
}
</script>