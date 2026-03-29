from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_db
from app.core.response import APIResponse, success_response, Pagination
from app.schemas.document import DocumentResponse
from app.models.user import User
from app.api.deps import get_current_user
from app.services.document import DocumentService
from app.repositories.document import document_repo
from fastapi.responses import Response
from app.services.storage import StorageService

router = APIRouter()
storage_service = StorageService()

@router.post("/upload", response_model=APIResponse[DocumentResponse])
async def upload_document(
    file: UploadFile = File(...),
    folder_id: Optional[int] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await DocumentService.upload_document(db, file, folder_id, current_user.id)
    return success_response(doc)

@router.get("", response_model=APIResponse[List[DocumentResponse]])
async def list_documents(
    folder_id: Optional[int] = None,
    q: Optional[str] = None,
    page: int = 1,
    size: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skip = (page - 1) * size
    total, docs = await document_repo.search(db, folder_id, q, skip, size)
    return success_response(docs, pagination=Pagination.create(total, page, size))

@router.get("/{id}/download")
async def download_document(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
    
    content, mime = await storage_service.get_file(doc.file_path)
    return Response(content=content, media_type=mime, headers={"Content-Disposition": f"attachment; filename={doc.name}"})

@router.delete("/{id}", response_model=APIResponse)
async def delete_document(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await document_repo.get(db, id)
    if doc:
        doc.is_deleted = True
        await db.commit()
    return success_response(message="Document soft deleted")
