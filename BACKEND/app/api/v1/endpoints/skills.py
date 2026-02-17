"""
Skills endpoints - CRUD operations for user skills.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.crud import skill as skill_crud
from app.crud import site_content as site_content_crud
from app.schemas.skill import Skill, SkillCreate, SkillUpdate, SkillList
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=SkillList)
def get_skills(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = None,
    user_id: Optional[int] = None,
    slug: Optional[str] = Query(None, description="Profile slug filter"),
) -> SkillList:
    """Get all skills with optional filters."""
    if slug:
        content = site_content_crud.get_by_slug(db, profile_slug=slug)
        if content:
            user_id = content.user_id
        else:
            return SkillList(skills=[], total=0)

    if user_id and category:
        skills = skill_crud.get_by_category(db, user_id=user_id, category=category)
    elif user_id:
        skills = skill_crud.get_by_user(db, user_id=user_id, skip=skip, limit=limit)
    else:
        skills = skill_crud.get_multi(db, skip=skip, limit=limit)
    
    total = len(skills) if slug or user_id else skill_crud.count(db)
    return SkillList(skills=skills, total=total)


@router.get("/{skill_id}", response_model=Skill)
def get_skill(
    skill_id: int,
    db: Session = Depends(get_db)
) -> Skill:
    """Get skill by ID."""
    skill = skill_crud.get(db, id=skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    return skill


@router.post("/", response_model=Skill, status_code=status.HTTP_201_CREATED)
def create_skill(
    *,
    db: Session = Depends(get_db),
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_active_user),
) -> Skill:
    """Create new skill (authentication required)."""
    skill = skill_crud.create_with_user(
        db, obj_in=skill_in, user_id=current_user.id
    )
    return skill


@router.put("/{skill_id}", response_model=Skill)
def update_skill(
    *,
    db: Session = Depends(get_db),
    skill_id: int,
    skill_in: SkillUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Skill:
    """Update skill (authentication required)."""
    skill = skill_crud.get(db, id=skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    if skill.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    skill = skill_crud.update(db, db_obj=skill, obj_in=skill_in)
    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    *,
    db: Session = Depends(get_db),
    skill_id: int,
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete skill (authentication required)."""
    skill = skill_crud.get(db, id=skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    if skill.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    skill_crud.remove(db, id=skill_id)
