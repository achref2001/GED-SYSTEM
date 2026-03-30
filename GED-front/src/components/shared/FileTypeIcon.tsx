import React from 'react'
import { FileIcon, FileTextIcon, ImageIcon, MusicIcon, VideoIcon, FileArchiveIcon, FileCodeIcon, FileQuestionIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FileTypeIconProps {
  fileType: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function FileTypeIcon({ fileType, size = 'md', className }: FileTypeIconProps) {
  const normalizedType = (fileType || '').toLowerCase()
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  }
  
  const iconProps = {
    className: cn(sizeClasses[size], className)
  }

  // PDF
  if (normalizedType === 'pdf') {
    return <FileTextIcon {...iconProps} className={cn('text-red-500', iconProps.className)} />
  }
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(normalizedType)) {
    return <ImageIcon {...iconProps} className={cn('text-blue-500', iconProps.className)} />
  }
  
  // Word / Text
  if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(normalizedType)) {
    return <FileTextIcon {...iconProps} className={cn('text-blue-600', iconProps.className)} />
  }
  
  // Excel / Spreadsheet
  if (['xls', 'xlsx', 'csv', 'ods'].includes(normalizedType)) {
    return <FileTextIcon {...iconProps} className={cn('text-green-600', iconProps.className)} />
  }
  
  // Powerpoint
  if (['ppt', 'pptx'].includes(normalizedType)) {
    return <FileTextIcon {...iconProps} className={cn('text-orange-500', iconProps.className)} />
  }
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(normalizedType)) {
    return <FileArchiveIcon {...iconProps} className={cn('text-amber-600', iconProps.className)} />
  }
  
  // Audio
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(normalizedType)) {
    return <MusicIcon {...iconProps} className={cn('text-purple-500', iconProps.className)} />
  }
  
  // Video
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(normalizedType)) {
    return <VideoIcon {...iconProps} className={cn('text-indigo-500', iconProps.className)} />
  }
  
  // Code
  if (['json', 'js', 'ts', 'tsx', 'jsx', 'html', 'css', 'py', 'go', 'rs', 'cpp'].includes(normalizedType)) {
    return <FileCodeIcon {...iconProps} className={cn('text-slate-600', iconProps.className)} />
  }

  return <FileIcon {...iconProps} className={cn('text-slate-400', iconProps.className)} />
}
