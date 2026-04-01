import json
import os
from typing import List


class SystemSettingsService:
    """Simple file-backed runtime settings for admin-managed policies."""

    DEFAULT_ALLOWED_EXTENSIONS = [
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
        ".txt",
        ".csv",
    ]

    def __init__(self) -> None:
        self.settings_path = os.path.join(os.getcwd(), "system_settings.json")
        self._ensure_file()

    def _ensure_file(self) -> None:
        if not os.path.exists(self.settings_path):
            self._write({"allowed_extensions": self.DEFAULT_ALLOWED_EXTENSIONS})

    def _read(self) -> dict:
        self._ensure_file()
        with open(self.settings_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data: dict) -> None:
        with open(self.settings_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def get_allowed_extensions(self) -> List[str]:
        data = self._read()
        extensions = data.get("allowed_extensions", self.DEFAULT_ALLOWED_EXTENSIONS)
        return self.normalize_extensions(extensions)

    def set_allowed_extensions(self, extensions: List[str]) -> List[str]:
        normalized = self.normalize_extensions(extensions)
        self._write({"allowed_extensions": normalized})
        return normalized

    @staticmethod
    def normalize_extensions(extensions: List[str]) -> List[str]:
        seen = set()
        normalized: List[str] = []
        for ext in extensions:
            value = (ext or "").strip().lower()
            if not value:
                continue
            if not value.startswith("."):
                value = f".{value}"
            if value not in seen:
                seen.add(value)
                normalized.append(value)
        return normalized

