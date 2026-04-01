import React, { useState } from 'react'
import { Tag, X, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'

export function TagFilter() {
  const { selectedTags, setSelectedTags } = useExplorerStore()
  const [newTag, setNewTag] = useState('')
  const [showNewTagInput, setShowNewTagInput] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag('')
      setShowNewTagInput(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag()
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap rounded-2xl border border-slate-100 bg-white/70 p-2">
      {/* Existing Tags */}
      {selectedTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="gap-1 pr-2 group hover:bg-red-100 transition-colors rounded-lg"
        >
          <Tag className="w-3 h-3" />
          <span className="text-xs">{tag}</span>
          <button
            onClick={() => handleRemoveTag(tag)}
            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3 hover:text-red-600" />
          </button>
        </Badge>
      ))}

      {/* Add New Tag */}
      {showNewTagInput ? (
        <div className="flex items-center gap-1">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter tag name..."
            className="h-8 w-32 text-xs rounded-lg"
            autoFocus
          />
          <Button
            onClick={handleAddTag}
            size="sm"
            className="h-8 px-2 rounded-lg"
          >
            Add
          </Button>
          <Button
            onClick={() => {
              setShowNewTagInput(false)
              setNewTag('')
            }}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowNewTagInput(true)}
          size="sm"
          variant="outline"
          className="h-8 gap-1 text-xs rounded-lg"
        >
          <Plus className="w-3 h-3" />
          Add Tag
        </Button>
      )}
    </div>
  )
}
