import { useUploadStore } from '../stores/uploadStore'
import { useQueryClient } from '@tanstack/react-query'
import { computeFileHash } from '../services/hash'
import { documentsApi } from '../services/api/documents'
import { UploadItem } from '../types/document'

export interface UploadMetadata {
  folderId: number | null
  tags?: string[]
  description?: string
  expiresAt?: string | null
  expiryAction?: string
}

export function useUpload() {
  const store = useUploadStore()
  const queryClient = useQueryClient()
  
  const processFile = async (item: UploadItem) => {
    // Step 1: compute hash with progress
    store.updateItem(item.id, { status: 'hashing' })
    try {
      const hash = await computeFileHash(
        item.file,
        (p) => store.updateItem(item.id, { hashProgress: p })
      )
      store.updateItem(item.id, { hash, status: 'hash_done' })
      
      // Step 2: check duplicate
      const res = await documentsApi.checkDuplicate(hash)
      const { is_duplicate, existing_document } = res.data.data
      if (is_duplicate && !item.force) {
        store.updateItem(item.id, {
          status: 'duplicate',
          duplicate: { is_duplicate, existing_document }
        })
        return
      }
      store.updateItem(item.id, { status: 'ready' })
    } catch (error) {
      store.updateItem(item.id, { status: 'error', error: 'Hashing or duplicate check failed' })
    }
  }
  
  const uploadItem = async (
    item: UploadItem, 
    metadata: UploadMetadata
  ) => {
    const formData = new FormData()
    formData.append('file', item.file)
    if (metadata.folderId) formData.append('folder_id', String(metadata.folderId))
    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags))
    if (metadata.description) formData.append('description', metadata.description)
    if (metadata.expiresAt) formData.append('expires_at', metadata.expiresAt)
    if (metadata.expiryAction) formData.append('expiry_action', metadata.expiryAction)

    store.updateItem(item.id, { status: 'uploading' })
    
    try {
      const res = await documentsApi.upload(
        formData,
        item.force,
        (p) => store.updateItem(item.id, { uploadProgress: p })
      )
      store.updateItem(item.id, { 
        status: 'done', 
        result: res.data.data 
      })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'Upload failed'
      store.updateItem(item.id, {
        status: 'error',
        error: message
      })
    }
  }
  
  return { processFile, uploadItem }
}
