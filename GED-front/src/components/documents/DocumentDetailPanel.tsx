import { motion } from 'framer-motion';
import type { GedDocument } from '@/types';
import { FileTypeIcon } from './FileTypeIcon';
import { formatFileSize, formatDateTime, getStatusColor, getStatusLabel, getFileTypeLabel } from '@/lib/helpers';
import { mockData } from '@/data/mockData';
import {
  X, Download, Share2, Star, Tag, Clock, User, FileText,
  CheckCircle, XCircle, Send, MessageSquare, History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

interface DocumentDetailPanelProps {
  document: GedDocument;
  onClose: () => void;
}

type Tab = 'info' | 'versions' | 'comments';

export function DocumentDetailPanel({ document: doc, onClose }: DocumentDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const versions = mockData.versions.filter((v) => v.documentId === doc.id);
  const comments = mockData.comments.filter((c) => c.documentId === doc.id);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'info', label: 'Détails', icon: FileText },
    { id: 'versions', label: 'Versions', icon: History },
    { id: 'comments', label: 'Commentaires', icon: MessageSquare },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-96 border-l bg-card flex-shrink-0 overflow-y-auto scrollbar-thin flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b">
        <div className="flex items-center gap-3 min-w-0">
          <FileTypeIcon type={doc.type} size="md" />
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">{doc.name}</h3>
            <p className="text-xs text-muted-foreground">{getFileTypeLabel(doc.type)} · {formatFileSize(doc.size)}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 py-3 border-b">
        <Button size="sm" variant="outline" className="gap-1 text-xs flex-1">
          <Download className="w-3.5 h-3.5" /> Télécharger
        </Button>
        <Button size="sm" variant="outline" className="gap-1 text-xs flex-1">
          <Share2 className="w-3.5 h-3.5" /> Partager
        </Button>
        <Button size="sm" variant="ghost" className="px-2">
          <Star className={`w-4 h-4 ${doc.isFavorite ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
        </Button>
      </div>

      {/* Status & workflow */}
      <div className="px-5 py-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Statut</span>
          <Badge variant="secondary" className={`text-xs ${getStatusColor(doc.status)}`}>
            {getStatusLabel(doc.status)}
          </Badge>
        </div>
        {doc.status === 'draft' && (
          <Button size="sm" className="w-full gap-2 mt-2" variant="default">
            <Send className="w-3.5 h-3.5" /> Soumettre pour révision
          </Button>
        )}
        {doc.status === 'pending_review' && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="flex-1 gap-1 bg-success hover:bg-success/90 text-success-foreground">
              <CheckCircle className="w-3.5 h-3.5" /> Approuver
            </Button>
            <Button size="sm" variant="destructive" className="flex-1 gap-1">
              <XCircle className="w-3.5 h-3.5" /> Rejeter
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {doc.description && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground">{doc.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon={User} label="Auteur" value={doc.createdBy.fullName} />
              <InfoItem icon={Clock} label="Créé le" value={formatDateTime(doc.createdAt)} />
              <InfoItem icon={Clock} label="Modifié le" value={formatDateTime(doc.updatedAt)} />
              <InfoItem icon={History} label="Version" value={`v${doc.version}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="space-y-3">
            {versions.length > 0 ? versions.map((v) => (
              <div key={v.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  v{v.version}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{v.changelog || 'Pas de description'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {v.uploadedBy.fullName} · {formatDateTime(v.uploadedAt)}
                  </p>
                </div>
                {v.version < doc.version && (
                  <Button size="sm" variant="ghost" className="text-xs">
                    Restaurer
                  </Button>
                )}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune version antérieure</p>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{c.userName}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                </div>
                <p className="text-sm text-foreground ml-8">{c.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun commentaire</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
