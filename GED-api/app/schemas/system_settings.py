from pydantic import BaseModel, Field
from typing import List


class UploadPolicyResponse(BaseModel):
    allowed_extensions: List[str] = Field(default_factory=list)


class UploadPolicyUpdateRequest(BaseModel):
    allowed_extensions: List[str] = Field(default_factory=list, min_length=1)

