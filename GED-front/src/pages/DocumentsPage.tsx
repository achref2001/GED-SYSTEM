import { useEffect, useState } from 'react';
import { folders as folderApi, documents as documentApi } from '@/lib/api';
import type { Folder, GedDocument } from '@/types';
import { useAppStore } from '@/stores/appStore';
import { FolderTree } from '@/components/documents/FolderTree';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentDetailPanel } from '@/components/documents/DocumentDetailPanel';
import { UploadModal } from '@/components/documents/UploadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AnimatePresence } from 'framer-motion';
import {
  Upload, LayoutGrid, List, ChevronRight, Home, FolderOpen, FolderPlus,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const { viewMode, setViewMode, selectedFolderId, setSelectedFolder, detailPanelOpen, selectedDocumentId, openDetailPanel, closeDetailPanel } = useAppStore();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<GedDocument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [selectedFolderId]);

  const fetchFolders = async () => {
    try {
      const res = await folderApi.getAll();
      if (res.success) setFolders(res.data);
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const parentId = selectedFolderId ? parseInt(selectedFolderId) : undefined;
      const res = await documentApi.getAll(parentId);
      if (res.success) setDocuments(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const parentIdNum = selectedFolderId ? parseInt(selectedFolderId) : null;
      const res = await folderApi.create(newFolderName, parentIdNum);
      if (res.success) {
        setNewFolderName('');
        setCreateFolderOpen(false);
        fetchFolders();
        toast.success('Dossier créé avec succès');
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      toast.error('Erreur lors de la création du dossier');
    }
  };

  const selectedDocument = selectedDocumentId
    ? documents.find((d) => d.id === selectedDocumentId)
    : null;

  // Build breadcrumb
  const getBreadcrumb = () => {
    if (!selectedFolderId) return [{ id: null, name: 'Tous les documents' }];
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Documents' }];
    
    const allFolders: Folder[] = [];
    const flatten = (list: Folder[]) => {
      list.forEach(f => {
        allFolders.push(f);
        if (f.subfolders) flatten(f.subfolders);
      });
    };
    flatten(folders);

    const buildCrumbs = (targetId: string) => {
      const folder = allFolders.find(f => f.id.toString() === targetId.toString());
      if (folder) {
        if (folder.parentId) buildCrumbs(folder.parentId.toString());
        crumbs.push({ id: folder.id.toString(), name: folder.name });
      }
    };
    
    buildCrumbs(selectedFolderId);
    return crumbs;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="flex gap-0 -m-6 h-[calc(100vh-4rem)] animate-fade-in">
      {/* Folder sidebar */}
      <div className="w-64 border-r bg-card flex-shrink-0 overflow-y-auto scrollbar-thin p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Dossiers</h3>
        <FolderTree
          folders={folders}
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
            
            <Button variant="outline" size="sm" onClick={() => setCreateFolderOpen(true)} className="gap-2">
              <FolderPlus className="w-4 h-4" />
              Nouveau dossier
            </Button>

            <Button size="sm" onClick={() => setUploadOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Téléverser
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : documents.length === 0 ? (
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
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploadSuccess={fetchDocuments} />

      {/* Create Folder Dialog */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau dossier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateFolder} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Nom du dossier</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ex: Factures 2024"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateFolderOpen(false)}>Annuler</Button>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
