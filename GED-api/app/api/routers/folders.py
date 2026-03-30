from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.core.response import APIResponse, success_response
from app.schemas.folder import FolderResponse, FolderCreate, FolderUpdate
from app.models.user import User
from app.api.deps import get_current_user
from app.repositories.folder import folder_repo
from app.models.folder import Folder
from sqlalchemy import select

router = APIRouter()

@router.post("", response_model=APIResponse[FolderResponse])
async def create_folder(folder_in: FolderCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_folder = Folder(**folder_in.model_dump(), created_by_id=current_user.id)
    db.add(db_folder)
    await db.commit()
    await db.refresh(db_folder)
    return success_response(db_folder)

from sqlalchemy.orm import selectinload
from app.schemas.folder import FolderResponse, FolderCreate, FolderUpdate, FolderTreeResponse, BreadcrumbItem

@router.get("/tree", response_model=APIResponse[List[FolderTreeResponse]])
async def get_folder_tree(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Select root folders and eagerly load their children
    result = await db.execute(
        select(Folder)
        .where(Folder.parent_id == None)
        .options(selectinload(Folder.subfolders))
    )
    folders = result.scalars().all()
    return success_response(list(folders))

@router.get("/{id}/breadcrumb", response_model=APIResponse[List[BreadcrumbItem]])
async def get_folder_breadcrumb(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    breadcrumb = []
    current_id = id
    
    while current_id:
        folder = await db.get(Folder, current_id)
        if not folder:
            break
        breadcrumb.insert(0, {"id": folder.id, "name": folder.name})
        current_id = folder.parent_id
        
    return success_response(breadcrumb)

@router.get("", response_model=APIResponse[List[FolderResponse]])
async def get_folders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Select root folders and eagerly load their children
    result = await db.execute(
        select(Folder)
        .where(Folder.parent_id == None)
        .options(selectinload(Folder.subfolders))
    )
    folders = result.scalars().all()
    return success_response(list(folders))

@router.get("/{id}", response_model=APIResponse[FolderResponse])
async def get_folder_by_id(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    folder = await db.get(Folder, id)
    if not folder:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Folder not found")
    return success_response(folder)
