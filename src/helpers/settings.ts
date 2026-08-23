import { useDataStore } from "@/store"
import router from "@/router"
import axios from "axios"

const store = useDataStore()

export const onLogout = () => {
  Object.assign(axios.defaults, {
    headers: { Authorization: null }
  })
  store.ws?.close()
  store.ws = null
  console.log("Socket closed")

  store.userData = { switcherHistory: store.userData.switcherHistory }
  localStorage.removeItem("token")
  router.push("/login")
}
