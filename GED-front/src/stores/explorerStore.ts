import { create } from 'zustand'

interface ExplorerState {
  currentFolderId: number | null
  viewMode: 'grid' | 'list'
  selectedDocumentIds: Set<number>
  openDocumentId: number | null
  sortBy: 'name' | 'date' | 'size' | 'type'
  sortOrder: 'asc' | 'desc'
  isDetailPanelOpen: boolean
  selectedTags: string[]
  searchQuery: string

  // Actions
  setCurrentFolder: (id: number | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  toggleSelect: (id: number) => void
  selectRange: (fromId: number, toId: number, allIds: number[]) => void
  selectAll: (ids: number[]) => void
  clearSelection: () => void
  openDocument: (id: number) => void
  closeDetailPanel: () => void
  setSortBy: (sort: 'name' | 'date' | 'size' | 'type') => void
  toggleSortOrder: () => void
  setSelectedTags: (tags: string[]) => void
  setSearchQuery: (query: string) => void
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  currentFolderId: null,
  viewMode: 'grid',
  selectedDocumentIds: new Set<number>(),
  openDocumentId: null,
  sortBy: 'name',
  sortOrder: 'asc',
  isDetailPanelOpen: false,
  selectedTags: [],
  searchQuery: '',

  setCurrentFolder: (id) => set({ currentFolderId: id, selectedDocumentIds: new Set() }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleSelect: (id) => set((state) => {
    const newSelected = new Set(state.selectedDocumentIds)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    return { selectedDocumentIds: newSelected }
  }),
  selectRange: (fromId, toId, allIds) => {
    const fromIndex = allIds.indexOf(fromId)
    const toIndex = allIds.indexOf(toId)
    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)
    const newSelection = new Set(get().selectedDocumentIds)
    for (let i = start; i <= end; i++) {
        newSelection.add(allIds[i])
    }
    set({ selectedDocumentIds: newSelection })
  },
  selectAll: (ids) => set({ selectedDocumentIds: new Set(ids) }),
  clearSelection: () => set({ selectedDocumentIds: new Set() }),
  openDocument: (id) => set({ openDocumentId: id, isDetailPanelOpen: true }),
  closeDetailPanel: () => set({ isDetailPanelOpen: false }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleSortOrder: () => set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),
  setSelectedTags: (tags: string[]) => set({ selectedTags: tags }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
