import React, { useState } from 'react'
import { useFolderTree } from '../../hooks/queries/useFolders'
import { FolderTreeNode } from './FolderTreeNode'
import { Loader2, Plus, Folder } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'

export function FolderTree() {
  const { data: tree, isLoading } = useFolderTree()
  const { currentFolderId } = useExplorerStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8008/api/v1/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parent_id: currentFolderId || null
        })
      })
      
      if (response.ok) {
        setNewFolderName('')
        setIsCreateDialogOpen(false)
        // Refresh the folder tree by invalidating the query
        window.location.reload()
      } else {
        const error = await response.json()
        console.error('Failed to create folder:', error)
        alert(`Failed to create folder: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to create folder:', error)
      alert('Failed to create folder. Please try again.')
    }
  }

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
        <p className="text-sm font-medium text-slate-500 mb-4">No folders yet</p>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateFolder} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="p-2 sticky top-0 z-10 bg-white/80 backdrop-blur-xl rounded-xl">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/80 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateFolder} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {tree.map(node => (
        <FolderTreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  )
}
