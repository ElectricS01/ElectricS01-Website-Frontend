import { Chat } from "./chat"

export interface Friend {
  id: number
  status: string
  createdAt: string
  user2: BasicUser
}

interface UserFriend {
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
  friend?: UserFriend
}

export interface LoginData extends User {
  chatsList: Chat[]
  emailVerified: boolean
  savePrivateKey: boolean
  publicKey: string
  privateKey: string
  token: string
}

export interface UserData extends User {
  chatsList: Chat[]
  emailVerified: boolean
  savePrivateKey: boolean
  publicKey?: CryptoKey
  privateKey: CryptoKey
}
