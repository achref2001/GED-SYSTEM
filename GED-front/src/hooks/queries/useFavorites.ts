import { useQuery } from '@tanstack/react-query'
import { favoritesApi } from '../../services/api/favorites'

export function useFavorites(type: 'all' | 'documents' | 'folders' = 'all') {
  return useQuery({
    queryKey: ['favorites', type],
    queryFn: () => favoritesApi.getAll(type),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}

export function useFavoriteCheck(documentId: number) {
  return useQuery({
    queryKey: ['favorite-check', 'document', documentId],
    queryFn: () => favoritesApi.checkDocument(documentId),
    staleTime: 30_000,
    select: (res) => res.data.data
  })
}

export function useFolderFavoriteCheck(folderId: number) {
  return useQuery({
    queryKey: ['favorite-check', 'folder', folderId],
    queryFn: () => favoritesApi.checkFolder(folderId),
    staleTime: 30_000,
    select: (res) => res.data.data
  })
}
