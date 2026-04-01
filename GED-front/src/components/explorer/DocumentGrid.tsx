import React from 'react'
import { Document } from '../../types/document'
import { DocumentCard } from './DocumentCard'

export function DocumentGrid({ documents }: { documents: Document[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {documents.map((doc) => (
        <div key={doc.id} className="h-full">
          <DocumentCard document={doc} />
        </div>
      ))}
    </div>
  )
}
