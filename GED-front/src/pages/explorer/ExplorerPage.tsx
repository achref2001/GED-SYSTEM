import React from 'react'
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
        <aside className="hidden xl:flex w-72 2xl:w-80 shrink-0 bg-white/70 backdrop-blur-xl border-r border-indigo-100/60 overflow-y-auto flex-col">
          <div className="px-6 py-7 border-b border-indigo-50/70 flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-[11px] font-black text-indigo-600/50 uppercase tracking-[0.25em]">Repository</h2>
              <p className="text-xl font-black text-slate-800 tracking-tight">Main Vault</p>
            </div>
          </div>
          <div className="flex-1 p-4 scrollbar-premium">
            <FolderTree />
          </div>
        </aside>
        
        {/* CENTER: Main Explorer Content */}
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] relative overflow-hidden",
          isDetailPanelOpen && "2xl:mr-[400px]"
        )}>
          <TopBar />
          
          <div className="flex-1 overflow-y-auto scrollbar-premium">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-4">
                <Breadcrumb />
                <div className="flex items-center justify-between gap-3 flex-wrap border-b border-indigo-50/70 pb-4">
                  <div className="flex-1 min-w-[280px]">
                    <SortBar />
                  </div>
                  <BulkActionBar />
                </div>
              </div>
              
              <div className="flex-1 min-h-[500px]">
                 <DocumentArea selectedTags={selectedTags} />
              </div>
            </div>
          </div>
        </main>
        
        {/* RIGHT: Detail Panel (slide-in) */}
        {isDetailPanelOpen && openDocumentId && (
          <aside
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px]
                       bg-white/90 backdrop-blur-xl border-l border-indigo-100/70 
                       shadow-[-20px_0_40px_rgba(0,0,0,0.05)] overflow-y-auto z-50 p-0"
          >
            <DocumentDetailPanel documentId={openDocumentId} />
          </aside>
        )}
        
      </div>
  )
}

