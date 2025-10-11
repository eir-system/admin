export interface User {
  id: string
  username: string
  email?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserSession {
  user: User
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormField<T = any> {
  value: T
  error: string
  touched: boolean
  rules?: ValidationRule
}