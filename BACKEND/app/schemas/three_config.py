from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class ThreeConfigBase(BaseModel):
    """Base 3D configuration schema."""
    scene_name: str = Field(..., max_length=100)
    scene_type: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    settings: Optional[Dict[str, Any]] = None
    model_url: Optional[str] = None
    environment_url: Optional[str] = None
    texture_urls: Optional[List[str]] = None
    is_active: Optional[bool] = True
    display_order: Optional[int] = 0


class ThreeConfigCreate(ThreeConfigBase):
    """Schema for creating a 3D configuration."""
    pass


class ThreeConfigUpdate(BaseModel):
    """Schema for updating a 3D configuration."""
    scene_name: Optional[str] = Field(None, max_length=100)
    scene_type: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    settings: Optional[Dict[str, Any]] = None
    model_url: Optional[str] = None
    environment_url: Optional[str] = None
    texture_urls: Optional[List[str]] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class ThreeConfigInDBBase(ThreeConfigBase):
    """Base 3D configuration schema for database."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ThreeConfig(ThreeConfigInDBBase):
    """Schema for 3D configuration response."""
    pass


class ThreeConfigList(BaseModel):
    """Schema for list of 3D configurations response."""
    configs: List[ThreeConfig]
    total: int
