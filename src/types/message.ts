import { BasicUser } from "./user"

export interface Embed {
  type: string
  mediaProxyLink: string
}

export interface Reaction {
  emoji: string
  userId: number
}

interface MessageKey {
  encryptedMessageKey: string
  nonce: string
}

export interface Message {
  id: number
  userId: number
  messageContents: string
  ciphertext: string
  nonce: string
  embeds: Embed[]
  reply: number
  edited: boolean
  pinned: boolean
  user: BasicUser
  messageKey: MessageKey | null
  reactions: Reaction[]
  createdAt: string
  updatedAt: string

  deleted?: boolean
  encrypted?: boolean
}
