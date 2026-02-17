"""
Site content endpoints - Admin CRUD for homepage hero content.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.crud import site_content as site_content_crud
from app.models.user import User
from app.schemas.site_content import (
    SiteContent,
    SiteContentCreate,
    SiteContentUpdate,
    SiteContentList,
)

router = APIRouter()


@router.get("/public", response_model=SiteContent)
def get_public_site_content(
    db: Session = Depends(get_db),
    slug: Optional[str] = Query(None, description="Profile slug"),
) -> SiteContent:
    """Get currently active site content for public pages."""
    if slug:
        content = site_content_crud.get_by_slug(db, profile_slug=slug)
    else:
        # If no slug, fall back to first active across users (legacy behavior)
        content = site_content_crud.get_active(db)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active site content found",
        )
    return content


@router.get("/", response_model=SiteContentList)
def list_site_content(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
) -> SiteContentList:
    """List all site content entries (admin only)."""
    if current_user.is_superuser:
        contents = site_content_crud.get_multi(db, skip=skip, limit=limit)
        total = site_content_crud.count(db)
    else:
        contents = site_content_crud.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
        total = len(contents)
    return SiteContentList(contents=contents, total=total)


@router.get("/{content_id}", response_model=SiteContent)
def get_site_content(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> SiteContent:
    """Get site content by ID (admin only)."""
    content = site_content_crud.get(db, id=content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site content not found",
        )
    if not current_user.is_superuser and content.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return content


@router.post("/", response_model=SiteContent, status_code=status.HTTP_201_CREATED)
def create_site_content(
    *,
    db: Session = Depends(get_db),
    content_in: SiteContentCreate,
    current_user: User = Depends(get_current_active_user),
) -> SiteContent:
    """Create site content (admin only)."""
    content = site_content_crud.create_with_user(
        db, obj_in=content_in, user_id=current_user.id
    )
    return content


@router.put("/{content_id}", response_model=SiteContent)
def update_site_content(
    *,
    db: Session = Depends(get_db),
    content_id: int,
    content_in: SiteContentUpdate,
    current_user: User = Depends(get_current_active_user),
) -> SiteContent:
    """Update site content (admin only)."""
    content = site_content_crud.get(db, id=content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site content not found",
        )
    if not current_user.is_superuser and content.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    updated = site_content_crud.update(db, db_obj=content, obj_in=content_in)
    if content_in.is_active:
        activated = site_content_crud.set_active(db, content_id=updated.id)
        if activated:
            return activated
    return updated


@router.post("/{content_id}/activate", response_model=SiteContent)
def activate_site_content(
    *,
    db: Session = Depends(get_db),
    content_id: int,
    current_user: User = Depends(get_current_active_user),
) -> SiteContent:
    """Mark one site content row as active (admin only)."""
    content = site_content_crud.set_active(db, content_id=content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site content not found",
        )
    if not current_user.is_superuser and content.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return content


@router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site_content(
    *,
    db: Session = Depends(get_db),
    content_id: int,
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete site content row (admin only)."""
    content = site_content_crud.get(db, id=content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site content not found",
        )
    if not current_user.is_superuser and content.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    site_content_crud.remove(db, id=content_id)
