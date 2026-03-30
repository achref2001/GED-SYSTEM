from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, delete
from sqlalchemy.orm import joinedload
from app.models.user_favorite import UserFavorite
from app.models.audit import AuditLog
from fastapi import HTTPException

class FavoriteService:
    @staticmethod
    async def add_favorite(db: AsyncSession, user_id: int, document_id: Optional[int] = None, folder_id: Optional[int] = None, note: Optional[str] = None) -> UserFavorite:
        # Check if already exists
        query = select(UserFavorite).filter(UserFavorite.user_id == user_id)
        if document_id:
            query = query.filter(UserFavorite.document_id == document_id)
        elif folder_id:
            query = query.filter(UserFavorite.folder_id == folder_id)
        
        existing = await db.execute(query)
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="Already in favorites")

        favorite = UserFavorite(
            user_id=user_id,
            document_id=document_id,
            folder_id=folder_id,
            note=note
        )
        db.add(favorite)
        
        # Audit
        db.add(AuditLog(user_id=user_id, action="ADD_FAVORITE", document_id=document_id))
        
        await db.commit()
        await db.refresh(favorite)
        return favorite

    @staticmethod
    async def remove_favorite(db: AsyncSession, user_id: int, document_id: Optional[int] = None, folder_id: Optional[int] = None):
        query = delete(UserFavorite).filter(UserFavorite.user_id == user_id)
        if document_id:
            query = query.filter(UserFavorite.document_id == document_id)
        elif folder_id:
            query = query.filter(UserFavorite.folder_id == folder_id)
            
        await db.execute(query)
        db.add(AuditLog(user_id=user_id, action="REMOVE_FAVORITE", document_id=document_id))
        await db.commit()

    @staticmethod
    async def get_favorites(db: AsyncSession, user_id: int, fav_type: str = "all") -> dict:
        query = select(UserFavorite).filter(UserFavorite.user_id == user_id).order_by(UserFavorite.added_at.desc())
        
        if fav_type == "documents":
            query = query.filter(UserFavorite.document_id.isnot(None)).options(joinedload(UserFavorite.document))
        elif fav_type == "folders":
            query = query.filter(UserFavorite.folder_id.isnot(None)).options(joinedload(UserFavorite.folder))
        else:
            query = query.options(joinedload(UserFavorite.document), joinedload(UserFavorite.folder))
            
        result = await db.execute(query)
        favorites = result.scalars().all()
        
        docs = [f for f in favorites if f.document_id]
        folders = [f for f in favorites if f.folder_id]
        
        return {
            "documents": docs,
            "folders": folders,
            "total": len(favorites)
        }
