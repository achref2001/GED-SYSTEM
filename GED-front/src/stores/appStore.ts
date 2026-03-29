import { create } from 'zustand';
import type { ViewMode, SortField, SortDirection } from '@/types';

interface AppState {
  selectedFolderId: string | null;
  setSelectedFolder: (id: string | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  setSort: (field: SortField, direction: SortDirection) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  detailPanelOpen: boolean;
  selectedDocumentId: string | null;
  openDetailPanel: (docId: string) => void;
  closeDetailPanel: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  selectedFolderId: null,
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
  sortField: 'date',
  sortDirection: 'desc',
  setSort: (field, direction) => set({ sortField: field, sortDirection: direction }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  detailPanelOpen: false,
  selectedDocumentId: null,
  openDetailPanel: (docId) => set({ detailPanelOpen: true, selectedDocumentId: docId }),
  closeDetailPanel: () => set({ detailPanelOpen: false, selectedDocumentId: null }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
