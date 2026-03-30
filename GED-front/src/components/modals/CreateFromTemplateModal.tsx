import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Template } from '../../types/template'
import { templatesApi } from '../../services/api/templates'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FileStack, LayoutGrid, CheckCircle2, AlertCircle, X, ArrowRight, Tags, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CreateFromTemplateModalProps {
  template: Template
  onClose: () => void
}

export function CreateFromTemplateModal({ template, onClose }: CreateFromTemplateModalProps) {
  const queryClient = useQueryClient()
  const [docName, setDocName] = useState(`${template.name} - ${new Date().toLocaleDateString()}`)
  const [metadata, setMetadata] = useState<Record<string, string>>({})
  const [tags, setTags] = useState<string[]>(template.default_tags || [])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    // Initialize metadata with default values
    const initialMetadata: Record<string, string> = {}
    Object.entries(template.default_metadata || {}).forEach(([key, val]) => {
      initialMetadata[key] = String(val)
    })
    setMetadata(initialMetadata)
  }, [template])

  const createMutation = useMutation({
    mutationFn: (data: any) => templatesApi.createDocument(template.id, data),
    onSuccess: () => {
      toast.success('Document created from template')
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      onClose()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Creation failed')
    }
  })

  const handleSubmit = () => {
    createMutation.mutate({
      document_name: docName,
      folder_id: template.default_folder_id || null, // In practice, would need a folder selector
      metadata,
      tags
    })
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] gap-0 p-0 overflow-hidden rounded-3xl border-0 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="bg-slate-900 p-10 text-white flex flex-col items-center relative overflow-hidden">
            {/* Background Abstract Sparkle */}
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
               <FileStack size={180} />
            </div>
            
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 rotate-3 transition-transform hover:rotate-0 duration-500 relative z-10 border-2 border-blue-400">
                <LayoutGrid className="w-10 h-10" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tighter text-white transition-all relative z-10">Blueprint Initialization</DialogTitle>
            <DialogDescription className="text-slate-400 mt-2 text-center text-sm font-bold uppercase tracking-widest relative z-10">
                Configure parameters for {template.name}
            </DialogDescription>
        </div>

        <div className="grid grid-cols-5 gap-0 bg-white">
            <div className="col-span-3 p-10 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-thin">
                <section className="space-y-4">
                    <Label htmlFor="docName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1 italic border-l-4 border-blue-500/20 ml-1">
                        <ArrowRight size={10} className="text-blue-500" /> Document Name
                    </Label>
                    <Input 
                      id="docName" 
                      value={docName} 
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="Enter formalized document name..." 
                      className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xs font-bold transition-all shadow-inner"
                    />
                </section>

                <section className="space-y-6 pt-4 border-t border-slate-50">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 border-l-4 border-blue-500/20 ml-1 italic flex items-center gap-2">
                       <ArrowRight size={10} className="text-blue-500" /> Embedded Metadata
                   </h4>
                   <div className="grid gap-6">
                       {Object.keys(template.default_metadata || {}).map(key => (
                         <div key={key} className="space-y-2 group">
                            <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-2 group-focus-within:text-blue-500 transition-colors">{key.replace(/_/g, ' ')}</Label>
                            <Input 
                              value={metadata[key] || ''} 
                              onChange={(e) => setMetadata({...metadata, [key]: e.target.value})}
                              placeholder={`Enter ${key}...`}
                              className="h-12 bg-slate-50/50 border-slate-100/10 hover:border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold shadow-inner transition-all"
                            />
                         </div>
                       ))}
                   </div>
                </section>
            </div>

            {/* Sidebar Logic for Tags/Info */}
            <div className="col-span-2 bg-slate-50/80 p-10 border-l border-slate-100 space-y-10">
                <section className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                        <Tags size={12} className="text-blue-500" /> Classification
                    </Label>
                    <div className="flex flex-wrap gap-1.5 p-4 bg-white/40 border border-white rounded-3xl min-h-[80px] shadow-sm backdrop-blur-md">
                        {tags.map(tag => (
                          <span key={tag} className="bg-white text-slate-700 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border border-slate-100 flex items-center group/tag shadow-sm hover:border-red-200 hover:text-red-600 transition-all cursor-default">
                             {tag}
                             <button onClick={() => removeTag(tag)} className="ml-1.5 opacity-0 group-hover/tag:opacity-100 transition-opacity">
                                <X size={10} className="stroke-[3] drop-shadow-sm" />
                             </button>
                          </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                         <Input 
                           value={newTag} 
                           onChange={(e) => setNewTag(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && addTag()}
                           placeholder="Add tag..." 
                           className="h-10 text-[10px] rounded-xl border-slate-200 bg-white shadow-inner font-bold placeholder:italic transition-all"
                         />
                    </div>
                </section>

                <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 space-y-3">
                     <div className="flex items-center gap-2 text-blue-600">
                        <Info size={14} className="stroke-[2.5]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Blueprint Info</span>
                     </div>
                     <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                        Initializing this document will synchronize all default tags and embedded metadata. Existing permissions for the target folder will be applied automatically.
                     </p>
                </div>
            </div>
        </div>

        <DialogFooter className="p-10 pt-0 bg-white flex justify-end gap-3 items-center border-t border-slate-50">
            <Button variant="ghost" onClick={onClose} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">Abort</Button>
            <Button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending || !docName.trim()}
                className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-600/30 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 group flex items-center gap-3"
            >
                {createMutation.isPending ? 'Syncing...' : 'Initialize Document'}
                <CheckCircle2 size={16} className="group-hover:rotate-12 transition-transform shadow-md" />
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
