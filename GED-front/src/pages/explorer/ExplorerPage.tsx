import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExplorerStore } from '../../stores/explorerStore'

import { FolderTree } from '../../components/explorer/FolderTree'
import { DocumentDetailPanel } from '../../components/document/DocumentDetailPanel'
import { cn } from '../../lib/utils'

import { TopBar } from '../../components/explorer/TopBar'
import { Breadcrumb } from '../../components/explorer/Breadcrumb'
import { SortBar } from '../../components/explorer/SortBar'
import { BulkActionBar } from '../../components/bulk/BulkActionBar'
import { TagFilter } from '../../components/explorer/TagFilter'
import { DocumentArea } from '../../components/explorer/DocumentArea'

export default function ExplorerPage() {
  const { currentFolderId, openDocumentId, isDetailPanelOpen, selectedTags } = useExplorerStore()
  
  return (
    <div className="flex h-full overflow-hidden bg-transparent">
        
        {/* LEFT: Folder Tree Sidebar */}
        <aside className="w-80 shrink-0 bg-white/40 backdrop-blur-3xl border-r border-indigo-100/50 overflow-y-auto hidden lg:flex flex-col shadow-[10px_0_30px_-15px_rgba(0,0,0,0.03)]">
          <div className="px-8 py-10 border-b border-indigo-50/50 flex items-center justify-between sticky top-0 z-10">
            <div className="space-y-1">
              <h2 className="text-[11px] font-black text-indigo-600/50 uppercase tracking-[0.25em]">Repository</h2>
              <p className="text-xl font-black text-slate-800 tracking-tight">Main Vault</p>
            </div>
          </div>
          <div className="flex-1 p-6 scrollbar-premium">
            <FolderTree />
          </div>
        </aside>
        
        {/* CENTER: Main Explorer Content */}
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] relative overflow-hidden",
          isDetailPanelOpen && "mr-[400px]"
        )}>
          <TopBar />
          
          <div className="flex-1 overflow-y-auto scrollbar-premium">
            <div className="max-w-[1600px] mx-auto p-8 space-y-6">
              <div className="flex flex-col gap-6">
                <Breadcrumb />
                <div className="flex items-center justify-end gap-4 flex-wrap border-b border-indigo-50/50 pb-6">
                  <div className="flex items-center gap-3">
                    <SortBar />
                    <BulkActionBar />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-h-[500px]">
                 <DocumentArea selectedTags={selectedTags} />
              </div>
            </div>
          </div>
        </main>
        
        {/* RIGHT: Detail Panel (slide-in) */}
        <AnimatePresence>
          {isDetailPanelOpen && openDocumentId && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-[400px] 
                         bg-white/80 backdrop-blur-2xl border-l border-indigo-100/50 
                         shadow-[-20px_0_40px_rgba(0,0,0,0.05)] overflow-y-auto z-50 p-0"
            >
              <DocumentDetailPanel documentId={openDocumentId} />
            </motion.aside>
          )}
        </AnimatePresence>
        
      </div>
  )
}

