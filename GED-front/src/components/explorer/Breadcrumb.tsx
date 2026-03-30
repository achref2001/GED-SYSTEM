import React from 'react'
import { ChevronRight, Home, ChevronLeft, LayoutPanelLeft } from 'lucide-react'
import { useFolderBreadcrumb, useFolderDetails } from '../../hooks/queries/useFolders'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'

export function Breadcrumb() {
  const { currentFolderId, setCurrentFolder } = useExplorerStore()
  const { data: breadcrumb } = useFolderBreadcrumb(currentFolderId)
  const { data: folder } = useFolderDetails(currentFolderId)

  return (
    <nav className="px-10 py-5 bg-white/40 backdrop-blur-xl flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 group border-b border-slate-100/50 sticky top-20 z-10 transition-colors">
      <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-lg hover:bg-white hover:text-blue-600 transition-all cursor-pointer shadow-sm border border-transparent hover:border-slate-100" onClick={() => setCurrentFolder(null)}>
        <Home size={14} className="stroke-[2.5]" />
        <span className="hidden sm:inline-block">Root Directory</span>
      </div>

      {breadcrumb?.map((item, index) => (
        <React.Fragment key={item.id}>
           <ChevronRight size={14} className="stroke-[3] text-slate-200 group-hover:text-blue-500/30 transition-colors mr-1" />
           <div 
             className={cn(
               "flex items-center p-1 px-2.5 rounded-lg transition-all cursor-pointer border border-transparent",
               item.id === currentFolderId 
                 ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-105 border-blue-600" 
                 : "hover:bg-white hover:text-blue-600 hover:border-slate-100 hover:shadow-sm"
             )}
             onClick={() => setCurrentFolder(item.id)}
           >
             <span className="truncate max-w-[150px]">{item.name}</span>
           </div>
        </React.Fragment>
      ))}

      {breadcrumb?.length === 0 && currentFolderId !== null && (
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-100 animate-in slide-in-from-left-2 duration-300">
             <ChevronRight size={14} className="text-blue-500 stroke-[3]" />
             <span className="text-blue-600 font-black italic">{folder?.name || 'Syncing Node...'}</span>
          </div>
      )}
    </nav>
  )
}
