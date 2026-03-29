from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.models.workflow import WorkflowStatus

class WorkflowResponse(BaseModel):
    id: int
    document_id: int
    status: WorkflowStatus
    reviewer_id: Optional[int]
    approver_id: Optional[int]
    comments: Optional[str]

    model_config = ConfigDict(from_attributes=True)

class WorkflowUpdate(BaseModel):
    status: Optional[WorkflowStatus] = None
    reviewer_id: Optional[int] = None
    approver_id: Optional[int] = None
    comments: Optional[str] = None
