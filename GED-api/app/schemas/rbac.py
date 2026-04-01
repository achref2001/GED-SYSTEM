from pydantic import BaseModel, Field
from typing import Dict, List


class RoleUpsertRequest(BaseModel):
    name: str = Field(min_length=2, max_length=64)
    permissions: List[str] = Field(default_factory=list)


class UserRoleAssignRequest(BaseModel):
    role_name: str


class RoleListResponse(BaseModel):
    roles: Dict[str, List[str]]


class PermissionListResponse(BaseModel):
    permissions: List[str]

