from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SkillBase(BaseModel):
    """Base skill schema."""
    name: str = Field(..., max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    proficiency: Optional[float] = Field(None, ge=0, le=100)
    years_experience: Optional[float] = Field(None, ge=0)
    icon_url: Optional[str] = None
    color: Optional[str] = Field(None, max_length=50)
    display_order: Optional[int] = 0
    three_config: Optional[str] = None


class SkillCreate(SkillBase):
    """Schema for creating a skill."""
    pass


class SkillUpdate(BaseModel):
    """Schema for updating a skill."""
    name: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    proficiency: Optional[float] = Field(None, ge=0, le=100)
    years_experience: Optional[float] = Field(None, ge=0)
    icon_url: Optional[str] = None
    color: Optional[str] = Field(None, max_length=50)
    display_order: Optional[int] = None
    three_config: Optional[str] = None


class SkillInDBBase(SkillBase):
    """Base skill schema for database."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Skill(SkillInDBBase):
    """Schema for skill response."""
    pass


class SkillList(BaseModel):
    """Schema for list of skills response."""
    skills: List[Skill]
    total: int
