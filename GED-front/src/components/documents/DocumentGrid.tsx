import type { GedDocument } from '@/types';
import { FileTypeIcon } from './FileTypeIcon';
import { formatFileSize, formatRelativeDate, getStatusColor, getStatusLabel } from '@/lib/helpers';
import { Star, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentGridProps {
  documents: GedDocument[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function DocumentGrid({ documents, onSelect, selectedId }: DocumentGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={`group bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
            selectedId === doc.id ? 'ring-2 ring-primary border-primary' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <FileTypeIcon type={doc.type} size="lg" />
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {doc.isFavorite && <Star className="w-4 h-4 text-warning fill-warning" />}
            </div>
          </div>
          <h4 className="text-sm font-medium text-foreground truncate mb-1">{doc.name}</h4>
          <p className="text-xs text-muted-foreground mb-2">{formatFileSize(doc.size)}</p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getStatusColor(doc.status)}`}>
              {getStatusLabel(doc.status)}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{formatRelativeDate(doc.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
