import React from 'react'
import { useFolderTree } from '../../hooks/queries/useFolders'
import { FolderTreeNode } from './FolderTreeNode'
import { Loader2 } from 'lucide-react'

export function FolderTree() {
  const { data: tree, isLoading } = useFolderTree()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm font-medium">Loading repository...</span>
      </div>
    )
  }

  if (!tree?.length) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 m-4">
        <p className="text-sm font-medium text-slate-500">No folders yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {tree.map(node => (
        <FolderTreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  )
}
