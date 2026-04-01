import React, { useMemo, useState } from 'react'
import { ArrowLeft, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { settingsApi } from '../../services/api/settings'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

function normalizeExtension(value: string): string {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return ''
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`
}

export default function ExtensionsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [newExtension, setNewExtension] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['upload-policy'],
    queryFn: () => settingsApi.getUploadPolicy(),
  })

  const allowedExtensions = useMemo(
    () => data?.data?.data?.allowed_extensions || [],
    [data]
  )

  const saveMutation = useMutation({
    mutationFn: (extensions: string[]) => settingsApi.updateUploadPolicy(extensions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upload-policy'] })
      toast.success('Allowed extensions updated')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to update upload policy')
    },
  })

  const addExtension = () => {
    const normalized = normalizeExtension(newExtension)
    if (!normalized) return
    if (allowedExtensions.includes(normalized)) {
      toast.info('Extension already exists')
      return
    }
    saveMutation.mutate([...allowedExtensions, normalized])
    setNewExtension('')
  }

  const removeExtension = (ext: string) => {
    const next = allowedExtensions.filter((e) => e !== ext)
    if (next.length === 0) {
      toast.error('At least one extension must remain')
      return
    }
    saveMutation.mutate(next)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-mesh">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Allowed File Extensions</h1>
            <p className="text-slate-500 text-sm">Admin upload policy for documents and templates.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck size={18} className="text-indigo-600" />
            <span className="font-semibold text-sm">Upload policy</span>
          </div>

          <div className="flex gap-3">
            <Input
              value={newExtension}
              onChange={(e) => setNewExtension(e.target.value)}
              placeholder="Add extension (e.g. pdf or .pdf)"
              className="h-11"
              onKeyDown={(e) => e.key === 'Enter' && addExtension()}
            />
            <Button onClick={addExtension} className="h-11">
              <Plus size={16} className="mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-10">
            {isLoading ? (
              <span className="text-sm text-slate-400">Loading...</span>
            ) : allowedExtensions.length === 0 ? (
              <span className="text-sm text-slate-400">No extensions configured.</span>
            ) : (
              allowedExtensions.map((ext) => (
                <div
                  key={ext}
                  className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm"
                >
                  <span>{ext}</span>
                  <button
                    onClick={() => removeExtension(ext)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                    title={`Remove ${ext}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

