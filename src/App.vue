<template>
  <header>
    <div v-if="navbarShown" id="mobile-navbar" class="navbar">
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
      <router-link
        v-if="active('/blog')"
        to="/blog"
        :class="{ active: active('/blog') }"
        @click="mobileNav"
      >
        Blog
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
    <div v-else class="chat-navbar">
      <router-link
        class="chat-button"
        :class="{ 'responsive-chat': route.path.startsWith('/chat') }"
        to="/chat"
      >
        Better Communications
      </router-link>
      <icons
        v-if="active('/chat')"
        size="28"
        icon="chats"
        class="left chat-icon"
        title="Show chats"
        @click="toggleChatBar"
      />
      <router-link
        v-if="store.userData.id"
        class="right chat-icon"
        to="/account/account"
        title="Settings"
      >
        <icons size="28" icon="settings" />
      </router-link>
      <router-link
        v-else
        class="right chat-button"
        to="/login"
        title="Login to BetterCommunications"
      >
        Login
      </router-link>
      <router-link
        class="right chat-button"
        to="/"
        title="Got to ElectricS01.com home"
      >
        Home
      </router-link>
      <icons
        v-if="active('/chat')"
        class="right chat-icon"
        title="Show users"
        size="28"
        icon="users"
        @click="toggleSidebar"
      />
      <icons
        v-if="active('/chat')"
        class="right chat-icon"
        title="Search this chat"
        size="28"
        icon="search"
        @click=";(store.search = !store.search), (store.pins = false)"
      />
      <icons
        v-if="active('/chat')"
        class="right chat-icon"
        title="View this chat's pins"
        size="28"
        icon="pin"
        @click=";(store.pins = !store.pins), (store.search = false)"
      />
    </div>
    <transition>
      <p v-if="store.error" class="error-banner">
        {{ store.error }}
      </p>
    </transition>
  </header>
  <main :class="isDarkMode === 'true' ? 'dark-mode' : 'light-mode'">
    <div
      class="background"
      :style="{
        backgroundImage: navbarShown
          ? 'url(\'/src/assets/background.png\')'
          : ''
      }"
    />
    <transition>
      <modal-simple
        v-if="store.quickSwitcherShown"
        :is-active="store.quickSwitcherShown"
        @close="store.quickSwitcherShown = false"
      >
        <div class="switcher-modal">
          <input
            id="quick-switcher"
            v-model="switcherInput"
            placeholder="Quick switcher"
            class="switcher-input"
            @keydown.enter="activateItem(highlightedIndex)"
            @keydown.down.prevent="moveHighlight(1)"
            @keydown.up.prevent="moveHighlight(-1)"
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
import { useRoute, useRouter } from "vue-router"
import { useDataStore } from "@/stores/main"
import { computed, nextTick, ref, watch } from "vue"
import axios from "axios"
import ModalSimple from "@/components/core/ModalSimple.vue"

const route = useRoute()
const router = useRouter()
const store = useDataStore()

const highlightedIndex = ref(0)
const switcherInput = ref()
const isDarkMode = ref("true")

let searchedItems = store.switcherItems

if (localStorage.getItem("isDarkMode")) {
  isDarkMode.value = localStorage.getItem("isDarkMode")
} else {
  localStorage.setItem("isDarkMode", "true")
  isDarkMode.value = "true"
}
if (localStorage.getItem("isDarkMode") !== "true") {
  document.body.style.backgroundColor = "white"
}
Object.assign(axios.defaults, {
  headers: { Authorization: localStorage.getItem("token") }
})
if (localStorage.getItem("token")) {
  store.getUser()
} else {
  store.userData.switcherHistory =
    JSON.parse(localStorage.getItem("switcherHistory")) || []
  store.sortSwitcher()
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

const active = (routePattern) => route.path.startsWith(routePattern)
const mobileNav = () => {
  const nav = document.getElementById("mobile-navbar")
  if (nav.className === "navbar") {
    nav.className += " responsive"
  } else {
    nav.className = "navbar"
  }
}
let toggleMode = () => {
  if (localStorage.getItem("isDarkMode") !== "true") {
    localStorage.setItem("isDarkMode", "true")
    document.body.style.backgroundColor = "#181a1b"
  } else {
    localStorage.setItem("isDarkMode", "false")
    document.body.style.backgroundColor = "white"
  }
  isDarkMode.value = localStorage.getItem("isDarkMode")
}
const toggleSidebar = () => {
  if (
    localStorage.getItem("sidebarOpen") !== "true" ||
    store.search === true ||
    store.pins === true
  ) {
    localStorage.setItem("sidebarOpen", "true")
    store.search = false
    store.pins = false
  } else {
    localStorage.setItem("sidebarOpen", "false")
    store.search = false
    store.pins = false
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
    searchedItems = store.switcherItems.filter((item) =>
      typeof item === "string"
        ? item.toLowerCase().includes(switcherInput.value.toLowerCase())
        : item[0].toLowerCase().includes(switcherInput.value.toLowerCase())
    )
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
      }
      return page.page[1] === searchedItems[id][1]
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

const navbarShown = computed(
  () =>
    !route.path.startsWith("/chat") &&
    !route.path.startsWith("/login") &&
    !route.path.startsWith("/register") &&
    !route.path.startsWith("/account") &&
    !route.path.startsWith("/reset")
)

watch(switcherInput, () => {
  searchItems()
})
</script>
