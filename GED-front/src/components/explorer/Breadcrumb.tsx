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
    <nav className="w-full px-3 sm:px-4 py-2.5 bg-white/70 border border-slate-100/80 rounded-2xl flex items-center gap-2 text-[11px] font-semibold text-slate-500 overflow-x-auto scrollbar-premium">
      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer border border-transparent" onClick={() => setCurrentFolder(null)}>
        <Home size={14} className="stroke-[2.5]" />
        <span className="whitespace-nowrap">Root</span>
      </div>

      {breadcrumb?.map((item, index) => (
        <React.Fragment key={item.id}>
           <ChevronRight size={13} className="stroke-[3] text-slate-300 shrink-0" />
           <div 
             className={cn(
               "shrink-0 flex items-center px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-transparent",
               item.id === currentFolderId 
                 ? "bg-indigo-600 text-white border-indigo-600" 
                 : "hover:bg-slate-100 hover:text-indigo-600"
             )}
             onClick={() => setCurrentFolder(item.id)}
           >
             <span className="truncate max-w-[180px]">{item.name}</span>
           </div>
        </React.Fragment>
      ))}

      {breadcrumb?.length === 0 && currentFolderId !== null && (
          <div className="shrink-0 flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
             <ChevronRight size={13} className="text-indigo-500 stroke-[3]" />
             <span className="text-indigo-600 font-semibold">{folder?.name || 'Syncing Node...'}</span>
          </div>
      )}
    </nav>
  )
}
