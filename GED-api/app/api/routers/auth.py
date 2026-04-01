from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.core.response import APIResponse, success_response, error_response
from app.schemas.user import UserResponse, UserCreate, Token, AuthUserProfile
from app.models.user import User
from app.services.auth_service import get_user_by_email
from app.services.rbac_service import RBACService
from app.api.deps import get_current_user

router = APIRouter()
rbac_service = RBACService()

@router.post("/register", response_model=APIResponse[UserResponse])
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, user_in.email)
    if user:
        return error_response("Email already registered")
    
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return success_response(new_user)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.id)
    fallback_role = user.role.value if hasattr(user.role, "value") else str(user.role)
    effective_role = rbac_service.get_user_effective_role(user.id, fallback_role)
    permissions = rbac_service.get_permissions_for_role(effective_role)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": AuthUserProfile(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=fallback_role,
            effective_role=effective_role,
            permissions=permissions,
            is_active=user.is_active,
            created_at=user.created_at,
        ),
    }


@router.get("/me", response_model=APIResponse[AuthUserProfile])
async def me(current_user: User = Depends(get_current_user)):
    fallback_role = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
    effective_role = rbac_service.get_user_effective_role(current_user.id, fallback_role)
    permissions = rbac_service.get_permissions_for_role(effective_role)
    return success_response(
        AuthUserProfile(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            role=fallback_role,
            effective_role=effective_role,
            permissions=permissions,
            is_active=current_user.is_active,
            created_at=current_user.created_at,
        )
    )
