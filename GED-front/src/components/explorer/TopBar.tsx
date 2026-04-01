import React from 'react'
import { Search, Bell, Grid, List, Plus, Upload, Filter, MoreVertical, LayoutGrid, LayoutList } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { useUploadStore } from '../../stores/uploadStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'

export function TopBar() {
  const { viewMode, setViewMode, currentFolderId, searchQuery, setSearchQuery } = useExplorerStore()
  const { openModal } = useUploadStore()

  const handleUploadClick = () => {
    openModal(currentFolderId)
  }

  return (
    <header className="min-h-20 px-4 sm:px-6 lg:px-8 py-3 bg-white/80 backdrop-blur-xl border-b border-indigo-100/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sticky top-0 z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] transition-all">
      <div className="w-full lg:flex-1 lg:max-w-2xl group transition-all">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, tags, or metadata..." 
              className="h-11 sm:h-12 pl-12 pr-4 bg-white/60 border-white/80 focus:bg-white focus:ring-indigo-500/10 focus:border-indigo-500/50 rounded-2xl text-[13px] font-medium transition-all duration-200 shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 sm:gap-4 lg:ml-8">
        {/* View Toggles */}
        <div className="flex items-center bg-slate-200/40 p-1 rounded-[1rem] border border-white/50 shadow-inner overflow-hidden">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200",
              viewMode === 'grid' 
                ? "bg-white text-indigo-600 shadow-md shadow-indigo-500/10" 
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <LayoutGrid size={16} className="stroke-[2.5]" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Grid</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200",
              viewMode === 'list' 
                ? "bg-white text-indigo-600 shadow-md shadow-indigo-500/10" 
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <LayoutList size={16} className="stroke-[2.5]" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">List</span>
          </button>
        </div>

        <div className="hidden sm:block h-8 w-px bg-indigo-100/50 mx-1" />

        <Button 
          onClick={handleUploadClick}
          className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] group flex items-center gap-2 sm:gap-3 btn-glossy"
        >
          <Upload size={18} className="transition-transform stroke-[2.5]" />
          <span className="text-[11px] uppercase tracking-[0.2em] leading-none">Upload Asset</span>
        </Button>
      </div>
    </header>
  )
}

