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

@router.get("", response_model=APIResponse[List[FolderResponse]])
async def get_folders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Folder).where(Folder.parent_id == None))
    folders = result.scalars().all()
    return success_response(list(folders))
