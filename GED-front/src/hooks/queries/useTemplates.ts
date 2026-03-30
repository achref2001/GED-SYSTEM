import { useQuery } from '@tanstack/react-query'
import { templatesApi } from '../../services/api/templates'

export function useTemplates(params?: { category?: string | null; name?: string; page?: number; per_page?: number }) {
  // Convert null category to undefined for params
  const fetchParams = { ...params, category: params?.category || undefined }
  
  return useQuery({
    queryKey: ['templates', fetchParams],
    queryFn: () => templatesApi.getAll(fetchParams),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}

export function useTemplateDetails(id: number) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesApi.get(id),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}

export function useTemplateVersions(id: number) {
  return useQuery({
    queryKey: ['template-versions', id],
    queryFn: () => templatesApi.getVersions(id),
    staleTime: 60_000,
    select: (res) => res.data.data
  })
}
