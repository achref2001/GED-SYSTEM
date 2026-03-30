import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExplorerStore } from '../../stores/explorerStore'
import { 
  X, Move, Trash2, Download, Tags, 
  CheckCircle2, AlertCircle, FileStack 
} from 'lucide-react'
import { Button } from '../ui/button'
import { useBulkMutation } from '../../hooks/mutations/useBulkMutation'
import { documentsApi } from '../../services/api/documents'

export function BulkActionBar() {
  const { selectedDocumentIds, clearSelection } = useExplorerStore()
  const hasSelection = selectedDocumentIds.size > 0
  const selectedIdsArray = Array.from(selectedDocumentIds)
  const { bulkDelete } = useBulkMutation()

  const handleDownload = () => {
    documentsApi.bulkDownload(selectedIdsArray)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedDocumentIds.size} documents?`)) {
        bulkDelete.mutate(selectedIdsArray, {
            onSuccess: () => clearSelection()
        })
    }
  }

  return (
    <AnimatePresence>
      {hasSelection && (
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-2xl px-8"
        >
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between pointer-events-auto ring-4 ring-slate-900/20">
             <div className="flex items-center gap-6 pl-4">
                <button 
                  onClick={clearSelection}
                  className="w-10 h-10 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center group"
                >
                  <X size={16} className="group-hover:rotate-90 transition-transform stroke-[2.5]" />
                </button>
                <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                       <h3 className="text-white text-sm font-black uppercase tracking-widest">{selectedDocumentIds.size} Assets Selected</h3>
                       <CheckCircle2 size={12} className="text-blue-500 stroke-[3]" />
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter opacity-70">Bulk operation mode active</p>
                </div>
             </div>

             <div className="flex items-center gap-2 pr-2">
                <Button 
                   variant="ghost" 
                   onClick={handleDownload}
                   className="h-14 px-5 rounded-2xl text-blue-400 font-black uppercase tracking-widest text-[9px] hover:bg-blue-600/10 transition-all flex flex-col items-center justify-center gap-1 group"
                >
                   <Download size={14} className="group-hover:-translate-y-0.5 transition-transform stroke-[3]" />
                   <span>Export ZIP</span>
                </Button>

                <Button 
                   variant="ghost" 
                   className="h-14 px-5 rounded-2xl text-white/50 hover:text-white font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 group"
                >
                   <Move size={14} className="group-hover:translate-x-0.5 transition-transform stroke-[3]" />
                   <span>Relocate</span>
                </Button>

                <Button 
                   variant="ghost" 
                   className="h-14 px-5 rounded-2xl text-white/50 hover:text-white font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 group"
                >
                   <Tags size={14} className="group-hover:rotate-12 transition-transform stroke-[3]" />
                   <span>Edit Tags</span>
                </Button>

                <div className="w-px h-10 bg-white/10 mx-2" />

                <Button 
                   variant="ghost" 
                   onClick={handleDelete}
                   className="h-14 px-6 rounded-2xl text-red-400 hover:text-red-500 font-black uppercase tracking-widest text-[9px] hover:bg-red-600/20 transition-all flex flex-col items-center justify-center gap-1 group"
                >
                   <Trash2 size={14} className="group-active:scale-90 transition-transform stroke-[3]" />
                   <span>Purge</span>
                </Button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
