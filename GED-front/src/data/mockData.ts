import type { User, GedDocument, Folder, AuditLogEntry, DashboardStats, Notification, DocumentVersion, Comment } from '@/types';

const mockUser: User = {
  id: '',
  email: '',
  fullName: '',
  role: 'viewer',
  storageUsed: 0,
  storageLimit: 0,
  createdAt: '',
};

export const mockData = {
  user: mockUser,
  users: [] as User[],
  folders: [] as Folder[],
  documents: [] as GedDocument[],
  auditLog: [] as AuditLogEntry[],
  notifications: [] as Notification[],
  versions: [] as DocumentVersion[],
  comments: [] as Comment[],
  stats: {
    totalDocuments: 0,
    storageUsed: 0,
    storageLimit: 0,
    recentUploads: 0,
    pendingReviews: 0,
  } as DashboardStats,
};
