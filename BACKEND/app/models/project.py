from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Project(Base):
    """Project model for portfolio projects."""

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Basic Information
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)

    # Media URLs
    image_url = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)

    # Project Details
    technologies = Column(JSON, nullable=True)  # Array of tech stack
    category = Column(String(100), nullable=True)  # e.g., "Web App", "Mobile", "3D", etc.
    tags = Column(JSON, nullable=True)  # Array of tags

    # Display Settings
    featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    status = Column(String(50), default="completed")  # completed, in-progress, archived

    # 3D Related
    model_url = Column(String(500), nullable=True)  # 3D model file URL
    three_config = Column(JSON, nullable=True)  # 3D scene configuration

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    project_date = Column(DateTime(timezone=True), nullable=True)  # Actual project completion date

    # Relationship
    user = relationship("User", back_populates="projects")
