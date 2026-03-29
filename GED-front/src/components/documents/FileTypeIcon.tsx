import { FileType } from '@/types';
import { FileText, FileSpreadsheet, Image, Film, Archive, File } from 'lucide-react';
import { getFileTypeColor } from '@/lib/helpers';

const iconMap: Record<FileType, React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  image: Image,
  video: Film,
  archive: Archive,
  other: File,
};

interface FileTypeIconProps {
  type: FileType;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5' },
  lg: { container: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
};

export function FileTypeIcon({ type, size = 'md' }: FileTypeIconProps) {
  const Icon = iconMap[type] || iconMap.other;
  const s = sizeMap[size];
  return (
    <div className={`${s.container} flex items-center justify-center ${getFileTypeColor(type)}`}>
      <Icon className={s.icon} />
    </div>
  );
}
