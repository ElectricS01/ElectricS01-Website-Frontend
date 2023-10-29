<template>
  <header>
    <div class="navbar" id="mobile-navbar" v-if="navbarShown">
      <router-link class="main" to="/" @click="mobileNav">
        ElectricS01.com
      </router-link>
      <router-link
        to="/tonkgame"
        :class="{ active: active('/tonkgame') }"
        @click="mobileNav"
      >
        TonkGame
      </router-link>
      <router-link
        to="/calculator"
        :class="{ active: active('/calculator') }"
        @click="mobileNav"
      >
        Calculator
      </router-link>
      <router-link
        to="/tetris"
        :class="{ active: active('/tetris') }"
        @click="mobileNav"
      >
        Tetris
      </router-link>
      <router-link
        to="/collider"
        :class="{ active: active('/collider') }"
        @click="mobileNav"
      >
        Collider
      </router-link>
      <a href="https://mapit.electrics01.com">Mapit (Demo)</a>
      <router-link
        v-if="store.userData.id"
        class="right"
        to="/account/account"
        @click="mobileNav"
      >
        Account
      </router-link>
      <div class="icon-mobile" @click="mobileNav">☰</div>
    </div>
    <div class="chat-navbar" v-else>
      <router-link
        class="chat-button"
        :class="{ 'responsive-chat': route.path.startsWith('/chat') }"
        to="/chat"
      >
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
      <div
        v-if="active('/chat')"
        @click="store.search = !store.search"
        class="right chat-icon"
      >
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
    <transition>
      <modal-simple
        v-if="store.quickSwitcherShown"
        :is-active="store.quickSwitcherShown"
        @close="store.quickSwitcherShown = false"
      >
        <div class="switcher-modal">
          <input
            placeholder="Quick switcher"
            @keydown.enter="activateItem(highlightedIndex)"
            @keydown.down.prevent="moveHighlight(1)"
            @keydown.up.prevent="moveHighlight(-1)"
            class="switcher-input"
            v-model="switcherInput"
            id="quick-switcher"
          />
          <div class="switch-container scroll-bar">
            <div
              v-for="(item, index) in searchedItems"
              :key="item"
              class="switcher-item"
              :class="{ highlighted: index === highlightedIndex }"
              @click="activateItem(index)"
            >
              {{ typeof item === "string" ? item : item[0] }}
            </div>
          </div>
        </div>
      </modal-simple>
    </transition>
    <router-view />
  </main>
</template>

<script setup>
import Icons from "@/components/core/Icons.vue"
import { useRoute } from "vue-router"
import { useDataStore } from "@/stores/main"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import axios from "axios"
import ModalSimple from "@/components/core/ModalSimple.vue"
import router from "@/router"

const route = useRoute()
const store = useDataStore()

const highlightedIndex = ref(0)
const switcherInput = ref()

let searchedItems = store.switcherItems

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
const mobileNav = () => {
  const nav = document.getElementById("mobile-navbar")
  if (nav.className === "navbar") {
    nav.className += " responsive"
  } else {
    nav.className = "navbar"
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
const toggleQuickSwitcher = ({ repeat, metaKey, ctrlKey, key }) => {
  if (repeat) return
  if ((metaKey || ctrlKey) && (key === "k" || key === "/")) {
    store.quickSwitcherShown = !store.quickSwitcherShown
    searchedItems = store.switcherItems
    if (store.quickSwitcherShown) {
      nextTick(() => {
        const quickSwitcher = document.getElementById("quick-switcher")
        quickSwitcher?.focus()
      })
    }
  }
}
const searchItems = () => {
  if (store.quickSwitcherShown) {
    const lastSearchedItems = searchedItems
    searchedItems = store.switcherItems.filter((item) => {
      return typeof item === "string"
        ? item.toLowerCase().includes(switcherInput.value.toLowerCase())
        : item[0].toLowerCase().includes(switcherInput.value.toLowerCase())
    })
    searchedItems.sort((a, b) => {
      const aStartsWithSearch =
        typeof a === "string"
          ? a.toLowerCase().startsWith(switcherInput.value.toLowerCase())
          : a[0].toLowerCase().startsWith(switcherInput.value.toLowerCase())
      const bStartsWithSearch =
        typeof b === "string"
          ? b.toLowerCase().startsWith(switcherInput.value.toLowerCase())
          : b[0].toLowerCase().startsWith(switcherInput.value.toLowerCase())
      if (aStartsWithSearch && !bStartsWithSearch) {
        return -1
      } else if (!aStartsWithSearch && bStartsWithSearch) {
        return 1
      }
      return 0
    })
    if (JSON.stringify(lastSearchedItems) !== JSON.stringify(searchedItems)) {
      highlightedIndex.value = 0
    }
  }
}
const moveHighlight = (step) => {
  if (Object.keys(searchedItems).length === 0) return
  if (highlightedIndex.value === -1 && step === -1) {
    highlightedIndex.value = searchedItems.length - 1
  } else if (
    highlightedIndex.value === searchedItems.length - 1 &&
    step === 1
  ) {
    highlightedIndex.value = 0
  } else {
    highlightedIndex.value =
      (highlightedIndex.value + step + searchedItems.length) %
      searchedItems.length
  }
  nextTick(() => {
    const highlightedElement = document.getElementsByClassName("highlighted")
    if (highlightedElement) {
      highlightedElement[0].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      })
    }
  })
}
const activateItem = (id) => {
  if (id !== -1 && searchedItems.length && store.quickSwitcherShown) {
    store.quickSwitcherShown = false
    router.push(
      typeof searchedItems[id] === "string"
        ? `/${searchedItems[id]}`
        : `/chat/${searchedItems[id][1]}`
    )
    const existingPage = store.userData.switcherHistory.find((page) => {
      if (typeof page.page === "string") {
        return page.page === searchedItems[id]
      } else return page.page[1] === searchedItems[id][1]
    })
    if (existingPage) {
      existingPage.searches++
    } else {
      store.userData.switcherHistory.push({
        page:
          typeof searchedItems[id] === "string"
            ? searchedItems[id]
            : [searchedItems[id][0], searchedItems[id][1]],
        searches: 1
      })
    }
    switcherInput.value = ""
    if (store.userData.saveSwitcher) {
      axios
        .post("/api/history", {
          history: store.userData.switcherHistory
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      localStorage.setItem(
        "switcherHistory",
        JSON.stringify(store.userData.switcherHistory)
      )
    }
    store.sortSwitcher()
  }
}
const escPressed = ({ key }) => {
  if (key === "Escape") {
    store.quickSwitcherShown = false
  }
}

document.addEventListener("keydown", toggleQuickSwitcher)
document.addEventListener("keydown", escPressed)

const navbarShown = computed(() => {
  return (
    !route.path.startsWith("/chat") &&
    !route.path.startsWith("/login") &&
    !route.path.startsWith("/register") &&
    !route.path.startsWith("/account") &&
    !route.path.startsWith("/reset")
  )
})

onMounted(async () => {
  if (store.userData) await store.getChats()
})

watch(switcherInput, () => {
  searchItems()
})
</script>
