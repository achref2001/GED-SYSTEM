from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_db
from app.core.response import APIResponse, success_response
from app.api.deps import get_current_user
from app.models.user import User
from app.services.view_tracking_service import ViewTrackingService
from app.schemas.document import DocumentResponse

router = APIRouter()

@router.get("", response_model=APIResponse[List[dict]])
async def get_recently_viewed(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    views = await ViewTrackingService.get_recently_viewed(db, current_user.id, limit=limit)
    # Manual serialization since it is a list of dicts with ORM objects
    return success_response([
        {
            "document": DocumentResponse.model_validate(v["document"]),
            "last_viewed_at": v["last_viewed_at"],
            "view_count": v["view_count"]
        }
        for v in views
    ])

@router.delete("", response_model=APIResponse)
async def clear_recently_viewed(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.document_view import DocumentView
    from sqlalchemy import delete
    
    await db.execute(delete(DocumentView).filter(DocumentView.user_id == current_user.id))
    await db.commit()
    return success_response(message="History cleared")

@router.delete("/{document_id}", response_model=APIResponse)
async def remove_specific_view(
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.document_view import DocumentView
    from sqlalchemy import delete
    
    await db.execute(delete(DocumentView).filter(DocumentView.user_id == current_user.id, DocumentView.document_id == document_id))
    await db.commit()
    return success_response(message="Entry removed")

@router.get("/admin/most-viewed")
async def get_most_viewed(
    limit: int = 20,
    period: str = "all",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only")
        
    views = await ViewTrackingService.get_most_viewed(db, limit=limit, period=period)
    return success_response([
        {
            "document": DocumentResponse.model_validate(v["document"]),
            "total_views": v["total_views"],
            "unique_viewers": v["unique_viewers"],
            "last_viewed_at": v["last_viewed_at"]
        }
        for v in views
    ])
