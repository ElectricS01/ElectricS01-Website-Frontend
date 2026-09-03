import { defineStore } from "pinia"

import { nextTick, ref } from "vue"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"
import { loadPrivateKey } from "./helpers/indexedDb"
import { importPublicKey } from "./helpers/encryption"

const switcherPages = [
  "Home",
  "TonkGame",
  "Calculator",
  ["String Processor", "string-processor"],
  "Tetris",
  "Collider",
  "Mapit",
  "Blog",
  "Account",
  ["Privacy", "account/privacy"],
  ["Security", "account/security"],
  ["Appearance", "account/appearance"],
  ["Profile", "account/profile"],
  ["About", "account/about"],
  ["Changelog", "account/changelog"],
  "Chat"
]

export const useDataStore = defineStore("store", () => {
  const route = useRoute()
  const router = useRouter()

  const error = ref("")
  const errorLink = ref("")
  /** @type {import("vue").Ref<import("@/types/user").UserData | import("@/types/user").LoggedOutUser>} */
  const userData = ref({ switcherHistory: [] })
  const pageStatus = ref(null)
  const quickSwitcherShown = ref(false)
  const loadingChats = ref(true)
  const switcherItems = ref(switcherPages)
  const showFriends = ref(false)
  const chatBarOpen = ref(false)
  const sidebarOpen = ref(false)
  const pins = ref(false)
  const search = ref(false)
  const notifications = ref(false)

  const ws = ref(null)
  let errorTimeout = null

  const errorFalse = () => {
    error.value = ""
    errorLink.value = ""
    if (errorTimeout) {
      clearTimeout(errorTimeout)
      errorTimeout = null
    }
  }

  const showError = (message, timeout = 5000, link = "") => {
    error.value = message
    errorLink.value = link
    if (errorTimeout) {
      clearTimeout(errorTimeout)
    }
    errorTimeout = setTimeout(errorFalse, timeout)
    return message
  }

  const getErrorMessage = (input) => {
    if (!input) return ""
    if (typeof input === "string") return input
    if (typeof input === "number" || typeof input === "boolean") {
      return String(input)
    }
    if (input?.message) return input.message
    if (input?.error) return input.error
    return ""
  }

  const handleError = (message, timeout = 5000) => {
    return showError(message || "Something went wrong", timeout)
  }

  const handleAxiosError = (input, timeout = 5000) => {
    if (input?.code === "ERR_CANCELED" || input?.response?.status === 304) {
      return null
    }

    const message =
      (input?.response?.status >= 500
        ? "500 Internal Server Error"
        : input?.response?.status == 404
          ? "404 Not Found"
          : getErrorMessage(input?.response?.data)) ||
      (input?.response?.status
        ? `Error ${input.response.status}${
            input.response.statusText ? `, ${input.response.statusText}` : ""
          }`
        : "") ||
      (input?.request && !input?.response ? "Cannot connect to server" : "") ||
      getErrorMessage(input) ||
      "Something went wrong"

    return showError(message, timeout)
  }

  let retry = 0

  const openWebSocket = () => {
    retry++
    if (localStorage.getItem("token")) {
      console.log("Opening socket")
      ws.value = new WebSocket("/ws")
      console.log("Socket connected")

      ws.value.onopen = () => {
        ws.value.send(JSON.stringify({ token: localStorage.getItem("token") }))
        console.log("Socket authenticated")
        if (pageStatus.value !== null) {
          ws.value.send(JSON.stringify({ page: pageStatus.value }))
        }
        retry = 0
      }

      ws.value.onclose = (event) => {
        console.log("Socket closed")
        console.log(`${event.code}: "${event.reason ?? "no message"}"`)
        if (event.code === 3000) {
          router.push("/login?redirect=" + route.path)
          localStorage.removeItem("token")
        } else if (retry <= 3) {
          setTimeout(openWebSocket, 1000 * retry)
        }
      }
    }
  }

  openWebSocket()

  const getItemSearches = (item) => {
    if (Array.isArray(item)) {
      const id = item[0]
      return (
        userData.value.switcherHistory.find((historyItem) => {
          if (Array.isArray(historyItem.page)) {
            return historyItem.page[0] === id
          }
          return historyItem.page === id
        })?.searches || 0
      )
    }
    return (
      userData.value.switcherHistory.find((historyItem) => {
        if (Array.isArray(historyItem.page)) {
          return historyItem.page[0] === item
        }
        return historyItem.page === item
      })?.searches || 0
    )
  }
  const sortSwitcher = () => {
    switcherItems.value.sort((a, b) => {
      const searchesA = getItemSearches(a)
      const searchesB = getItemSearches(b)

      return searchesB - searchesA
    })
  }

  /**
   * @param {import("@/types/user").LoginData} data
   * @returns {import("@/types/user").UserData}
   */
  const handleUser = (data) => {
    if (typeof data === "object") userData.value = data
    if (!userData.value.saveSwitcher) {
      userData.value.switcherHistory =
        JSON.parse(localStorage.getItem("switcherHistory")) || []
    }
    sortSwitcher()
    if (userData.value.chatsList) {
      switcherItems.value.push(
        ...userData.value.chatsList.map((obj) => [
          obj.type === 1 && obj.owner !== userData.value.id
            ? obj.ownerDetails.username
            : obj.name,
          `chat/${obj.id}`
        ])
      )
      loadingChats.value = false
      chatSort()
    }
    return userData.value
  }

  const getUser = () => {
    axios
      .get("/api/user")
      .then(async (res) => {
        handleUser(res.data)
        userData.value.publicKey = await importPublicKey(res.data.publicKey)
        userData.value.privateKey = await loadPrivateKey(res.data.id)
        console.log(userData.value.publicKey)
        console.log(userData.value.privateKey)
        if (!userData.value.publicKey || !userData.value.privateKey) {
          showError(
            "Failed to load key pair, please generate a new key pair in Security Settings",
            10000,
            "/account/security"
          )
        }
        if (
          userData.value.chatsList &&
          route.path.startsWith("/chat") &&
          !userData.value.chatsList.find(
            (chat) => chat?.id === parseInt(route.params.chatId)
          )
        ) {
          await router.push("/chat/1")
        }
        if (userData.value.id === 1)
          document.addEventListener("paste", (e) => {
            if (e.clipboardData && e.clipboardData.files.length) {
              const files = e.clipboardData.files
              const formData = new FormData()
              for (const file of files) {
                formData.append("attachment", file)
              }
              axios
                .post("/api/upload", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                })
                .then((res) => {
                  navigator.clipboard.writeText(
                    window.location.origin + "/api/i/" + res.data.message
                  )
                })
            }
          })
      })
      .catch((e) => {
        if (e.response?.status !== 401) {
          handleAxiosError(e)
        }
      })
  }
  const chatSort = () => {
    userData.value.chatsList.sort((a, b) => {
      if (a?.latest && b?.latest) {
        return new Date(b.latest) - new Date(a.latest)
      } else if (a?.latest) {
        return -1
      } else if (b?.latest) {
        return 1
      }
      return 0
    })
  }
  async function editFocus() {
    await nextTick(() => {
      const status = document.getElementById("status")
      const input = document.getElementById("edit")
      if (status) {
        status?.focus()
      } else if (input) {
        input?.focus()
      } else {
        const input = document.getElementById("input")
        input?.focus()
      }
    })
  }
  return {
    chatBarOpen,
    chatSort,
    editFocus,
    error,
    errorFalse,
    errorLink,
    getUser,
    handleAxiosError,
    handleError,
    handleUser,
    loadingChats,
    notifications,
    openWebSocket,
    /** @type {string | null} */
    pageStatus,
    pins,
    quickSwitcherShown,
    search,
    showFriends,
    sidebarOpen,
    sortSwitcher,
    switcherItems,
    /** @type {import("@/types/user").UserData | import("@/types/user").LoggedOutUser} */
    userData,
    /** @type {WebSocket | null} */
    ws
  }
})
