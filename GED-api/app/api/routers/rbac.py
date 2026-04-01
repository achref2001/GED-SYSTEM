from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.response import APIResponse, success_response
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.schemas.rbac import (
    RoleUpsertRequest,
    UserRoleAssignRequest,
    RoleListResponse,
    PermissionListResponse,
)
from app.services.rbac_service import RBACService, ALL_PERMISSIONS

router = APIRouter()
rbac_service = RBACService()


@router.get("/permissions", response_model=APIResponse[PermissionListResponse])
async def get_permissions(current_user: User = Depends(require_permission("users.manage_roles"))):
    return success_response(PermissionListResponse(permissions=ALL_PERMISSIONS))


@router.get("/roles", response_model=APIResponse[RoleListResponse])
async def list_roles(current_user: User = Depends(require_permission("users.manage_roles"))):
    return success_response(RoleListResponse(roles=rbac_service.list_roles()))


@router.post("/roles", response_model=APIResponse[RoleListResponse])
async def upsert_role(req: RoleUpsertRequest, current_user: User = Depends(require_permission("users.manage_roles"))):
    roles = rbac_service.upsert_role(req.name.strip().upper(), req.permissions)
    return success_response(RoleListResponse(roles=roles))


@router.delete("/roles/{role_name}", response_model=APIResponse[RoleListResponse])
async def delete_role(role_name: str, current_user: User = Depends(require_permission("users.manage_roles"))):
    try:
        roles = rbac_service.delete_role(role_name.strip().upper())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return success_response(RoleListResponse(roles=roles))


@router.get("/users", response_model=APIResponse[list[dict]])
async def list_users_for_rbac(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("users.manage_roles")),
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    rows = []
    for user in users:
        fallback_role = user.role.value if hasattr(user.role, "value") else str(user.role)
        effective_role = rbac_service.get_user_effective_role(user.id, fallback_role)
        permissions = rbac_service.get_permissions_for_role(effective_role)
        rows.append(
            {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "base_role": fallback_role,
                "effective_role": effective_role,
                "permissions": permissions,
            }
        )
    return success_response(rows)


@router.put("/users/{user_id}/role", response_model=APIResponse[dict])
async def assign_user_role(
    user_id: int,
    req: UserRoleAssignRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("users.manage_roles")),
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        rbac_service.assign_user_role(user_id, req.role_name.strip().upper())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return success_response({"user_id": user_id, "role_name": req.role_name.strip().upper()})

