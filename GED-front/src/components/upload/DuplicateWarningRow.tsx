import React from 'react'
import { AlertCircle, ArrowUpCircle, Info, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface DuplicateWarningRowProps {
  onAction: () => void
  info: any
  onForceUpload: () => void
}

export function DuplicateWarningRow({ onAction, info, onForceUpload }: DuplicateWarningRowProps) {
  return (
    <div className="bg-amber-600 p-8 rounded-[2.5rem] text-white flex flex-col items-center relative overflow-hidden transition-all hover:bg-amber-700 shadow-2xl shadow-amber-600/30">
        {/* Absolute Background Decoration */}
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150 group-hover:scale-175 transition-transform">
            <ShieldAlert size={180} />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-amber-500/50 flex items-center justify-center mb-6 shadow-2xl border border-amber-400/30 rotate-3 transition-transform hover:rotate-0 duration-500 relative z-10">
            <AlertCircle className="w-8 h-8 text-white stroke-[2.5]" />
        </div>

        <div className="text-center space-y-4 max-w-sm relative z-10">
             <h4 className="text-xl font-black text-white leading-tight tracking-tight uppercase">Integrity Alert: Recursive Collision</h4>
             <p className="text-[11px] font-bold text-amber-50/80 leading-relaxed uppercase tracking-[0.1em] opacity-80">A cryptographic twin already exists within the repository database.</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-md relative z-10">
            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl flex flex-col items-center text-center transition-all hover:bg-white/20 group cursor-pointer group/card">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-xl transition-all group-hover/card:scale-110">
                    <ExternalLink size={16} className="stroke-[3]" />
                </div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Inspect Twin</h5>
                <p className="text-[9px] font-bold text-amber-50/60 leading-relaxed uppercase tracking-tighter">View original document metadata and source location.</p>
            </div>

            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl flex flex-col items-center text-center transition-all hover:bg-white/20 group cursor-pointer group/card" onClick={onForceUpload}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-xl transition-all group-hover/card:scale-110">
                    <ArrowUpCircle size={16} className="stroke-[3]" />
                </div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Force Sync</h5>
                <p className="text-[9px] font-bold text-emerald-50/80 leading-relaxed uppercase tracking-tighter">Bypass integrity controls and establish a unique instance.</p>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 w-full flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-amber-50/50 italic opacity-60">
             <Info size={12} className="stroke-[3]" />
             <span>Integrity hash check performed: SHA-256 Protocol</span>
        </div>
    </div>
  )
}
