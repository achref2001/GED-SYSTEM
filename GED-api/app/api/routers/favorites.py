from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_db
from app.core.response import APIResponse, success_response
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.favorite import FavoriteResponse, FavoritesListResponse, FavoriteCheckResponse, AddFavoriteRequest, UpdateFavoriteRequest
from app.services.favorite_service import FavoriteService

router = APIRouter()

@router.post("/documents/{document_id}", response_model=APIResponse[FavoriteResponse])
async def add_document_favorite(
    document_id: int,
    req: AddFavoriteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fav = await FavoriteService.add_favorite(db, current_user.id, document_id=document_id, note=req.note)
    return success_response(fav)

@router.post("/folders/{folder_id}", response_model=APIResponse[FavoriteResponse])
async def add_folder_favorite(
    folder_id: int,
    req: AddFavoriteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fav = await FavoriteService.add_favorite(db, current_user.id, folder_id=folder_id, note=req.note)
    return success_response(fav)

@router.delete("/documents/{document_id}", response_model=APIResponse)
async def remove_document_favorite(
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await FavoriteService.remove_favorite(db, current_user.id, document_id=document_id)
    return success_response(message="Removed from favorites")

@router.delete("/folders/{folder_id}", response_model=APIResponse)
async def remove_folder_favorite(
    folder_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await FavoriteService.remove_favorite(db, current_user.id, folder_id=folder_id)
    return success_response(message="Removed from favorites")

@router.get("", response_model=APIResponse[FavoritesListResponse])
async def list_favorites(
    type: str = Query("all", regex="^(all|documents|folders)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favs = await FavoriteService.get_favorites(db, current_user.id, fav_type=type)
    return success_response(favs)

@router.patch("/documents/{document_id}", response_model=APIResponse[FavoriteResponse])
async def update_favorite_note(
    document_id: int,
    req: UpdateFavoriteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.user_favorite import UserFavorite
    from sqlalchemy import select
    
    query = select(UserFavorite).filter(UserFavorite.user_id == current_user.id, UserFavorite.document_id == document_id)
    res = await db.execute(query)
    fav = res.scalars().first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
        
    fav.note = req.note
    await db.commit()
    await db.refresh(fav)
    return success_response(fav)

@router.get("/check/documents/{document_id}", response_model=APIResponse[FavoriteCheckResponse])
async def check_document_favorite(
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.user_favorite import UserFavorite
    from sqlalchemy import select
    
    query = select(UserFavorite).filter(UserFavorite.user_id == current_user.id, UserFavorite.document_id == document_id)
    res = await db.execute(query)
    fav = res.scalars().first()
    
    if fav:
        return success_response(FavoriteCheckResponse(is_favorite=True, note=fav.note, added_at=fav.added_at))
    return success_response(FavoriteCheckResponse(is_favorite=False))

@router.get("/check/folders/{folder_id}", response_model=APIResponse[FavoriteCheckResponse])
async def check_folder_favorite(
    folder_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.user_favorite import UserFavorite
    from sqlalchemy import select
    
    query = select(UserFavorite).filter(UserFavorite.user_id == current_user.id, UserFavorite.folder_id == folder_id)
    res = await db.execute(query)
    fav = res.scalars().first()
    
    if fav:
        return success_response(FavoriteCheckResponse(is_favorite=True, note=fav.note, added_at=fav.added_at))
    return success_response(FavoriteCheckResponse(is_favorite=False))
