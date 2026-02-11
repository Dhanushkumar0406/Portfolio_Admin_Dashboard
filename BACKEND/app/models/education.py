from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Education(Base):
    """Education model for academic background and certifications."""

    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Institution Information
    institution = Column(String(255), nullable=False)
    institution_url = Column(String(500), nullable=True)
    institution_logo = Column(String(500), nullable=True)

    # Degree Information
    degree = Column(String(255), nullable=False)  # e.g., "Bachelor of Science"
    field_of_study = Column(String(255), nullable=True)  # e.g., "Computer Science"
    grade = Column(String(50), nullable=True)  # GPA, percentage, or grade
    grade_scale = Column(String(50), nullable=True)  # e.g., "4.0", "100", "First Class"

    # Date Range
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    is_current = Column(Boolean, default=False)

    # Description
    description = Column(Text, nullable=True)
    activities = Column(Text, nullable=True)  # Extracurricular activities
    achievements = Column(Text, nullable=True)  # Academic achievements

    # Certification specific (if this is a certification)
    is_certification = Column(Boolean, default=False)
    certificate_url = Column(String(500), nullable=True)  # URL to certificate document
    credential_id = Column(String(255), nullable=True)
    credential_url = Column(String(500), nullable=True)  # URL to verify credential

    # Display
    display_order = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="educations")
