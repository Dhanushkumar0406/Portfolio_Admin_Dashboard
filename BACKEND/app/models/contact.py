from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base


class Contact(Base):
    """Contact model for contact form submissions (standalone, no user FK)."""

    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    # Contact Information
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)

    # Message
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)

    # Status
    is_read = Column(Boolean, default=False)
    is_replied = Column(Boolean, default=False)

    # Tracking
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)
    replied_at = Column(DateTime(timezone=True), nullable=True)
