import { useState } from 'react';
import { mockData } from '@/data/mockData';
import { useAppStore } from '@/stores/appStore';
import { FolderTree } from '@/components/documents/FolderTree';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentDetailPanel } from '@/components/documents/DocumentDetailPanel';
import { UploadModal } from '@/components/documents/UploadModal';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import {
  Upload, LayoutGrid, List, ChevronRight, Home, FolderOpen,
} from 'lucide-react';

export default function DocumentsPage() {
  const { viewMode, setViewMode, selectedFolderId, setSelectedFolder, detailPanelOpen, selectedDocumentId, openDetailPanel, closeDetailPanel } = useAppStore();
  const [uploadOpen, setUploadOpen] = useState(false);

  const documents = selectedFolderId
    ? mockData.documents.filter((d) => d.folderId === selectedFolderId)
    : mockData.documents;

  const selectedDocument = selectedDocumentId
    ? mockData.documents.find((d) => d.id === selectedDocumentId)
    : null;

  // Build breadcrumb
  const getBreadcrumb = () => {
    if (!selectedFolderId) return [{ id: null, name: 'Tous les documents' }];
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Documents' }];
    const findFolder = (folders: typeof mockData.folders, targetId: string): boolean => {
      for (const f of folders) {
        if (f.id === targetId) {
          if (f.parentId) {
            findFolder(mockData.folders, f.parentId);
          }
          crumbs.push({ id: f.id, name: f.name });
          return true;
        }
        if (f.children) {
          for (const child of f.children) {
            if (child.id === targetId) {
              crumbs.push({ id: f.id, name: f.name });
              crumbs.push({ id: child.id, name: child.name });
              return true;
            }
          }
        }
      }
      return false;
    };
    findFolder(mockData.folders, selectedFolderId);
    return crumbs;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="flex gap-0 -m-6 h-[calc(100vh-4rem)] animate-fade-in">
      {/* Folder sidebar */}
      <div className="w-64 border-r bg-card flex-shrink-0 overflow-y-auto scrollbar-thin p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Dossiers</h3>
        <FolderTree
          folders={mockData.folders}
          selectedId={selectedFolderId}
          onSelect={setSelectedFolder}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
          <div className="flex items-center gap-1 text-sm">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                <button
                  onClick={() => setSelectedFolder(crumb.id)}
                  className={`hover:text-primary transition-colors ${
                    i === breadcrumb.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {i === 0 && !selectedFolderId ? (
                    <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" /> {crumb.name}</span>
                  ) : (
                    crumb.name
                  )}
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button size="sm" onClick={() => setUploadOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Téléverser
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">Aucun document</h3>
              <p className="text-sm text-muted-foreground mb-4">Ce dossier est vide. Téléversez votre premier document.</p>
              <Button size="sm" onClick={() => setUploadOpen(true)} className="gap-2">
                <Upload className="w-4 h-4" />
                Téléverser
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <DocumentGrid documents={documents} onSelect={openDetailPanel} selectedId={selectedDocumentId} />
          ) : (
            <DocumentList documents={documents} onSelect={openDetailPanel} selectedId={selectedDocumentId} />
          )}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedDocument && (
          <DocumentDetailPanel document={selectedDocument} onClose={closeDetailPanel} />
        )}
      </AnimatePresence>

      {/* Upload modal */}
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
