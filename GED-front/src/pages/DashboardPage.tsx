import { mockData } from '@/data/mockData';
import { formatFileSize, formatRelativeDate, getFileTypeColor, getStatusColor, getStatusLabel, getStoragePercentage } from '@/lib/helpers';
import { useNavigate } from 'react-router-dom';
import {
  FileText, HardDrive, Upload, Clock, Star, ArrowUpRight,
  TrendingUp, FolderOpen, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileTypeIcon } from '@/components/documents/FileTypeIcon';

export default function DashboardPage() {
  const { stats, documents, auditLog } = mockData;
  const navigate = useNavigate();
  const favorites = documents.filter((d) => d.isFavorite);
  const storagePercent = getStoragePercentage(stats.storageUsed, stats.storageLimit);

  const statCards = [
    { label: 'Total documents', value: stats.totalDocuments.toLocaleString(), icon: FileText, color: 'text-primary bg-primary/10' },
    { label: 'Stockage utilisé', value: formatFileSize(stats.storageUsed), icon: HardDrive, color: 'text-info bg-info/10', sub: `${storagePercent}% de ${formatFileSize(stats.storageLimit)}` },
    { label: 'Téléversements récents', value: stats.recentUploads.toString(), icon: Upload, color: 'text-success bg-success/10' },
    { label: 'Révisions en attente', value: stats.pendingReviews.toString(), icon: Clock, color: 'text-warning bg-warning/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre espace documentaire</p>
        </div>
        <Button onClick={() => navigate('/documents')} className="gap-2">
          <Upload className="w-4 h-4" />
          Téléverser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                {card.sub && <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Storage bar */}
      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">Espace de stockage</p>
          <p className="text-sm text-muted-foreground">{formatFileSize(stats.storageUsed)} / {formatFileSize(stats.storageLimit)}</p>
        </div>
        <Progress value={storagePercent} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorites */}
        <div className="bg-card rounded-xl border">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" />
              Favoris
            </h2>
          </div>
          <div className="divide-y">
            {favorites.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/documents?doc=${doc.id}`)}
              >
                <FileTypeIcon type={doc.type} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)} · v{doc.version}</p>
                </div>
                <Badge variant="secondary" className={`text-xs ${getStatusColor(doc.status)}`}>
                  {getStatusLabel(doc.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card rounded-xl border">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Activité récente
            </h2>
          </div>
          <div className="divide-y">
            {auditLog.slice(0, 6).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{entry.userName}</span>{' '}
                    <span className="text-muted-foreground">— {entry.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{entry.entityName}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatRelativeDate(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
