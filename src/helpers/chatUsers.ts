import { useDataStore } from "@/store"
import { ChatData } from "@/types/chat"
import { ChatUser, UserData } from "@/types/user"
import axios from "axios"

const store = useDataStore()

export const getChatUsers = async (chatId: number) => {
  try {
    const response = await axios.get<ChatUser[]>(`/api/chat-users/${chatId}`)
    return response.data
  } catch (error) {
    store.handleAxiosError(error)
    return []
  }
}

export const getUserByName = async (username: string) => {
  try {
    const response = await axios.post("/api/get-user", {
      username
    })
    return response.data
  } catch (error) {
    store.handleAxiosError(error)
    return -1
  }
}

export const sendDm = async (id: number) => {
  const response = await axios.post<ChatData>(`/api/direct-message/${id}`)
  ;(store.userData as UserData).chatsList = response.data.chats
  store.chatSort()
  return response.data
}
