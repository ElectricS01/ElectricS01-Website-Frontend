import { defineStore } from "pinia"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { nextTick, ref } from "vue"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"

dayjs.extend(relativeTime)

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
  const loadingChats = ref(true)
  const switcherItems = ref(switcherPages)
  const showFriends = ref(false)

  const errorFalse = () => {
    error.value = ""
  }
  const dayjsLong = (date) => dayjs(date).format("DD/MM/YYYY HH:mm:ss")
  const dayjsDate = (date) => dayjs(date).format("D MMMM YYYY")
  const dayjsSince = (date) => dayjs(date).fromNow()

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
  const getUser = () => {
    axios
      .get("/api/user")
      .then(async (res) => {
        if (typeof res.data === "object") userData.value = res.data
        if (!userData.value.saveSwitcher) {
          userData.value.switcherHistory =
            JSON.parse(localStorage.getItem("switcherHistory")) || []
        }
        sortSwitcher()
        if (userData.value.chatsList) {
          switcherItems.value.push(
            ...userData.value.chatsList.map((obj) => [
              obj.type === 1 && obj.ownerDetails.id !== userData.value.id
                ? obj.ownerDetails.username
                : obj.name,
              obj.id
            ])
          )
          loadingChats.value = false
          chatSort()
          if (
            route.path.startsWith("/chat") &&
            !userData.value.chatsList.find(
              (chat) => chat?.id === parseInt(route.params.chatId)
            )
          )
            await router.push("/chat/1")
        }
      })
      .catch((e) => {
        if (e.response?.status !== 401) {
          error.value = `Error 503, Cannot Connect to Server ${e}`
          setTimeout(errorFalse, 5000)
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
  async function savePrivateKey(privateKey) {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("MyKeyDatabase", 1)
      request.onupgradeneeded = (event) => {
        event.target.result.createObjectStore("keys", { keyPath: "id" })
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const exportedKey = await crypto.subtle.exportKey("jwk", privateKey)
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(["keys"], "readwrite")
      const objectStore = transaction.objectStore("keys")
      const request = objectStore.put({ id: "privateKey", key: exportedKey })
      request.onsuccess = resolve
      request.onerror = reject
    })
    userData.value.privateKey = privateKey
  }
  async function encryptPrivateKey(privateKey, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 10000,
        hash: "SHA-256"
      },
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      ),
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    )
    const exportedKey = await crypto.subtle.exportKey("jwk", privateKey)
    const keyString = JSON.stringify(exportedKey)
    const keyBuffer = new TextEncoder().encode(keyString)
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: crypto.getRandomValues(new Uint8Array(12)) // Use a random IV
      },
      derivedKey,
      keyBuffer
    )
    return JSON.stringify({
      salt: Array.from(salt),
      encryptedKey: Array.from(new Uint8Array(encryptedBuffer))
    })
  }
  return {
    chatSort,
    dayjsDate,
    dayjsLong,
    dayjsSince,
    editFocus,
    error,
    errorFalse,
    getUser,
    loadingChats,
    quickSwitcherShown,
    sortSwitcher,
    switcherItems,
    userData,
    savePrivateKey,
    encryptPrivateKey,
    showFriends
  }
})
