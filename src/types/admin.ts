import { AdminUser } from "./user"

export interface AdminData {
  feedback: Feedback[]
  users: AdminUser[]
}

export interface Feedback {
  id: number
  userId: number
  feedback: string
  updatedAt: string
  createdAt: string
}
