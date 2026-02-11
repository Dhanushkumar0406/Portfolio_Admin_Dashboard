from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class EducationBase(BaseModel):
    """Base education schema."""
    institution: str = Field(..., max_length=255)
    institution_url: Optional[str] = None
    institution_logo: Optional[str] = None
    degree: str = Field(..., max_length=255)
    field_of_study: Optional[str] = Field(None, max_length=255)
    grade: Optional[str] = Field(None, max_length=50)
    grade_scale: Optional[str] = Field(None, max_length=50)
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = False
    description: Optional[str] = None
    activities: Optional[str] = None
    achievements: Optional[str] = None
    is_certification: Optional[bool] = False
    certificate_url: Optional[str] = None
    credential_id: Optional[str] = Field(None, max_length=255)
    credential_url: Optional[str] = None
    display_order: Optional[int] = 0


class EducationCreate(EducationBase):
    """Schema for creating an education entry."""
    pass


class EducationUpdate(BaseModel):
    """Schema for updating an education entry."""
    institution: Optional[str] = Field(None, max_length=255)
    institution_url: Optional[str] = None
    institution_logo: Optional[str] = None
    degree: Optional[str] = Field(None, max_length=255)
    field_of_study: Optional[str] = Field(None, max_length=255)
    grade: Optional[str] = Field(None, max_length=50)
    grade_scale: Optional[str] = Field(None, max_length=50)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    activities: Optional[str] = None
    achievements: Optional[str] = None
    is_certification: Optional[bool] = None
    certificate_url: Optional[str] = None
    credential_id: Optional[str] = Field(None, max_length=255)
    credential_url: Optional[str] = None
    display_order: Optional[int] = None


class EducationInDBBase(EducationBase):
    """Base education schema for database."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Education(EducationInDBBase):
    """Schema for education response."""
    pass


class EducationList(BaseModel):
    """Schema for list of education entries response."""
    educations: List[Education]
    total: int
