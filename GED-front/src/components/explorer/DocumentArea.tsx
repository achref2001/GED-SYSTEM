import React from 'react'
import { useDocuments } from '../../hooks/queries/useDocuments'
import { useExplorerStore } from '../../stores/explorerStore'
import { DocumentGrid } from './DocumentGrid'
import { DocumentList } from './DocumentList'
import { Loader2, FolderSearch, AlertOctagon, LayoutGrid } from 'lucide-react'
import { Button } from '../ui/button'

export function DocumentArea({ selectedTags: propTags }: { selectedTags?: string[] }) {
  const { currentFolderId, viewMode, sortBy, sortOrder, selectedTags: storeTags, searchQuery } = useExplorerStore()
  
  const finalTags = propTags || storeTags

  const { data, isLoading, isError, refetch } = useDocuments({
    folder_id: currentFolderId,
    sort_by: sortBy,
    sort_order: sortOrder,
    selectedTags: finalTags,
    q: searchQuery
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 sm:p-20 animate-in fade-in duration-300 bg-transparent">
        <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/5 flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 rounded-[2rem] border-2 border-indigo-500/10 border-t-indigo-500" />
           <Loader2 className="w-10 h-10 text-indigo-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Retrieving Assets</h3>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">Establishing secure link to the repository...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 sm:p-20 glass-card mx-2 sm:mx-6 lg:mx-20 rounded-[2rem] sm:rounded-[3rem] border-rose-100 bg-rose-50/20">
        <div className="w-16 h-16 rounded-[1.5rem] bg-rose-100 flex items-center justify-center text-rose-500 mb-6 shadow-xl shadow-rose-500/10">
           <AlertOctagon size={32} />
        </div>
        <h3 className="text-xl font-black text-rose-900 mb-2">Sync Failure</h3>
        <p className="text-[11px] font-bold text-rose-700/60 uppercase tracking-[0.15em] mb-10 text-center max-w-xs">Could not establish connection to the asset streaming server.</p>
        <Button onClick={() => refetch()} variant="destructive" className="h-12 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-600/30 btn-glossy">Re-Initialize link</Button>
      </div>
    )
  }

  if (!data?.items.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 sm:p-20">
        <div className="w-40 h-40 rounded-[3rem] bg-white border border-indigo-50 shadow-2xl shadow-indigo-500/5 flex items-center justify-center text-indigo-100 mb-12 relative">
           <FolderSearch size={64} className="drop-shadow-sm opacity-20" />
           <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 border-4 border-white">
              <LayoutGrid size={24} />
           </div>
        </div>
        <div className="text-center group">
           <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Void Directory</h3>
           <p className="text-sm font-semibold text-slate-400 leading-relaxed max-w-sm uppercase tracking-[0.2em] opacity-80">This workspace contains no assets. Upload files or select a different repository node to proceed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 transition-all min-h-0">
      <div key={viewMode} className="min-h-full">
        {viewMode === 'grid' ? (
          <DocumentGrid documents={data.items} />
        ) : (
          <DocumentList documents={data.items} />
        )}
      </div>
      
      {/* Spacer for scroll headroom */}
      <div className="h-32" />
    </div>
  )
}

