from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Skill(Base):
    """Skill model for user skills and proficiency levels."""

    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Skill Information
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(100), nullable=True)  # e.g., "Frontend", "Backend", "Tools", "3D"
    proficiency = Column(Float, nullable=True)  # 0-100 percentage
    years_experience = Column(Float, nullable=True)

    # Display
    icon_url = Column(String(500), nullable=True)  # Skill icon/logo URL
    color = Column(String(50), nullable=True)  # Hex color for visualization
    display_order = Column(Integer, default=0)

    # 3D Visualization (Optional)
    three_config = Column(String(500), nullable=True)  # JSON string for 3D representation

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="skills")
