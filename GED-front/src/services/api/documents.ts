import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'
import { Document, DocumentVersion, BulkOperationResult, ExpiryAction } from '../../types/document'

export interface DocumentListParams {
  folder_id?: number | null
  q?: string
  page?: number
  size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  selectedTags?: string[]
}

export const documentsApi = {
  list: (params: DocumentListParams) =>
    api.get<ApiResponse<Document[]>>('/documents', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Document>>(`/documents/${id}`),

  download: async (id: number, filename: string) => {
    const response = await api.get(`/documents/${id}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([response.data]))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },

  open: async (id: number) => {
    const response = await api.get(`/documents/${id}/download`, { responseType: 'blob' })
    const type = response.data.type || 'application/octet-stream'
    const url = URL.createObjectURL(new Blob([response.data], { type }))
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 15000)
  },

  upload: (
    formData: FormData, 
    force = false,
    onProgress?: (percent: number) => void
  ) =>
    api.post<ApiResponse<Document>>(
      `/documents/upload${force ? '?force=true' : ''}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) =>
          onProgress?.(Math.round((e.loaded * 100) / (e.total ?? 1)))
      }
    ),

  checkDuplicate: (fileHash: string) =>
    api.post<ApiResponse<{ 
      is_duplicate: boolean
      existing_document: Document | null 
    }>>('/documents/check-duplicate', { file_hash: fileHash }),

  bulkMove: (documentIds: number[], targetFolderId: number) =>
    api.post<ApiResponse<BulkOperationResult>>(
      '/documents/bulk/move',
      { document_ids: documentIds, target_folder_id: targetFolderId }
    ),

  bulkDelete: (documentIds: number[]) =>
    api.post<ApiResponse<BulkOperationResult>>(
      '/documents/bulk/delete',
      { document_ids: documentIds }
    ),

  bulkDownload: async (documentIds: number[]) => {
    const response = await api.post(
      '/documents/bulk/download',
      { document_ids: documentIds },
      { responseType: 'blob' }
    )
    const url = URL.createObjectURL(
      new Blob([response.data], { type: 'application/zip' })
    )
    const a = document.createElement('a')
    a.href = url
    a.download = `ged_export_${Date.now()}.zip`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },

  bulkTag: (
    documentIds: number[], 
    addTags: string[], 
    removeTags: string[]
  ) =>
    api.post<ApiResponse<BulkOperationResult>>(
      '/documents/bulk/tag',
      { document_ids: documentIds, add_tags: addTags, 
        remove_tags: removeTags }
    ),

  setExpiry: (
    id: number, 
    expiresAt: string | null, 
    expiryAction: ExpiryAction
  ) =>
    api.patch<ApiResponse<Document>>(
      `/documents/${id}/expiry`,
      { expires_at: expiresAt, expiry_action: expiryAction }
    ),

  archive: (id: number, reason: string) =>
    api.post<ApiResponse<Document>>(
      `/documents/${id}/archive`, 
      { reason }
    ),

  restore: (id: number) =>
    api.post<ApiResponse<Document>>(`/documents/${id}/restore`),

  checkout: (
    id: number, 
    reason?: string, 
    lockDurationHours = 8
  ) =>
    api.post<ApiResponse<{ 
      document: Document
      lock_expires_at: string 
    }>>(
      `/documents/${id}/checkout`,
      { reason, lock_duration_hours: lockDurationHours }
    ),

  checkin: (id: number, file?: File, comment?: string) => {
    const formData = new FormData()
    if (file) formData.append('file', file)
    if (comment) formData.append('comment', comment)
    return api.post<ApiResponse<Document>>(
      `/documents/${id}/checkin`, 
      formData
    )
  },

  forceUnlock: (id: number, reason: string) =>
    api.post<ApiResponse<Document>>(
      `/documents/${id}/force-unlock`, 
      { reason }
    ),

  getVersions: (id: number) =>
    api.get<ApiResponse<DocumentVersion[]>>(
      `/documents/${id}/versions`
    ),

  restoreVersion: (id: number, versionId: number) =>
    api.post<ApiResponse<Document>>(
      `/documents/${id}/versions/restore/${versionId}`
    ),

  getExpiringSoon: (days = 7, folderId?: number) =>
    api.get<ApiResponse<Document[]>>(
      '/documents/expiring-soon',
      { params: { days, folder_id: folderId } }
    ),

  getLocked: () =>
    api.get<ApiResponse<Document[]>>('/documents/locked'),
}
