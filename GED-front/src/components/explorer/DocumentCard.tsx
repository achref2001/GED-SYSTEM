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

export function DocumentCard({ document: doc }: { document: Document }) {
  const { openDocument, toggleSelect, selectedDocumentIds } = useExplorerStore()
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
    <div 
      className={cn(
        "group bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer flex flex-col h-full relative overflow-hidden active:scale-95 duration-500",
        isSelected && "border-blue-500 bg-blue-50/50 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/10 scale-[1.02]"
      )}
      onClick={handleCardClick}
    >
      {/* Premium Badge & Check Selection Overlay */}
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-10">
         <div 
           className={cn(
             "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 transform scale-0 group-hover:scale-100",
             isSelected ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/50 scale-100" : "bg-white/80 border-slate-200 hover:border-blue-500/50 shadow-sm"
           )}
           onClick={handleCheckboxClick}
         >
           {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-white shadow-inner animate-in zoom-in-50 duration-300" />}
         </div>
         <FavoriteStar documentId={doc.id} size="sm" showTooltip={false} />
      </div>

      {/* Main Asset Visualization */}
      <div className="flex flex-col items-center justify-center py-8 mb-6 relative group/icon transition-all h-32">
         <div className="w-24 h-24 rounded-[2rem] bg-white border border-slate-100 shadow-xl flex items-center justify-center p-6 transition-all duration-500 group-hover:bg-blue-600/5 group-hover:border-blue-200 group-hover:rotate-6 group-hover:scale-110 shadow-slate-200/50 relative z-0">
            <FileTypeIcon fileType={doc.file_type} size="xl" />
         </div>
      </div>

      {/* Primary Data Group */}
      <div className="flex-1 min-w-0 text-center flex flex-col items-center">
         <h3 className="text-sm font-black text-slate-800 line-clamp-1 leading-tight mb-2 tracking-tight group-hover:text-blue-600 transition-colors px-1" title={doc.name}>
           {doc.name}
         </h3>
         <div className="flex items-center gap-2 mb-4 group-hover:translate-y-[-2px] transition-transform duration-300">
            <Badge variant="secondary" className="bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-lg px-2 py-0 border-0">{doc.file_type}</Badge>
            <span className="text-[10px] font-bold text-slate-400">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
         </div>
      </div>

      {/* Interactive Context and Meta Icons Row */}
      <footer className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity duration-500">
         <div className="flex items-center gap-2.5">
            {doc.is_locked && (
              <div className="p-2 bg-amber-50 rounded-xl text-amber-500 border border-amber-100 shadow-sm" title={`Locked by ${doc.locked_by_name}`}>
                <Lock size={12} className="stroke-[3]" />
              </div>
            )}
            {doc.expires_at && (
              <div className="p-2 bg-red-50 rounded-xl text-red-500 border border-red-100 shadow-sm" title="Expiring Soon">
                <Clock size={12} className="stroke-[3]" />
              </div>
            )}
            {doc.is_archived && (
              <div className="p-2 bg-slate-900 rounded-xl text-white shadow-xl" title="Archived Source">
                <Archive size={12} className="stroke-[3]" />
              </div>
            )}
         </div>

         <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 hover:border hover:border-blue-100 transition-all active:scale-95 shadow-sm group/btn">
                  <MoreHorizontal size={16} className="stroke-[2.5]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-2xl border-slate-100 shadow-2xl p-2 w-48 font-bold text-[10px] uppercase tracking-widest animate-in slide-in-from-top-2 duration-300">
                 <DropdownMenuItem className="rounded-xl h-10 px-3 cursor-pointer"><MousePointerClick className="w-3.5 h-3.5 mr-2" /> Inspect details</DropdownMenuItem>
                 <DropdownMenuItem className="rounded-xl h-10 px-3 cursor-pointer text-blue-600"><Download className="w-3.5 h-3.5 mr-2" /> Download asset</DropdownMenuItem>
                 <DropdownMenuItem className="rounded-xl h-10 px-3 cursor-pointer text-slate-400"><FileDigit className="w-3.5 h-3.5 mr-2" /> Checksum v2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
       </footer>
    </div>
  )
}
