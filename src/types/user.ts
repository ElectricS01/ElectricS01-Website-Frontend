import { ChatListItem } from "./chat"
import { Notification } from "./notification"

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

interface CoreUser extends BasicUser {
  status: string
  statusMessage: string
  friendRequests: boolean
  gameName: string
  friend?: UserFriend
}

export interface User extends CoreUser {
  encryption?: Encryption
  publicKey?: string
}

export interface ProfileUser extends CoreUser {
  description?: string
  banner: string
  directMessages: Dms
  gameStatus: string
  playingSince: string
  createdAt?: string
  tetris: GameScore[]
}

export interface AdminUser extends ProfileUser {
  admin: boolean
  createdAt: string
}

export interface LoginData extends CoreUser {
  chatsList: ChatListItem[]
  emailVerified: boolean
  savePrivateKey: boolean
  publicKey: string
  privateKey: string
  token: string
}

export interface LoggedOutUser {
  id?: undefined
  username?: undefined
  email?: undefined
  emailVerified?: undefined
  saveSwitcher?: undefined
  createdAt?: undefined
  switcherHistory: SwitcherHistoryItem[]
}

export interface UserData extends Omit<CoreUser, "id"> {
  id?: number
  email: string
  emailVerified: boolean
  encryption: Encryption
  savePrivateKey: boolean
  publicKey?: CryptoKey
  privateKey: CryptoKey
  saveSwitcher: boolean
  createdAt: string
  chatsList: ChatListItem[]
  notifications: Notification[]
  switcherHistory: SwitcherHistoryItem[]
}
