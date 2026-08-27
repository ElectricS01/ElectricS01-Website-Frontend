import { useDataStore } from "@/store"
import router from "@/router"
import axios from "axios"
import { ToggleableProperty, UserProperty } from "@/types/user"

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

const checkImage = async (url: string) => {
  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)

    img.src = url
  })
}

const setProperty = async (property: UserProperty, value: string | boolean) => {
  try {
    const res = await axios.post("/api/user-prop", {
      property,
      val: value
    })
    store.userData[property] = res.data.value
  } catch (e) {
    store.handleAxiosError(e)
  }
}

export const toggleProp = async (property: ToggleableProperty) => {
  const value = !store.userData[property]
  await setProperty(property, value)
}

export const changeProperty = async (property: UserProperty, value: string) => {
  if (!value) {
    return
  }

  if (
    (property === "avatar" || property === "banner") &&
    !(await checkImage(value))
  ) {
    store.handleError("Invalid URL", 2500)
    return
  }

  await setProperty(property, value)
}
