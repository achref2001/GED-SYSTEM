from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, DateTime, func, Integer, UniqueConstraint, Index
from app.core.database import Base

class DocumentView(Base):
    __tablename__ = "document_views"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    viewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    view_count: Mapped[int] = mapped_column(Integer, default=1)
    last_viewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    document = relationship("Document")

    __table_args__ = (
        UniqueConstraint("user_id", "document_id", name="uix_user_document_view"),
        Index("ix_user_last_viewed", "user_id", "last_viewed_at")
    )
