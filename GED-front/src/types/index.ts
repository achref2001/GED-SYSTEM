export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type FileType = 'pdf' | 'docx' | 'xlsx' | 'image' | 'video' | 'archive' | 'other';

export interface GedDocument {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  description?: string;
  tags: string[];
  version: number;
  isFavorite: boolean;
  thumbnailUrl?: string;
  downloadUrl?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  permissions: Permission[];
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  children?: Folder[];
  documentCount: number;
}

export interface Permission {
  userId: string;
  user: User;
  level: 'viewer' | 'editor' | 'admin';
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  size: number;
  uploadedBy: User;
  uploadedAt: string;
  changelog?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: 'document' | 'folder' | 'user';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  type: 'upload' | 'share' | 'review' | 'comment' | 'approval';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardStats {
  totalDocuments: number;
  storageUsed: number;
  storageLimit: number;
  recentUploads: number;
  pendingReviews: number;
}

export interface SearchFilters {
  query: string;
  type?: FileType[];
  folderId?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  uploadedBy?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortField = 'name' | 'date' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';
