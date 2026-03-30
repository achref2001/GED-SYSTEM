import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../../services/api/documents'
import { toast } from 'sonner'

export function useCheckinMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file, comment }: { id: number, file?: File, comment?: string }) => 
      documentsApi.checkin(id, file, comment),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      queryClient.invalidateQueries({ queryKey: ['document-versions', id] })
      toast.success('Document checked in successfully')
    },
    onError: (err: any) => {
        const msg = err.response?.data?.message || 'Checkin failed'
        toast.error(msg)
    }
  })
}
