export type ErrorCode = 
  | 'DUPLICATE_FILE' 
  | 'DOCUMENT_LOCKED' 
  | 'FORBIDDEN' 
  | 'NOT_FOUND' 
  | 'BAD_REQUEST' 
  | 'VALIDATION_ERROR' 
  | 'INTERNAL_ERROR'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  error: ErrorCode | null
  pagination: Pagination | null
}

export interface Pagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}
