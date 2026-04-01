import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'
import { Tag } from '../../types/document'

export interface TagCreate {
  name: string
}

export const tagsApi = {
  list: () =>
    api.get<ApiResponse<Tag[]>>('/tags'),

  create: (data: TagCreate) =>
    api.post<ApiResponse<Tag>>('/tags', data),

  delete: (id: number) =>
    api.delete<ApiResponse<any>>(`/tags/${id}`),
}
