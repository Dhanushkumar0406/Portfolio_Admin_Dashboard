from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Experience(Base):
    """Experience model for work experience and employment history."""

    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Company Information
    company = Column(String(255), nullable=False)
    company_url = Column(String(500), nullable=True)
    company_logo = Column(String(500), nullable=True)

    # Position Details
    position = Column(String(255), nullable=False)
    employment_type = Column(String(100), nullable=True)  # Full-time, Part-time, Contract, etc.
    location = Column(String(255), nullable=True)
    is_remote = Column(Boolean, default=False)

    # Date Range
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)  # NULL means current
    is_current = Column(Boolean, default=False)

    # Description
    description = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True)  # Can be JSON array
    achievements = Column(Text, nullable=True)  # Can be JSON array

    # Display
    display_order = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="experiences")
