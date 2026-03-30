import React from 'react'
import { Search, Bell, Grid, List, Plus, Upload, Filter, MoreVertical, LayoutGrid, LayoutList } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { useUploadStore } from '../../stores/uploadStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'

export function TopBar() {
  const { viewMode, setViewMode } = useExplorerStore()
  const { openModal } = useUploadStore()

  return (
    <header className="h-20 px-8 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-all">
      <div className="flex-1 max-w-2xl group transition-all">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search documents, tags, or metadata..." 
            className="h-12 pl-12 pr-4 bg-slate-50 border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xs font-bold uppercase tracking-widest placeholder:text-slate-300 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-10">
        <div className="flex items-center bg-slate-100/50 p-1.5 rounded-xl border border-slate-100 shadow-sm transition-all hover:bg-white">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              viewMode === 'grid' ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10 scale-105" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <LayoutGrid size={16} className="stroke-[2.5]" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              viewMode === 'list' ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10 scale-105" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <LayoutList size={16} className="stroke-[2.5]" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-100 mx-1" />

        <Button 
          onClick={() => openModal()}
          className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 group flex items-center gap-2.5"
        >
          <Upload size={16} className="group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
          <span className="text-[10px] uppercase tracking-widest leading-none">Upload Asset</span>
        </Button>
      </div>
    </header>
  )
}
