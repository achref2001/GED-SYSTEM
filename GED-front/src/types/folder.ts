export interface Folder {
  id: number
  name: string
  parent_id: number | null
  path_slug: string
  created_at: string
  updated_at: string
  uploaded_by_id: number
  is_deleted: boolean
  subfolders?: Folder[]
}

export interface FolderTree {
  id: number
  name: string
  subfolders: FolderTree[]
}

export interface BreadcrumbItem {
  id: number
  name: string
}
