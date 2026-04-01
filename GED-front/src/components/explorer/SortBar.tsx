import React from 'react'
import { ArrowUpDown, ChevronDown, Filter, LayoutGrid, LayoutList, SortAsc, SortDesc, Database, Tags, Calendar, FileType } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '../ui/dropdown-menu'
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
    <div className="px-12 py-6 bg-white/40 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between sticky top-[136px] z-10 transition-colors">
      <div className="flex items-center gap-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all active:scale-95 group group-active:shadow-blue-500/10">
               <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all group-hover:rotate-12">
                  <ArrowUpDown size={14} className="stroke-[3]" />
               </div>
               <div className="flex flex-col items-start min-w-[120px]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sort Repository</span>
                  <span className="text-xs font-black text-slate-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                     {activeSort.label}
                     <ChevronDown size={12} className="text-slate-300 group-hover:text-blue-500 stroke-[4]" />
                  </span>
               </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl border-slate-100 shadow-2xl p-2 w-64 animate-in slide-in-from-top-4 duration-500 font-sans">
             <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select sorting criterion</DropdownMenuLabel>
             <DropdownMenuSeparator className="bg-slate-50" />
             {sortItems.map((item) => (
                <DropdownMenuItem 
                  key={item.value}
                  className={cn(
                    "rounded-xl h-12 px-4 cursor-pointer font-bold text-[10px] uppercase tracking-widest transition-all mb-1",
                    sortBy === item.value ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" : "hover:bg-slate-50 hover:text-blue-600"
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
          className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-xl shadow-slate-200/50 hover:shadow-blue-500/10 transition-all active:scale-90 group"
          title={sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
        >
          {sortOrder === 'asc' ? <SortAsc size={20} className="stroke-[3]" /> : <SortDesc size={20} className="stroke-[3]" />}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all active:scale-95 group",
              selectedTags.length > 0 
                ? "bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20" 
                : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 shadow-xl shadow-slate-200/50"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:rotate-12",
                selectedTags.length > 0 ? "bg-white/20" : "bg-indigo-50 text-indigo-600"
              )}>
                <Filter size={14} className="stroke-[3]" />
              </div>
              <div className="flex flex-col items-start text-left min-w-[100px]">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                  selectedTags.length > 0 ? "text-indigo-200" : "text-slate-400"
                )}>
                  {selectedTags.length === 0 ? "Filter Tags" : `${selectedTags.length} Active Filters`}
                </span>
                <span className="text-xs font-black truncate max-w-[120px]">
                  {selectedTags.length === 0 ? "None Selected" : selectedTags.join(', ')}
                </span>
              </div>
              <ChevronDown size={12} className={cn("stroke-[4]", selectedTags.length > 0 ? "text-indigo-200" : "text-slate-300")} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-[2rem] border-slate-100 shadow-2xl p-4 w-72 animate-in slide-in-from-top-4 duration-500 font-sans glass">
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
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
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
