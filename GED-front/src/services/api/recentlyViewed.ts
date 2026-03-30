import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'
import { RecentlyViewedItem, MostViewedItem } from '../../types/recentlyViewed'

export const recentlyViewedApi = {
  getAll: (limit = 20) =>
    api.get<ApiResponse<RecentlyViewedItem[]>>(
      '/recently-viewed',
      { params: { limit } }
    ),

  clearAll: () =>
    api.delete<ApiResponse<void>>(
      '/recently-viewed'
    ),

  clearOne: (documentId: number) =>
    api.delete<ApiResponse<void>>(
      `/recently-viewed/${documentId}`
    ),

  getMostViewed: (
    limit = 20, 
    period: '7d' | '30d' | 'all' = '30d'
  ) =>
    api.get<ApiResponse<MostViewedItem[]>>(
      '/recently-viewed/admin/most-viewed',
      { params: { limit, period } }
    ),
}
