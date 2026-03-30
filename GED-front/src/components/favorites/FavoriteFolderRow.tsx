import React from 'react'
import { Favorite } from '../../types/favorite'
import { FolderIcon, ExternalLink, Trash2 } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { Button } from '../ui/button'
import { useToggleFolderFavorite } from '../../hooks/mutations/useFavoriteMutation'

export function FavoriteFolderRow({ favorite }: { favorite: Favorite }) {
  const { setCurrentFolder } = useExplorerStore()
  const { remove } = useToggleFolderFavorite()
  const folder = favorite.folder

  if (!folder) return null

  return (
    <div className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="bg-amber-100 p-2 rounded-lg text-amber-600 transition-colors">
        <FolderIcon className="w-5 h-5 fill-amber-500" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-slate-900 truncate">
          {folder.name}
        </h3>
        <p className="text-xs text-slate-500 truncate">
          {favorite.note || "No note added"}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentFolder(folder.id)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Go to Folder
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-slate-400 hover:text-red-500"
          onClick={() => remove.mutate(folder.id!)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
