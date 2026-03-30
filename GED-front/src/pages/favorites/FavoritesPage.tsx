import React, { useState } from 'react'
import { Star, Heart, Folder, FileText, Loader2, Sparkles } from 'lucide-react'
import { useFavorites } from '../../hooks/queries/useFavorites'
import { useToggleFavorite } from '../../hooks/mutations/useFavoriteMutation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { FavoriteDocumentCard } from '../../components/favorites/FavoriteDocumentCard'
import { FavoriteFolderRow } from '../../components/favorites/FavoriteFolderRow'
import { motion, AnimatePresence } from 'framer-motion'

export default function FavoritesPage() {
  const [tab, setTab] = useState<'documents' | 'folders'>('documents')
  const { data, isLoading } = useFavorites('all')
  const { remove } = useToggleFavorite()

  const docCount = data?.documents?.length ?? 0
  const folderCount = data?.folders?.length ?? 0

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="px-8 py-8 border-b border-slate-100 bg-white flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shadow-inner">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Favorites</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {(docCount + folderCount)} saved items across your vault.
            </p>
          </div>
        </div>
      </header>

      {/* Tabs + Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-8">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as 'documents' | 'folders')}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mb-6 w-fit bg-slate-100/80 rounded-xl p-1.5 border border-slate-200/50 flex-shrink-0">
            <TabsTrigger
              value="documents"
              className="rounded-lg px-6 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all flex items-center gap-2"
            >
              <FileText size={14} />
              Documents
              <span className="bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                {docCount}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="folders"
              className="rounded-lg px-6 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all flex items-center gap-2"
            >
              <Folder size={14} />
              Folders
              <span className="bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                {folderCount}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="flex-1 overflow-y-auto scrollbar-thin data-[state=inactive]:hidden">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest animate-pulse">Retrieving saved assets...</span>
                </motion.div>
              ) : docCount === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">No favorites yet</h3>
                    <p className="text-sm text-slate-400 font-medium">Star documents to save them here for quick access.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8"
                >
                  {data?.documents.map((fav) => (
                    <FavoriteDocumentCard
                      key={fav.id}
                      favorite={fav}
                      onRemove={() => remove.mutate(fav.document_id!)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Folders Tab */}
          <TabsContent value="folders" className="flex-1 overflow-y-auto scrollbar-thin data-[state=inactive]:hidden">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </motion.div>
              ) : folderCount === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Folder className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">No favorite folders</h3>
                    <p className="text-sm text-slate-400 font-medium">Save folders here for quick navigation.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 pb-8"
                >
                  {data?.folders.map((fav) => (
                    <FavoriteFolderRow key={fav.id} favorite={fav} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
