import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../../services/api/documents'
import { ExpiryAction } from '../../types/document'
import { toast } from 'sonner'

export function useSetExpiryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, date, action }: { id: number, date: string | null, action: ExpiryAction }) => 
      documentsApi.setExpiry(id, date, action),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      toast.success('Expiry settings updated')
    }
  })
}
