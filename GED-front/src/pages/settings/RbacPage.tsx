import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Shield, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { rbacApi } from '../../services/api/rbac'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export default function RbacPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [roleName, setRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const { data: rolesRes } = useQuery({
    queryKey: ['rbac-roles'],
    queryFn: () => rbacApi.listRoles(),
  })
  const { data: permsRes } = useQuery({
    queryKey: ['rbac-permissions'],
    queryFn: () => rbacApi.listPermissions(),
  })
  const { data: usersRes } = useQuery({
    queryKey: ['rbac-users'],
    queryFn: () => rbacApi.listUsers(),
  })

  const roles = rolesRes?.data?.data?.roles || {}
  const permissions = permsRes?.data?.data?.permissions || []
  const users = usersRes?.data?.data || []

  const createRoleMutation = useMutation({
    mutationFn: () => rbacApi.upsertRole(roleName, selectedPermissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rbac-roles'] })
      setRoleName('')
      setSelectedPermissions([])
      toast.success('Role saved')
    },
    onError: (e: any) => toast.error(e?.response?.data?.detail || 'Failed to save role'),
  })

  const assignMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      rbacApi.assignUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rbac-users'] })
      toast.success('Role assigned')
    },
  })

  const roleNames = useMemo(() => Object.keys(roles), [roles])

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-mesh">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">RBAC Management</h1>
            <p className="text-sm text-slate-500">Create custom roles and assign permissions/users.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Shield size={18} className="text-indigo-600" />
            <span className="font-semibold text-sm">Create or update role</span>
          </div>
          <div className="flex gap-3">
            <Input value={roleName} onChange={(e) => setRoleName(e.target.value.toUpperCase())} placeholder="Role name (e.g. QA_REVIEWER)" />
            <Button onClick={() => createRoleMutation.mutate()} disabled={!roleName || selectedPermissions.length === 0}>
              <Plus size={16} className="mr-2" />
              Save Role
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {permissions.map((p) => {
              const active = selectedPermissions.includes(p)
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPermissions((prev) => active ? prev.filter((x) => x !== p) : [...prev, p])}
                  className={`px-3 py-1.5 rounded-lg text-xs border ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-slate-800">Roles</h3>
            {roleNames.map((r) => (
              <div key={r} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-semibold text-slate-800">{r}</p>
                <p className="text-xs text-slate-500 mt-1">{(roles[r] || []).join(', ') || 'No permissions'}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-slate-800">Assign role to users</h3>
            {users.map((u) => (
              <div key={u.id} className="border border-slate-100 rounded-lg p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{u.full_name || u.email}</p>
                  <p className="text-xs text-slate-500">{u.email} - current: {u.effective_role}</p>
                </div>
                <select
                  className="h-9 px-2 rounded-md border border-slate-200 text-sm"
                  value={u.effective_role}
                  onChange={(e) => assignMutation.mutate({ userId: u.id, role: e.target.value })}
                >
                  {roleNames.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

