import React from 'react'
import { useDocuments } from '../../hooks/queries/useDocuments'
import { useExplorerStore } from '../../stores/explorerStore'
import { DocumentGrid } from './DocumentGrid'
import { DocumentList } from './DocumentList'
import { Loader2, FolderSearch, AlertOctagon, LayoutGrid } from 'lucide-react'
import { Button } from '../ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export function DocumentArea() {
  const { currentFolderId, viewMode, sortBy, sortOrder } = useExplorerStore()
  const { data, isLoading, isError, refetch } = useDocuments({
    folder_id: currentFolderId,
    sort_by: sortBy,
    sort_order: sortOrder
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in duration-700 bg-slate-50/10">
        <div className="w-24 h-24 rounded-3xl bg-blue-600/5 flex items-center justify-center shadow-inner mb-10 transition-all scale-110">
           <Loader2 className="w-10 h-10 animate-spin text-blue-500 stroke-[2.5]" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tighter italic">Retrieving assets...</h3>
        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest pl-0.5">Please hold while we sync the repository data.</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 bg-red-50/50">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 mb-6 shadow-xl shadow-red-500/10">
           <AlertOctagon size={32} />
        </div>
        <h3 className="text-lg font-black text-red-900 mb-2">Sync failure.</h3>
        <p className="text-xs font-bold text-red-700/60 uppercase tracking-widest mb-10 text-center max-w-xs">Could not establish connection to the asset streaming server.</p>
        <Button onClick={() => refetch()} variant="destructive" className="h-12 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-600/30">Force Resync</Button>
      </div>
    )
  }

  if (!data?.items.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 bg-slate-50/30">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           className="w-32 h-32 rounded-[2.5rem] bg-white flex items-center justify-center text-slate-300 mb-12 shadow-2xl shadow-slate-200/50 relative border border-slate-100"
        >
           <FolderSearch size={48} className="drop-shadow-sm" />
           <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
              <LayoutGrid size={18} />
           </div>
        </motion.div>
        <div className="text-center group">
           <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter group-hover:text-blue-600 transition-colors italic">Void directory detected.</h3>
           <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-sm uppercase tracking-widest pl-0.5 opacity-60">This subspace contains no files. Upload assets or select a different repository node.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200 transition-all bg-slate-50/20">
      <AnimatePresence mode="wait">
        <motion.div
           key={viewMode}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.4, ease: "easeOut" }}
           className="h-full"
        >
          {viewMode === 'grid' ? (
            <DocumentGrid documents={data.items} />
          ) : (
            <DocumentList documents={data.items} />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Spacer for bottom action bar */}
      <div className="h-24" />
    </div>
  )
}
