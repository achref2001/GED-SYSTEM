import React, { useState } from 'react'
import { FolderTree } from '../../types/folder'
import { ChevronRight, ChevronDown, Folder, FolderOpen, Upload } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { useUploadStore } from '../../stores/uploadStore'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { FavoriteStar } from '../document/FavoriteStar'

interface FolderTreeNodeProps {
  node: FolderTree
  level?: number
}

export function FolderTreeNode({ node, level = 0 }: FolderTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentFolderId, setCurrentFolder } = useExplorerStore()
  const { openModal } = useUploadStore()
  const hasChildren = node.subfolders && node.subfolders.length > 0
  const isActive = currentFolderId === node.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentFolder(node.id)
    if (hasChildren) setIsOpen(!isOpen)
  }

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleUpload = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentFolder(node.id)
    openModal(node.id)
  }

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group transition-all duration-150",
          isActive 
            ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
            : "hover:bg-slate-100/80 text-slate-600 hover:text-slate-900"
        )}
        style={{ paddingLeft: `${(level * 16) + 12}px` }}
        onClick={handleClick}
      >
        <div 
          onClick={toggleOpen}
          className={cn(
            "p-1 rounded-md hover:bg-slate-200/50 transition-colors",
            !hasChildren && "invisible w-6 h-6"
          )}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        
        <div className={cn(
            "flex-shrink-0 transition-colors",
            isActive ? "text-indigo-500" : "text-slate-400 group-hover:text-indigo-500"
        )}>
            {isOpen ? <FolderOpen size={18} fill="currentColor" fillOpacity={0.2} /> : <Folder size={18} fill="currentColor" fillOpacity={0.2} />}
        </div>
        
        <span className="text-sm font-medium truncate flex-1">
          {node.name}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <FavoriteStar 
            folderId={node.id} 
            size="sm" 
            showTooltip={false} 
          />
          <Button
            onClick={handleUpload}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
            title="Upload to this folder"
          >
            <Upload size={14} />
          </Button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="overflow-hidden">
          {node.subfolders.map(child => (
            <FolderTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
