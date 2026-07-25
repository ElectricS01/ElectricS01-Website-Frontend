import { BasicUser } from "./user"

interface ChatAssociation {
  notifications: number
}

export interface Chat {
  id: number
  type: number
  name: string
  description: string
  icon: string
  owner: number
  requireVerification: boolean
  ownerDetails: BasicUser
  association: ChatAssociation
}
