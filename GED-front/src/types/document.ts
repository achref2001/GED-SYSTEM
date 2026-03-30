export type LockStatus = 'locked_by_me' | 'locked_by_other' | 'unlocked'
export type ExpiryAction = 'notify' | 'archive' | 'delete'
export type WorkflowStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ARCHIVED'
export type OCRStatus = 'pending' | 'processing' | 
                        'completed' | 'failed' | 'not_required'

export interface Document {
  id: number
  name: string
  description: string | null
  file_type: string
  mime_type: string
  file_size: number
  file_hash: string
  folder_id: number | null
  folder_path: string
  tags: string[]
  metadata: Record<string, unknown>
  category: string | null
  
  // Lock
  is_locked: boolean
  locked_by: number | null
  locked_by_name: string | null
  locked_at: string | null
  lock_expires_at: string | null
  lock_status: LockStatus
  
  // Expiry
  expires_at: string | null
  expiry_action: ExpiryAction | null
  days_until_expiry: number | null
  
  // Archive
  is_archived: boolean
  archived_at: string | null
  archived_by: string | null
  archive_reason: string | null
  
  // OCR
  ocr_status: OCRStatus
  ocr_confidence: number | null
  
  // Workflow
  workflow_status: WorkflowStatus
  
  // Embedding
  has_embedding: boolean
  
  // Audit
  created_by: string
  created_by_name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  
  // Template origin
  created_from_template_id: number | null
}

export interface DocumentVersion {
  id: number
  document_id: number
  version_number: number
  file_size: number
  file_hash: string
  uploaded_by: string
  uploaded_by_name: string
  uploaded_at: string
  comment: string | null
  is_current: boolean
}

export interface UploadItem {
  id: string                          // client-side uuid
  file: File
  hash: string | null
  hashProgress: number                // 0-100
  duplicate: {
    is_duplicate: boolean
    existing_document: Document | null
  } | null
  uploadProgress: number              // 0-100
  status: 'hashing' | 'hash_done' | 'duplicate' | 
          'ready' | 'uploading' | 'done' | 'error' | 'skipped'
  error: string | null
  force: boolean
  result: Document | null
}

export interface BulkOperationResult {
  success: boolean
  total: number
  succeeded: number[]
  failed: Array<{ id: number; reason: string }>
}
