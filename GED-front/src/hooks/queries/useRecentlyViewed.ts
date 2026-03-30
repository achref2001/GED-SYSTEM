import { useQuery } from '@tanstack/react-query'
import { recentlyViewedApi } from '../../services/api/recentlyViewed'

export function useRecentlyViewed(limit = 20) {
  return useQuery({
    queryKey: ['recently-viewed', limit],
    queryFn: () => recentlyViewedApi.getAll(limit),
    staleTime: 10_000,
    select: (res) => res.data.data
  })
}

export function useMostViewed(limit = 20, period: '7d' | '30d' | 'all' = '30d') {
  return useQuery({
    queryKey: ['most-viewed', limit, period],
    queryFn: () => recentlyViewedApi.getMostViewed(limit, period),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}
