import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'
import { Template, TemplateVersion, CreateDocumentFromTemplateRequest } from '../../types/template'
import { Document } from '../../types/document'

export const templatesApi = {
  getAll: (params?: { category?: string; name?: string; 
                       page?: number; per_page?: number }) =>
    api.get<ApiResponse<Template[]>>('/templates', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Template>>(`/templates/${id}`),

  create: (formData: FormData) =>
    api.post<ApiResponse<Template>>('/templates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id: number, data: Partial<Template>) =>
    api.put<ApiResponse<Template>>(`/templates/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/templates/${id}`),

  addVersion: (id: number, formData: FormData) =>
    api.post<ApiResponse<TemplateVersion>>(
      `/templates/${id}/new-version`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),

  getVersions: (id: number) =>
    api.get<ApiResponse<TemplateVersion[]>>(
      `/templates/${id}/versions`
    ),

  createDocument: (
    id: number, 
    data: CreateDocumentFromTemplateRequest
  ) =>
    api.post<ApiResponse<Document>>(
      `/templates/${id}/create-document`, 
      data
    ),
}
