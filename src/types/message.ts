import { BasicUser } from "./user"

export interface Embed {
  type: string
  mediaProxyLink: string
}

export interface Reaction {
  emoji: string
  userId: number
}

export interface Message {
  id: number
  userId: number
  messageContents: string
  embeds: Embed[]
  reply: number
  edited: boolean
  pinned: boolean
  user: BasicUser
  reactions: Reaction[]
  createdAt: string
  updatedAt: string

  deleted?: boolean
}
