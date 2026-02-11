from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class ThreeConfig(Base):
    """3D Scene Configuration model for Three.js settings."""

    __tablename__ = "three_config"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Scene Information
    scene_name = Column(String(100), nullable=False, unique=True, index=True)
    scene_type = Column(String(50), nullable=True)  # e.g., "hero", "about", "projects", "skills"
    description = Column(String(500), nullable=True)

    # 3D Configuration (stored as JSON)
    settings = Column(JSON, nullable=True)
    """
    settings can include:
    {
        "camera": {
            "position": [x, y, z],
            "fov": 75,
            "near": 0.1,
            "far": 1000
        },
        "lighting": {
            "ambient": {"color": "#ffffff", "intensity": 0.5},
            "directional": {"color": "#ffffff", "intensity": 1.0, "position": [x, y, z]}
        },
        "models": [
            {
                "url": "/models/avatar.glb",
                "position": [x, y, z],
                "rotation": [x, y, z],
                "scale": [x, y, z]
            }
        ],
        "effects": {
            "particles": true,
            "bloom": true,
            "fog": {"color": "#000000", "near": 1, "far": 100}
        },
        "controls": {
            "enabled": true,
            "autoRotate": false,
            "autoRotateSpeed": 2.0
        }
    }
    """

    # Asset URLs
    model_url = Column(String(500), nullable=True)  # Main 3D model URL
    environment_url = Column(String(500), nullable=True)  # HDRI environment map URL
    texture_urls = Column(JSON, nullable=True)  # Array of texture URLs

    # Display Settings
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="three_configs")
