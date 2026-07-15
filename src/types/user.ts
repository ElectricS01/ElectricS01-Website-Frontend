export interface BasicUser {
  id: number
  username: string
  avatar: string
}

export interface User extends BasicUser {
  status: string
  statusMessage: string
  gameName: string
}
