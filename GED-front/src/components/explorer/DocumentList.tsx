import React from 'react'
import { Document } from '../../types/document'
import { DocumentRow } from './DocumentRow'

export function DocumentList({ documents }: { documents: Document[] }) {
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-slate-100/70 rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 shadow-lg transition-all overflow-hidden">
      <div className="hidden md:grid grid-cols-12 px-4 sm:px-6 py-3 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 italic">
         <div className="col-span-6 flex items-center gap-3">
             <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100/50" />
             <span>Asset Identity</span>
         </div>
         <div className="col-span-2 text-center">Status</div>
         <div className="col-span-2 text-center">Interaction Date</div>
         <div className="col-span-2 text-right">Payload Size</div>
      </div>
      
      <div className="space-y-1">
        {documents.map((doc) => (
          <DocumentRow key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  )
}
