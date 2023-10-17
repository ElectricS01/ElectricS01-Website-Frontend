<template>
  <header>
    <div class="navbar" id="mobile-navbar" v-if="navbarShown">
      <router-link class="main" to="/" @click="responsiveNavbar()">
        ElectricS01.com
      </router-link>
      <router-link
        to="/tonkgame"
        :class="{ active: active('/tonkgame') }"
        @click="responsiveNavbar()"
      >
        TonkGame
      </router-link>
      <router-link
        to="/calculator"
        :class="{ active: active('/calculator') }"
        @click="responsiveNavbar()"
      >
        Calculator
      </router-link>
      <router-link
        to="/tetris"
        :class="{ active: active('/tetris') }"
        @click="responsiveNavbar()"
      >
        Tetris
      </router-link>
      <router-link
        to="/collider"
        :class="{ active: active('/collider') }"
        @click="responsiveNavbar()"
      >
        Collider
      </router-link>
      <a href="https://mapit.electrics01.com">Mapit (Demo)</a>
      <router-link
        v-if="store.userData.id"
        class="right"
        to="/account/account"
        @click="responsiveNavbar()"
      >
        Account
      </router-link>
      <div class="icon-mobile" @click="responsiveNavbar()">☰</div>
    </div>
    <div class="chat-navbar" v-else>
      <router-link class="responsive-chat chat-button" to="/chat">
        Better Communications
      </router-link>
      <div v-if="active('/chat')" @click="toggleChatBar" class="left chat-icon">
        <Icons size="28" icon="chats" />
      </div>
      <router-link
        v-if="store.userData.id"
        class="right chat-icon"
        to="/account/account"
      >
        <Icons size="28" icon="settings" />
      </router-link>
      <router-link v-else class="right chat-button" to="/login">
        Login
      </router-link>
      <router-link class="right chat-button" to="/">Home</router-link>
      <div
        v-if="active('/chat')"
        @click="toggleSidebar"
        class="right chat-icon"
      >
        <Icons size="28" icon="account" />
      </div>
      <div v-if="active('/chat')" @click="toggleSearch" class="right chat-icon">
        <Icons size="28" icon="search" />
      </div>
    </div>
    <transition>
      <p v-if="store.error" class="error-banner">
        {{ store.error }}
      </p>
    </transition>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script setup>
import Icons from "@/components/core/Icons.vue"
import { useRoute } from "vue-router"
import { useDataStore } from "@/stores/main"
import { computed } from "vue"
import axios from "axios"

const route = useRoute()
const store = useDataStore()

Object.assign(axios.defaults, {
  headers: { Authorization: localStorage.getItem("token") }
})
if (localStorage.getItem("token")) {
  store.getUser()
}
if (localStorage.getItem("sidebarOpen")) {
  store.sidebarOpen = localStorage.getItem("sidebarOpen")
} else {
  store.sidebarOpen = false
}
if (localStorage.getItem("chatBarOpen")) {
  store.chatBarOpen = localStorage.getItem("chatBarOpen")
} else {
  store.chatBarOpen = false
}
if (localStorage.getItem("sortUsers")) {
  store.sortUsers = localStorage.getItem("sortUsers")
} else {
  store.sortUsers = "id"
}

const active = (routePattern) => {
  return route.path.startsWith(routePattern)
}
const responsiveNavbar = () => {
  const responsiveNavbar = document.getElementById("mobile-navbar")
  if (responsiveNavbar.className === "navbar") {
    responsiveNavbar.className += " responsive"
  } else {
    responsiveNavbar.className = "navbar"
  }
}
const toggleSidebar = () => {
  if (localStorage.getItem("sidebarOpen") !== "true" || store.search === true) {
    localStorage.setItem("sidebarOpen", "true")
    store.search = false
  } else {
    localStorage.setItem("sidebarOpen", "false")
    store.search = false
  }
  store.sidebarOpen = localStorage.getItem("sidebarOpen")
}
const toggleChatBar = () => {
  if (localStorage.getItem("chatBarOpen") !== "true") {
    localStorage.setItem("chatBarOpen", "true")
  } else {
    localStorage.setItem("chatBarOpen", "false")
  }
  store.chatBarOpen = localStorage.getItem("chatBarOpen")
}
const toggleSearch = () => {
  store.search = !store.search
}
const navbarShown = computed(() => {
  return (
    !route.path.startsWith("/chat") &&
    !route.path.startsWith("/login") &&
    !route.path.startsWith("/register") &&
    !route.path.startsWith("/account") &&
    !route.path.startsWith("/reset")
  )
})
</script>
