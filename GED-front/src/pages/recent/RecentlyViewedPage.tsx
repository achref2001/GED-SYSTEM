import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, CalendarClock, History } from 'lucide-react'
import { useRecentlyViewed } from '../../hooks/queries/useRecentlyViewed'
import { recentlyViewedApi } from '../../services/api/recentlyViewed'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { RecentItemRow } from '../../components/recent/RecentItemRow'
import { Button } from '../../components/ui/button'
import { differenceInDays, formatDistanceToNow, isToday, isYesterday, subDays } from 'date-fns'
import { RecentlyViewedItem } from '../../types/recentlyViewed'
import { cn } from '../../lib/utils'

export default function RecentlyViewedPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useRecentlyViewed(50)

  const clearAll = useMutation({
    mutationFn: recentlyViewedApi.clearAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recently-viewed'] })
  })

  const clearOne = useMutation({
    mutationFn: (id: number) => recentlyViewedApi.clearOne(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recently-viewed'] })
  })

  const grouped = useMemo(() => {
    if (!data) return {}
    const now = new Date()
    const groups: Record<string, RecentlyViewedItem[]> = {
      'Today': [],
      'Yesterday': [],
      'Last 7 days': [],
      'Older': [],
    }
    
    data.forEach((item) => {
      const viewedDate = new Date(item.last_viewed_at)
      if (isToday(viewedDate)) groups['Today'].push(item)
      else if (isYesterday(viewedDate)) groups['Yesterday'].push(item)
      else if (differenceInDays(now, viewedDate) <= 7) groups['Last 7 days'].push(item)
      else groups['Older'].push(item)
    })
    
    return Object.fromEntries(Object.entries(groups).filter(([, v]) => v.length > 0))
  }, [data])

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Header */}
        <header className="px-8 py-8 border-b border-slate-100 bg-white flex items-center justify-between shadow-sm flex-shrink-0 z-10 transition-colors">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner group cursor-default">
                <Clock className="w-6 h-6 group-hover:text-blue-500 transition-colors" />
             </div>
             <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Interaction History</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Recently accessed documents and shared files.</p>
             </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => clearAll.mutate()}
            disabled={!data?.length || clearAll.isPending}
            className="rounded-xl h-10 px-4 font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all uppercase tracking-widest text-[10px]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Wipe Interaction History
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 scrollbar-thin scrollbar-thumb-slate-200">
           {isLoading ? (
             <div className="flex items-center justify-center h-full">Loading history...</div>
           ) : !data?.length ? (
             <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-300 mb-8 shadow-inner scale-110">
                   <History className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No interaction recorded.</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">As you explore documents and perform collaborative edits, your activity will be securely logged here for quick retrieval.</p>
             </div>
           ) : (
             <div className="max-w-4xl mx-auto space-y-12 pb-20">
                {Object.entries(grouped).map(([group, items], i) => (
                  <motion.div 
                    key={group}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                  >
                     <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                        <CalendarClock className="w-4 h-4 text-blue-500" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex-1">{group}</h2>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg border border-slate-200/50 shadow-sm transition-all">{items.length} items logged</span>
                     </div>
                     <div className="grid gap-2 bg-white/40 p-2 rounded-3xl border border-white transition-all backdrop-blur-sm">
                        {items.map((item) => (
                          <RecentItemRow
                            key={item.document.id}
                            item={item}
                            onRemove={() => clearOne.mutate(item.document.id)}
                          />
                        ))}
                     </div>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
    </div>
  )
}
