export interface BaseListResponse<T = any> {
  items: T[]
  total: number
  has_next: boolean
}

export interface BaseResponse<T = any> {
    success: boolean
    message?: string
    code: number
    data?: T
  }