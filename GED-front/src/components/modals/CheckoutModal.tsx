import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useCheckoutMutation } from '../../hooks/mutations/useCheckoutMutation'
import { Lock } from 'lucide-react'

interface CheckoutModalProps {
  documentId: number
  open: boolean
  onClose: () => void
}

export function CheckoutModal({ documentId, open, onClose }: CheckoutModalProps) {
  const [reason, setReason] = useState('')
  const [hours, setHours] = useState('8')
  const checkout = useCheckoutMutation()

  const handleCheckout = () => {
    checkout.mutate({ 
      id: documentId, 
      reason: reason || undefined, 
      hours: parseInt(hours) 
    }, {
      onSuccess: () => {
        onClose()
        setReason('')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden rounded-3xl border-0 shadow-2xl p-0">
        <div className="bg-blue-600 p-8 text-white flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-4 shadow-inner">
                <Lock className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Lock Document</DialogTitle>
            <DialogDescription className="text-blue-100 mt-2 text-center text-sm font-medium">
                Ensures only you can edit this document.
            </DialogDescription>
        </div>

        <div className="p-8 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="hours" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Duration</Label>
                <Select value={hours} onValueChange={setHours}>
                    <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl focus:ring-blue-500 font-semibold">
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="1" className="font-medium">1 Hour</SelectItem>
                        <SelectItem value="4" className="font-medium">4 Hours</SelectItem>
                        <SelectItem value="8" className="font-medium">8 Hours (Standard)</SelectItem>
                        <SelectItem value="24" className="font-medium">24 Hours</SelectItem>
                        <SelectItem value="48" className="font-medium">48 Hours</SelectItem>
                        <SelectItem value="72" className="font-medium">72 Hours (Max)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="reason" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Reason (Optional)</Label>
                <Input 
                    id="reason" 
                    placeholder="e.g. Monthly report update..." 
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl focus:ring-blue-500 font-medium placeholder:italic placeholder:text-slate-300"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-white">
            <div className="flex w-full gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50">Cancel</Button>
                <Button 
                    onClick={handleCheckout} 
                    disabled={checkout.isPending}
                    className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 font-bold uppercase tracking-widest text-[10px] transition-all"
                >
                    {checkout.isPending ? 'Locking...' : 'Lock Now'}
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
