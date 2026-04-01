import json
import os
from typing import Dict, List


ALL_PERMISSIONS = [
    "documents.read",
    "documents.write",
    "documents.delete",
    "folders.read",
    "folders.write",
    "tags.manage",
    "templates.manage",
    "settings.manage",
    "users.manage_roles",
]


class RBACService:
    def __init__(self) -> None:
        self.path = os.path.join(os.getcwd(), "rbac_settings.json")
        self._ensure_file()

    def _default_data(self) -> dict:
        return {
            "roles": {
                "ADMIN": ALL_PERMISSIONS,
                "MANAGER": [
                    "documents.read",
                    "documents.write",
                    "folders.read",
                    "folders.write",
                    "tags.manage",
                    "templates.manage",
                ],
                "EDITOR": [
                    "documents.read",
                    "documents.write",
                    "folders.read",
                    "folders.write",
                ],
                "VIEWER": [
                    "documents.read",
                    "folders.read",
                ],
            },
            "user_roles": {},
        }

    def _ensure_file(self) -> None:
        if not os.path.exists(self.path):
            self._write(self._default_data())

    def _read(self) -> dict:
        self._ensure_file()
        with open(self.path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data: dict) -> None:
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def list_roles(self) -> Dict[str, List[str]]:
        return self._read().get("roles", {})

    def get_permissions_for_role(self, role_name: str) -> List[str]:
        roles = self.list_roles()
        return roles.get(role_name, [])

    def get_user_effective_role(self, user_id: int, fallback_role: str) -> str:
        data = self._read()
        user_roles = data.get("user_roles", {})
        return user_roles.get(str(user_id), fallback_role)

    def get_user_permissions(self, user_id: int, fallback_role: str) -> List[str]:
        effective_role = self.get_user_effective_role(user_id, fallback_role)
        return self.get_permissions_for_role(effective_role)

    def upsert_role(self, name: str, permissions: List[str]) -> Dict[str, List[str]]:
        data = self._read()
        data.setdefault("roles", {})
        data["roles"][name] = sorted(set(permissions))
        self._write(data)
        return data["roles"]

    def delete_role(self, name: str) -> Dict[str, List[str]]:
        data = self._read()
        if name in ("ADMIN", "MANAGER", "EDITOR", "VIEWER"):
            raise ValueError("System roles cannot be deleted")
        roles = data.get("roles", {})
        if name in roles:
            del roles[name]
        user_roles = data.get("user_roles", {})
        user_roles = {k: v for k, v in user_roles.items() if v != name}
        data["user_roles"] = user_roles
        self._write(data)
        return roles

    def assign_user_role(self, user_id: int, role_name: str) -> None:
        data = self._read()
        roles = data.get("roles", {})
        if role_name not in roles:
            raise ValueError("Role does not exist")
        data.setdefault("user_roles", {})
        data["user_roles"][str(user_id)] = role_name
        self._write(data)

