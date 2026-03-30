import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'
import { Favorite, FavoritesResponse, FavoriteCheckResponse } from '../../types/favorite'

export const favoritesApi = {
  getAll: (type: 'documents' | 'folders' | 'all' = 'all') =>
    api.get<ApiResponse<FavoritesResponse>>(
      '/favorites', 
      { params: { type } }
    ),

  addDocument: (id: number, note?: string) =>
    api.post<ApiResponse<Favorite>>(
      `/favorites/documents/${id}`, 
      { note }
    ),

  removeDocument: (id: number) =>
    api.delete<ApiResponse<void>>(
      `/favorites/documents/${id}`
    ),

  addFolder: (id: number, note?: string) =>
    api.post<ApiResponse<Favorite>>(
      `/favorites/folders/${id}`, 
      { note }
    ),

  removeFolder: (id: number) =>
    api.delete<ApiResponse<void>>(
      `/favorites/folders/${id}`
    ),

  updateNote: (id: number, note: string) =>
    api.patch<ApiResponse<Favorite>>(
      `/favorites/documents/${id}`, 
      { note }
    ),

  checkDocument: (id: number) =>
    api.get<ApiResponse<FavoriteCheckResponse>>(
      `/favorites/check/${id}`
    ),
}
