import { defineStore } from "pinia"
import dayjs from "dayjs"
import { nextTick } from "vue"

export const useDataStore = defineStore("store", {
  state: () => ({
    error: ""
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
    }
  }
})
