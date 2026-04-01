from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from jose import jwt, JWTError
from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import UnauthorizedException
from app.models.user import User
from app.services.auth_service import get_user_by_id
from app.services.rbac_service import RBACService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")
rbac_service = RBACService()

async def get_current_user(db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise UnauthorizedException()
    except JWTError:
        raise UnauthorizedException()
    user = await get_user_by_id(db, int(user_id))
    if user is None:
        raise UnauthorizedException()
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise UnauthorizedException("Inactive user")
    return current_user


def require_permission(permission: str):
    async def checker(current_user: User = Depends(get_current_user)) -> User:
        fallback_role = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
        user_permissions = rbac_service.get_user_permissions(current_user.id, fallback_role)
        if permission not in user_permissions:
            raise HTTPException(status_code=403, detail=f"Missing permission: {permission}")
        return current_user

    return checker
