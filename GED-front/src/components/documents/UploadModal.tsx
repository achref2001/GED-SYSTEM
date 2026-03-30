import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatFileSize } from '@/lib/helpers';
import { documents as documentApi } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  errorMessage?: string;
}

export function UploadModal({ open, onClose, onUploadSuccess }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [tags, setTags] = useState('');
  const { selectedFolderId } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    // Process uploads
    for (const uf of newFiles) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file === uf.file ? { ...f, progress: 10, status: 'uploading' } : f
        )
      );

      try {
        const folderIdStr = selectedFolderId ? parseInt(selectedFolderId) : undefined;
        const res = await documentApi.upload(uf.file, folderIdStr);
        
        if (res.success) {
          setFiles((prev) =>
            prev.map((f) =>
              f.file === uf.file ? { ...f, progress: 100, status: 'done' } : f
            )
          );
          if (onUploadSuccess) onUploadSuccess();
        } else {
          throw new Error(res.message || 'Upload failed');
        }
      } catch (err: any) {
        console.error('Upload error:', err);
        setFiles((prev) =>
          prev.map((f) =>
            f.file === uf.file ? { ...f, status: 'error', errorMessage: err.message } : f
          )
        );
        toast.error(`Échec du téléversement de ${uf.file.name}`);
      }
    }
  }, [selectedFolderId, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const handleClose = () => {
    setFiles([]);
    setTags('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Téléverser des documents</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">
            {isDragActive ? 'Déposez les fichiers ici...' : 'Glissez-déposez vos fichiers'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">ou cliquez pour parcourir</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {files.map((uf) => (
              <div key={uf.file.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {uf.status === 'done' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : uf.status === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  ) : (
                    <FileText className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{uf.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(uf.file.size)}</p>
                  {uf.status === 'uploading' && <Progress value={uf.progress} className="h-1 mt-1" />}
                </div>
                <button onClick={() => removeFile(uf.file)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label>Tags (séparés par des virgules)</Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="facture, 2025, important"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
