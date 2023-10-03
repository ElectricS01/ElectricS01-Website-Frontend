import { defineStore } from "pinia"
import dayjs from "dayjs"
import { nextTick } from "vue"
import axios from "axios"

export const useDataStore = defineStore("store", {
  state: () => ({
    error: "",
    userData: {}
  }),
  actions: {
    errorFalse() {
      this.error = ""
    },
    dayjs(date) {
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
    },
    dayjsDate(date) {
      return dayjs(date).format("D MMMM YYYY")
    },
    async editFocus() {
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
    },
    getUser() {
      axios
        .get("/api/user")
        .then((res) => {
          this.userData = res.data
        })
        .catch((e) => {
          this.error = "Error 503, Cannot Connect to Server " + e
          setTimeout(this.errorFalse, 5000)
        })
    }
  }
})
