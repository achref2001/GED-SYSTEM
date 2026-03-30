from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, DateTime, func, Integer, CheckConstraint, UniqueConstraint
from app.core.database import Base

class UserFavorite(Base):
    __tablename__ = "user_favorites"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id: Mapped[Optional[int]] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), nullable=True, index=True)
    folder_id: Mapped[Optional[int]] = mapped_column(ForeignKey("folders.id", ondelete="CASCADE"), nullable=True, index=True)
    note: Mapped[Optional[str]] = mapped_column(String(255))
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    document = relationship("Document")
    folder = relationship("Folder")

    __table_args__ = (
        CheckConstraint('document_id IS NOT NULL OR folder_id IS NOT NULL', name='check_doc_or_folder'),
        UniqueConstraint('user_id', 'document_id', name='uix_user_favorite_document'),
        UniqueConstraint('user_id', 'folder_id', name='uix_user_favorite_folder'),
    )
