import React from 'react'
import { Document } from '../../types/document'
import { MoreVertical, Lock, Clock, ShieldCheck, Download, Archive, MoreHorizontal, MousePointerClick, FileDigit } from 'lucide-react'
import { FileTypeIcon } from '../shared/FileTypeIcon'
import { FavoriteStar } from '../document/FavoriteStar'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { useBulkMutation } from '../../hooks/mutations/useBulkMutation'
import { TagSelector } from '../shared/TagSelector'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Tags, Hash, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function DocumentCard({ document: doc }: { document: Document }) {
  const { openDocument, toggleSelect, selectedDocumentIds } = useExplorerStore()
  const { bulkTag } = useBulkMutation()
  const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false)
  const isSelected = selectedDocumentIds.has(doc.id)

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.stopPropagation()
        toggleSelect(doc.id)
    } else {
        openDocument(doc.id)
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSelect(doc.id)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "group bg-white border border-indigo-50/50 rounded-[2.5rem] p-7 cursor-pointer flex flex-col h-full relative overflow-hidden transition-all duration-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)]",
        isSelected 
          ? "border-indigo-500 bg-indigo-50/30 shadow-2xl shadow-indigo-500/10 ring-4 ring-indigo-500/5 rotate-1" 
          : "hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-100"
      )}
      onClick={handleCardClick}
    >
      {/* Selection Overlay */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
         <div 
           className={cn(
             "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-500 transform",
             isSelected 
               ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/40 scale-110" 
               : "bg-white/90 border-slate-200 opacity-0 group-hover:opacity-100 scale-90 hover:scale-100"
           )}
           onClick={handleCheckboxClick}
         >
           {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-white" />}
         </div>
         <FavoriteStar documentId={doc.id} size="sm" showTooltip={false} />
      </div>

      {/* Main Asset Visualization */}
      <div className="flex flex-col items-center justify-center py-10 mb-6 relative transition-all h-36">
         <div className="w-24 h-24 rounded-[2.2rem] bg-gradient-to-tr from-slate-50 to-white border border-indigo-50 shadow-xl flex items-center justify-center p-6 transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 relative z-0">
            <FileTypeIcon fileType={doc.file_type} size="xl" />
            <div className="absolute inset-0 bg-indigo-500/5 rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
         </div>
      </div>

      {/* Primary Data Group */}
      <div className="flex-1 min-w-0 text-center flex flex-col items-center">
         <h3 className="text-[15px] font-black text-slate-800 line-clamp-1 leading-tight mb-2 tracking-tight group-hover:text-indigo-600 transition-colors duration-300 px-1" title={doc.name}>
           {doc.name}
         </h3>
         <div className="flex items-center gap-2.5 mb-2 transition-transform duration-500">
            <Badge variant="secondary" className="bg-indigo-50/50 text-[9px] font-bold uppercase tracking-widest text-indigo-500 rounded-xl px-2.5 py-0.5 border-0 shadow-sm">{doc.file_type}</Badge>
            <span className="text-[10px] font-bold text-slate-400">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
         </div>
         <div className="text-[10px] text-slate-400 font-medium mb-3">
           {formatDistanceToNow(new Date(doc.updated_at))} ago
         </div>

         {/* Document Tags */}
         {doc.tags && doc.tags.length > 0 && (
           <div className="flex flex-wrap justify-center gap-1.5 mt-1 overflow-hidden max-h-12">
             {doc.tags.map(tag => (
               <Badge 
                 key={tag.id} 
                 variant="outline" 
                 className="bg-slate-50/50 text-[8px] font-bold text-slate-500 border-slate-100 rounded-lg py-0 px-1.5 h-4 flex items-center gap-1"
               >
                 <Hash size={8} /> {tag.name}
               </Badge>
             ))}
           </div>
         )}
      </div>

      {/* Footer Info & Actions */}
      <footer className="mt-8 pt-6 border-t border-indigo-50/50 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-all duration-500">
         <div className="flex items-center gap-2">
            {doc.is_locked && (
              <div className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-xl text-amber-500 border border-amber-100 shadow-sm" title={`Locked by ${doc.locked_by_name}`}>
                <Lock size={12} className="stroke-[3]" />
              </div>
            )}
            {doc.is_archived && (
              <div className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-xl text-white shadow-lg" title="Archived">
                <Archive size={12} className="stroke-[3]" />
              </div>
            )}
         </div>

         <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90 shadow-sm border border-transparent">
                  <MoreHorizontal size={18} className="stroke-[2.5]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-2xl border-indigo-50/50 shadow-2xl p-2 w-52 overflow-hidden glass animate-in fade-in zoom-in-95 duration-300">
                  <DropdownMenuItem className="rounded-xl h-11 px-4 cursor-pointer gap-3 text-[11px] font-bold uppercase tracking-widest transition-colors focus:bg-indigo-50 focus:text-indigo-600"><MousePointerClick className="w-4 h-4" /> Inspect detail</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl h-11 px-4 cursor-pointer gap-3 text-[11px] font-bold uppercase tracking-widest transition-colors focus:bg-indigo-50 focus:text-indigo-600 text-indigo-600/80"><Download className="w-4 h-4" /> Download</DropdownMenuItem>
                  <div className="h-px bg-indigo-50/50 my-1 mx-2" />
                  
                  <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem 
                        className="rounded-xl h-11 px-4 cursor-pointer gap-3 text-[11px] font-bold uppercase tracking-widest transition-colors focus:bg-indigo-50 focus:text-indigo-600 text-slate-700"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Tags className="w-4 h-4" /> Manage Tags
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                       <DialogHeader className="sr-only">
                         <DialogTitle>Manage Tags for {doc.name}</DialogTitle>
                       </DialogHeader>
                       <div className="rounded-[2.5rem] bg-white p-8 shadow-2xl border border-indigo-100 space-y-6">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                             <Tags size={24} />
                           </div>
                           <div>
                             <h4 className="font-black text-slate-800 tracking-tight">Tag Management</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update tags for {doc.name}</p>
                           </div>
                         </div>

                         <TagSelector 
                           selectedTagNames={doc.tags?.map(t => t.name) || []}
                           onToggle={(tagName) => {
                              const isAdded = doc.tags?.some(t => t.name === tagName) || false
                              bulkTag.mutate({ 
                                ids: [doc.id], 
                                add: isAdded ? [] : [tagName], 
                                remove: isAdded ? [tagName] : [] 
                              }, {
                                onSuccess: () => {
                                  toast.success(`${isAdded ? 'Removed' : 'Added'} tag ${tagName}`)
                                }
                              })
                           }}
                           onClose={() => setIsTagDialogOpen(false)}
                         />
                         
                         <button 
                            onClick={() => setIsTagDialogOpen(false)}
                            className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
                         >
                           Finished
                         </button>
                       </div>
                    </DialogContent>
                  </Dialog>

                  <div className="h-px bg-indigo-50/50 my-1 mx-2" />
                  <DropdownMenuItem className="rounded-xl h-11 px-4 cursor-pointer gap-3 text-[11px] font-bold uppercase tracking-widest transition-colors focus:bg-indigo-50 focus:text-indigo-600 text-slate-400"><FileDigit className="w-4 h-4" /> Attributes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
       </footer>
    </motion.div>
  )
}

