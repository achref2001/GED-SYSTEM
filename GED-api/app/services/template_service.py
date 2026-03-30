import uuid
import shutil
import hashlib
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.document_template import DocumentTemplate, DocumentTemplateVersion
from app.models.document import Document
from app.models.audit import AuditLog
from app.services.storage import StorageService

storage_service = StorageService()

class TemplateService:
    @staticmethod
    async def create_document_from_template(db: AsyncSession, template_id: int, req, user_id: int) -> Document:
        query = await db.execute(
            select(DocumentTemplate)
            .options(selectinload(DocumentTemplate.versions))
            .filter(DocumentTemplate.id == template_id, DocumentTemplate.is_active == True)
        )
        template = query.scalars().first()
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Validate required metadata
        provided_metadata = req.metadata_json or {}
        if template.required_metadata_fields:
            missing_fields = [f for f in template.required_metadata_fields if f not in provided_metadata]
            if missing_fields:
                raise HTTPException(status_code=422, detail=f"Missing required metadata fields: {missing_fields}")
        
        # Merge metadata
        merged_metadata = template.default_metadata.copy() if template.default_metadata else {}
        merged_metadata.update(provided_metadata)
        
        # Copy file if it exists
        new_file_path = None
        file_hash = None
        if template.file_path:
            # We would typically copy the file on disk or object storage.
            # Assuming StorageService has a copy mechanism or we do it manually if local.
            # For this example, we'll read and rewrite the existing file, or use storage_service.
            content, mime = await storage_service.get_file(template.file_path)
            if isinstance(content, bytes):
                # Write to tmp and upload again to storage service
                import tempfile
                with tempfile.NamedTemporaryFile(delete=False) as f:
                    f.write(content)
                    tmp_name = f.name
                
                # Mock an UploadFile
                from fastapi import UploadFile
                with open(tmp_name, "rb") as bf:
                    uf = UploadFile(file=bf, filename=f"{req.document_name}.docx", size=len(content))
                    new_file_path = await storage_service.upload_file(uf)
                
                import os
                os.unlink(tmp_name)

                # Compute hash
                h = hashlib.sha256()
                h.update(content)
                file_hash = h.hexdigest()

        # Create Document record
        document = Document(
            name=req.document_name,
            file_path=new_file_path or "",
            file_size=len(content) if template.file_path and isinstance(content, bytes) else 0,
            mime_type="application/octet-stream", # Infer from extension normally
            folder_id=req.folder_id or template.default_folder_id,
            uploaded_by_id=user_id,
            metadata_json=merged_metadata,
            file_hash=file_hash,
            hash_algorithm='sha256'
        )
        
        db.add(document)
        await db.flush()
        
        # Audit log
        audit = AuditLog(user_id=user_id, action="CREATE_FROM_TEMPLATE", document_id=document.id)
        db.add(audit)
        
        await db.commit()
        await db.refresh(document)
        return document
