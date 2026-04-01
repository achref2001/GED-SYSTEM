import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'

export interface UploadPolicy {
  allowed_extensions: string[]
}

export const settingsApi = {
  getUploadPolicy: () =>
    api.get<ApiResponse<UploadPolicy>>('/settings/upload-policy'),

  updateUploadPolicy: (allowedExtensions: string[]) =>
    api.put<ApiResponse<UploadPolicy>>('/settings/upload-policy', {
      allowed_extensions: allowedExtensions
    }),
}

