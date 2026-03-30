import React from 'react'
import { Template } from '../../types/template'
import { ExternalLink, Settings, ShieldCheck, FileType, CalendarRange, ArrowRight, Layers, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'
import { FileTypeIcon } from '../shared/FileTypeIcon'
import { format } from 'date-fns'

interface TemplateCardProps {
  template: Template
  canManage: boolean
  onUse: () => void
  index?: number
}

export function TemplateCard({ template, canManage, onUse, index = 0 }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110">
         <Sparkles className="w-5 h-5 text-blue-500/30" />
      </div>

      <div className="flex items-center gap-6 mb-8 flex-shrink-0 animate-in zoom-in-95 duration-500">
         <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 shadow-xl transition-all group-hover:bg-blue-600/5 group-hover:border-blue-200 group-hover:rotate-6 group-hover:shadow-blue-500/10">
            <FileTypeIcon fileType={template.file_type} size="xl" />
         </div>
         <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
               <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-widest leading-none truncate">{template.category}</span>
               {template.is_active && (
                   <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-tighter transition-all">Validated Blueprint</span>
               )}
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors" title={template.name}>
               {template.name}
            </h3>
         </div>
      </div>

      <div className="flex-1 space-y-6">
         <p className="text-sm font-medium text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-4 group-hover:border-blue-500/20 transition-all">
            “{template.description || 'Enterprise-grade blueprint for standardized document generation across multiple departments.'}”
         </p>

         <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 border-t border-b border-slate-50 mb-4 transition-all group-hover:border-blue-500/10">
            <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
               <CalendarRange className="w-3.5 h-3.5" />
               <span>Latest {format(new Date(template.updated_at), 'MMM d')}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors underline decoration-slate-100 underline-offset-4">
               <Layers className="w-3.5 h-3.5" />
               <span>v{template.latest_version?.version_number || '1.0'}</span>
            </div>
         </div>
      </div>

      <div className="flex gap-4 mt-8 flex-shrink-0 animate-in slide-in-from-bottom-2 duration-700">
         <Button 
           onClick={onUse}
           className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
         >
           Initialize Blueprint
           <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
         </Button>
         
         {canManage && (
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all"
            >
               <Settings className="w-5 h-5 flex-shrink-0" />
            </Button>
         )}
      </div>
    </motion.div>
  )
}
