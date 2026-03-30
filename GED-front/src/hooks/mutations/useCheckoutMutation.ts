import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../../services/api/documents'
import { toast } from 'sonner'

export function useCheckoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason, hours }: { id: number, reason?: string, hours?: number }) => 
      documentsApi.checkout(id, reason, hours),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      toast.success('Document checked out successfully')
    },
    onError: (err: any) => {
        const msg = err.response?.data?.message || 'Lock failed'
        toast.error(msg)
    }
  })
}

export function useForceUnlockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: number, reason: string }) => 
      documentsApi.forceUnlock(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      toast.success('Document unlocked forcefully')
    }
  })
}
