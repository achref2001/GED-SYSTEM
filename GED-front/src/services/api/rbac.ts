import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'

export interface RoleMapResponse {
  roles: Record<string, string[]>
}

export interface PermissionListResponse {
  permissions: string[]
}

export interface RbacUser {
  id: number
  email: string
  full_name: string | null
  base_role: string
  effective_role: string
  permissions: string[]
}

export const rbacApi = {
  listPermissions: () => api.get<ApiResponse<PermissionListResponse>>('/rbac/permissions'),
  listRoles: () => api.get<ApiResponse<RoleMapResponse>>('/rbac/roles'),
  upsertRole: (name: string, permissions: string[]) =>
    api.post<ApiResponse<RoleMapResponse>>('/rbac/roles', { name, permissions }),
  deleteRole: (roleName: string) =>
    api.delete<ApiResponse<RoleMapResponse>>(`/rbac/roles/${encodeURIComponent(roleName)}`),
  listUsers: () => api.get<ApiResponse<RbacUser[]>>('/rbac/users'),
  assignUserRole: (userId: number, roleName: string) =>
    api.put<ApiResponse<any>>(`/rbac/users/${userId}/role`, { role_name: roleName }),
}

