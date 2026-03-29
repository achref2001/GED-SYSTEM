import { useState } from 'react';
import type { Folder } from '@/types';
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderOpen } from 'lucide-react';

interface FolderTreeProps {
  folders: Folder[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function FolderItem({
  folder,
  selectedId,
  onSelect,
  level = 0,
}: {
  folder: Folder;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  level?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedId === folder.id;

  return (
    <div>
      <button
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
          isSelected
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-foreground hover:bg-muted'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(folder.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-0.5"
          >
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        {isSelected ? (
          <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
        ) : (
          <FolderIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <span className="truncate">{folder.name}</span>
        <span className="ml-auto text-xs text-muted-foreground">{folder.documentCount}</span>
      </button>
      {hasChildren && expanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree({ folders, selectedId, onSelect }: FolderTreeProps) {
  return (
    <div className="space-y-0.5">
      <button
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
          selectedId === null
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-foreground hover:bg-muted'
        }`}
        onClick={() => onSelect(null)}
      >
        <FolderOpen className="w-4 h-4" />
        <span>Tous les documents</span>
      </button>
      {folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
