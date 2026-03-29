from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.repositories.base import BaseRepository
from app.models.document import Document
from app.schemas.document import DocumentUpdate, DocumentBase

class DocumentRepository(BaseRepository[Document, DocumentBase, DocumentUpdate]):
    async def search(self, db: AsyncSession, folder_id: Optional[int], q: Optional[str], skip: int, limit: int) -> tuple[int, List[Document]]:
        query = select(Document).where(Document.is_deleted == False)
        if folder_id is not None:
            query = query.where(Document.folder_id == folder_id)
        if q:
            query = query.where(
                or_(
                    Document.name.ilike(f"%{q}%"),
                    Document.description.ilike(f"%{q}%")
                )
            )
        
        result_all = await db.execute(select(Document).where(Document.is_deleted == False))
        total = len(list(result_all.scalars().all()))

        query = query.order_by(desc(Document.uploaded_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return total, list(result.scalars().all())

document_repo = DocumentRepository(Document)
