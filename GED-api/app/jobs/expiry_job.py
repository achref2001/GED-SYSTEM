import asyncio
import logging
from datetime import datetime, timezone
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.document import Document, DocumentExpiryAction
from app.models.audit import AuditLog

logger = logging.getLogger(__name__)

async def process_expired_documents():
    async with AsyncSessionLocal() as db:
        now = datetime.now(timezone.utc)
        
        # Select documents that have expired but are not yet deleted or archived
        query = select(Document).filter(
            Document.expires_at <= now,
            Document.is_deleted == False,
            Document.is_archived == False
        )
        
        result = await db.execute(query)
        expired_docs = result.scalars().all()
        
        logger.info(f"Processing {len(expired_docs)} expired documents...")
        
        for doc in expired_docs:
            try:
                if doc.expiry_action == DocumentExpiryAction.NOTIFY:
                    # Notify owner logic (email sending omitted, but update last notified)
                    doc.expiry_notified_at = now
                    # Log
                    db.add(AuditLog(user_id=1, action="AUTO_NOTIFY_EXPIRED", document_id=doc.id))
                
                elif doc.expiry_action == DocumentExpiryAction.ARCHIVE:
                    doc.is_archived = True
                    doc.archived_at = now
                    doc.archive_reason = "auto-expired"
                    db.add(AuditLog(user_id=1, action="AUTO_ARCHIVE", document_id=doc.id))
                
                elif doc.expiry_action == DocumentExpiryAction.DELETE:
                    doc.is_deleted = True
                    db.add(AuditLog(user_id=1, action="AUTO_DELETE_EXPIRED", document_id=doc.id))
                    
                await db.commit()
            except Exception as e:
                logger.error(f"Error processing expired doc {doc.id}: {e}")
                await db.rollback()
                
        logger.info("Expiration job complete.")
