import type { User, GedDocument, Folder, AuditLogEntry, DashboardStats, Notification, DocumentVersion, Comment } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'admin@ged.com',
  fullName: 'Ahmed Benali',
  role: 'admin',
  storageUsed: 2147483648,
  storageLimit: 10737418240,
  createdAt: '2024-01-15T08:00:00Z',
  lastLogin: '2025-03-28T14:30:00Z',
};

const mockUsers: User[] = [
  mockUser,
  { id: '2', email: 'sarah@ged.com', fullName: 'Sarah Martin', role: 'manager', storageUsed: 1073741824, storageLimit: 5368709120, createdAt: '2024-02-20T10:00:00Z' },
  { id: '3', email: 'karim@ged.com', fullName: 'Karim Dupont', role: 'user', storageUsed: 536870912, storageLimit: 2147483648, createdAt: '2024-03-10T09:00:00Z' },
  { id: '4', email: 'lea@ged.com', fullName: 'Léa Moreau', role: 'viewer', storageUsed: 268435456, storageLimit: 1073741824, createdAt: '2024-04-05T11:00:00Z' },
];

const mockFolders: Folder[] = [
  { id: 'f1', name: 'Ressources Humaines', parentId: null, createdAt: '2024-01-20T08:00:00Z', updatedAt: '2024-01-20T08:00:00Z', createdBy: mockUser, documentCount: 12, children: [
    { id: 'f1-1', name: 'Contrats', parentId: 'f1', createdAt: '2024-01-21T08:00:00Z', updatedAt: '2024-01-21T08:00:00Z', createdBy: mockUser, documentCount: 5 },
    { id: 'f1-2', name: 'Fiches de paie', parentId: 'f1', createdAt: '2024-01-22T08:00:00Z', updatedAt: '2024-01-22T08:00:00Z', createdBy: mockUser, documentCount: 8 },
  ]},
  { id: 'f2', name: 'Finance', parentId: null, createdAt: '2024-02-01T08:00:00Z', updatedAt: '2024-02-01T08:00:00Z', createdBy: mockUser, documentCount: 23, children: [
    { id: 'f2-1', name: 'Factures', parentId: 'f2', createdAt: '2024-02-02T08:00:00Z', updatedAt: '2024-02-02T08:00:00Z', createdBy: mockUser, documentCount: 15 },
    { id: 'f2-2', name: 'Bilans', parentId: 'f2', createdAt: '2024-02-03T08:00:00Z', updatedAt: '2024-02-03T08:00:00Z', createdBy: mockUser, documentCount: 4 },
  ]},
  { id: 'f3', name: 'Projets', parentId: null, createdAt: '2024-03-01T08:00:00Z', updatedAt: '2024-03-01T08:00:00Z', createdBy: mockUser, documentCount: 18, children: [
    { id: 'f3-1', name: 'Projet Alpha', parentId: 'f3', createdAt: '2024-03-02T08:00:00Z', updatedAt: '2024-03-02T08:00:00Z', createdBy: mockUser, documentCount: 7 },
    { id: 'f3-2', name: 'Projet Beta', parentId: 'f3', createdAt: '2024-03-03T08:00:00Z', updatedAt: '2024-03-03T08:00:00Z', createdBy: mockUser, documentCount: 11 },
  ]},
  { id: 'f4', name: 'Juridique', parentId: null, createdAt: '2024-04-01T08:00:00Z', updatedAt: '2024-04-01T08:00:00Z', createdBy: mockUser, documentCount: 9 },
  { id: 'f5', name: 'Marketing', parentId: null, createdAt: '2024-05-01T08:00:00Z', updatedAt: '2024-05-01T08:00:00Z', createdBy: mockUser, documentCount: 14 },
];

const mockDocuments: GedDocument[] = [
  { id: 'd1', name: 'Contrat CDI - Ahmed Benali.pdf', type: 'pdf', mimeType: 'application/pdf', size: 2457600, folderId: 'f1-1', createdAt: '2025-03-25T10:30:00Z', updatedAt: '2025-03-25T10:30:00Z', createdBy: mockUser, tags: ['contrat', 'cdi', 'rh'], version: 2, isFavorite: true, status: 'approved', permissions: [], description: 'Contrat à durée indéterminée' },
  { id: 'd2', name: 'Facture_Mars_2025.xlsx', type: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1048576, folderId: 'f2-1', createdAt: '2025-03-26T14:00:00Z', updatedAt: '2025-03-26T14:00:00Z', createdBy: mockUsers[1], tags: ['facture', 'mars', '2025'], version: 1, isFavorite: false, status: 'pending_review', permissions: [], description: 'Factures du mois de mars' },
  { id: 'd3', name: 'Rapport Projet Alpha.docx', type: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 3145728, folderId: 'f3-1', createdAt: '2025-03-24T09:15:00Z', updatedAt: '2025-03-27T11:00:00Z', createdBy: mockUsers[2], tags: ['rapport', 'alpha', 'projet'], version: 3, isFavorite: true, status: 'approved', permissions: [], description: 'Rapport final du projet Alpha' },
  { id: 'd4', name: 'Logo Entreprise.png', type: 'image', mimeType: 'image/png', size: 524288, folderId: 'f5', createdAt: '2025-03-20T16:45:00Z', updatedAt: '2025-03-20T16:45:00Z', createdBy: mockUsers[1], tags: ['logo', 'branding'], version: 1, isFavorite: false, status: 'approved', permissions: [], description: 'Logo officiel haute résolution' },
  { id: 'd5', name: 'Bilan Annuel 2024.pdf', type: 'pdf', mimeType: 'application/pdf', size: 5242880, folderId: 'f2-2', createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-03-28T10:00:00Z', createdBy: mockUser, tags: ['bilan', '2024', 'finance'], version: 4, isFavorite: true, status: 'approved', permissions: [], description: 'Bilan annuel complet pour 2024' },
  { id: 'd6', name: 'Procédure Qualité ISO.pdf', type: 'pdf', mimeType: 'application/pdf', size: 1572864, folderId: 'f4', createdAt: '2025-03-22T13:20:00Z', updatedAt: '2025-03-22T13:20:00Z', createdBy: mockUsers[2], tags: ['qualité', 'iso', 'procédure'], version: 1, isFavorite: false, status: 'pending_review', permissions: [], description: 'Manuel de procédure qualité ISO 9001' },
  { id: 'd7', name: 'Présentation Marketing Q1.pdf', type: 'pdf', mimeType: 'application/pdf', size: 8388608, folderId: 'f5', createdAt: '2025-03-27T15:00:00Z', updatedAt: '2025-03-27T15:00:00Z', createdBy: mockUsers[1], tags: ['marketing', 'présentation', 'q1'], version: 1, isFavorite: false, status: 'draft', permissions: [], description: 'Présentation des résultats marketing du premier trimestre' },
  { id: 'd8', name: 'Planning Équipe Mars.xlsx', type: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 409600, folderId: 'f1', createdAt: '2025-03-01T07:30:00Z', updatedAt: '2025-03-28T08:00:00Z', createdBy: mockUser, tags: ['planning', 'équipe', 'mars'], version: 6, isFavorite: true, status: 'approved', permissions: [], description: 'Planning des ressources humaines' },
  { id: 'd9', name: 'Cahier des Charges Beta.docx', type: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 2097152, folderId: 'f3-2', createdAt: '2025-03-18T11:45:00Z', updatedAt: '2025-03-25T14:30:00Z', createdBy: mockUsers[2], tags: ['cdc', 'beta', 'spécifications'], version: 2, isFavorite: false, status: 'pending_review', permissions: [], description: 'Cahier des charges pour le projet Beta' },
  { id: 'd10', name: 'Photo Événement Corporate.jpg', type: 'image', mimeType: 'image/jpeg', size: 4194304, folderId: 'f5', createdAt: '2025-03-28T17:00:00Z', updatedAt: '2025-03-28T17:00:00Z', createdBy: mockUsers[3], tags: ['événement', 'photo', 'corporate'], version: 1, isFavorite: false, status: 'approved', permissions: [], description: 'Photos de l\'événement corporate annuel' },
];

const mockAuditLog: AuditLogEntry[] = [
  { id: 'a1', action: 'Téléversement', entityType: 'document', entityId: 'd10', entityName: 'Photo Événement Corporate.jpg', userId: '4', userName: 'Léa Moreau', timestamp: '2025-03-28T17:00:00Z' },
  { id: 'a2', action: 'Modification', entityType: 'document', entityId: 'd8', entityName: 'Planning Équipe Mars.xlsx', userId: '1', userName: 'Ahmed Benali', timestamp: '2025-03-28T08:00:00Z' },
  { id: 'a3', action: 'Approbation', entityType: 'document', entityId: 'd5', entityName: 'Bilan Annuel 2024.pdf', userId: '1', userName: 'Ahmed Benali', timestamp: '2025-03-28T10:00:00Z' },
  { id: 'a4', action: 'Partage', entityType: 'document', entityId: 'd3', entityName: 'Rapport Projet Alpha.docx', userId: '3', userName: 'Karim Dupont', timestamp: '2025-03-27T11:00:00Z', details: 'Partagé avec Sarah Martin' },
  { id: 'a5', action: 'Téléversement', entityType: 'document', entityId: 'd7', entityName: 'Présentation Marketing Q1.pdf', userId: '2', userName: 'Sarah Martin', timestamp: '2025-03-27T15:00:00Z' },
  { id: 'a6', action: 'Création dossier', entityType: 'folder', entityId: 'f3-2', entityName: 'Projet Beta', userId: '1', userName: 'Ahmed Benali', timestamp: '2025-03-26T09:00:00Z' },
  { id: 'a7', action: 'Suppression', entityType: 'document', entityId: 'dx', entityName: 'Ancien document.pdf', userId: '2', userName: 'Sarah Martin', timestamp: '2025-03-26T16:00:00Z' },
  { id: 'a8', action: 'Téléchargement', entityType: 'document', entityId: 'd1', entityName: 'Contrat CDI - Ahmed Benali.pdf', userId: '3', userName: 'Karim Dupont', timestamp: '2025-03-25T14:00:00Z' },
];

const mockNotifications: Notification[] = [
  { id: 'n1', type: 'share', title: 'Document partagé', message: 'Karim Dupont a partagé "Rapport Projet Alpha.docx" avec vous', read: false, createdAt: '2025-03-28T11:00:00Z', actionUrl: '/documents?doc=d3' },
  { id: 'n2', type: 'review', title: 'Révision demandée', message: 'Nouveau document en attente de révision: "Facture_Mars_2025.xlsx"', read: false, createdAt: '2025-03-28T14:05:00Z', actionUrl: '/documents?doc=d2' },
  { id: 'n3', type: 'approval', title: 'Document approuvé', message: 'Votre document "Bilan Annuel 2024.pdf" a été approuvé', read: true, createdAt: '2025-03-28T10:05:00Z', actionUrl: '/documents?doc=d5' },
  { id: 'n4', type: 'upload', title: 'Téléversement terminé', message: '"Photo Événement Corporate.jpg" téléversé avec succès', read: true, createdAt: '2025-03-28T17:01:00Z' },
  { id: 'n5', type: 'comment', title: 'Nouveau commentaire', message: 'Sarah Martin a commenté "Cahier des Charges Beta.docx"', read: false, createdAt: '2025-03-27T16:30:00Z', actionUrl: '/documents?doc=d9' },
];

const mockVersions: DocumentVersion[] = [
  { id: 'v1', documentId: 'd5', version: 4, size: 5242880, uploadedBy: mockUser, uploadedAt: '2025-03-28T10:00:00Z', changelog: 'Corrections finales' },
  { id: 'v2', documentId: 'd5', version: 3, size: 5100000, uploadedBy: mockUsers[1], uploadedAt: '2025-03-20T14:00:00Z', changelog: 'Ajout des annexes' },
  { id: 'v3', documentId: 'd5', version: 2, size: 4800000, uploadedBy: mockUser, uploadedAt: '2025-03-10T09:00:00Z', changelog: 'Mise à jour des chiffres' },
  { id: 'v4', documentId: 'd5', version: 1, size: 4500000, uploadedBy: mockUser, uploadedAt: '2025-03-01T08:00:00Z', changelog: 'Version initiale' },
];

const mockComments: Comment[] = [
  { id: 'c1', documentId: 'd3', userId: '2', userName: 'Sarah Martin', content: 'Excellent travail sur ce rapport. Quelques remarques mineures sur la section 3.', createdAt: '2025-03-27T10:00:00Z' },
  { id: 'c2', documentId: 'd3', userId: '1', userName: 'Ahmed Benali', content: 'Merci Sarah, je vais prendre en compte vos remarques.', createdAt: '2025-03-27T10:30:00Z' },
  { id: 'c3', documentId: 'd9', userId: '2', userName: 'Sarah Martin', content: 'Il manque la section sur les exigences techniques.', createdAt: '2025-03-27T16:30:00Z' },
];

export const mockData = {
  user: mockUser,
  users: mockUsers,
  folders: mockFolders,
  documents: mockDocuments,
  auditLog: mockAuditLog,
  notifications: mockNotifications,
  versions: mockVersions,
  comments: mockComments,
  stats: {
    totalDocuments: 247,
    storageUsed: 3221225472,
    storageLimit: 10737418240,
    recentUploads: 12,
    pendingReviews: 5,
  } as DashboardStats,
};
