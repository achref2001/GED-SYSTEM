import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockData } from '@/data/mockData';
import { useAppStore } from '@/stores/appStore';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentList } from '@/components/documents/DocumentList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, LayoutGrid, List } from 'lucide-react';
import type { FileType } from '@/types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { viewMode, setViewMode, openDetailPanel, selectedDocumentId } = useAppStore();

  const results = useMemo(() => {
    let docs = mockData.documents;
    if (query.trim()) {
      const q = query.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.description?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') {
      docs = docs.filter((d) => d.type === typeFilter);
    }
    return docs;
  }, [query, typeFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recherche</h1>
        <p className="text-muted-foreground mt-1">Trouvez rapidement vos documents</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, tag, description..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
          <Filter className="w-4 h-4" />
          Filtres
        </Button>
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
      </div>

      {showFilters && (
        <div className="flex gap-3 flex-wrap p-4 bg-card rounded-xl border">
          <div className="w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type de fichier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setTypeFilter('all')}>
              Type: {typeFilter} <X className="w-3 h-3" />
            </Badge>
          )}
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground mb-4">
          {results.length} résultat{results.length !== 1 ? 's' : ''}
          {query && ` pour "${query}"`}
        </p>
        {results.length > 0 ? (
          viewMode === 'grid' ? (
            <DocumentGrid documents={results} onSelect={openDetailPanel} selectedId={selectedDocumentId} />
          ) : (
            <DocumentList documents={results} onSelect={openDetailPanel} selectedId={selectedDocumentId} />
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-1">Aucun résultat</h3>
            <p className="text-sm text-muted-foreground">Essayez des termes de recherche différents</p>
          </div>
        )}
      </div>
    </div>
  );
}
