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
    <div className="flex h-full overflow-hidden bg-slate-50">
        
        {/* LEFT: Folder Tree Sidebar */}
        <aside className="w-80 shrink-0 bg-white border-r border-slate-200 overflow-y-auto hidden lg:flex flex-col shadow-sm">
          <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Vault Repository</h2>
          </div>
          <div className="flex-1 p-4">
            <FolderTree />
          </div>
        </aside>
        
        {/* CENTER: Main Explorer Content */}
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out relative",
          isDetailPanelOpen && "mr-[400px]"
        )}>
          <TopBar />
          <Breadcrumb />
          <TagFilter />
          <SortBar />
          <BulkActionBar />
          
          <div className="flex-1 flex flex-col relative z-0">
             <DocumentArea selectedTags={selectedTags} />
          </div>
        </main>
        
        {/* RIGHT: Detail Panel (slide-in) */}
        {isDetailPanelOpen && openDocumentId && (
          <aside
            className={`fixed right-0 top-0 bottom-0 w-[400px] 
                       bg-white border-l border-slate-200 
                       shadow-lg overflow-y-auto z-30 transition-transform duration-200 ${
              isDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <DocumentDetailPanel documentId={openDocumentId} />
          </aside>
        )}
        
      </div>
  )
}
