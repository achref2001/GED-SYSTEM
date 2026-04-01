from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, DateTime, func
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    action: Mapped[str] = mapped_column(String, nullable=False, index=True)
    document_id: Mapped[Optional[int]] = mapped_column(ForeignKey("documents.id", ondelete="SET NULL"), index=True)
    folder_id: Mapped[Optional[int]] = mapped_column(ForeignKey("folders.id", ondelete="SET NULL"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    ip_address: Mapped[Optional[str]] = mapped_column(String)
