import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useFavoriteCheck, useFolderFavoriteCheck } from '../../hooks/queries/useFavorites'
import { useToggleFavorite, useToggleFolderFavorite } from '../../hooks/mutations/useFavoriteMutation'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FavoriteStarProps {
  documentId?: number
  folderId?: number
  size?: 'sm' | 'md'
  showTooltip?: boolean
}

export function FavoriteStar({ 
  documentId, 
  folderId,
  size = 'md',
  showTooltip = true 
}: FavoriteStarProps) {
  const isFolder = !!folderId
  const activeId = (isFolder ? folderId : documentId) as number

  const { data: docData } = useFavoriteCheck(documentId || 0)
  const { data: folderData } = useFolderFavoriteCheck(folderId || 0)
  
  const { add: addDoc, remove: removeDoc } = useToggleFavorite()
  const { add: addFolder, remove: removeFolder } = useToggleFolderFavorite()

  const isFavorite = isFolder ? (folderData?.is_favorite ?? false) : (docData?.is_favorite ?? false)
  const isPending = isFolder 
    ? (addFolder.isPending || removeFolder.isPending)
    : (addDoc.isPending || removeDoc.isPending)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite) {
      isFolder ? removeFolder.mutate(activeId) : removeDoc.mutate(activeId)
    } else {
      isFolder ? addFolder.mutate({ id: activeId }) : addDoc.mutate({ id: activeId })
    }
  }

  const icon = (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'rounded-full transition-all duration-150 hover:scale-110',
        size === 'sm' ? 'p-1' : 'p-1.5',
        isFavorite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
      )}
    >
      <Star
        className={cn(
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
          isFavorite && 'fill-amber-400'
        )}
      />
    </button>
  )

  if (!showTooltip) return icon
  return (
    <Tooltip>
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent>
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </TooltipContent>
    </Tooltip>
  )
}
