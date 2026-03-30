import React, { useState } from 'react'
import { FolderTree } from '../../types/folder'
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface FolderTreeNodeProps {
  node: FolderTree
  level?: number
}

export function FolderTreeNode({ node, level = 0 }: FolderTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentFolderId, setCurrentFolder } = useExplorerStore()
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

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200",
          isActive 
            ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
            : "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
          level > 0 && `ml-${level * 4}`
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
            isActive ? "text-blue-500" : "text-slate-400 group-hover:text-amber-500"
        )}>
            {isOpen ? <FolderOpen size={18} fill="currentColor" fillOpacity={0.2} /> : <Folder size={18} fill="currentColor" fillOpacity={0.2} />}
        </div>
        
        <span className="text-sm font-medium truncate flex-1">
          {node.name}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.subfolders.map(child => (
              <FolderTreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
