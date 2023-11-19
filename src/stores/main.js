import { defineStore } from "pinia"
import dayjs from "dayjs"
import { nextTick, ref } from "vue"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"

const switcherPages = [
  "Home",
  "TonkGame",
  "Calculator",
  "Tetris",
  "Collider",
  "Mapit",
  "Account",
  "Chat"
]

export const useDataStore = defineStore("store", () => {
  const route = useRoute()
  const router = useRouter()

  const error = ref("")
  const userData = ref({})
  const quickSwitcherShown = ref(false)
  const chatsList = ref([])
  const loadingChats = ref(true)
  const switcherItems = ref(switcherPages)

  const errorFalse = () => {
    error.value = ""
  }
  const dayjsLong = (date) => {
    return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
  }
  const dayjsDate = (date) => {
    return dayjs(date).format("D MMMM YYYY")
  }
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
    } else {
      return (
        userData.value.switcherHistory.find((historyItem) => {
          if (Array.isArray(historyItem.page)) {
            return historyItem.page[0] === item
          }
          return historyItem.page === item
        })?.searches || 0
      )
    }
  }
  const sortSwitcher = () => {
    switcherItems.value.sort((a, b) => {
      const searchesA = getItemSearches(a)
      const searchesB = getItemSearches(b)

      return searchesB - searchesA
    })
  }
  const getUser = () => {
    axios
      .get("/api/user")
      .then((res) => {
        if (typeof res.data === "object") userData.value = res.data
        if (!userData.value.saveSwitcher) {
          userData.value.switcherHistory =
            JSON.parse(localStorage.getItem("switcherHistory")) || []
        }
        sortSwitcher()
      })
      .catch((e) => {
        error.value = "Error 503, Cannot Connect to Server " + e
        setTimeout(errorFalse.value, 5000)
      })
  }
  const chatSort = () => {
    chatsList.value.sort((a, b) => {
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
  async function getChats() {
    await axios
      .get("/api/chats")
      .then(async (res) => {
        chatsList.value = res.data
        switcherItems.value.push(
          ...chatsList.value.map((obj) => [obj.name, obj.id])
        )
        loadingChats.value = false
        chatSort()
        if (
          route.path.startsWith("/chat") &&
          !chatsList.value.find(
            (chat) => chat?.id === parseInt(route.params.chatId)
          )
        )
          await router.push("/chat/1")
      })
      .catch((e) => {
        if (e.message === "Request failed with status code 401") {
          error.value = "Error 401, You are not logged in"
          router.push("/login")
        } else {
          error.value = "Error 503, Cannot Connect to Server " + e
        }
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
    error,
    userData,
    quickSwitcherShown,
    chatsList,
    loadingChats,
    switcherItems,
    errorFalse,
    dayjsLong,
    dayjsDate,
    sortSwitcher,
    getUser,
    chatSort,
    getChats,
    editFocus
  }
})
