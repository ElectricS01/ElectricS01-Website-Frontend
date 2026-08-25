import { ChatListItem } from "./chat"
import { Notification } from "./notification"

export enum Dms {
  noOne = "no one",
  friends = "friends",
  everyone = "everyone"
}

export type ToggleableProperty =
  | "directMessages"
  | "friendRequests"
  | "showCreated"
  | "saveSwitcher"
  | "savePrivateKey"

export type UserProperty =
  ToggleableProperty | "avatar" | "banner" | "description" | "encryption"

export enum Encryption {
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
  directMessages: Dms
  description: string
  banner: string
  gameName: string
  friend?: UserFriend
}

export interface User extends CoreUser {
  encryption?: Encryption
  publicKey?: string
}

export interface ProfileUser extends CoreUser {
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
  description?: undefined
  avatar?: undefined
  banner?: undefined
  emailVerified?: undefined
  directMessages?: undefined
  friendRequests?: undefined
  showCreated?: undefined
  saveSwitcher?: undefined
  encryption?: undefined
  savePrivateKey?: undefined
  publicKey?: undefined
  privateKey?: undefined
  otpVerified?: undefined
  createdAt?: undefined
  sessionId?: undefined
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
  friendRequests: boolean
  showCreated: boolean
  saveSwitcher: boolean
  otpVerified: boolean
  createdAt: string
  sessionId: number
  chatsList: ChatListItem[]
  notifications: Notification[]
  switcherHistory: SwitcherHistoryItem[]
}
