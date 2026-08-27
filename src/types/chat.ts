import { Message } from "./message"
import { BasicUser, User } from "./user"

export enum ChatType {
  Group = 0,
  Direct = 1,
  Global = 2
}

interface ChatListItemAssociation {
  notifications: number
}

interface ChatAssociation {
  lastRead: number
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
  ownerDetails: BasicUser
  association: ChatListItemAssociation
}

export interface Chat extends Omit<ChatListItem, "association"> {
  association: ChatAssociation
  messages: Message[]
  pins: Message[]
  users: User[]
}
