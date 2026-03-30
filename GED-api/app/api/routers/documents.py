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

from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.schemas.document import DuplicateCheckRequest, DuplicateCheckResponse

@router.post("/check-duplicate", response_model=APIResponse[DuplicateCheckResponse])
async def check_duplicate(
    req: DuplicateCheckRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await DocumentService.check_duplicate(db, req.file_hash)
    if doc:
        # Pydantic serialization might be needed, or we just return the ORM object since APIResponse is generic
        return APIResponse(
            success=False,
            error="DUPLICATE_FILE",
            message="This file already exists",
            data=DuplicateCheckResponse(is_duplicate=True, existing_document=doc).model_dump()
        )
    return success_response(DuplicateCheckResponse(is_duplicate=False))


@router.post("/upload", response_model=APIResponse[DocumentResponse])
async def upload_document(
    file: UploadFile = File(...),
    folder_id: Optional[int] = Form(None),
    force: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        doc = await DocumentService.upload_document(db, file, folder_id, current_user.id, force)
        return success_response(doc)
    except HTTPException as e:
        if e.status_code == 409:
            data_dump = e.detail.get("data", {})
            # Existing doc needs to be serialized to a dict if it is an ORM object
            if "existing_document" in data_dump:
                data_dump["existing_document"] = DocumentResponse.model_validate(data_dump["existing_document"]).model_dump(mode="json")
                
            return JSONResponse(
                status_code=409,
                content={
                    "success": False,
                    "error": e.detail.get("error"),
                    "message": e.detail.get("message"),
                    "data": data_dump
                }
            )
        raise e

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

from app.services.view_tracking_service import ViewTrackingService

@router.get("/{id}", response_model=APIResponse[DocumentResponse])
async def get_document(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
    
    # Record view history
    await ViewTrackingService.record_view(db, current_user.id, id)
    
    return success_response(doc)

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


from app.schemas.bulk import BulkMoveRequest, BulkDeleteRequest, BulkDownloadRequest, BulkTagRequest, BulkOperationResponse
from fastapi.responses import StreamingResponse

@router.post("/bulk/move", response_model=APIResponse[BulkOperationResponse])
async def bulk_move(
    req: BulkMoveRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(req.document_ids) > 100:
        raise HTTPException(status_code=400, detail="Max bulk size is 100")
    result = await DocumentService.bulk_move(db, req.document_ids, req.target_folder_id, current_user.id)
    return success_response(result)

@router.post("/bulk/delete", response_model=APIResponse[BulkOperationResponse])
async def bulk_delete(
    req: BulkDeleteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(req.document_ids) > 100:
        raise HTTPException(status_code=400, detail="Max bulk size is 100")
    result = await DocumentService.bulk_delete(db, req.document_ids, current_user.id)
    return success_response(result)

@router.post("/bulk/download")
async def bulk_download(
    req: BulkDownloadRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(req.document_ids) > 100:
        raise HTTPException(status_code=400, detail="Max bulk size is 100")
    
    stream, filename = await DocumentService.bulk_download(db, req.document_ids, current_user.id)
    return StreamingResponse(
        stream,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/bulk/tag", response_model=APIResponse[BulkOperationResponse])
async def bulk_tag(
    req: BulkTagRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(req.document_ids) > 100:
        raise HTTPException(status_code=400, detail="Max bulk size is 100")
from datetime import datetime

@router.patch("/{id}/expiry", response_model=APIResponse[DocumentResponse])
async def set_expiry(
    id: int,
    expires_at: Optional[datetime],
    expiry_action: str = 'notify',
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if expires_at and expires_at < datetime.now().astimezone():
        raise HTTPException(status_code=400, detail="Expiry time must be in the future")
    
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
        
    doc.expires_at = expires_at
    if expiry_action in ['notify', 'archive', 'delete']:
        doc.expiry_action = expiry_action
        
    from app.models.audit import AuditLog
    db.add(AuditLog(user_id=current_user.id, action="SET_EXPIRY", document_id=doc.id))
    await db.commit()
    await db.refresh(doc)
    return success_response(doc)

@router.get("/expiring-soon", response_model=APIResponse[List[DocumentResponse]])
async def expiring_soon(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy import select
    from datetime import timedelta
    
    threshold = datetime.now().astimezone() + timedelta(days=days)
    now = datetime.now().astimezone()
    
    # Query documents where expires_at is between now and threshold
    result = await db.execute(
        select(Document).filter(
            Document.expires_at >= now,
            Document.expires_at <= threshold,
            Document.is_deleted == False,
            Document.is_archived == False
        )
    )
    docs = result.scalars().all()
    return success_response(docs)

@router.post("/{id}/archive", response_model=APIResponse[DocumentResponse])
async def archive_document(
    id: int,
    reason: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
        
    doc.is_archived = True
    doc.archived_at = datetime.now().astimezone()
    doc.archived_by = current_user.email
    doc.archive_reason = reason
    
    from app.models.audit import AuditLog
    db.add(AuditLog(user_id=current_user.id, action="ARCHIVE", document_id=doc.id))
    await db.commit()
    await db.refresh(doc)
    return success_response(doc)

@router.post("/{id}/restore", response_model=APIResponse[DocumentResponse])
async def restore_document(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
        
    doc.is_archived = False
    doc.archived_at = None
    doc.archived_by = None
    doc.archive_reason = None
    
    from app.models.audit import AuditLog
    db.add(AuditLog(user_id=current_user.id, action="RESTORE_FROM_ARCHIVE", document_id=doc.id))
    await db.commit()
@router.post("/{id}/checkout", response_model=APIResponse[dict])
async def checkout_document(
    id: int,
    reason: Optional[str] = Form(None),
    lock_duration_hours: int = Form(8),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from datetime import timedelta
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
        
    if doc.is_locked and doc.locked_by_id != current_user.id:
        return JSONResponse(
            status_code=423,
            content={
                "success": False,
                "error": "DOCUMENT_LOCKED",
                "message": f"Document is locked by another user",
                "data": {"locked_by_id": doc.locked_by_id, "locked_at": doc.locked_at.isoformat() if doc.locked_at else None, "lock_expires_at": doc.lock_expires_at.isoformat() if doc.lock_expires_at else None}
            }
        )
        
    doc.is_locked = True
    doc.locked_by_id = current_user.id
    doc.locked_at = datetime.now().astimezone()
    doc.lock_expires_at = datetime.now().astimezone() + timedelta(hours=min(lock_duration_hours, 72))
    doc.lock_reason = reason
    
    db.add(AuditLog(user_id=current_user.id, action="CHECKOUT", document_id=doc.id))
    await db.commit()
    await db.refresh(doc)
    
    return success_response({"document": DocumentResponse.model_validate(doc).model_dump(mode="json"), "lock_expires_at": doc.lock_expires_at})


@router.post("/{id}/checkin", response_model=APIResponse[DocumentResponse])
async def checkin_document(
    id: int,
    file: Optional[UploadFile] = File(None),
    comment: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
        
    if doc.is_locked and doc.locked_by_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only the locker or admin can check in this document")
        
    if file:
        file_path = await storage_service.upload_file(file)
        doc.current_version += 1
        
        from app.models.document import DocumentVersion
        version = DocumentVersion(
            document_id=doc.id,
            version_number=doc.current_version,
            file_path=file_path,
            uploaded_by_id=current_user.id
        )
        db.add(version)
        
        doc.file_path = file_path
        doc.file_size = file.size if file.size else 1024
        doc.mime_type = file.content_type or doc.mime_type
        # If we hash, we should rehash here, but omitted for simplicity directly in endpoint
        
    doc.is_locked = False
    doc.locked_by_id = None
    doc.locked_at = None
    doc.lock_expires_at = None
    doc.lock_reason = None
    
    db.add(AuditLog(user_id=current_user.id, action="CHECKIN", document_id=doc.id))
    await db.commit()
    await db.refresh(doc)
    return success_response(doc)


@router.post("/{id}/force-unlock", response_model=APIResponse[DocumentResponse])
async def force_unlock_document(
    id: int,
    reason: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can force unlock")
        
    doc = await document_repo.get(db, id)
    if not doc:
        return APIResponse(success=False, message="Document not found")
        
    doc.is_locked = False
    doc.locked_by_id = None
    doc.locked_at = None
    doc.lock_expires_at = None
    doc.lock_reason = None
    
    db.add(AuditLog(user_id=current_user.id, action="FORCE_UNLOCK", document_id=doc.id))
    # Notify logic would go here
    
    await db.commit()
    await db.refresh(doc)
    return success_response(doc)

@router.get("/status/locked", response_model=APIResponse[List[DocumentResponse]])
async def get_locked_documents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy import select
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only")
        
    result = await db.execute(
        select(Document).filter(Document.is_locked == True)
    )
    docs = result.scalars().all()
    return success_response(docs)


