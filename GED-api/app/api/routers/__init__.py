from fastapi import APIRouter
from app.api.routers.auth import router as auth_router
from app.api.routers.documents import router as documents_router
from app.api.routers.folders import router as folders_router
from app.api.routers.tags import router as tags_router
from app.api.routers.workflows import router as workflows_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(folders_router, prefix="/folders", tags=["Folders"])
api_router.include_router(documents_router, prefix="/documents", tags=["Documents"])
api_router.include_router(tags_router, prefix="/tags", tags=["Tags"])
api_router.include_router(workflows_router, prefix="/workflows", tags=["Workflows"])
