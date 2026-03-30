import React from 'react'
import { UploadItem } from '../../types/document'
import { FileTypeIcon } from '../shared/FileTypeIcon'
import { HashProgressBar } from './HashProgressBar'
import { DuplicateWarningRow } from './DuplicateWarningRow'
import { CheckCircle2, AlertCircle, RefreshCw, X, Loader2, CloudUpload } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useUploadStore } from '../../stores/uploadStore'

export function UploadProgressItem({ item }: { item: UploadItem }) {
  const { removeItem } = useUploadStore()
  
  const statusConfig = {
    ready: { label: 'Asset Ready', icon: CheckCircle2, color: 'text-slate-400' },
    hashing: { label: 'Integrity Check', icon: Loader2, color: 'text-blue-500', spin: true },
    hash_done: { label: 'Verified', icon: ShieldCheck, color: 'text-blue-600' },
    duplicate: { label: 'Duplicate Found', icon: AlertCircle, color: 'text-amber-500' },
    uploading: { label: 'Synchronizing', icon: CloudUpload, color: 'text-blue-600' },
    done: { label: 'Sync Complete', icon: CheckCircle2, color: 'text-emerald-500' },
    error: { label: 'Sync Failed', icon: AlertCircle, color: 'text-red-500' }
  }

  const config = statusConfig[item.status] || statusConfig.ready
  const Icon = config.icon

  return (
    <div className="bg-white border border-slate-100/50 rounded-3xl p-6 shadow-xl shadow-slate-200/20 hover:border-blue-500/10 transition-all group overflow-hidden">
        <div className="flex items-center gap-6 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-50 shadow-xl flex items-center justify-center p-3 transition-transform group-hover:scale-105 duration-300">
                <FileTypeIcon fileType={item.file.name.split('.').pop() || 'other'} size="lg" />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-sm font-black text-slate-800 truncate leading-tight tracking-tight uppercase" title={item.file.name}>{item.file.name}</h4>
                    <span className="text-[10px] font-bold text-slate-300">{(item.file.size / 1024).toFixed(1)} KB</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className={cn("flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em]", config.color)}>
                        <Icon size={12} className={cn("stroke-[3]", config.spin && "animate-spin")} />
                        <span>{config.label}</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => removeItem(item.id)}
                className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-500 text-slate-300 flex items-center justify-center transition-all active:scale-90"
            >
                <X size={16} className="stroke-[3]" />
            </button>
        </div>

        <div className="space-y-4 px-1 pb-2">
             <HashProgressBar 
                hashProgress={item.hashProgress}
                uploadProgress={item.uploadProgress}
                status={item.status} 
                hash={item.hash || undefined}
             />

             {item.status === 'duplicate' && item.duplicate && (
                 <DuplicateWarningRow 
                    onAction={() => {}} 
                    info={item.duplicate}
                    onForceUpload={() => {}}
                 />
             )}
        </div>
    </div>
  )
}

function ShieldCheck({ size, className }: { size: number, className: string }) {
    return <CheckCircle2 size={size} className={className} />
}
