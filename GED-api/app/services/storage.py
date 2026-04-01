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

    def _sanitize_segment(self, segment: str) -> str:
        """Return filesystem-safe folder name segment."""
        cleaned = "".join("_" if c in '<>:"/\\|?*' else c for c in segment).strip()
        cleaned = cleaned.rstrip(". ")
        return cleaned or "untitled"

    def ensure_folder_path(self, segments: list[str]) -> str:
        """Create nested directory path under local storage and return absolute path."""
        safe_segments = [self._sanitize_segment(s) for s in segments if s and s.strip()]
        target = os.path.join(self.local_path, *safe_segments) if safe_segments else self.local_path
        os.makedirs(target, exist_ok=True)
        return target

    async def upload_file(self, file: UploadFile, folder_segments: list[str] | None = None) -> str:
        """Uploads a file locally and returns the relative file path"""
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        contents = await file.read()
        await file.seek(0)

        target_dir = self.ensure_folder_path(folder_segments or [])
        file_path = os.path.join(target_dir, unique_filename)
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
