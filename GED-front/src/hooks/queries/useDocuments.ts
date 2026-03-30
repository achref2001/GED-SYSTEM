import { useQuery } from '@tanstack/react-query'
import { documentsApi, DocumentListParams } from '../../services/api/documents'

export function useDocuments(params: DocumentListParams) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentsApi.list(params),
    staleTime: 30_000,
    select: (res) => ({
      items: res.data.data?.filter(doc => 
        params.selectedTags?.length === 0 || 
        doc.tags?.some(tag => params.selectedTags.includes(tag.name))
      ) || [],
      pagination: res.data.pagination
    })
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
