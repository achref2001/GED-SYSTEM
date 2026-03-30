from typing import List, Optional
from pydantic import BaseModel, Field

class BulkMoveRequest(BaseModel):
    document_ids: List[int] = Field(..., min_length=1, max_length=100)
    target_folder_id: int

class BulkDeleteRequest(BaseModel):
    document_ids: List[int] = Field(..., min_length=1, max_length=100)

class BulkDownloadRequest(BaseModel):
    document_ids: List[int] = Field(..., min_length=1, max_length=100)

class BulkTagRequest(BaseModel):
    document_ids: List[int] = Field(..., min_length=1, max_length=100)
    add_tags: List[str] = Field(default_factory=list)
    remove_tags: List[str] = Field(default_factory=list)

class FailedItem(BaseModel):
    id: int
    reason: str

class BulkOperationResponse(BaseModel):
    success: bool
    moved: Optional[List[int]] = None
    deleted: Optional[List[int]] = None
    updated: Optional[List[int]] = None
    failed: List[FailedItem] = Field(default_factory=list)
    total: int
