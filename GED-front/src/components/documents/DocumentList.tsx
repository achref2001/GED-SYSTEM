import type { GedDocument } from '@/types';
import { FileTypeIcon } from './FileTypeIcon';
import { formatFileSize, formatDate, getStatusColor, getStatusLabel } from '@/lib/helpers';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentListProps {
  documents: GedDocument[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function DocumentList({ documents, onSelect, selectedId }: DocumentListProps) {
  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Nom</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Taille</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Modifié</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Auteur</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              onClick={() => onSelect(doc.id)}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedId === doc.id ? 'bg-primary/5' : ''
              }`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileTypeIcon type={doc.type} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-foreground truncate">{doc.name}</span>
                      {doc.isFavorite && <Star className="w-3 h-3 text-warning fill-warning flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.tags.slice(0, 2).join(', ')}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{formatFileSize(doc.size)}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{formatDate(doc.updatedAt)}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{doc.createdBy.fullName}</td>
              <td className="px-4 py-3">
                <Badge variant="secondary" className={`text-xs ${getStatusColor(doc.status)}`}>
                  {getStatusLabel(doc.status)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
