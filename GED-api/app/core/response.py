from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel
import math

T = TypeVar("T")

class Pagination(BaseModel):
    total: int
    page: int
    size: int
    pages: int

    @classmethod
    def create(cls, total: int, page: int, size: int):
        pages = math.ceil(total / size) if size > 0 else 0
        return cls(total=total, page=page, size=size, pages=pages)

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Success"
    pagination: Optional[Pagination] = None

def success_response(data: Any = None, message: str = "Success", pagination: Optional[Pagination] = None) -> APIResponse[Any]:
    return APIResponse(success=True, data=data, message=message, pagination=pagination)

def error_response(message: str = "Error", data: Any = None) -> APIResponse[Any]:
    return APIResponse(success=False, data=data, message=message)
