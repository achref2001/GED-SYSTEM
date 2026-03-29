import { motion } from 'framer-motion';
import { mockData } from '@/data/mockData';
import { formatRelativeDate } from '@/lib/helpers';
import { Bell, Upload, Share2, CheckCircle, MessageSquare, FileCheck, X } from 'lucide-react';
import type { Notification } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  upload: Upload,
  share: Share2,
  approval: CheckCircle,
  review: FileCheck,
  comment: MessageSquare,
};

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      className="absolute right-0 mt-2 w-96 bg-card rounded-xl border shadow-xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        {mockData.notifications.map((notif) => {
          const Icon = iconMap[notif.type] || Bell;
          return (
            <div
              key={notif.id}
              className={`flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-b-0 ${
                !notif.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                !notif.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notif.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formatRelativeDate(notif.createdAt)}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
