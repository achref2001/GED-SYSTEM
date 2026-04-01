import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUploadStore } from '../../stores/uploadStore'
import { useUpload } from '../../hooks/useUpload'
import { UploadCloud, FileStack, ShieldCheck, Box, Sparkles, LayoutGrid } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '../../services/api/settings'
import { toast } from 'sonner'

export function UploadDropzone() {
  const { addFiles } = useUploadStore()
  const { processFile } = useUpload()
  const { data: policyRes } = useQuery({
    queryKey: ['upload-policy'],
    queryFn: () => settingsApi.getUploadPolicy(),
  })
  const allowedExtensions = policyRes?.data?.data?.allowed_extensions || []
  const acceptConfig = allowedExtensions.length > 0 ? { '*/*': allowedExtensions } : undefined

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles)
  }, [addFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    onDropRejected: () => {
      toast.error(`Some files were rejected. Allowed extensions: ${allowedExtensions.join(', ')}`)
    }
  })

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "flex-1 flex flex-col items-center justify-center border-4 border-dashed rounded-[3rem] p-12 text-center transition-all duration-500 cursor-pointer relative overflow-hidden group",
        isDragActive ? "border-blue-500 bg-blue-50/30 scale-[0.98] animate-pulse" : "border-slate-100 hover:border-blue-500/50 bg-slate-50 shadow-inner"
      )}
    >
      <input {...getInputProps()} />

      <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150 transition-transform group-hover:rotate-0">
          <FileStack size={200} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-24 h-24 rounded-[2rem] bg-white border border-slate-100 shadow-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500 relative">
             <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity" />
             <UploadCloud className="w-10 h-10 text-blue-500 stroke-[2.5] relative" />
          </div>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-4 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
              Synchronize External Assets
              <Sparkles className="w-5 h-5 text-amber-500/50" />
          </h3>
          <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-widest pl-1 italic">
              Drop individual files or entire batches directly into the encrypted stream.
          </p>

          <footer className="mt-12 flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-blue-500 stroke-[3]" />
                 <span>SHA-256 Hashing</span>
              </div>
              <div className="flex items-center gap-2">
                 <Box size={14} className="text-slate-400 stroke-[3]" />
                 <span>Max 100MB / File</span>
              </div>
          </footer>
      </div>
    </div>
  )
}
