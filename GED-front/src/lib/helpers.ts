import { FileType } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 o';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(date: string): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: fr });
}

export function formatDateTime(date: string): string {
  return format(new Date(date), 'dd MMM yyyy à HH:mm', { locale: fr });
}

export function formatRelativeDate(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function getFileTypeColor(type: FileType): string {
  const colors: Record<FileType, string> = {
    pdf: 'text-file-pdf bg-file-pdf/10',
    docx: 'text-file-doc bg-file-doc/10',
    xlsx: 'text-file-xls bg-file-xls/10',
    image: 'text-file-img bg-file-img/10',
    video: 'text-file-other bg-file-other/10',
    archive: 'text-file-other bg-file-other/10',
    other: 'text-file-other bg-file-other/10',
  };
  return colors[type];
}

export function getFileTypeLabel(type: FileType): string {
  const labels: Record<FileType, string> = {
    pdf: 'PDF',
    docx: 'Word',
    xlsx: 'Excel',
    image: 'Image',
    video: 'Vidéo',
    archive: 'Archive',
    other: 'Autre',
  };
  return labels[type];
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    pending_review: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-destructive/10 text-destructive',
  };
  return colors[status] || colors.draft;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    pending_review: 'En révision',
    approved: 'Approuvé',
    rejected: 'Rejeté',
  };
  return labels[status] || status;
}

export function getStoragePercentage(used: number, limit: number): number {
  return Math.round((used / limit) * 100);
}
