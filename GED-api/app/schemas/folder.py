from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    parent_id: Optional[int] = None

class FolderUpdate(FolderBase):
    name: Optional[str] = None
    parent_id: Optional[int] = None

class FolderResponse(FolderBase):
    id: int
    name: str
    parent_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    created_by_id: int

    model_config = ConfigDict(from_attributes=True)

class FolderTreeResponse(FolderResponse):
    subfolders: List['FolderTreeResponse'] = []
    
    model_config = ConfigDict(from_attributes=True)
