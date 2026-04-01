import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag as TagIcon, Plus, X, Loader2, Trash2, Hash, ArrowLeft } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagsApi } from '../../services/api/tags'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function TagsPage() {
  const [newTagName, setNewTagName] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: tagsResponse, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.list()
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => tagsApi.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setNewTagName('')
      toast.success('Tag created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create tag')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag deleted successfully')
    }
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTagName.trim()) {
      createMutation.mutate(newTagName.trim())
    }
  }

  const tags = tagsResponse?.data?.data || []

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-mesh font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur shadow-sm border border-white flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all hover:shadow-md active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tag Categories</h1>
              <p className="text-slate-500 font-medium mt-1">Global classification for your document system</p>
            </div>
          </div>
          
          {/* Summary Stat */}
          <div className="px-6 py-3 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{tags.length} Active Tags</span>
          </div>
        </div>

        {/* Action Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-indigo-500/5 p-8"
        >
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 text-indigo-600 mb-2">
              <TagIcon size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Create a New Category</h2>
            <p className="text-slate-500">Add a descriptive tag to help users find and filter documents more efficiently.</p>
            
            <form onSubmit={handleCreate} className="flex gap-4 mt-8">
              <div className="relative flex-1 group">
                <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g. Invoices, Contracts, Project-X..."
                  className="pl-12 h-16 rounded-3xl border-slate-200 bg-white/50 focus:bg-white text-lg font-medium shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || !newTagName.trim()}
                className="h-16 px-10 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <>
                    <Plus className="w-6 h-6 mr-3" />
                    Create Tag
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Tags Grid */}
        <div className="space-y-6 pb-20">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] px-2">Managed Categories</h3>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Syncing with system...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-20 bg-white/30 backdrop-blur rounded-[2.5rem] border border-dashed border-slate-300">
              <TagIcon className="w-16 h-16 text-slate-300 mx-auto mb-4 opacity-40" />
              <p className="text-slate-500 font-semibold text-lg">No tags defined yet.</p>
              <p className="text-slate-400 text-sm">Create your first tag using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {tags.map((tag) => (
                  <motion.div
                    layout
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white/60 backdrop-blur-sm p-4 pl-6 rounded-3xl border border-white hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                        <Hash size={18} />
                      </div>
                      <span className="font-bold text-slate-800 text-lg">{tag.name}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                         if(window.confirm('Delete this tag? This will remove it from all linked documents.')) {
                            deleteMutation.mutate(tag.id)
                         }
                      }}
                      disabled={deleteMutation.isPending}
                      className="p-3 opacity-0 group-hover:opacity-100 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-2xl transition-all active:scale-90"
                      title="Delete tag"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
