import { create } from 'zustand'
import { UploadItem } from '../types/document'

interface UploadStore {
  items: UploadItem[]
  isModalOpen: boolean
  defaultFolderId: number | null
  
  // Actions
  addFiles: (files: File[]) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<UploadItem>) => void
  setForce: (id: string, force: boolean) => void
  skipItem: (id: string) => void
  clearCompleted: () => void
  openModal: (folderId?: number | null) => void
  closeModal: () => void
  
  // Computed
  pendingCount: () => number
  hasErrors: () => boolean
  allDone: () => boolean
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  items: [],
  isModalOpen: false,
  defaultFolderId: null,

  addFiles: (files) => {
    const newItems: UploadItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      hash: null,
      hashProgress: 0,
      duplicate: null,
      uploadProgress: 0,
      status: 'ready',
      error: null,
      force: false,
      result: null
    }))
    set((state) => ({ items: [...state.items, ...newItems] }))
  },

  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i))
  })),

  setForce: (id, force) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, force, status: force ? 'ready' : i.status } : i))
  })),

  skipItem: (id) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, status: 'skipped' as const } : i))
  })),

  clearCompleted: () => set((state) => ({
    items: state.items.filter((i) => i.status !== 'done' && i.status !== 'skipped')
  })),

  openModal: (folderId = null) => set({ isModalOpen: true, defaultFolderId: folderId }),
  closeModal: () => set({ isModalOpen: false }),

  pendingCount: () => get().items.filter((i) => i.status !== 'done' && i.status !== 'skipped').length,
  hasErrors: () => get().items.some((i) => i.status === 'error'),
  allDone: () => get().items.every((i) => i.status === 'done' || i.status === 'skipped'),
}))
