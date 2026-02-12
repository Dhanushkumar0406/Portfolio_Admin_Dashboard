from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class SiteContent(Base):
    """Editable homepage content managed from admin dashboard."""

    __tablename__ = "site_content"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Content identity
    name = Column(String(100), nullable=False, default="default-home")
    is_active = Column(Boolean, default=True)
    profile_slug = Column(String(100), nullable=True, unique=True, index=True)

    # Visual identity
    display_name = Column(String(255), nullable=True)
    icon_text = Column(String(50), nullable=True)
    profile_image_url = Column(String(500), nullable=True)

    # Header / Navbar
    brand_initials = Column(String(20), nullable=True)
    brand_title = Column(String(255), nullable=True)
    brand_tagline = Column(String(255), nullable=True)
    nav_cta_text = Column(String(100), nullable=True)
    nav_cta_link = Column(String(500), nullable=True)

    # Hero copy
    eyebrow_text = Column(String(255), nullable=True)
    hero_title = Column(String(500), nullable=True)
    hero_subtitle = Column(String(1000), nullable=True)

    # CTA links
    cta_primary_text = Column(String(100), nullable=True)
    cta_primary_link = Column(String(500), nullable=True)
    cta_secondary_text = Column(String(100), nullable=True)
    cta_secondary_link = Column(String(500), nullable=True)

    # Contact section
    contact_title = Column(String(500), nullable=True)
    contact_subtitle = Column(String(1000), nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_location = Column(String(255), nullable=True)
    contact_availability = Column(String(255), nullable=True)
    contact_response_time = Column(String(255), nullable=True)

    # Footer
    footer_tagline = Column(String(500), nullable=True)
    footer_email = Column(String(255), nullable=True)
    footer_location = Column(String(255), nullable=True)
    footer_availability = Column(String(255), nullable=True)
    footer_links = Column(JSON, nullable=True)  # Array of {label, url, icon}
    footer_disclaimer = Column(String(500), nullable=True)
    footer_rights = Column(String(500), nullable=True)

    # About page
    about_title = Column(String(500), nullable=True)
    about_body_primary = Column(String(1500), nullable=True)
    about_body_secondary = Column(String(1500), nullable=True)
    about_snapshot_focus = Column(String(255), nullable=True)
    about_snapshot_stack = Column(String(255), nullable=True)
    about_snapshot_availability = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="site_contents")
