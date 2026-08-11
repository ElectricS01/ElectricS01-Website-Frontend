import { BasicUser } from "./user"

export enum ChatType {
  Group = 0,
  Direct = 1,
  Global = 2
}

interface ChatAssociation {
  notifications: number
}

export interface Chat {
  id: number
  type: ChatType
  name: string
  description: string
  icon: string
  owner: number
  latest: string
  requireVerification: boolean
  ownerDetails: BasicUser
  association: ChatAssociation
}
