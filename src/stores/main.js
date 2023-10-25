import { defineStore } from "pinia"
import dayjs from "dayjs"
import { nextTick, ref } from "vue"
import axios from "axios"
import router from "@/router"
import { useRoute } from "vue-router"

export const useDataStore = defineStore("store", () => {
  const error = ref("")
  const userData = ref({})
  const quickSwitcherShown = ref(false)
  const chatsList = ref([])
  const loadingChats = ref(true)

  const route = useRoute()

  const errorFalse = () => {
    error.value = ""
  }
  const dayjsLong = (date) => {
    return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
  }
  const dayjsDate = (date) => {
    return dayjs(date).format("D MMMM YYYY")
  }
  const getUser = () => {
    axios
      .get("/api/user")
      .then((res) => {
        userData.value = res.data
        if (!userData.value.saveSwitcher) {
          console.log(localStorage.getItem("switcherHistory"))
          userData.value.history =
            JSON.parse(localStorage.getItem("switcherHistory")) || []
        }
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
        loadingChats.value = false
        chatSort()
        if (
          !chatsList.value.find(
            (chat) => chat?.id === parseInt(route.params.id)
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
    errorFalse,
    dayjsLong,
    dayjsDate,
    getUser,
    chatSort,
    getChats,
    editFocus
  }
})
