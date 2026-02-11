from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema with common attributes."""
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None


class UserInDBBase(UserBase):
    """Base user schema for database models."""
    id: int
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDBBase):
    """Schema for user response."""
    pass


class UserInDB(UserInDBBase):
    """Schema for user in database with hashed password."""
    hashed_password: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str
