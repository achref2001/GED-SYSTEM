import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useForceUnlockMutation } from '../../hooks/mutations/useCheckoutMutation'
import { ShieldAlert, Unlock, AlertTriangle } from 'lucide-react'
import { Document } from '../../types/document'

interface ForceUnlockModalProps {
  document: Document
  open: boolean
  onClose: () => void
}

export function ForceUnlockModal({ document, open, onClose }: ForceUnlockModalProps) {
  const [reason, setReason] = useState('')
  const forceUnlock = useForceUnlockMutation()

  const handleForceUnlock = () => {
    forceUnlock.mutate({ 
      id: document.id, 
      reason 
    }, {
      onSuccess: () => {
        onClose()
        setReason('')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] overflow-hidden rounded-3xl border-0 shadow-2xl p-0">
        <div className="bg-red-600 p-8 text-white flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 shadow-inner animate-pulse">
                <ShieldAlert className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Administrative Override</DialogTitle>
            <DialogDescription className="text-red-100 mt-2 text-center text-sm font-medium">
                Forcefully release a document lock.
            </DialogDescription>
        </div>

        <div className="p-8 space-y-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center">
                 <AlertTriangle className="w-6 h-6 text-red-500 mb-3" />
                 <p className="text-xs font-bold text-red-900 leading-relaxed tracking-tight underline decoration-red-200 decoration-2">
                    {document.locked_by_name} is currently editing this document. Unlocking prematurely may result in data loss or major version conflicts.
                 </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="reason" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Auditable Reason</Label>
                <textarea 
                    id="reason" 
                    rows={3}
                    placeholder="e.g. Critical deadline, original owner unreachable..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:italic placeholder:text-slate-300 transition-all resize-none shadow-inner"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-white">
            <div className="flex w-full gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all">Cancel Override</Button>
                <Button 
                    onClick={handleForceUnlock} 
                    disabled={forceUnlock.isPending || !reason.trim()}
                    className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 font-bold uppercase tracking-widest text-[10px] transition-all"
                >
                    {forceUnlock.isPending ? 'Releasing...' : 'Force Unlock Now'}
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
