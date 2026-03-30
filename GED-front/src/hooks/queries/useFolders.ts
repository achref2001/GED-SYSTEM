import { useQuery } from '@tanstack/react-query'
import { foldersApi } from '../../services/api/folders'

export function useFolderTree() {
  return useQuery({
    queryKey: ['folder-tree'],
    queryFn: () => foldersApi.getTree(),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}

export function useFolderDetails(id: number | null) {
  return useQuery({
    queryKey: ['folder', id],
    queryFn: () => foldersApi.getById(id!),
    enabled: !!id,
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}

export function useFolderBreadcrumb(id: number | null) {
  return useQuery({
    queryKey: ['folder-breadcrumb', id],
    queryFn: () => foldersApi.getBreadcrumb(id!),
    enabled: !!id,
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}
