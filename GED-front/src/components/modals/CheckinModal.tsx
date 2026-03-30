import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useCheckinMutation } from '../../hooks/mutations/useCheckinMutation'
import { Unlock, Upload, FileText } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '../../lib/utils'

interface CheckinModalProps {
  documentId: number
  open: boolean
  onClose: () => void
}

export function CheckinModal({ documentId, open, onClose }: CheckinModalProps) {
  const [comment, setComment] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const checkin = useCheckinMutation()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
    multiple: false
  })

  const handleCheckin = () => {
    checkin.mutate({ 
      id: documentId, 
      file: file || undefined, 
      comment: comment || undefined 
    }, {
      onSuccess: () => {
        onClose()
        setComment('')
        setFile(null)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] overflow-hidden rounded-3xl border-0 shadow-2xl p-0">
        <div className="bg-emerald-600 p-8 text-white flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-4 shadow-inner">
                <Unlock className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Unlock & New Version</DialogTitle>
            <DialogDescription className="text-emerald-100 mt-2 text-center text-sm font-medium">
                Submit updates and release the lock.
            </DialogDescription>
        </div>

        <div className="p-8 space-y-6">
            <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Version (Optional)</Label>
                <div 
                    {...getRootProps()} 
                    className={cn(
                        "border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300",
                        isDragActive ? "border-emerald-500 bg-emerald-50/50 scale-95" : "border-slate-100 hover:border-emerald-300 bg-slate-50/50",
                        file && "border-emerald-600 bg-emerald-50/80 shadow-md scale-105"
                    )}
                >
                    <input {...getInputProps()} />
                    {file ? (
                        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                             <FileText className="w-10 h-10 text-emerald-600 mb-3" />
                             <span className="text-xs font-bold text-emerald-700 truncate max-w-xs">{file.name}</span>
                             <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-slate-400 group">
                             <Upload className="w-10 h-10 mb-3 group-hover:text-emerald-500 transition-colors" />
                             <p className="text-xs font-semibold group-hover:text-slate-600 transition-colors tracking-tight">Drop the new version here, or <span className="text-emerald-600 underline underline-offset-4 decoration-2">browse</span></p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="comment" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Change Summary</Label>
                <textarea 
                    id="comment" 
                    rows={4}
                    placeholder="e.g. Updated financial projections for Q3..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:italic placeholder:text-slate-300 transition-all resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-white">
            <div className="flex w-full gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">Cancel Close</Button>
                <Button 
                    onClick={handleCheckin} 
                    disabled={checkin.isPending}
                    className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-bold uppercase tracking-widest text-[10px] transition-all"
                >
                    {checkin.isPending ? 'Unlocking...' : 'Unlock Now'}
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
