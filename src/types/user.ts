import { Chat } from "./chat"

interface Friend {
  status: string
}

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
  friendRequests: boolean
  gameName: string
  friend?: Friend
}

export interface UserData extends User {
  chatsList: Chat[]
  emailVerified: boolean
  savePrivateKey: boolean
  publicKey: CryptoKey
  privateKey: CryptoKey
}
