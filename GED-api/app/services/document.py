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
    async def _build_folder_segments(db: AsyncSession, folder_id: Optional[int]) -> list[str]:
        """Build nested folder path segments for storage from DB hierarchy."""
        if folder_id is None:
            return []

        from sqlalchemy import select
        from app.models.folder import Folder

        segments: list[str] = []
        current_id = folder_id
        while current_id:
            result = await db.execute(select(Folder).where(Folder.id == current_id))
            folder = result.scalars().first()
            if not folder:
                break
            segments.insert(0, folder.name)
            current_id = folder.parent_id
        return segments

    @staticmethod
    async def compute_file_hash(file: UploadFile) -> str:
        import hashlib
        h = hashlib.sha256()
        while True:
            chunk = await file.read(8192)
            if not chunk:
                break
            h.update(chunk)
        await file.seek(0)
        return h.hexdigest()

    @staticmethod
    async def check_duplicate(db: AsyncSession, file_hash: str) -> Optional[Document]:
        from sqlalchemy import select
        result = await db.execute(select(Document).filter(Document.file_hash == file_hash, Document.is_deleted == False))
        return result.scalars().first()

    @staticmethod
    async def upload_document(db: AsyncSession, file: UploadFile, folder_id: Optional[int], user_id: int, force: bool = False) -> Document:
        file_hash = await DocumentService.compute_file_hash(file)
        folder_segments = await DocumentService._build_folder_segments(db, folder_id)
        
        existing_doc = await DocumentService.check_duplicate(db, file_hash)
        if existing_doc:
            if not force:
                from fastapi import HTTPException, status
                # Standard HTTP exception for easy catching or raw response. Requirement says 409
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={"error": "DUPLICATE_FILE", "message": "This file already exists", "data": {"existing_document": existing_doc}}
                )
            else:
                # If force=True, create new version linked to existing doc
                file_path = await storage_service.upload_file(file, folder_segments=folder_segments)
                existing_doc.current_version += 1
                
                version = DocumentVersion(
                    document_id=existing_doc.id,
                    version_number=existing_doc.current_version,
                    file_path=file_path,
                    uploaded_by_id=user_id
                )
                db.add(version)
                audit = AuditLog(user_id=user_id, action="UPLOAD_NEW_VERSION", document_id=existing_doc.id)
                db.add(audit)
                await db.commit()
                await db.refresh(existing_doc)
                return existing_doc

        file_path = await storage_service.upload_file(file, folder_segments=folder_segments)
        
        file_size = file.size if file.size else 1024 
        
        document = Document(
            name=file.filename,
            file_path=file_path,
            file_size=file_size,
            mime_type=file.content_type or "application/octet-stream",
            folder_id=folder_id,
            uploaded_by_id=user_id,
            file_hash=file_hash,
            hash_algorithm='sha256'
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

    @staticmethod
    async def bulk_move(db: AsyncSession, document_ids: list[int], target_folder_id: int, user_id: int) -> dict:
        from sqlalchemy import select
        from app.models.folder import Folder
        
        target = await db.execute(select(Folder).filter(Folder.id == target_folder_id))
        if not target.scalars().first():
            return {"success": False, "moved": [], "failed": [{"id": d, "reason": "Target folder not found"} for d in document_ids], "total": len(document_ids)}

        result = {"success": True, "moved": [], "failed": [], "total": len(document_ids)}
        for doc_id in document_ids:
            try:
                doc = await db.execute(select(Document).filter(Document.id == doc_id, Document.is_deleted == False))
                doc = doc.scalars().first()
                if not doc:
                    result["failed"].append({"id": doc_id, "reason": "Not found"})
                    continue
                doc.folder_id = target_folder_id
                audit = AuditLog(user_id=user_id, action="BULK_MOVE", document_id=doc.id)
                db.add(audit)
                result["moved"].append(doc_id)
            except Exception as e:
                result["failed"].append({"id": doc_id, "reason": str(e)})
        
        await db.commit()
        return result

    @staticmethod
    async def bulk_delete(db: AsyncSession, document_ids: list[int], user_id: int) -> dict:
        from sqlalchemy import select
        result = {"success": True, "deleted": [], "failed": [], "total": len(document_ids)}
        for doc_id in document_ids:
            try:
                doc = await db.execute(select(Document).filter(Document.id == doc_id, Document.is_deleted == False))
                doc = doc.scalars().first()
                if not doc:
                    result["failed"].append({"id": doc_id, "reason": "Not found"})
                    continue
                doc.is_deleted = True
                audit = AuditLog(user_id=user_id, action="BULK_DELETE", document_id=doc.id)
                db.add(audit)
                result["deleted"].append(doc_id)
            except Exception as e:
                result["failed"].append({"id": doc_id, "reason": str(e)})
        
        await db.commit()
        return result

    @staticmethod
    async def bulk_download(db: AsyncSession, document_ids: list[int], user_id: int):
        import zipfile
        import tempfile
        import os
        from datetime import datetime
        from sqlalchemy import select

        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
        
        try:
            with zipfile.ZipFile(tmp_file, 'w', zipfile.ZIP_DEFLATED) as zf:
                for doc_id in document_ids:
                    doc = await db.execute(select(Document).filter(Document.id == doc_id, Document.is_deleted == False))
                    doc = doc.scalars().first()
                    if doc:
                        content, mime = await storage_service.get_file(doc.file_path)
                        if isinstance(content, bytes):
                            filename = f"{doc.name}_v{doc.current_version}.{doc.file_path.split('.')[-1]}"
                            zf.writestr(filename, content)
                            
                        audit = AuditLog(user_id=user_id, action="BULK_DOWNLOAD", document_id=doc.id)
                        db.add(audit)
            
            await db.commit()
        except Exception:
            os.unlink(tmp_file.name)
            raise

        async def stream_generator():
            try:
                with open(tmp_file.name, "rb") as f:
                    while chunk := f.read(8192):
                        yield chunk
            finally:
                os.unlink(tmp_file.name)

        filename = f"ged_export_{int(datetime.now().timestamp())}.zip"
        return stream_generator(), filename

    @staticmethod
    async def bulk_tag(db: AsyncSession, document_ids: list[int], add_tags: list[str], remove_tags: list[str], user_id: int) -> dict:
        from sqlalchemy import select
        from app.models.tag import Tag, DocumentTag
        
        result = {"success": True, "updated": [], "failed": [], "total": len(document_ids)}
        
        # Ensure add_tags exist
        added_tag_objs = []
        for tag_name in add_tags:
            tag_query = await db.execute(select(Tag).filter(Tag.name == tag_name))
            tag = tag_query.scalars().first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                await db.flush()
            added_tag_objs.append(tag)
            
        remove_tag_objs = []
        for tag_name in remove_tags:
            tag_query = await db.execute(select(Tag).filter(Tag.name == tag_name))
            tag = tag_query.scalars().first()
            if tag:
                remove_tag_objs.append(tag)

        for doc_id in document_ids:
            try:
                doc = await db.execute(select(Document).filter(Document.id == doc_id, Document.is_deleted == False))
                doc = doc.scalars().first()
                if not doc:
                    result["failed"].append({"id": doc_id, "reason": "Not found"})
                    continue
                
                for tag in added_tag_objs:
                    dt = await db.execute(select(DocumentTag).filter(DocumentTag.document_id == doc.id, DocumentTag.tag_id == tag.id))
                    if not dt.scalars().first():
                        db.add(DocumentTag(document_id=doc.id, tag_id=tag.id))
                
                for tag in remove_tag_objs:
                    dt = await db.execute(select(DocumentTag).filter(DocumentTag.document_id == doc.id, DocumentTag.tag_id == tag.id))
                    dt_obj = dt.scalars().first()
                    if dt_obj:
                        await db.delete(dt_obj)
                
                audit = AuditLog(user_id=user_id, action="BULK_TAG", document_id=doc.id)
                db.add(audit)
                result["updated"].append(doc_id)
            except Exception as e:
                result["failed"].append({"id": doc_id, "reason": str(e)})
                
        await db.commit()
        return result
