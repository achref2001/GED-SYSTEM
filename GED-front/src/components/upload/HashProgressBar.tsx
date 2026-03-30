import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Fingerprint, CloudUpload, ShieldCheck } from 'lucide-react'

export function HashProgressBar({ 
  hashProgress, 
  uploadProgress, 
  status, 
  hash 
}: { 
  hashProgress: number, 
  uploadProgress: number, 
  status: string, 
  hash?: string 
}) {
  const isHashing = status === 'hashing'
  const isUploading = status === 'uploading'
  const isDone = status === 'done' || status === 'hash_done'
  const progress = isHashing ? hashProgress : uploadProgress
  
  return (
    <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner group-hover/item:border-blue-500/10 transition-all">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
           {isHashing ? <Fingerprint size={12} className="text-blue-500 stroke-[3]" /> : <CloudUpload size={12} className="text-blue-500 stroke-[3]" />}
           <span>{isHashing ? 'Generating SHA-256 Digest' : isUploading ? 'Transmitting Stream' : 'Integrity Verified'}</span>
        </div>
        <span className="text-blue-600 tabular-nums">{progress}%</span>
      </div>

      <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-300 relative overflow-hidden",
            isHashing ? "bg-blue-500" : isUploading ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-emerald-500"
          )}
        >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" style={{ width: '200%' }} />
        </motion.div>
      </div>

      {hash && (
        <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-3 overflow-hidden group/hash">
           <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 animate-in zoom-in-50 duration-300">
              <ShieldCheck size={12} className="stroke-[3]" />
           </div>
           <code className="text-[9px] font-mono text-slate-400 truncate leading-none items-center pr-2 group-hover/hash:text-blue-600 transition-colors">Digest: {hash}</code>
        </div>
      )}
    </div>
  )
}
