import React from 'react'
import { Favorite } from '../../types/favorite'
import { FileTypeIcon } from '../shared/FileTypeIcon'
import { useExplorerStore } from '../../stores/explorerStore'
import { Trash2, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

interface FavoriteDocumentCardProps {
  favorite: Favorite
  onRemove: () => void
}

export function FavoriteDocumentCard({ favorite, onRemove }: FavoriteDocumentCardProps) {
  const { openDocument } = useExplorerStore()
  const doc = favorite.document

  if (!doc) return null

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <FileTypeIcon fileType={doc.file_type} size="lg" />
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); onRemove() }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium text-slate-900 truncate mb-1" title={doc.name}>
        {doc.name}
      </h3>
      <p className="text-xs text-slate-500 mb-3 truncate">
        {doc.folder_path || 'Root'}
      </p>

      {favorite.note && (
        <div className="bg-slate-50 rounded-lg p-2 mb-3">
          <p className="text-xs text-slate-600 line-clamp-2">“{favorite.note}”</p>
        </div>
      )}

      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full"
        onClick={() => openDocument(favorite.document_id!)}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-2" />
        Open Document
      </Button>
    </div>
  )
}
