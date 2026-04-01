import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tagsApi } from '../../services/api/tags'
import { Check, Hash, Loader2, Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface TagSelectorProps {
  selectedTagNames: string[]
  onToggle: (tagName: string) => void
  onClose?: () => void
}

export function TagSelector({ selectedTagNames, onToggle, onClose }: TagSelectorProps) {
  const [search, setSearch] = useState('')
  const { data: tagsResponse, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.list()
  })

  const allTags = tagsResponse?.data?.data || []
  const filteredTags = allTags.filter(tag => 
    tag.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col w-64 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Search Header */}
      <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
        <Search size={14} className="text-slate-500 ml-1" />
        <input 
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tags..."
          className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 flex-1 py-1"
        />
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-500">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tags List */}
      <div className="max-h-60 overflow-y-auto scrollbar-premium py-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 gap-2">
            <Loader2 size={14} className="text-indigo-400 animate-spin" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading...</span>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No tags found</p>
          </div>
        ) : (
          <div className="px-2 space-y-1">
            {filteredTags.map(tag => {
              const isSelected = selectedTagNames.includes(tag.name)
              return (
                <button
                  key={tag.id}
                  onClick={() => onToggle(tag.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group text-left",
                    isSelected ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-white/5 text-slate-400"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Hash size={12} className={cn("transition-colors", isSelected ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400")} />
                    <span className="text-xs font-semibold">{tag.name}</span>
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={14} className="text-indigo-400" />
                    </motion.div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-white/5 bg-slate-950/50 flex items-center justify-between">
         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{selectedTagNames.length} SELECTED</span>
         {onClose && (
           <button onClick={onClose} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Done</button>
         )}
      </div>
    </div>
  )
}
