from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.response import APIResponse, success_response
from app.schemas.tag import TagCreate, TagResponse
from app.models.tag import Tag
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=APIResponse[List[TagResponse]])
async def get_all_tags(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Tag).order_by(Tag.name))
    tags = result.scalars().all()
    return success_response(tags)

@router.post("", response_model=APIResponse[TagResponse])
async def create_tag(
    tag_in: TagCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if tag exists
    result = await db.execute(select(Tag).where(Tag.name == tag_in.name))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Tag already exists")
    
    tag = Tag(name=tag_in.name)
    db.add(tag)
    await db.commit()
    await db.refresh(tag)
    return success_response(tag)

@router.delete("/{tag_id}", response_model=APIResponse)
async def delete_tag(
    tag_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Tag).where(Tag.id == tag_id))
    tag = result.scalars().first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    await db.delete(tag)
    await db.commit()
    return success_response(message=f"Tag deleted successfully")
