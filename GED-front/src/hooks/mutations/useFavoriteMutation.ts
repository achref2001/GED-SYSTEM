import { useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesApi } from '../../services/api/favorites'
import { toast } from 'sonner'

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  
  const add = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) =>
      favoritesApi.addDocument(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-check', 'document', id] })
      toast.success('Added to favorites')
    },
    onError: () => {
        toast.error('Failed to add favorite')
    }
  })
  
  const remove = useMutation({
    mutationFn: (id: number) => favoritesApi.removeDocument(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-check', 'document', id] })
      toast.success('Removed from favorites')
    },
    onError: () => {
        toast.error('Failed to remove favorite')
    }
  })
  
  return { add, remove }
}

export function useToggleFolderFavorite() {
  const queryClient = useQueryClient()
  
  const add = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) =>
      favoritesApi.addFolder(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-check', 'folder', id] })
      toast.success('Folder added to favorites')
    },
  })
  
  const remove = useMutation({
    mutationFn: (id: number) => favoritesApi.removeFolder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-check', 'folder', id] })
      toast.success('Folder removed from favorites')
    },
  })
  
  return { add, remove }
}
