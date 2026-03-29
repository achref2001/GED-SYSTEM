from app.repositories.base import BaseRepository
from app.models.folder import Folder
from app.schemas.folder import FolderCreate, FolderUpdate

class FolderRepository(BaseRepository[Folder, FolderCreate, FolderUpdate]):
    pass

folder_repo = FolderRepository(Folder)
