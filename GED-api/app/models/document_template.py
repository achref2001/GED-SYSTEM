from datetime import datetime
from typing import List, Optional, Any
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, DateTime, func, Integer, Boolean, Text
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base

class DocumentTemplate(Base):
    __tablename__ = "document_templates"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    file_path: Mapped[Optional[str]] = mapped_column(String(500))
    file_hash: Mapped[Optional[str]] = mapped_column(String(64))
    category: Mapped[Optional[str]] = mapped_column(String(100))
    default_folder_id: Mapped[Optional[int]] = mapped_column(ForeignKey("folders.id", ondelete="SET NULL"))
    default_tags: Mapped[Optional[list[str]]] = mapped_column(JSONB)
    default_metadata: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB)
    required_metadata_fields: Mapped[Optional[list[str]]] = mapped_column(JSONB)
    
    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    versions = relationship("DocumentTemplateVersion", back_populates="template", cascade="all, delete")

class DocumentTemplateVersion(Base):
    __tablename__ = "document_template_versions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    template_id: Mapped[int] = mapped_column(ForeignKey("document_templates.id", ondelete="CASCADE"), index=True)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    uploaded_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    changelog: Mapped[Optional[str]] = mapped_column(Text)

    template = relationship("DocumentTemplate", back_populates="versions")
