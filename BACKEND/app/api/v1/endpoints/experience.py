"""
Experience endpoints - CRUD operations for work experience.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.crud import experience as experience_crud
from app.schemas.experience import Experience, ExperienceCreate, ExperienceUpdate, ExperienceList
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=ExperienceList)
def get_experiences(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: Optional[int] = None,
    current_only: bool = False
) -> ExperienceList:
    """Get all experience entries with optional filters."""
    if user_id and current_only:
        experiences = experience_crud.experience.get_current(db, user_id=user_id)
    elif user_id:
        experiences = experience_crud.experience.get_by_user(db, user_id=user_id, skip=skip, limit=limit)
    else:
        experiences = experience_crud.experience.get_multi(db, skip=skip, limit=limit)
    
    total = experience_crud.experience.count(db)
    return ExperienceList(experiences=experiences, total=total)


@router.get("/{experience_id}", response_model=Experience)
def get_experience(
    experience_id: int,
    db: Session = Depends(get_db)
) -> Experience:
    """Get experience by ID."""
    experience = experience_crud.experience.get(db, id=experience_id)
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    return experience


@router.post("/", response_model=Experience, status_code=status.HTTP_201_CREATED)
def create_experience(
    *,
    db: Session = Depends(get_db),
    experience_in: ExperienceCreate,
    current_user: User = Depends(get_current_active_user)
) -> Experience:
    """Create new experience entry (authentication required)."""
    experience = experience_crud.experience.create_with_user(
        db, obj_in=experience_in, user_id=current_user.id
    )
    return experience


@router.put("/{experience_id}", response_model=Experience)
def update_experience(
    *,
    db: Session = Depends(get_db),
    experience_id: int,
    experience_in: ExperienceUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Experience:
    """Update experience (authentication required)."""
    experience = experience_crud.experience.get(db, id=experience_id)
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    if experience.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    experience = experience_crud.experience.update(db, db_obj=experience, obj_in=experience_in)
    return experience


@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    *,
    db: Session = Depends(get_db),
    experience_id: int,
    current_user: User = Depends(get_current_active_user)
) -> None:
    """Delete experience (authentication required)."""
    experience = experience_crud.experience.get(db, id=experience_id)
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    if experience.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    experience_crud.experience.remove(db, id=experience_id)
