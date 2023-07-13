import { defineStore } from "pinia"
import dayjs from "dayjs"

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
    }
  }
})
