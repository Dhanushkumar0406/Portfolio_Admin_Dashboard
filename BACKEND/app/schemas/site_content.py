from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class SiteContentBase(BaseModel):
    """Base schema for editable homepage content."""

    name: str = Field(default="default-home", max_length=100)
    is_active: bool = True
    profile_slug: Optional[str] = Field(default=None, max_length=100)

    display_name: Optional[str] = Field(default=None, max_length=255)
    icon_text: Optional[str] = Field(default=None, max_length=50)
    profile_image_url: Optional[str] = None

    # Header / Navbar
    brand_initials: Optional[str] = Field(default=None, max_length=20)
    brand_title: Optional[str] = Field(default=None, max_length=255)
    brand_tagline: Optional[str] = Field(default=None, max_length=255)
    nav_cta_text: Optional[str] = Field(default=None, max_length=100)
    nav_cta_link: Optional[str] = None

    eyebrow_text: Optional[str] = Field(default=None, max_length=255)
    hero_title: Optional[str] = Field(default=None, max_length=500)
    hero_subtitle: Optional[str] = Field(default=None, max_length=1000)

    cta_primary_text: Optional[str] = Field(default=None, max_length=100)
    cta_primary_link: Optional[str] = None
    cta_secondary_text: Optional[str] = Field(default=None, max_length=100)
    cta_secondary_link: Optional[str] = None

    # Contact section
    contact_title: Optional[str] = Field(default=None, max_length=500)
    contact_subtitle: Optional[str] = Field(default=None, max_length=1000)
    contact_email: Optional[str] = Field(default=None, max_length=255)
    contact_location: Optional[str] = Field(default=None, max_length=255)
    contact_availability: Optional[str] = Field(default=None, max_length=255)
    contact_response_time: Optional[str] = Field(default=None, max_length=255)

    # Footer
    footer_tagline: Optional[str] = Field(default=None, max_length=500)
    footer_email: Optional[str] = Field(default=None, max_length=255)
    footer_location: Optional[str] = Field(default=None, max_length=255)
    footer_availability: Optional[str] = Field(default=None, max_length=255)
    footer_links: Optional[list] = None
    footer_disclaimer: Optional[str] = Field(default=None, max_length=500)
    footer_rights: Optional[str] = Field(default=None, max_length=500)

    about_title: Optional[str] = Field(default=None, max_length=500)
    about_body_primary: Optional[str] = Field(default=None, max_length=1500)
    about_body_secondary: Optional[str] = Field(default=None, max_length=1500)
    about_snapshot_focus: Optional[str] = Field(default=None, max_length=255)
    about_snapshot_stack: Optional[str] = Field(default=None, max_length=255)
    about_snapshot_availability: Optional[str] = Field(default=None, max_length=255)
    footer_rights: Optional[str] = Field(default=None, max_length=500)

    about_title: Optional[str] = Field(default=None, max_length=500)
    about_body_primary: Optional[str] = Field(default=None, max_length=1500)
    about_body_secondary: Optional[str] = Field(default=None, max_length=1500)
    about_snapshot_focus: Optional[str] = Field(default=None, max_length=255)
    about_snapshot_stack: Optional[str] = Field(default=None, max_length=255)
    about_snapshot_availability: Optional[str] = Field(default=None, max_length=255)


class SiteContentCreate(SiteContentBase):
    """Schema for creating site content."""

    pass


class SiteContentUpdate(BaseModel):
    """Schema for updating site content."""

    name: Optional[str] = Field(default=None, max_length=100)
    is_active: Optional[bool] = None
    profile_slug: Optional[str] = Field(default=None, max_length=100)

    display_name: Optional[str] = Field(default=None, max_length=255)
    icon_text: Optional[str] = Field(default=None, max_length=50)
    profile_image_url: Optional[str] = None

    brand_initials: Optional[str] = Field(default=None, max_length=20)
    brand_title: Optional[str] = Field(default=None, max_length=255)
    brand_tagline: Optional[str] = Field(default=None, max_length=255)
    nav_cta_text: Optional[str] = Field(default=None, max_length=100)
    nav_cta_link: Optional[str] = None

    eyebrow_text: Optional[str] = Field(default=None, max_length=255)
    hero_title: Optional[str] = Field(default=None, max_length=500)
    hero_subtitle: Optional[str] = Field(default=None, max_length=1000)

    cta_primary_text: Optional[str] = Field(default=None, max_length=100)
    cta_primary_link: Optional[str] = None
    cta_secondary_text: Optional[str] = Field(default=None, max_length=100)
    cta_secondary_link: Optional[str] = None

    contact_title: Optional[str] = Field(default=None, max_length=500)
    contact_subtitle: Optional[str] = Field(default=None, max_length=1000)
    contact_email: Optional[str] = Field(default=None, max_length=255)
    contact_location: Optional[str] = Field(default=None, max_length=255)
    contact_availability: Optional[str] = Field(default=None, max_length=255)
    contact_response_time: Optional[str] = Field(default=None, max_length=255)

    footer_tagline: Optional[str] = Field(default=None, max_length=500)
    footer_email: Optional[str] = Field(default=None, max_length=255)
    footer_location: Optional[str] = Field(default=None, max_length=255)
    footer_availability: Optional[str] = Field(default=None, max_length=255)
    footer_links: Optional[list] = None
    footer_disclaimer: Optional[str] = Field(default=None, max_length=500)


class SiteContentInDBBase(SiteContentBase):
    """Base schema with database fields."""

    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SiteContent(SiteContentInDBBase):
    """Response schema for site content."""

    pass


class SiteContentList(BaseModel):
    """List response for site content."""

    contents: List[SiteContent]
    total: int
