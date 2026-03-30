from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime

class TemplateVersionResponse(BaseModel):
    id: int
    template_id: int
    version_number: int
    file_path: str
    uploaded_by_id: int
    uploaded_at: datetime
    changelog: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class TemplateResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    file_path: Optional[str] = None
    file_hash: Optional[str] = None
    category: Optional[str] = None
    default_folder_id: Optional[int] = None
    default_tags: Optional[List[str]] = None
    default_metadata: Optional[Dict[str, Any]] = None
    required_metadata_fields: Optional[List[str]] = None
    
    created_by_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    versions: Optional[List[TemplateVersionResponse]] = None

    model_config = ConfigDict(from_attributes=True)

class DocumentCreateFromTemplate(BaseModel):
    document_name: str
    folder_id: Optional[int] = None
    metadata_json: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
