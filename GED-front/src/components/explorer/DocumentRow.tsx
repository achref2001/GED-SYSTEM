import React from 'react'
import { Document } from '../../types/document'
import { FileTypeIcon } from '../shared/FileTypeIcon'
import { FavoriteStar } from '../document/FavoriteStar'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'
import { formatDistanceToNow, format } from 'date-fns'
import { Lock, Clock, Archive, MoreHorizontal, MousePointerClick, Download, FileDigit } from 'lucide-react'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export function DocumentRow({ document: doc }: { document: Document }) {
  const { openDocument, toggleSelect, selectedDocumentIds } = useExplorerStore()
  const isSelected = selectedDocumentIds.has(doc.id)

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.stopPropagation()
        toggleSelect(doc.id)
    } else {
        openDocument(doc.id)
    }
  }

  const handleCheckbox = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSelect(doc.id)
  }

  return (
    <div 
      className={cn(
        "group grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-0 px-4 sm:px-5 py-4 rounded-2xl cursor-pointer transition-all duration-150 active:scale-[0.995] border border-transparent",
        isSelected 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600 font-bold" 
          : "hover:bg-white hover:shadow-md hover:border-slate-100 text-slate-600 hover:text-slate-900",
        doc.is_locked && !isSelected && "bg-amber-50/50"
      )}
      onClick={handleClick}
    >
      {/* Identity Group */}
      <div className="md:col-span-6 flex items-center gap-3 min-w-0 md:pr-6 group/id">
         <div 
           className={cn(
             "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 transform scale-0 lg:scale-100 opacity-0 group-hover:opacity-100",
             isSelected ? "bg-white border-white scale-100 opacity-100" : "bg-white/80 border-slate-100 hover:border-blue-500/50 shadow-sm"
           )}
           onClick={handleCheckbox}
         >
           {isSelected && <div className="w-2 h-2 rounded-sm bg-blue-600 shadow-inner" />}
         </div>
         
         <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:rotate-6",
            isSelected ? "bg-white/10" : "bg-slate-50 border border-slate-100"
         )}>
            <FileTypeIcon fileType={doc.file_type} size="md" className={isSelected ? 'text-white' : ''} />
         </div>
         
         <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className={cn("text-sm truncate transition-colors", isSelected ? "text-white" : "text-slate-900 font-bold")}>
               {doc.name}
            </h3>
            <div className={cn("flex items-center gap-2 mt-1 text-[10px] uppercase tracking-widest font-black transition-opacity", isSelected ? "text-white/60" : "text-slate-400 opacity-70")}>
               <span>{doc.file_type}</span>
               <span className="opacity-30">•</span>
               <span className="truncate">{doc.folder_path || 'Root Database'}</span>
               <span className="opacity-30">•</span>
               <span className="truncate">{doc.created_by_name || 'Unknown'}</span>
               {doc.tags && doc.tags.length > 0 && (
                 <>
                   <span className="opacity-30">•</span>
                   <span className="truncate">{doc.tags.map(tag => tag.name).join(', ')}</span>
                 </>
               )}
            </div>
         </div>
      </div>

      {/* Status Meta Icons */}
      <div className="md:col-span-2 flex md:justify-center gap-1.5 transition-all">
         {doc.is_locked && (
           <div className={cn("p-2 rounded-xl border flex items-center justify-center transition-all", isSelected ? "bg-white/10 border-white/20" : "bg-amber-50 text-amber-500 border-amber-100")}>
             <Lock size={12} className="stroke-[3]" />
           </div>
         )}
         {doc.expires_at && (
           <div className={cn("p-2 rounded-xl border flex items-center justify-center transition-all", isSelected ? "bg-white/10 border-white/20" : "bg-red-50 text-red-500 border-red-100")}>
             <Clock size={12} className="stroke-[3]" />
           </div>
         )}
      </div>

      {/* Date Interaction */}
      <div className={cn("md:col-span-2 text-left md:text-center text-[10px] font-black uppercase tracking-widest flex flex-col transition-opacity", isSelected ? "text-white" : "text-slate-500")}>
         <span>{format(new Date(doc.updated_at), 'MMM d, yyyy')}</span>
         <span className={cn("text-[8px] opacity-60 mt-0.5", isSelected ? "text-white" : "text-slate-400 capitalize")}>{formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}</span>
      </div>

      {/* Payload Size + Context Trigger */}
      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4 md:gap-6 text-[10px] font-black uppercase tracking-widest group/footer md:pr-4">
         <span className={cn("transition-colors", isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-900")}>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
         
         <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
               <button className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90", isSelected ? "bg-white/10 text-white border border-white/20" : "bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white border border-slate-100")}>
                  <MoreHorizontal size={14} className="stroke-[3]" />
               </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-2 w-48 shadow-2xl border-slate-100 font-bold uppercase tracking-widest text-[10px] animate-in slide-in-from-right-4 duration-300">
               <DropdownMenuItem className="rounded-xl h-10 cursor-pointer"><MousePointerClick size={14} className="mr-3" /> Quick Inspect</DropdownMenuItem>
               <DropdownMenuItem className="rounded-xl h-10 cursor-pointer text-blue-600 font-black"><Download size={14} className="mr-3" /> Download Source</DropdownMenuItem>
               <DropdownMenuItem className="rounded-xl h-10 cursor-pointer text-slate-400"><FileDigit size={14} className="mr-3" /> Checksum v2</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
    </div>
  )
}
