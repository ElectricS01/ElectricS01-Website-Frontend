import { User } from "./user"

export interface Embed {
  type: string
  mediaProxyLink: string
}

export interface Message {
  id: number
  userId: number
  messageContents: string
  embeds: Embed[]
  reply: number
  edited: boolean
  createdAt: string
  updatedAt: string

  user: User

  deleted?: boolean
}
