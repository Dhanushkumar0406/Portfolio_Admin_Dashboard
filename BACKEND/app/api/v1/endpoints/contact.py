"""
Contact endpoints - Submit and manage contact form messages.
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_superuser
from app.models.contact import Contact as ContactModel
from app.schemas.contact import Contact, ContactCreate, ContactUpdate
from app.models.user import User

router = APIRouter()


@router.post("/", response_model=Contact, status_code=status.HTTP_201_CREATED)
def create_contact(
    *,
    db: Session = Depends(get_db),
    contact_in: ContactCreate,
    request: Request
) -> Contact:
    """Submit a contact message (public)."""
    ip_address: Optional[str] = None
    if request.client:
        ip_address = request.client.host

    contact = ContactModel(
        name=contact_in.name,
        email=contact_in.email,
        phone=contact_in.phone,
        subject=contact_in.subject,
        message=contact_in.message,
        ip_address=ip_address,
        user_agent=request.headers.get("user-agent"),
        is_read=False,
        is_replied=False,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/", response_model=List[Contact])
def list_contacts(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_superuser)
) -> List[Contact]:
    """List contact messages (admin only)."""
    contacts = (
        db.query(ContactModel)
        .order_by(ContactModel.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return contacts


@router.put("/{contact_id}", response_model=Contact)
def update_contact(
    *,
    db: Session = Depends(get_db),
    contact_id: int,
    contact_in: ContactUpdate,
    current_user: User = Depends(get_current_superuser)
) -> Contact:
    """Update contact status (admin only)."""
    contact = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    if contact_in.is_read is not None:
        contact.is_read = contact_in.is_read
        contact.read_at = datetime.utcnow() if contact_in.is_read else None

    if contact_in.is_replied is not None:
        contact.is_replied = contact_in.is_replied
        contact.replied_at = datetime.utcnow() if contact_in.is_replied else None

    db.commit()
    db.refresh(contact)
    return contact
