import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { useUploadStore } from '../../stores/uploadStore'
import { useExplorerStore } from '../../stores/explorerStore'
import { useUpload } from '../../hooks/useUpload'
import { UploadDropzone } from './UploadDropzone'
import { UploadQueue } from './UploadQueue'
import { Box, Upload, X, ShieldCheck, CheckCircle2, AlertCircle, Copy, ArrowRight, Tags, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

  export function UploadModal() {
  const { isModalOpen, closeModal, items, clearCompleted, defaultFolderId, updateItem } = useUploadStore()
  const { currentFolderId, folders } = useExplorerStore()
  const { processFile, uploadItem } = useUpload()
  const hasItems = items.length > 0

  // Get the current folder name
  const getCurrentFolderName = () => {
    if (!defaultFolderId) return 'Root Folder'
    // You might need to add a way to get folder name from ID
    return `Folder ${defaultFolderId}`
  }

  React.useEffect(() => {
    // Automatically process hashing for new files
    items.filter(i => i.status === 'ready' && !i.hash).forEach(item => {
        processFile(item)
    })
  }, [items, processFile])

  const handleStartAll = async () => {
    // Basic metadata for now - in pro app we'd have a sidebar to edit this
    const metadata = {
        folderId: defaultFolderId,
        tags: [],
        description: ''
    }
    
    for (const item of items) {
      if (item.status === 'ready' || item.status === 'duplicate') {
        await uploadItem(item, metadata)
      } else if (item.status === 'hash_done') {
          // Re-check or move to ready
          await uploadItem(item, metadata)
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[800px] gap-0 p-0 overflow-hidden rounded-lg border shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="grid grid-cols-12 h-[500px]">
           {/* LEFT: Upload Context/Status Sidebar */}
           <div className="col-span-4 bg-slate-900 p-6 text-white flex flex-col relative overflow-hidden">
                {/* Simplified Background Elements */}
                <div className="absolute top-[-20px] left-[-10px] w-32 h-32 bg-blue-600/10 rounded-full" />
                <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 bg-blue-400/5 rounded-full" />

                <div className="relative z-10 space-y-6 h-full flex flex-col">
                    <div>
                        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow mb-4">
                            <Upload className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold mb-1">Upload Files</h2>
                        <p className="text-xs text-slate-400 uppercase">Upload manager</p>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h4 className="text-xs font-bold text-slate-400 mb-2">Status</h4>
                            <p className="text-xs text-slate-300">
                                {items.length} files ready to upload
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Target</span>
                            <span>{getCurrentFolderName()}</span>
                        </div>
                    </div>
                </div>
           </div>

           {/* RIGHT: Main Interaction Area */}
           <div className="col-span-8 bg-white flex flex-col">
                <header className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-lg font-semibold text-slate-900">Upload Queue</DialogTitle>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{items.length} items</span>
                    </div>
                    <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                        <X size={16} />
                    </button>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {!hasItems ? (
                        <div className="flex-1 flex flex-col p-6">
                            <UploadDropzone />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-6 space-y-2">
                             <UploadQueue items={items} />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-0 bg-white border-t border-slate-100 flex items-center justify-between flex-shrink-0">
                    <div className="flex-1 flex items-center gap-3">
                        {hasItems && (
                           <Button 
                             variant="ghost" 
                             onClick={() => clearCompleted()}
                             className="text-slate-400 hover:text-red-500 transition-colors"
                           >
                             Clear Completed
                           </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={closeModal}>Close</Button>
                        <Button 
                            onClick={handleStartAll}
                            disabled={!hasItems || items.every(i => i.status === 'done')}
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                        >
                            Start Upload
                        </Button>
                    </div>
                </DialogFooter>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
