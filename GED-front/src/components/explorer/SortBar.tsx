import React from 'react'
import { ArrowUpDown, ChevronDown, Filter, SortAsc, SortDesc, Database, Calendar, FileType } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { tagsApi } from '../../services/api/tags'
import { Check, Hash, Loader2 } from 'lucide-react'

export function SortBar() {
  const { sortBy, sortOrder, setSortBy, toggleSortOrder, selectedTags, setSelectedTags } = useExplorerStore()

  const { data: tagsResponse, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.list()
  })

  const allTags = tagsResponse?.data?.data || []

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  const sortItems = [
    { label: 'Asset Name', value: 'name', icon: Database },
    { label: 'Date Modified', value: 'date', icon: Calendar },
    { label: 'Asset Size', value: 'size', icon: Database },
    { label: 'File Type', value: 'type', icon: FileType },
  ]

  const activeSort = sortItems.find(i => i.value === sortBy) || sortItems[0]

  return (
    <div className="w-full lg:w-auto px-2 sm:px-3 py-2 bg-white/70 border border-slate-100/80 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors group min-w-[185px]">
               <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ArrowUpDown size={14} className="stroke-[3]" />
               </div>
               <div className="flex flex-col items-start min-w-[110px]">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">Sort</span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                     {activeSort.label}
                     <ChevronDown size={12} className="text-slate-300 group-hover:text-indigo-500 stroke-[4]" />
                  </span>
               </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl border-slate-100 shadow-2xl p-2 w-64 animate-in slide-in-from-top-4 duration-200 font-sans">
             <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select sorting criterion</DropdownMenuLabel>
             <DropdownMenuSeparator className="bg-slate-50" />
             {sortItems.map((item) => (
                <DropdownMenuItem 
                  key={item.value}
                  className={cn(
                    "rounded-xl h-11 px-4 cursor-pointer font-bold text-[10px] uppercase tracking-widest transition-all mb-1",
                    sortBy === item.value ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-50 hover:text-indigo-600"
                  )}
                  onClick={() => setSortBy(item.value as any)}
                >
                  <item.icon size={14} className="mr-3 stroke-[2.5]" />
                  {item.label}
                </DropdownMenuItem>
             ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button 
          onClick={toggleSortOrder}
          className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-colors group"
          title={sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
        >
          {sortOrder === 'asc' ? <SortAsc size={18} className="stroke-[3]" /> : <SortDesc size={18} className="stroke-[3]" />}
        </button>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors group min-w-[210px]",
              selectedTags.length > 0 
                ? "bg-indigo-600 border-indigo-500 text-white shadow-sm" 
                : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 shadow-sm"
            )}>
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center",
                selectedTags.length > 0 ? "bg-white/20" : "bg-indigo-50 text-indigo-600"
              )}>
                <Filter size={14} className="stroke-[3]" />
              </div>
              <div className="flex flex-col items-start text-left min-w-[90px] max-w-[145px]">
                <span className={cn(
                  "text-[10px] font-semibold uppercase tracking-widest leading-none mb-1",
                  selectedTags.length > 0 ? "text-indigo-200" : "text-slate-400"
                )}>
                  {selectedTags.length === 0 ? "Filter Tags" : `${selectedTags.length} Active Filters`}
                </span>
                <span className="text-xs font-semibold truncate max-w-[120px]">
                  {selectedTags.length === 0 ? "None Selected" : selectedTags.join(', ')}
                </span>
              </div>
              <ChevronDown size={12} className={cn("stroke-[4]", selectedTags.length > 0 ? "text-indigo-200" : "text-slate-300")} />
            </button>
          </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-[1.25rem] border-slate-100 shadow-2xl p-3 w-[19rem] animate-in slide-in-from-top-4 duration-200 font-sans glass">
            <DropdownMenuLabel className="px-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Filter by Tag Category</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100/50 my-2" />
            
            <div className="max-h-60 overflow-y-auto scrollbar-premium pr-1 space-y-1">
              {isLoadingTags ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <Loader2 size={16} className="text-indigo-500 animate-spin" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Tags...</span>
                </div>
              ) : allTags.length === 0 ? (
                <div className="py-8 px-2 text-center text-slate-400">
                  <p className="text-[10px] font-bold uppercase tracking-widest">No tags defined</p>
                </div>
              ) : (
                allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.name)
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors group",
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-sm" 
                          : "hover:bg-indigo-50 text-slate-600 hover:text-indigo-600"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Hash size={12} className={cn("transition-colors", isSelected ? "text-indigo-200" : "text-slate-400 group-hover:text-indigo-400")} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">{tag.name}</span>
                      </div>
                      {isSelected && <Check size={14} className="stroke-[3]" />}
                    </button>
                  )
                })
              )}
            </div>

            {selectedTags.length > 0 && (
              <>
                <DropdownMenuSeparator className="bg-slate-100/50 my-3" />
                <button 
                  onClick={() => setSelectedTags([])}
                  className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  Clear All Filters
                </button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
