from fastapi import APIRouter, Depends, HTTPException
from app.core.response import APIResponse, success_response
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.system_settings import UploadPolicyResponse, UploadPolicyUpdateRequest
from app.services.system_settings import SystemSettingsService

router = APIRouter()
settings_service = SystemSettingsService()


@router.get("/upload-policy", response_model=APIResponse[UploadPolicyResponse])
async def get_upload_policy(current_user: User = Depends(get_current_user)):
    return success_response(
        UploadPolicyResponse(
            allowed_extensions=settings_service.get_allowed_extensions()
        )
    )


@router.put("/upload-policy", response_model=APIResponse[UploadPolicyResponse])
async def update_upload_policy(
    req: UploadPolicyUpdateRequest,
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can update upload policy")

    updated = settings_service.set_allowed_extensions(req.allowed_extensions)
    return success_response(UploadPolicyResponse(allowed_extensions=updated))

