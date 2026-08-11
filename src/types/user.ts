import { Chat } from "./chat"

enum Dms {
  noOne = "no one",
  friends = "friends",
  everyone = "everyone"
}

enum Encryption {
  never = "never",
  off = "off",
  on = "on",
  always = "always"
}

export type SwitcherPage = string | [string, string]

export interface SwitcherHistoryItem {
  page: SwitcherPage
  searches: number
}

export interface Friend {
  id: number
  status: string
  createdAt: string
  user2: BasicUser
}

interface UserFriend {
  status: string
}
interface GameScore {
  gameId: number
  difficulty: number
  value: number
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

export interface ProfileUser extends User {
  description?: string
  banner: string
  directMessages: Dms
  gameStatus: string
  playingSince: string
  createdAt?: string
  tetris: GameScore[]
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
  emailVerified: boolean
  encryption: Encryption
  savePrivateKey: boolean
  publicKey?: CryptoKey
  privateKey: CryptoKey
  saveSwitcher: boolean
  chatsList: Chat[]
  switcherHistory: SwitcherHistoryItem[]
}
