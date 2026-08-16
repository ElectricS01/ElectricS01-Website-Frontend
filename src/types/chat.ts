import { Message } from "./message"
import { User } from "./user"

export enum ChatType {
  Group = 0,
  Direct = 1,
  Global = 2
}

interface ChatAssociation {
  notifications: number
}

export interface ChatListItem {
  id: number
  type: ChatType
  name: string
  description: string
  icon: string
  owner: number
  latest: string
  requireVerification: boolean
  ownerDetails: User
  association: ChatAssociation
}
export interface Chat extends ChatListItem {
  messages: Message[]
  pins: Message[]
  users: User[]
}
