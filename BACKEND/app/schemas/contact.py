from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class ContactBase(BaseModel):
    """Base contact schema."""
    name: str = Field(..., max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    subject: Optional[str] = Field(None, max_length=255)
    message: str


class ContactCreate(ContactBase):
    """Schema for creating a contact submission."""
    pass


class ContactUpdate(BaseModel):
    """Schema for updating a contact (admin only)."""
    is_read: Optional[bool] = None
    is_replied: Optional[bool] = None


class ContactInDBBase(ContactBase):
    """Base contact schema for database."""
    id: int
    is_read: bool
    is_replied: bool
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    read_at: Optional[datetime] = None
    replied_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Contact(ContactInDBBase):
    """Schema for contact response."""
    pass


class ContactList(BaseModel):
    """Schema for list of contacts response."""
    contacts: List[Contact]
    total: int
    unread_count: int
