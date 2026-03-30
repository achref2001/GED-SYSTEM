import { Document } from './document'

export interface RecentlyViewedItem {
  document: Document
  last_viewed_at: string
  view_count: number
}

export interface MostViewedItem {
  document: Document
  total_views: number
  unique_viewers: number
  last_viewed_at: string
}
