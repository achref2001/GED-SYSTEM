import asyncio
import logging
from datetime import datetime, timezone
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.document import Document
from app.models.audit import AuditLog

logger = logging.getLogger(__name__)

async def release_expired_locks():
    async with AsyncSessionLocal() as db:
        now = datetime.now(timezone.utc)
        
        # Select documents that are locked and whose lock has expired
        query = select(Document).filter(
            Document.is_locked == True,
            Document.lock_expires_at <= now
        )
        
        result = await db.execute(query)
        locked_docs = result.scalars().all()
        
        logger.info(f"Releasing {len(locked_docs)} expired locks...")
        
        for doc in locked_docs:
            try:
                doc.is_locked = False
                doc.locked_by_id = None
                doc.locked_at = None
                doc.lock_expires_at = None
                doc.lock_reason = None
                
                db.add(AuditLog(user_id=1, action="AUTO_UNLOCK", document_id=doc.id))
                await db.commit()
            except Exception as e:
                logger.error(f"Error releasing lock for doc {doc.id}: {e}")
                await db.rollback()
                
        logger.info("Lock release job complete.")
