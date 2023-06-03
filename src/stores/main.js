import { defineStore } from "pinia"
import dayjs from "dayjs"

export const useDataStore = defineStore("store", {
  state: () => ({
    error: false
  }),
  actions: {
    errorFalse() {
      this.error = false
    },
    dayjs(date) {
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
    }
  }
})
