import React from 'react'
import { ArrowUpDown, ChevronDown, Filter, LayoutGrid, LayoutList, SortAsc, SortDesc, Database, Tags, Calendar, FileType } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

export function SortBar() {
  const { sortBy, sortOrder, setSortBy, toggleSortOrder } = useExplorerStore()

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

      <div className="flex items-center gap-4 bg-slate-100/30 p-2 rounded-2xl border border-slate-100/50 shadow-inner group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
         <div className="flex items-center gap-1 px-3 border-r border-slate-100/50">
            <Tags size={14} className="text-slate-400 stroke-[2.5] italic" />
         </div>
         <div className="flex gap-1.5 px-1 overflow-x-auto max-w-sm scrollbar-none">
            {['Validated', 'Draft', 'Expired', 'Archived'].map(filter => (
               <button key={filter} className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-blue-600 transition-all border border-transparent hover:border-slate-100">{filter}</button>
            ))}
         </div>
         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white group-hover:text-blue-600 transition-all font-bold">
            <Filter size={14} className="stroke-[3]" />
         </Button>
      </div>
    </div>
  )
}
