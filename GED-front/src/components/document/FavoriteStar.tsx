import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useFavoriteCheck } from '../../hooks/queries/useFavorites'
import { useToggleFavorite } from '../../hooks/mutations/useFavoriteMutation'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FavoriteStarProps {
  documentId: number
  size?: 'sm' | 'md'
  showTooltip?: boolean
}

export function FavoriteStar({ 
  documentId, 
  size = 'md',
  showTooltip = true 
}: FavoriteStarProps) {
  const { data } = useFavoriteCheck(documentId)
  const { add, remove } = useToggleFavorite()
  const isFavorite = data?.is_favorite ?? false

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite) {
      remove.mutate(documentId)
    } else {
      add.mutate({ id: documentId })
    }
  }

  const icon = (
    <button
      onClick={handleClick}
      disabled={add.isPending || remove.isPending}
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
