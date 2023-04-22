import { defineStore } from "pinia"

export const useDataStore = defineStore("loggedIn", {
  state: () => ({ user: {} })
})
