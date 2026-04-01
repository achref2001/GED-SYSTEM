import React, { useState } from 'react'
import { 
  X, Info, History, Tags,
  Download, Archive, Trash2,
  ExternalLink, RefreshCw 
} from 'lucide-react'
import { useDocumentDetails, useDocumentVersions } from '../../hooks/queries/useDocuments'
import { useExplorerStore } from '../../stores/explorerStore'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { FileTypeIcon } from '../shared/FileTypeIcon'
import { FavoriteStar } from './FavoriteStar'
import { LockStatusSection } from './LockStatusSection'
import { cn } from '../../lib/utils'
import { format } from 'date-fns'
import { TagSelector } from '../shared/TagSelector'
import { useBulkMutation } from '../../hooks/mutations/useBulkMutation'
import { toast } from 'sonner'
import { documentsApi } from '../../services/api/documents'

export function DocumentDetailPanel({ documentId }: { documentId: number }) {
  const { closeDetailPanel } = useExplorerStore()
  const { data: doc, isLoading } = useDocumentDetails(documentId)
  const { data: versions } = useDocumentVersions(documentId)
  const [activeTab, setActiveTab] = useState('info')
  const { bulkTag } = useBulkMutation()

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-sm font-medium text-slate-500">Retrieving document details...</p>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
          <X className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">Document not found</h3>
        <p className="text-sm text-slate-500 mb-6">The document you're looking for doesn't exist or is inaccessible.</p>
        <Button variant="outline" onClick={closeDetailPanel}>Close Panel</Button>
      </div>
    )
  }

  const selectedTagNames = (doc.tags || []).map((tag: any) =>
    typeof tag === 'string' ? tag : tag?.name
  ).filter(Boolean)

  const handleToggleTag = (tagName: string) => {
    const isSelected = selectedTagNames.includes(tagName)
    bulkTag.mutate(
      {
        ids: [doc.id],
        add: isSelected ? [] : [tagName],
        remove: isSelected ? [tagName] : []
      },
      {
        onSuccess: () => {
          toast.success(`${isSelected ? 'Removed' : 'Added'} tag ${tagName}`)
        }
      }
    )
  }

  const handleDownload = async () => {
    try {
      await documentsApi.download(doc.id, doc.name)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to download document')
    }
  }

  const handleOpen = async () => {
    try {
      await documentsApi.open(doc.id)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to open document')
    }
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="px-6 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={closeDetailPanel} 
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Details</h2>
        </div>
        <div className="flex items-center gap-1">
          <FavoriteStar documentId={doc.id} size="md" />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Document Info */}
        <div className="p-8 pb-4">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center flex-shrink-0 group hover:rotate-3 transition-transform duration-300">
               <FileTypeIcon fileType={doc.file_type} size="xl" />
            </div>
            <div className="flex-1 min-w-0">
               <h1 className="text-xl font-bold text-slate-900 truncate mb-1 leading-snug" title={doc.name}>
                 {doc.name}
               </h1>
               <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                 <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-widest">{doc.file_type}</span>
                 <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button onClick={handleDownload} variant="default" className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button onClick={handleOpen} variant="secondary" className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200">
              <ExternalLink className="w-4 h-4 mr-2" /> Open
            </Button>
          </div>

          <LockStatusSection document={doc} />
        </div>

        {/* Dynamic Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full border-t border-slate-100">
          <div className="px-6 bg-slate-50/50">
            <TabsList className="bg-transparent border-b-0 h-14 w-full justify-between gap-1">
              <TabsTrigger value="info" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg h-10 transition-all font-semibold text-xs uppercase tracking-wider">
                <Info className="w-4 h-4 mr-2" /> Info
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg h-10 transition-all font-semibold text-xs uppercase tracking-wider">
                <History className="w-4 h-4 mr-2" /> History
              </TabsTrigger>
              <TabsTrigger value="metadata" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg h-10 transition-all font-semibold text-xs uppercase tracking-wider">
                <Tags className="w-4 h-4 mr-2" /> Extended
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8">
            <TabsContent value="info" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Description</h4>
                 <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-blue-500/10 pl-4">{doc.description || 'No description available for this document.'}</p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm group">
                    <span className="text-slate-500 font-medium group-hover:text-slate-900 transition-colors">Created</span>
                    <span className="text-slate-900 font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                      {doc.uploaded_at ? format(new Date(doc.uploaded_at), 'PPP') : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm group">
                    <span className="text-slate-500 font-medium group-hover:text-slate-900 transition-colors">By</span>
                    <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">{doc.created_by_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm group">
                    <span className="text-slate-500 font-medium group-hover:text-slate-900 transition-colors">Last Update</span>
                    <span className="text-slate-900 font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                      {doc.updated_at ? format(new Date(doc.updated_at), 'PPP') : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-6 border-t border-slate-50">
                 <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="w-4 h-4 mr-3" /> Soft Delete</Button>
                 <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100"><Archive className="w-4 h-4 mr-3" /> Archive Permanently</Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
               {versions?.length ? (
                 <div className="space-y-6">
                    {versions.map((v, i) => (
                      <div key={v.id} className={cn(
                        "relative pl-8 border-l-2 py-4 group",
                        v.is_current ? "border-blue-500" : "border-slate-200"
                      )}>
                        <div className={cn(
                          "absolute -left-[9px] top-4 w-4 h-4 rounded-full border-4",
                          v.is_current ? "bg-white border-blue-500" : "bg-slate-300 border-white"
                        )} />
                        <div className="flex items-center justify-between mb-2">
                           <span className={cn("text-xs font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider", v.is_current ? "bg-blue-600 text-white border-blue-700" : "bg-slate-100 text-slate-600 border-slate-200")}>Version {v.version_number}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             {v.uploaded_at ? format(new Date(v.uploaded_at), 'MMM d, yyyy') : 'Unknown date'}
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 group-hover:text-slate-800 transition-colors italic">"{v.comment || 'Incremental update with metadata refinement.'}"</p>
                        <p className="text-[10px] mt-3 font-bold text-slate-400/60 uppercase tracking-tighter">Uploaded by: <span className="text-slate-900 border-b border-slate-100">{v.uploaded_by_name}</span></p>
                        {!v.is_current && (
                           <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="outline" className="h-7 text-[10px] hover:bg-blue-50 hover:text-blue-600">Restore Version</Button>
                           </div>
                        )}
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-sm font-medium text-slate-400">No version history found.</p>
                 </div>
               )}
            </TabsContent>

            <TabsContent value="metadata" className="mt-0">
               <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Tags</h4>
                    <div className="space-y-4">
                      {selectedTagNames.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedTagNames.map((tagName) => (
                            <span key={tagName} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold border border-indigo-100">
                              #{tagName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No tags assigned.</p>
                      )}
                      <TagSelector
                        selectedTagNames={selectedTagNames}
                        onToggle={handleToggleTag}
                      />
                    </div>
                  </div>

                  <div>
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Technical Metadata</h4>
                     <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 space-y-4">
                        {Object.entries(doc.metadata || {}).map(([key, val]) => (
                          <div key={key} className="flex flex-col group">
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">{key.replace(/_/g, ' ')}</span>
                             <span className="text-xs text-slate-900 font-mono bg-white p-2.5 rounded-lg border border-slate-100 group-hover:border-blue-500 group-hover:text-blue-600 transition-all break-all">{String(val)}</span>
                          </div>
                        ))}
                        {Object.keys(doc.metadata || {}).length === 0 && (
                          <p className="text-xs text-slate-400 text-center italic py-4">No custom fields defined.</p>
                        )}
                     </div>
                  </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
