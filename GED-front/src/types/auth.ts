export type Role = string

export interface User {
  id: number
  email: string
  full_name: string | null
  role: Role
  effective_role?: string
  permissions?: string[]
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}
