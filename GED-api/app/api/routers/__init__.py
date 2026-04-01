from fastapi import APIRouter
from app.api.routers.auth import router as auth_router
from app.api.routers.documents import router as documents_router
from app.api.routers.folders import router as folders_router
from app.api.routers.tags import router as tags_router
from app.api.routers.workflows import router as workflows_router
from app.api.routers.favorites import router as favorites_router
from app.api.routers.recently_viewed import router as recently_viewed_router
from app.api.routers.templates import router as templates_router
from app.api.routers.settings import router as settings_router
from app.api.routers.rbac import router as rbac_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(folders_router, prefix="/folders", tags=["Folders"])
api_router.include_router(documents_router, prefix="/documents", tags=["Documents"])
api_router.include_router(tags_router, prefix="/tags", tags=["Tags"])
api_router.include_router(workflows_router, prefix="/workflows", tags=["Workflows"])
api_router.include_router(favorites_router, prefix="/favorites", tags=["Favorites"])
api_router.include_router(recently_viewed_router, prefix="/recently-viewed", tags=["Recently Viewed"])
api_router.include_router(templates_router, prefix="/templates", tags=["Templates"])
api_router.include_router(settings_router, prefix="/settings", tags=["Settings"])
api_router.include_router(rbac_router, prefix="/rbac", tags=["RBAC"])
