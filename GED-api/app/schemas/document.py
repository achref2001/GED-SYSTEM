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

    model_config = ConfigDict(from_attributes=True)

class DocumentVersionResponse(BaseModel):
    id: int
    document_id: int
    version_number: int
    file_path: str
    uploaded_by_id: int
    uploaded_at: datetime
    metadata_json: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
