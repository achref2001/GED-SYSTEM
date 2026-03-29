from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document, DocumentVersion
from app.models.audit import AuditLog
from app.schemas.document import DocumentResponse
from app.services.storage import StorageService
from typing import Optional

storage_service = StorageService()

class DocumentService:
    @staticmethod
    async def upload_document(db: AsyncSession, file: UploadFile, folder_id: Optional[int], user_id: int) -> Document:
        file_path = await storage_service.upload_file(file)
        
        file_size = file.size if file.size else 1024 
        
        document = Document(
            name=file.filename,
            file_path=file_path,
            file_size=file_size,
            mime_type=file.content_type or "application/octet-stream",
            folder_id=folder_id,
            uploaded_by_id=user_id
        )
        db.add(document)
        await db.flush()

        version = DocumentVersion(
            document_id=document.id,
            version_number=1,
            file_path=file_path,
            uploaded_by_id=user_id
        )
        db.add(version)

        audit = AuditLog(user_id=user_id, action="UPLOAD", document_id=document.id)
        db.add(audit)

        await db.commit()
        await db.refresh(document)
        return document
