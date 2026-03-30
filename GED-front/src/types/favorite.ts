import { Document } from './document'
import { Folder } from './folder'

export interface Favorite {
  id: number
  user_id: number
  document_id: number | null
  folder_id: number | null
  added_at: string
  note: string | null
  document: Document | null
  folder: Folder | null
}

export interface FavoritesResponse {
  documents: Favorite[]
  folders: Favorite[]
  total: number
}

export interface FavoriteCheckResponse {
  is_favorite: boolean
  note: string | null
  added_at: string | null
}
