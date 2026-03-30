import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { X } from 'lucide-react'
import { RecentlyViewedItem } from '../../types/recentlyViewed'
import { useExplorerStore } from '../../stores/explorerStore'
import { FileTypeIcon } from '../shared/FileTypeIcon'
import { FavoriteStar } from '../document/FavoriteStar'

export function RecentItemRow({
  item,
  onRemove
}: {
  item: RecentlyViewedItem
  onRemove: () => void
}) {
  const { openDocument } = useExplorerStore()

  return (
    <div
      className="group flex items-center gap-3 p-3 rounded-lg
                 hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={() => openDocument(item.document.id)}
    >
      <FileTypeIcon 
        fileType={item.document.file_type} 
        size="md" 
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {item.document.name}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-slate-400 truncate">
            {item.document.folder_path}
          </span>
          <span className="text-xs text-slate-400 shrink-0">
            {formatDistanceToNow(
              new Date(item.last_viewed_at), 
              { addSuffix: true }
            )}
          </span>
          {item.view_count > 1 && (
            <span className="text-xs text-slate-400 shrink-0">
              {item.view_count} views
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 
                       opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteStar documentId={item.document.id} size="sm" />
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="p-1 rounded hover:bg-slate-200 text-slate-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
