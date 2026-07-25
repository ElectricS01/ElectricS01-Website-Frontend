import { Chat } from "./chat"

export interface ChatUser {
  id: number
  username: string
}

export interface BasicUser extends ChatUser {
  avatar: string
}

export interface User extends BasicUser {
  status: string
  statusMessage: string
  gameName: string
}

export interface UserData extends User {
  chatsList: Chat[]
  emailVerified: boolean
}
