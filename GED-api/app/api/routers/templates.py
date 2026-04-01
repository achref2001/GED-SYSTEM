from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.core.database import get_db
from app.core.response import APIResponse, success_response, Pagination
from app.api.deps import get_current_user
from app.models.user import User
from app.models.document_template import DocumentTemplate, DocumentTemplateVersion
from app.schemas.template import TemplateResponse, TemplateVersionResponse, DocumentCreateFromTemplate
from app.services.template_service import TemplateService
from app.services.storage import StorageService
from app.services.system_settings import SystemSettingsService

router = APIRouter()
storage_service = StorageService()
settings_service = SystemSettingsService()

@router.post("", response_model=APIResponse[TemplateResponse])
async def create_template(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    default_folder_id: Optional[int] = Form(None),
    # Default tags/metadata simplified for initial implementation as string inputs or JSON
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["ADMIN", "MANAGER"]:
        raise HTTPException(status_code=403, detail="Permissions denied")

    ext = ""
    if file.filename and "." in file.filename:
        ext = "." + file.filename.rsplit(".", 1)[-1].lower()
    allowed = settings_service.get_allowed_extensions()
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '{ext or '(none)'}' is not allowed. Allowed: {', '.join(allowed)}",
        )
        
    file_path = await storage_service.upload_file(file)
    content, _ = await storage_service.get_file(file_path)
    
    import hashlib
    h = hashlib.sha256()
    h.update(content)
    file_hash = h.hexdigest()

    template = DocumentTemplate(
        name=name,
        description=description,
        file_path=file_path,
        file_hash=file_hash,
        category=category,
        default_folder_id=default_folder_id,
        created_by_id=current_user.id
    )
    db.add(template)
    await db.flush()

    # Initial version
    version = DocumentTemplateVersion(
        template_id=template.id,
        version_number=1,
        file_path=file_path,
        uploaded_by_id=current_user.id,
        changelog="Initial upload"
    )
    db.add(version)
    
    await db.commit()
    await db.refresh(template)
    return success_response(template)

@router.get("", response_model=APIResponse[List[TemplateResponse]])
async def list_templates(
    category: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 1,
    size: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(DocumentTemplate).filter(DocumentTemplate.is_active == True)
    if category:
        query = query.filter(DocumentTemplate.category == category)
    if q:
        query = query.filter(DocumentTemplate.name.ilike(f"%{q}%"))
        
    res = await db.execute(query.offset((page - 1) * size).limit(size))
    templates = res.scalars().all()
    return success_response(templates)

@router.get("/{id}", response_model=APIResponse[TemplateResponse])
async def get_template(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(DocumentTemplate).options(selectinload(DocumentTemplate.versions)).filter(DocumentTemplate.id == id)
    res = await db.execute(query)
    template = res.scalars().first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return success_response(template)

@router.post("/{id}/create-document", response_model=APIResponse)
async def create_from_template(
    id: int,
    req: DocumentCreateFromTemplate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = await TemplateService.create_document_from_template(db, id, req, current_user.id)
    # Circular dependency workaround or just return success with id
    return success_response({"id": doc.id, "name": doc.name}, message="Document created from template")
