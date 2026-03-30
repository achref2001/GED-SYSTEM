export interface Template {
  id: number
  name: string
  description: string | null
  file_type: string
  category: string
  default_folder_id: number | null
  default_tags: string[]
  default_metadata: Record<string, unknown>
  required_metadata_fields: string[]
  is_active: boolean
  created_by_id: number
  created_at: string
  updated_at: string
  versions?: TemplateVersion[]
}

export interface TemplateVersion {
  id: number
  template_id: number
  version_number: number
  file_path: string
  uploaded_by_id: number
  uploaded_at: string
  changelog: string | null
}

export interface CreateDocumentFromTemplateRequest {
  document_name: string
  folder_id: number
  metadata: Record<string, string>
  tags: string[]
}
