import React, { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Document } from '../../types/document'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/button'
import { CheckoutModal } from '../modals/CheckoutModal'
import { CheckinModal } from '../modals/CheckinModal'
import { ForceUnlockModal } from '../modals/ForceUnlockModal'

export function LockStatusSection({ document }: { document: Document }) {
  const { user } = useAuthStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkinOpen, setCheckinOpen] = useState(false)
  const [forceUnlockOpen, setForceUnlockOpen] = useState(false)

  // Use optional chaining or defaults for ID comparison
  const isLockedByMe = document.locked_by === user?.id
  const isLockedByOther = document.is_locked && !isLockedByMe
  const canForceUnlock = user?.role === 'ADMIN'

  if (!document.is_locked) {
    return (
      <div className="flex items-center justify-between p-3 
                       bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <Unlock className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Document is available
          </span>
        </div>
        <Button size="sm" variant="outline"
                onClick={() => setCheckoutOpen(true)}>
          Check Out
        </Button>
        <CheckoutModal
            documentId={document.id}
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
        />
      </div>
    )
  }

  return (
    <div className={cn(
      'p-3 rounded-lg border',
      isLockedByMe 
        ? 'bg-blue-50 border-blue-200' 
        : 'bg-amber-50 border-amber-200'
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Lock className={cn(
          'w-4 h-4',
          isLockedByMe ? 'text-blue-600' : 'text-amber-600'
        )} />
        <span className={cn(
          'text-sm font-medium',
          isLockedByMe ? 'text-blue-700' : 'text-amber-700'
        )}>
          {isLockedByMe 
            ? 'Checked out by you' 
            : `Checked out by ${document.locked_by_name}`
          }
        </span>
      </div>
      {document.lock_expires_at && (
          <div className="text-xs text-slate-500 mb-3">
            Expires: {new Date(document.lock_expires_at).toLocaleString()}
          </div>
      )}
      <div className="flex gap-2">
        {isLockedByMe && (
          <Button size="sm" onClick={() => setCheckinOpen(true)}>
            Check In
          </Button>
        )}
        {canForceUnlock && isLockedByOther && (
          <Button size="sm" variant="destructive"
                  onClick={() => setForceUnlockOpen(true)}>
            Force Unlock
          </Button>
        )}
      </div>

      <CheckinModal
        documentId={document.id}
        open={checkinOpen}
        onClose={() => setCheckinOpen(false)}
      />
      <ForceUnlockModal
        document={document}
        open={forceUnlockOpen}
        onClose={() => setForceUnlockOpen(false)}
      />
    </div>
  )
}
