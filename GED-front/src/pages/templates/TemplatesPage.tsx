import React, { useState, useMemo } from 'react'
import { Plus, Search, FileStack, Sparkles, Filter, ChevronRight, LayoutGrid } from 'lucide-react'
import { useTemplates } from '../../hooks/queries/useTemplates'
import { Template } from '../../types/template'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { CreateFromTemplateModal } from '../../components/modals/CreateFromTemplateModal'
import { TemplateCard } from '../../components/templates/TemplateCard'

export default function TemplatesPage() {
  const [category, setCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [createTarget, setCreateTarget] = useState<Template | null>(null)
  
  const { data, isLoading } = useTemplates({ category, name: search })
  const { hasAnyRole } = useAuthStore()
  const canManage = hasAnyRole('ADMIN', 'MANAGER')

  const categories = ['HR', 'Finance', 'Legal', 'IT', 'Marketing', 'Other']

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Advanced Header */}
        <header className="px-12 py-12 border-b border-slate-100 bg-white flex items-center justify-between shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] z-10 transition-all flex-shrink-0">
          <div className="flex items-center gap-6 animate-in slide-in-from-left-4 duration-500">
             <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 rotate-3 transition-transform hover:rotate-0 duration-300">
                <FileStack className="w-8 h-8" />
             </div>
             <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none mb-2">Standardized Blueprints</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-0.5">Enterprise Document Templates Repository.</p>
             </div>
          </div>
          
          {canManage && (
            <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center gap-3">
              <Plus className="w-5 h-5" />
              Upload Blueprint
            </Button>
          )}
        </header>

        {/* Global Toolbar */}
        <div className="px-12 py-6 bg-white/40 backdrop-blur-xl border-b border-slate-200/50 flex flex-wrap items-center gap-6 sticky top-0 z-20 shadow-sm transition-all">
           {/* Search Input */}
           <div className="relative flex-1 min-w-[300px] group transition-all">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Query blueprint database..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 pl-12 pr-6 rounded-2xl bg-white border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xs font-bold uppercase tracking-widest placeholder:text-slate-300 transition-all shadow-inner"
                />
           </div>

           {/* Category Chips Container */}
           <div className="flex items-center gap-3 p-2 bg-slate-100/50 rounded-2xl border border-slate-100 flex-shrink-0 transition-all">
              <div className="p-2 border-r border-slate-200/50 pr-4 flex items-center gap-2 text-slate-400">
                 <Filter className="w-4 h-4" />
              </div>
              <div className="flex gap-1.5 px-1 overflow-x-auto max-w-lg scrollbar-none">
                 <button
                   onClick={() => setCategory(null)}
                   className={cn(
                     'px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
                     !category 
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
                       : 'text-slate-500 hover:bg-white hover:text-blue-600'
                   )}
                 >
                   Allblueprints
                 </button>
                 {categories.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setCategory(cat)}
                     className={cn(
                       'px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap',
                       category === cat
                         ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                         : 'text-slate-500 hover:bg-white hover:text-blue-600'
                     )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Dynamic Template Grid */}
        <div className="flex-1 overflow-y-auto p-12 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent transition-all">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center justify-center h-full gap-4 text-slate-400"
              >
                 <Sparkles className="w-10 h-10 animate-spin transition-colors" />
                 <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Library...</span>
              </motion.div>
            ) : !data?.length ? (
              <motion.div 
                 key="empty"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center"
              >
                 <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100/50 flex items-center justify-center text-slate-300 mb-10 shadow-inner rotate-12">
                    <LayoutGrid className="w-16 h-16" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter italic">Found nothing.</h3>
                 <p className="text-sm font-medium text-slate-500 leading-relaxed">No blueprints matched your specific filters. Try expanding your search criteria or resetting the category filter.</p>
              </motion.div>
            ) : (
              <motion.div 
                 key="grid"
                 initial={{ opacity: 0, y: 40 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-32 max-w-7xl mx-auto"
              >
                {data.map((template, idx) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    canManage={canManage}
                    onUse={() => setCreateTarget(template)}
                    index={idx}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {createTarget && (
        <CreateFromTemplateModal
          template={createTarget}
          onClose={() => setCreateTarget(null)}
        />
      )}
    </div>
  )
}
