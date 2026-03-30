import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../../services/api/documents'
import { toast } from 'sonner'

export function useArchiveMutation() {
  const queryClient = useQueryClient()

  const archive = useMutation({
    mutationFn: ({ id, reason }: { id: number, reason: string }) => 
      documentsApi.archive(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      toast.success('Document archived successfully')
    }
  })

  const restore = useMutation({
    mutationFn: (id: number) => documentsApi.restore(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      toast.success('Document restored successfully')
    }
  })

  return { archive, restore }
}
