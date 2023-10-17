import { defineStore } from "pinia"
import dayjs from "dayjs"
import { nextTick, ref } from "vue"
import axios from "axios"

export const useDataStore = defineStore("store", () => {
  const error = ref("")
  const userData = ref({})
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
      })
      .catch((e) => {
        error.value = "Error 503, Cannot Connect to Server " + e
        setTimeout(errorFalse.value, 5000)
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
    errorFalse,
    dayjsLong,
    dayjsDate,
    getUser,
    editFocus
  }
})
