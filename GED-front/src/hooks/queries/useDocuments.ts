import { useQuery } from '@tanstack/react-query'
import { documentsApi, DocumentListParams } from '../../services/api/documents'

export function useDocuments(params: DocumentListParams) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentsApi.list(params),
    staleTime: 30_000,
    select: (res) => {
      let items = res.data.data || []
      
      // Filter by Tags
      if (params.selectedTags && params.selectedTags.length > 0) {
        items = items.filter(doc => 
          doc.tags?.some(tag => params.selectedTags?.includes(tag.name))
        )
      }

      // Filter by Search Query (Case Insensitive)
      if (params.q) {
        const query = params.q.toLowerCase()
        items = items.filter(doc => 
          doc.name.toLowerCase().includes(query) ||
          doc.tags?.some(tag => tag.name.toLowerCase().includes(query)) ||
          doc.file_type.toLowerCase().includes(query)
        )
      }

      return {
        items,
        pagination: res.data.pagination
      }
    }
  })
}

export function useDocumentDetails(id: number) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentsApi.get(id),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}

export function useDocumentVersions(id: number) {
  return useQuery({
    queryKey: ['document-versions', id],
    queryFn: () => documentsApi.getVersions(id),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}
