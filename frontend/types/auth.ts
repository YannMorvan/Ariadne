import { z } from "zod"
import {
  loginSchema,
  RegisterPayload as RegisterPayloadFromValidation,
} from "@/lib/validations/auth"

export type RegisterPayload = RegisterPayloadFromValidation
export type LoginPayload = z.infer<typeof loginSchema>

export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  message: string
  accessToken?: string
  user: User
}
