import React from 'react'
import { UploadProgressItem } from './UploadProgressItem'
import { UploadItem } from '../../types/upload'

export function UploadQueue({ items }: { items: UploadItem[] }) {
  if (!items.length) return null

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between px-6 mb-4 border-b border-slate-50 pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">
          <div className="flex-1">Asset Identity / Source Stream</div>
          <div className="w-1/3 text-right">Integrity Status</div>
      </div>
      
      {items.map((item) => (
        <UploadProgressItem key={item.id} item={item} />
      ))}
    </div>
  )
}
