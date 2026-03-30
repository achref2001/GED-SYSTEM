import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../../services/api/documents'
import { toast } from 'sonner'

export function useBulkMutation() {
  const queryClient = useQueryClient()

  const bulkMove = useMutation({
    mutationFn: ({ ids, targetId }: { ids: number[], targetId: number }) => 
      documentsApi.bulkMove(ids, targetId),
    onSuccess: (res) => {
      if (res.data.data.success) {
        toast.success(`Successfully moved ${res.data.data.succeeded.length} files`)
        queryClient.invalidateQueries({ queryKey: ['documents'] })
      } else {
        toast.error(`Failed to move some files`)
      }
    }
  })

  const bulkDelete = useMutation({
    mutationFn: (ids: number[]) => documentsApi.bulkDelete(ids),
    onSuccess: (res) => {
      toast.success(`Successfully deleted ${res.data.data.succeeded.length} files`)
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })

  const bulkTag = useMutation({
    mutationFn: ({ ids, add, remove }: { ids: number[], add: string[], remove: string[] }) => 
      documentsApi.bulkTag(ids, add, remove),
    onSuccess: () => {
      toast.success('Successfully updated tags')
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })

  return { bulkMove, bulkDelete, bulkTag }
}
