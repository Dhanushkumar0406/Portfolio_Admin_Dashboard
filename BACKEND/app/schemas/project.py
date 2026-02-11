from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List
from datetime import datetime


class ProjectBase(BaseModel):
    """Base project schema."""
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    github_url: Optional[str] = None
    youtube_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    featured: Optional[bool] = False
    display_order: Optional[int] = 0
    status: Optional[str] = Field("completed", max_length=50)
    model_url: Optional[str] = None
    three_config: Optional[dict] = None
    project_date: Optional[datetime] = None


class ProjectCreate(ProjectBase):
    """Schema for creating a project."""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    github_url: Optional[str] = None
    youtube_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None
    display_order: Optional[int] = None
    status: Optional[str] = Field(None, max_length=50)
    model_url: Optional[str] = None
    three_config: Optional[dict] = None
    project_date: Optional[datetime] = None


class ProjectInDBBase(ProjectBase):
    """Base project schema for database."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Project(ProjectInDBBase):
    """Schema for project response."""
    pass


class ProjectList(BaseModel):
    """Schema for list of projects response."""
    projects: List[Project]
    total: int
