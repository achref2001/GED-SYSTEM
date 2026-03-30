import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'
import { Folder, FolderTree, BreadcrumbItem } from '../../types/folder'

export const foldersApi = {
  getTree: () => api.get<ApiResponse<FolderTree[]>>('/folders/tree'),
  
  getById: (id: number) => api.get<ApiResponse<Folder>>(`/folders/${id}`),
  
  create: (data: { name: string, parent_id?: number | null }) => 
    api.post<ApiResponse<Folder>>('/folders', data),
    
  update: (id: number, data: { name: string }) => 
    api.put<ApiResponse<Folder>>(`/folders/${id}`, data),
    
  delete: (id: number) => api.delete<ApiResponse<void>>(`/folders/${id}`),
  
  getBreadcrumb: (id: number) => api.get<ApiResponse<BreadcrumbItem[]>>(`/folders/${id}/breadcrumb`)
}
