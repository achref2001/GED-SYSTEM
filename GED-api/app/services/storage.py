import os
import aiofiles
import uuid
from fastapi import UploadFile
from app.core.config import settings

class StorageService:
    """Handles file storage operations locally."""
    def __init__(self):
        self.local_path = settings.LOCAL_STORAGE_PATH
        os.makedirs(self.local_path, exist_ok=True)

    async def upload_file(self, file: UploadFile) -> str:
        """Uploads a file locally and returns the relative file path"""
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        contents = await file.read()
        await file.seek(0)
        
        file_path = os.path.join(self.local_path, unique_filename)
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(contents)
            
        return file_path

    async def get_file(self, file_path: str) -> tuple[bytes, str]:
        """Returns file content and generic mime type from local storage"""
        async with aiofiles.open(file_path, 'rb') as f:
            content = await f.read()
        return content, "application/octet-stream"

    async def delete_file(self, file_path: str) -> bool:
        """Deletes file from local storage"""
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
