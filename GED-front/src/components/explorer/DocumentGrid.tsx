import React from 'react'
import { Document } from '../../types/document'
import { DocumentCard } from './DocumentCard'
import { motion } from 'framer-motion'

export function DocumentGrid({ documents }: { documents: Document[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      {documents.map((doc, i) => (
        <motion.div
           key={doc.id}
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ delay: Math.min(i * 0.05, 1.5), duration: 0.5, ease: "easeOut" }}
           className="h-full"
        >
          <DocumentCard document={doc} />
        </motion.div>
      ))}
    </div>
  )
}
