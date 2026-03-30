from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class DocumentBase(BaseModel):
    name: str
    description: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None

class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    folder_id: Optional[int] = None
    metadata_json: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: int
    file_path: str
    file_size: int
    mime_type: str
    folder_id: Optional[int]
    uploaded_by_id: int
    uploaded_at: datetime
    updated_at: Optional[datetime]
    is_deleted: bool
    status: str
    current_version: int

    file_hash: Optional[str] = None
    hash_algorithm: Optional[str] = None
    expires_at: Optional[datetime] = None
    expiry_action: str
    expiry_notified_at: Optional[datetime] = None
    is_archived: bool
    archived_at: Optional[datetime] = None
    archived_by: Optional[str] = None
    archive_reason: Optional[str] = None
    is_locked: bool
    locked_by_id: Optional[int] = None
    locked_at: Optional[datetime] = None
    lock_expires_at: Optional[datetime] = None
    lock_reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DuplicateCheckRequest(BaseModel):
    file_hash: str

class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    existing_document: Optional[DocumentResponse] = None

class DocumentVersionResponse(BaseModel):
    id: int
    document_id: int
    version_number: int
    file_path: str
    uploaded_by_id: int
    uploaded_at: datetime
    metadata_json: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
