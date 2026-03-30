import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { useUploadStore } from '../../stores/uploadStore'
import { useUpload } from '../../hooks/useUpload'
import { UploadDropzone } from './UploadDropzone'
import { UploadQueue } from './UploadQueue'
import { Box, Upload, X, ShieldCheck, CheckCircle2, AlertCircle, Copy, ArrowRight, Tags, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

  const { isModalOpen, closeModal, items, clearCompleted, defaultFolderId, updateItem } = useUploadStore()
  const { processFile, uploadItem } = useUpload()
  const hasItems = items.length > 0

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
      <DialogContent className="sm:max-w-[1000px] gap-0 p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="grid grid-cols-12 h-[750px]">
           {/* LEFT: Upload Context/Status Sidebar */}
           <div className="col-span-4 bg-slate-900 p-12 text-white flex flex-col relative overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-[-50px] left-[-30px] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-20px] right-[-20px] w-48 h-48 bg-blue-400/10 rounded-full blur-[60px]" />

                <div className="relative z-10 space-y-12 h-full flex flex-col">
                    <div>
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 mb-8 border border-blue-400/30">
                            <Upload className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter mb-2 leading-tight">Asset Sync</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Multi-thread upload controller</p>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-blue-500" /> Integrity Control
                            </h4>
                            <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                                Every asset is hashed (SHA-256) client-side before synchronization. Duplicates are automatically flagged to prevent database redundancy.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Sync Pipeline</h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Asset Preparation', active: items.length > 0 },
                                    { label: 'Blockchain Verification', active: items.some(i => i.status === 'hashing') },
                                    { label: 'Cloud Stream', active: items.some(i => i.status === 'uploading') }
                                ].map((step, idx) => (
                                    <div key={idx} className={cn("flex items-center gap-3 transition-opacity", !step.active && "opacity-30")}>
                                        <div className={cn("w-1.5 h-6 rounded-full", step.active ? "bg-blue-500" : "bg-slate-700")} />
                                        <span className="text-[11px] font-bold tracking-tight">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
                            <span>Repository Target</span>
                            <span className="text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg">Folder ID: {defaultFolderId || 'Root'}</span>
                        </div>
                    </div>
                </div>
           </div>

           {/* RIGHT: Main Interaction Area */}
           <div className="col-span-8 bg-white flex flex-col">
                <header className="h-20 px-10 border-b border-slate-50 flex items-center justify-between bg-white flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <DialogTitle className="text-lg font-black text-slate-900 tracking-tight italic">Synchronization Queue</DialogTitle>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-3 py-1 rounded-full border border-slate-200/50 uppercase tracking-widest">{items.length} items queued</span>
                    </div>
                    <button onClick={closeModal} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                        <X size={20} className="stroke-[3]" />
                    </button>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {!hasItems ? (
                        <div className="flex-1 flex flex-col p-10">
                            <UploadDropzone />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-10 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
                             <UploadQueue items={items} />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-10 pt-0 bg-white border-t border-slate-50 flex items-center justify-between flex-shrink-0 mt-auto">
                    <div className="flex-1 flex items-center gap-4">
                        {hasItems && (
                           <Button 
                             variant="ghost" 
                             onClick={() => clearCompleted()}
                             className="h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-red-500 transition-all"
                           >
                             Purge Completed
                           </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={closeModal} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]">Close Window</Button>
                        <Button 
                            onClick={handleStartAll}
                            disabled={!hasItems || items.every(i => i.status === 'done')}
                            className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/30 transition-all active:scale-95 group flex items-center gap-3"
                        >
                            Commit Sync Stack
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-all stroke-[3]" />
                        </Button>
                    </div>
                </DialogFooter>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
