from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import RoleEnum

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: RoleEnum = RoleEnum.VIEWER
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AuthUserProfile(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    effective_role: str
    permissions: list[str] = []
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None
    user: Optional[AuthUserProfile] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None
