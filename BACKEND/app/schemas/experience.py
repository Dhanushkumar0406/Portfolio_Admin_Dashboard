from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ExperienceBase(BaseModel):
    """Base experience schema."""
    company: str = Field(..., max_length=255)
    company_url: Optional[str] = None
    company_logo: Optional[str] = None
    profile_slug: Optional[str] = Field(None, max_length=100)
    position: str = Field(..., max_length=255)
    employment_type: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    is_remote: Optional[bool] = False
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = False
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    achievements: Optional[str] = None
    display_order: Optional[int] = 0


class ExperienceCreate(ExperienceBase):
    """Schema for creating an experience."""
    pass


class ExperienceUpdate(BaseModel):
    """Schema for updating an experience."""
    company: Optional[str] = Field(None, max_length=255)
    company_url: Optional[str] = None
    company_logo: Optional[str] = None
    profile_slug: Optional[str] = Field(None, max_length=100)
    position: Optional[str] = Field(None, max_length=255)
    employment_type: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    is_remote: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    achievements: Optional[str] = None
    display_order: Optional[int] = None


class ExperienceInDBBase(ExperienceBase):
    """Base experience schema for database."""
    id: int
    user_id: int
    profile_slug: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Experience(ExperienceInDBBase):
    """Schema for experience response."""
    pass


class ExperienceList(BaseModel):
    """Schema for list of experiences response."""
    experiences: List[Experience]
    total: int
