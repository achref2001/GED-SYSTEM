from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    document_id: Optional[int]
    timestamp: datetime
    ip_address: Optional[str]

    model_config = ConfigDict(from_attributes=True)
