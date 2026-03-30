from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.document import DocumentResponse
from app.schemas.folder import FolderResponse

class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    document_id: Optional[int] = None
    folder_id: Optional[int] = None
    added_at: datetime
    note: Optional[str] = None
    document: Optional[DocumentResponse] = None
    folder: Optional[FolderResponse] = None

    model_config = ConfigDict(from_attributes=True)

class FavoritesListResponse(BaseModel):
    documents: List[FavoriteResponse]
    folders: List[FavoriteResponse]
    total: int

class FavoriteCheckResponse(BaseModel):
    is_favorite: bool
    note: Optional[str] = None
    added_at: Optional[datetime] = None

class AddFavoriteRequest(BaseModel):
    note: Optional[str] = None

class UpdateFavoriteRequest(BaseModel):
    note: str
